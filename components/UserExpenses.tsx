"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Trash2, Pencil, X } from "lucide-react";

type Expense = {
  id: string;
  amount: number;
  category: string;
  description?: string;
  expense_date: string;
};

export default function UserExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  const supabase = createClient();

  const fetchExpenses = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("expenses")
      .select("*")
      .eq("user_id", user.id)
      .order("expense_date", { ascending: false });

    if (!error) setExpenses(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleDelete = async (id: string) => {
    const confirm = window.confirm("Are you sure you want to delete this expense?");
    if (!confirm) return;

    const { error } = await supabase.from("expenses").delete().eq("id", id);

    if (!error) {
      setExpenses((prev) => prev.filter((e) => e.id !== id));
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingExpense) return;

    const { id, amount, category, description, expense_date } = editingExpense;

    const { error } = await supabase
      .from("expenses")
      .update({ amount, category, description, expense_date })
      .eq("id", id);

    if (!error) {
      setEditingExpense(null);
      fetchExpenses();
    }
  };

  const handleChange = (field: keyof Expense, value: string) => {
    if (!editingExpense) return;
    setEditingExpense({
      ...editingExpense,
      [field]:
        field === "amount" ? parseFloat(value) : value,
    });
  };

  if (loading) return <p>Loading expenses...</p>;
  if (expenses.length === 0) return <p>No expenses found.</p>;

  return (
    <>
      <div className="space-y-4">
        {expenses.map((expense) => (
          <div
            key={expense.id}
            className="border rounded-xl p-4 shadow-sm bg-white relative"
          >
            <div className="flex justify-between items-start">
              <div>
                <span className="font-semibold">{expense.category}</span>
                <span className="text-green-600 font-bold block">
                  ₱{expense.amount}
                </span>
                {expense.description && (
                  <p className="text-sm text-gray-600 mt-1">{expense.description}</p>
                )}
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(expense.expense_date).toLocaleDateString()}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setEditingExpense(expense)}
                  className="text-blue-500 hover:text-blue-700 p-1"
                  title="Edit"
                >
                  <Pencil size={18} />
                </button>
                <button
                  onClick={() => handleDelete(expense.id)}
                  className="text-red-500 hover:text-red-700 p-1"
                  title="Delete"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editingExpense && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="relative bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
            <button
              onClick={() => setEditingExpense(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
              aria-label="Close"
            >
              <X size={20} />
            </button>

            <h2 className="text-lg font-semibold mb-4">Edit Expense</h2>

            <form onSubmit={handleUpdate} className="space-y-4">
              <div className="flex flex-col">
                <label className="text-sm font-medium">Amount</label>
                <input
                  type="number"
                  className="px-3 py-2 border rounded"
                  value={editingExpense.amount}
                  onChange={(e) => handleChange("amount", e.target.value)}
                  required
                />
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-medium">Category</label>
                <select
                  className="px-3 py-2 border rounded"
                  value={editingExpense.category}
                  onChange={(e) => handleChange("category", e.target.value)}
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
                  value={editingExpense.description || ""}
                  onChange={(e) => handleChange("description", e.target.value)}
                />
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-medium">Date</label>
                <input
                  type="date"
                  className="px-3 py-2 border rounded"
                  value={editingExpense.expense_date}
                  onChange={(e) => handleChange("expense_date", e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Update Expense
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
