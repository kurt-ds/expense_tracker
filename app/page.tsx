import Hero from "@/components/hero";
import ConnectSupabaseSteps from "@/components/tutorial/connect-supabase-steps";
import SignUpUserSteps from "@/components/tutorial/sign-up-user-steps";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";

export default async function Home() {
  return (
    <>
      <main className="flex-1 flex flex-col gap-6 px-4 py-8 max-w-2xl mx-auto">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-gray-800">Welcome to Expense Tracker 🧾</h1>
          <p className="text-gray-600 text-lg">
            Track your daily expenses, stay within budget, and understand where your money goes — all in one simple app.
          </p>
          <p className="text-gray-600">
            Whether you're saving for something big or just want better money habits, BudgetBuddy is here to help.
          </p>
        </div>

        {/* <div className="mt-10">
          <h2 className="font-semibold text-xl mb-4 text-gray-800">Next Steps</h2>
          {hasEnvVars ? <SignUpUserSteps /> : <ConnectSupabaseSteps />}
        </div> */}
      </main>
    </>
  );
}

