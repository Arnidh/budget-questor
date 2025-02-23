
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { ExpenseForm } from "@/components/ExpenseForm";
import { ExpenseChart } from "@/components/ExpenseChart";
import { AuthForm } from "@/components/AuthForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut, Pencil } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

interface Expense {
  id: string;
  category: string;
  amount: number;
  date: string;
}

interface Budget {
  id: string;
  amount: number;
}

const Index = () => {
  const { user, signOut, isLoading } = useAuth();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [budget, setBudget] = useState<Budget | null>(null);
  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [newBudget, setNewBudget] = useState("");
  const { toast } = useToast();

  // Fetch expenses and budget when component mounts
  useEffect(() => {
    if (user) {
      fetchExpenses();
      fetchBudget();
    }
  }, [user]);

  const fetchExpenses = async () => {
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .order('date', { ascending: false });

    if (error) {
      toast({
        title: "Error fetching expenses",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    setExpenses(data || []);
  };

  const fetchBudget = async () => {
    const { data, error } = await supabase
      .from('budgets')
      .select('*')
      .maybeSingle();

    if (error) {
      toast({
        title: "Error fetching budget",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    setBudget(data);
  };

  const handleBudgetSubmit = async () => {
    const amount = parseFloat(newBudget);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Invalid budget amount",
        description: "Please enter a valid budget amount",
        variant: "destructive",
      });
      return;
    }

    const { error } = budget 
      ? await supabase
          .from('budgets')
          .update({ amount })
          .eq('user_id', user?.id)
      : await supabase
          .from('budgets')
          .insert([{ amount, user_id: user?.id }]);

    if (error) {
      toast({
        title: "Error saving budget",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    setBudget(prev => prev ? { ...prev, amount } : { id: '', amount });
    setIsEditingBudget(false);
    setNewBudget("");
    
    toast({
      title: "Success",
      description: "Budget updated successfully",
    });
  };

  const handleAddExpense = async (newExpense: Omit<Expense, "id">) => {
    const { data, error } = await supabase
      .from('expenses')
      .insert([
        {
          ...newExpense,
          user_id: user?.id,
        }
      ])
      .select()
      .single();

    if (error) {
      toast({
        title: "Error adding expense",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    setExpenses((prev) => [data, ...prev]);
  };

  const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const budgetLeft = budget ? budget.amount - totalSpent : 0;

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
            <p className="text-2xl font-bold">₹{totalSpent.toFixed(2)}</p>
          </Card>
          <Card className="p-6 glass-morphism card-hover">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-sm text-muted-foreground">Monthly Budget</h3>
                {isEditingBudget ? (
                  <div className="flex gap-2 mt-2">
                    <Input
                      type="number"
                      value={newBudget}
                      onChange={(e) => setNewBudget(e.target.value)}
                      placeholder="Enter budget"
                      className="w-32"
                    />
                    <Button onClick={handleBudgetSubmit} size="sm">Save</Button>
                  </div>
                ) : (
                  <p className="text-2xl font-bold">₹{budget?.amount.toFixed(2) || '0.00'}</p>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setIsEditingBudget(true);
                  setNewBudget(budget?.amount.toString() || "");
                }}
              >
                <Pencil className="h-4 w-4" />
              </Button>
            </div>
          </Card>
          <Card className="p-6 glass-morphism card-hover">
            <h3 className="font-semibold text-sm text-muted-foreground">Budget Left</h3>
            <p className="text-2xl font-bold text-mint-500">₹{budgetLeft.toFixed(2)}</p>
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
