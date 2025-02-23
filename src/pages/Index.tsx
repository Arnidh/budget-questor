
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { ExpenseForm } from "@/components/ExpenseForm";
import { ExpenseChart } from "@/components/ExpenseChart";
import { AuthForm } from "@/components/AuthForm";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut } from "lucide-react";

interface Expense {
  id: number;
  category: string;
  amount: number;
  date: string;
}

const Index = () => {
  const { user, signOut, isLoading } = useAuth();
  const [expenses, setExpenses] = useState<Expense[]>([]);  // Initialize with empty array

  const handleAddExpense = (newExpense: Omit<Expense, "id">) => {
    setExpenses((prev) => [
      { ...newExpense, id: Math.max(0, ...prev.map((e) => e.id)) + 1 },
      ...prev,
    ]);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary p-4 md:p-8">
        <div className="container mx-auto max-w-md space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold tracking-tight">Budget Buddy</h1>
            <p className="text-muted-foreground">Sign in to track your expenses</p>
          </div>
          <AuthForm />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary p-4 md:p-8">
      <main className="container mx-auto space-y-8 animate-fadeIn">
        {/* Header with Sign Out */}
        <div className="flex justify-between items-center">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold tracking-tight text-balance">
              Budget Buddy
            </h1>
            <p className="text-muted-foreground">
              Track your expenses, achieve your goals
            </p>
          </div>
          <Button
            variant="ghost"
            onClick={signOut}
            className="flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-6 glass-morphism card-hover">
            <h3 className="font-semibold text-sm text-muted-foreground">Total Spent</h3>
            <p className="text-2xl font-bold">
              ₹{expenses.reduce((sum, exp) => sum + exp.amount, 0).toFixed(2)}
            </p>
          </Card>
          <Card className="p-6 glass-morphism card-hover">
            <h3 className="font-semibold text-sm text-muted-foreground">Budget Left</h3>
            <p className="text-2xl font-bold text-mint-500">₹0.00</p>
          </Card>
          <Card className="p-6 glass-morphism card-hover">
            <h3 className="font-semibold text-sm text-muted-foreground">Savings</h3>
            <p className="text-2xl font-bold">₹0.00</p>
          </Card>
        </div>

        {/* Chart */}
        <Card className="p-6 glass-morphism">
          <ExpenseChart expenses={expenses} />
        </Card>

        {/* Recent Expenses */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Recent Expenses</h2>
            <ExpenseForm onSubmit={handleAddExpense} />
          </div>
          <div className="space-y-3">
            {expenses.map((expense) => (
              <Card key={expense.id} className="p-4 glass-morphism card-hover">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{expense.category}</p>
                    <p className="text-sm text-muted-foreground">{expense.date}</p>
                  </div>
                  <p className="text-lg font-semibold">₹{expense.amount.toFixed(2)}</p>
                </div>
              </Card>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;
