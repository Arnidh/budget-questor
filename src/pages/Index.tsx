
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { ExpenseForm } from "@/components/ExpenseForm";
import { ExpenseChart } from "@/components/ExpenseChart";

interface Expense {
  id: number;
  category: string;
  amount: number;
  date: string;
}

const Index = () => {
  const [expenses, setExpenses] = useState<Expense[]>([
    { id: 1, category: "Food & Dining", amount: 25.50, date: "2024-03-15" },
    { id: 2, category: "Transportation", amount: 15.00, date: "2024-03-15" },
    { id: 3, category: "Entertainment", amount: 50.00, date: "2024-03-14" },
  ]);

  const handleAddExpense = (newExpense: Omit<Expense, "id">) => {
    setExpenses((prev) => [
      { ...newExpense, id: Math.max(0, ...prev.map((e) => e.id)) + 1 },
      ...prev,
    ]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary p-4 md:p-8">
      <main className="container mx-auto space-y-8 animate-fadeIn">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight text-balance">
            Budget Questor
          </h1>
          <p className="text-muted-foreground">
            Track your expenses, achieve your goals
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-6 glass-morphism card-hover">
            <h3 className="font-semibold text-sm text-muted-foreground">Total Spent</h3>
            <p className="text-2xl font-bold">
              ${expenses.reduce((sum, exp) => sum + exp.amount, 0).toFixed(2)}
            </p>
          </Card>
          <Card className="p-6 glass-morphism card-hover">
            <h3 className="font-semibold text-sm text-muted-foreground">Budget Left</h3>
            <p className="text-2xl font-bold text-mint-500">$750.50</p>
          </Card>
          <Card className="p-6 glass-morphism card-hover">
            <h3 className="font-semibold text-sm text-muted-foreground">Savings</h3>
            <p className="text-2xl font-bold">$1,234.00</p>
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
                  <p className="text-lg font-semibold">${expense.amount.toFixed(2)}</p>
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
