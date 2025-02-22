
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const { toast } = useToast();
  const [expenses, setExpenses] = useState([
    { id: 1, category: "Food", amount: 25.50, date: "2024-03-15" },
    { id: 2, category: "Transport", amount: 15.00, date: "2024-03-15" },
    { id: 3, category: "Entertainment", amount: 50.00, date: "2024-03-14" },
  ]);

  const handleAddExpense = () => {
    toast({
      title: "Coming soon!",
      description: "This feature will be available in the next update.",
    });
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
            <p className="text-2xl font-bold">${expenses.reduce((sum, exp) => sum + exp.amount, 0).toFixed(2)}</p>
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

        {/* Recent Expenses */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Recent Expenses</h2>
            <Button onClick={handleAddExpense} className="bg-mint-500 hover:bg-mint-600">
              Add Expense
            </Button>
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
