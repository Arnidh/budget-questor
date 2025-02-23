
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { ExpenseChart } from "@/components/ExpenseChart";
import { DashboardStats } from "@/components/DashboardStats";
import { ExpenseList } from "@/components/ExpenseList";
import { PeriodHeader } from "@/components/PeriodHeader";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

interface Expense {
  id: string;
  category: string;
  amount: number;
  date: string;
  period_id: string;
}

interface Budget {
  id: string;
  amount: number;
}

interface Period {
  id: string;
  start_date: string;
  end_date: string;
  total_spent: number;
}

const Dashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentPeriod, setCurrentPeriod] = useState<Period | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [budget, setBudget] = useState<Budget | null>(null);

  useEffect(() => {
    if (user) {
      fetchCurrentPeriod();
      fetchBudget();
    }
  }, [user]);

  const fetchCurrentPeriod = async () => {
    // Check if there's an active period
    const today = new Date();
    const { data: periods, error } = await supabase
      .from('monthly_periods')
      .select('*')
      .eq('user_id', user?.id)
      .lte('start_date', today.toISOString())
      .gte('end_date', today.toISOString())
      .maybeSingle();

    if (error) {
      toast({
        title: "Error fetching period",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    if (!periods) {
      // Create a new period
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(startDate.getDate() + 30);

      const { data: newPeriod, error: createError } = await supabase
        .from('monthly_periods')
        .insert([
          {
            user_id: user?.id,
            start_date: startDate.toISOString(),
            end_date: endDate.toISOString(),
            total_spent: 0,
          },
        ])
        .select()
        .single();

      if (createError) {
        toast({
          title: "Error creating period",
          description: createError.message,
          variant: "destructive",
        });
        return;
      }

      setCurrentPeriod(newPeriod);
    } else {
      setCurrentPeriod(periods);
    }
  };

  useEffect(() => {
    if (currentPeriod) {
      fetchPeriodExpenses();
    }
  }, [currentPeriod]);

  const fetchPeriodExpenses = async () => {
    if (!currentPeriod) return;

    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .eq('period_id', currentPeriod.id)
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

  const handleAddExpense = async (newExpense: Omit<Expense, "id" | "period_id">) => {
    if (!currentPeriod) return;

    const { data, error } = await supabase
      .from('expenses')
      .insert([
        {
          ...newExpense,
          user_id: user?.id,
          period_id: currentPeriod.id,
        },
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

    // Update period total
    const { error: updateError } = await supabase
      .from('monthly_periods')
      .update({
        total_spent: currentPeriod.total_spent + newExpense.amount,
      })
      .eq('id', currentPeriod.id);

    if (updateError) {
      toast({
        title: "Error updating period total",
        description: updateError.message,
        variant: "destructive",
      });
    }

    // Update local state
    setCurrentPeriod(prev => prev ? {
      ...prev,
      total_spent: prev.total_spent + newExpense.amount
    } : null);
  };

  const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const budgetLeft = budget ? budget.amount - totalSpent : 0;

  return (
    <div className="space-y-8">
      <PeriodHeader 
        startDate={currentPeriod?.start_date} 
        endDate={currentPeriod?.end_date}
      />

      <DashboardStats
        totalSpent={totalSpent}
        budgetAmount={budget?.amount || 0}
        budgetLeft={budgetLeft}
      />

      <Card className="p-6">
        <ExpenseChart expenses={expenses} />
      </Card>

      <ExpenseList 
        expenses={expenses}
        onAddExpense={handleAddExpense}
      />
    </div>
  );
};

export default Dashboard;
