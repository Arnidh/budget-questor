
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface MonthlySpending {
  month: string;
  amount: number;
}

interface CategoryTotal {
  category: string;
  total: number;
}

const Profile = () => {
  const { user } = useAuth();
  const [monthlySpending, setMonthlySpending] = useState<MonthlySpending[]>([]);
  const [totalSpent, setTotalSpent] = useState(0);
  const [categoryTotals, setCategoryTotals] = useState<CategoryTotal[]>([]);
  const [avgMonthlySpend, setAvgMonthlySpend] = useState(0);

  useEffect(() => {
    if (user) {
      fetchSpendingHistory();
      fetchCategoryTotals();
    }
  }, [user]);

  const fetchSpendingHistory = async () => {
    const { data: periods } = await supabase
      .from('monthly_periods')
      .select('start_date, total_spent')
      .order('start_date', { ascending: true });

    if (periods) {
      const monthlyData = periods.map(period => ({
        month: new Date(period.start_date).toLocaleDateString('default', { month: 'short', year: 'numeric' }),
        amount: period.total_spent
      }));

      setMonthlySpending(monthlyData);
      const total = periods.reduce((sum, period) => sum + period.total_spent, 0);
      setTotalSpent(total);
      setAvgMonthlySpend(total / periods.length || 0);
    }
  };

  const fetchCategoryTotals = async () => {
    const { data: expenses } = await supabase
      .from('expenses')
      .select('category, amount');

    if (expenses) {
      const totals = expenses.reduce((acc: Record<string, number>, expense) => {
        acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
        return acc;
      }, {});

      setCategoryTotals(
        Object.entries(totals)
          .map(([category, total]) => ({ category, total }))
          .sort((a, b) => b.total - a.total)
      );
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Profile & Spending History</h1>
        <p className="text-muted-foreground mt-2">
          Your complete financial journey at a glance
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <h3 className="font-semibold text-sm text-muted-foreground">
            Total Spent (All Time)
          </h3>
          <p className="text-2xl font-bold">₹{totalSpent.toFixed(2)}</p>
        </Card>
        <Card className="p-6">
          <h3 className="font-semibold text-sm text-muted-foreground">
            Average Monthly Spend
          </h3>
          <p className="text-2xl font-bold">₹{avgMonthlySpend.toFixed(2)}</p>
        </Card>
        <Card className="p-6">
          <h3 className="font-semibold text-sm text-muted-foreground">
            Most Spent Category
          </h3>
          <p className="text-2xl font-bold">
            {categoryTotals[0]?.category || "No data"}
          </p>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4">Spending Trend</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlySpending}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="amount"
                stroke="#2a9989"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4">Category Breakdown</h3>
        <div className="space-y-4">
          {categoryTotals.map((category) => (
            <div key={category.category} className="flex justify-between items-center">
              <span className="font-medium">{category.category}</span>
              <span>₹{category.total.toFixed(2)}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Profile;
