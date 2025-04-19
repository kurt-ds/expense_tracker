"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

export default function NameList() {
  const [names, setNames] = useState<{ id: number; name: string }[]>([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const supabase = createClient();

  const fetchNames = async () => {
    const { data, error } = await supabase.from("names").select("id, name").order("id");
    if (error) {
      console.error("Error fetching names:", error.message);
    } else {
      setNames(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchNames();
  }, []);

  const handleAddClick = () => {
    setEditingId(null);
    setNewName("");
    setShowForm(true);
  };

  const handleEditClick = (id: number, currentName: string) => {
    setEditingId(id);
    setNewName(currentName);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    if (editingId === null) {
      const { error } = await supabase.from("names").insert({ name: newName.trim() });
      if (error) console.error("Error adding name:", error.message);
    } else {
      const { error } = await supabase
        .from("names")
        .update({ name: newName.trim() })
        .eq("id", editingId);
      if (error) console.error("Error updating name:", error.message);
    }

    setShowForm(false);
    setNewName("");
    setEditingId(null);
    fetchNames();
  };

  const handleDelete = async () => {
    if (deleteId !== null) {
      const { error } = await supabase.from("names").delete().eq("id", deleteId);
      if (error) console.error("Error deleting name:", error.message);
      setDeleteId(null);
      fetchNames();
    }
  };

  return (
    <>
      {/* Header and Add Button */}
      <div className="mt-8 mb-4 w-[500px] flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-white">Names List</h2>
        <button
          onClick={handleAddClick}
          className="w-32 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Add Name
        </button>
      </div>

      {/* Name List */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul className="space-y-2">
          {names.map(({ id, name }) => (
            <li
              key={id}
              className="flex justify-between items-center bg-black px-4 py-2 rounded text-white"
            >
              <span>{name}</span>
              <div className="space-x-2">
                <button
                  onClick={() => handleEditClick(id, name)}
                  className="text-sm px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => setDeleteId(id)}
                  className="text-sm px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Modal Form (Add / Edit) */}
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-black p-6 rounded-lg shadow-lg relative w-full max-w-md mx-auto">
            <button
              onClick={() => {
                setShowForm(false);
                setNewName("");
                setEditingId(null);
              }}
              className="absolute top-2 right-3 text-white hover:text-white-500 text-xl font-bold"
            >
              ×
            </button>

            <h3 className="text-lg font-semibold mb-4 text-white">
              {editingId === null ? "Add a New Name" : "Edit Name"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Enter name"
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
              >
                {editingId === null ? "Add" : "Update"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId !== null && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm mx-auto relative">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Confirm Deletion</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to delete this name?</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
