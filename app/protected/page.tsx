import FetchDataSteps from "@/components/tutorial/fetch-data-steps";
import { createClient } from "@/utils/supabase/server";
import { InfoIcon, PlusCircle } from "lucide-react";
import { redirect } from "next/navigation";
import UserExpenses from "@/components/UserExpenses";
import CreateExpenseForm from "@/components/CreateExpenseForm"; // 👈 New component

export default async function ProtectedPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  return (
    <div className="flex-1 w-96 max-w-2xl mx-auto flex flex-col gap-8 px-4 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Expenses</h1>
        <CreateExpenseForm userId={user.id} />
      </div>
      <UserExpenses />
    </div>
  );
}

