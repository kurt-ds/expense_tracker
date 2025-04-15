"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { PlusCircle, X } from "lucide-react";

export default function CreateExpenseForm({ userId }: { userId: string }) {
  const [showForm, setShowForm] = useState(false);
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");

  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error } = await supabase.from("expenses").insert([
      {
        user_id: userId,
        amount: Number(amount),
        category,
        description,
        expense_date: date,
      },
    ]);

    if (error) {
      console.error("Error inserting expense:", error);
    } else {
      setShowForm(false);
      setAmount("");
      setCategory("Food");
      setDescription("");
      setDate("");
      window.location.reload(); // Or use a mutation method if using SWR or React Query
    }
  };

  return (
    <>
      <button
        onClick={() => setShowForm(true)}
        className="flex items-center gap-1 text-sm bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700"
      >
        <PlusCircle size={16} />
        Add Expense
      </button>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="relative bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
              aria-label="Close"
            >
              <X size={20} />
            </button>

            <h2 className="text-lg font-semibold mb-4">New Expense</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col">
                <label className="text-sm font-medium">Amount (₱)</label>
                <input
                  type="number"
                  className="px-3 py-2 border rounded"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-medium">Category</label>
                <select
                  className="px-3 py-2 border rounded"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                >
                  <option value="Food">Food</option>
                  <option value="Rent">Rent</option>
                  <option value="Transport">Transport</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-medium">Description</label>
                <input
                  type="text"
                  className="px-3 py-2 border rounded"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-medium">Date</label>
                <input
                  type="date"
                  className="px-3 py-2 border rounded"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Save Expense
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
