
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, AlertCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";

interface InvestmentAdvice {
  title: string;
  description: string;
  risk: "Low" | "Medium" | "High";
  recommendation: string;
}

const Investment = () => {
  const { user } = useAuth();
  const [monthlyIncome, setMonthlyIncome] = useState<number>(0);
  const [monthlyExpenses, setMonthlyExpenses] = useState<number>(0);
  const [advice, setAdvice] = useState<InvestmentAdvice[]>([
    {
      title: "Emergency Fund",
      description: "Build an emergency fund of 3-6 months of expenses",
      risk: "Low",
      recommendation: "Keep in a high-yield savings account",
    },
    {
      title: "Debt Management",
      description: "Pay off high-interest debt before major investments",
      risk: "Low",
      recommendation: "Focus on debts with interest rates above 10%",
    },
    {
      title: "Index Funds",
      description: "Consider low-cost index funds for long-term growth",
      risk: "Medium",
      recommendation: "Allocate 60% of investment portfolio",
    },
  ]);

  useEffect(() => {
    if (user) {
      fetchFinancialData();
    }
  }, [user]);

  const fetchFinancialData = async () => {
    // Fetch budget
    const { data: budget } = await supabase
      .from('budgets')
      .select('amount')
      .maybeSingle();

    if (budget) {
      setMonthlyIncome(budget.amount);
    }

    // Fetch latest monthly expenses
    const { data: period } = await supabase
      .from('monthly_periods')
      .select('total_spent')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (period) {
      setMonthlyExpenses(period.total_spent);
    }
  };

  const savingsRate = monthlyIncome > 0 
    ? ((monthlyIncome - monthlyExpenses) / monthlyIncome * 100).toFixed(1)
    : '0';

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Investment Advice</h1>
        <p className="text-muted-foreground mt-2">
          Smart recommendations for better financial decisions
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <h3 className="font-semibold text-sm text-muted-foreground">
            Monthly Income
          </h3>
          <p className="text-2xl font-bold">₹{monthlyIncome.toFixed(2)}</p>
        </Card>
        <Card className="p-6">
          <h3 className="font-semibold text-sm text-muted-foreground">
            Monthly Expenses
          </h3>
          <p className="text-2xl font-bold">₹{monthlyExpenses.toFixed(2)}</p>
        </Card>
        <Card className="p-6">
          <h3 className="font-semibold text-sm text-muted-foreground">
            Savings Rate
          </h3>
          <p className="text-2xl font-bold text-mint-500">{savingsRate}%</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {advice.map((item, index) => (
          <Card key={index} className="p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-mint-500" />
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {item.description}
                </p>
              </div>
            </div>
            <div className="pt-4 border-t">
              <div className="flex items-center gap-2 text-sm">
                <AlertCircle className="h-4 w-4" />
                Risk Level: {item.risk}
              </div>
              <p className="text-sm mt-2">{item.recommendation}</p>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Personalized Recommendation</h3>
          <p className="text-muted-foreground">
            Based on your current savings rate of {savingsRate}%, we recommend:
          </p>
          <ul className="list-disc list-inside space-y-2 text-sm">
            <li>
              {Number(savingsRate) < 20
                ? "Focus on reducing expenses and building an emergency fund"
                : Number(savingsRate) < 40
                ? "Consider diversifying investments across low to medium risk options"
                : "Explore advanced investment strategies and consider retirement planning"}
            </li>
            <li>Track your expenses regularly to maintain financial discipline</li>
            <li>Review and adjust your investment strategy quarterly</li>
          </ul>
          <Button className="mt-4">
            <TrendingUp className="mr-2 h-4 w-4" />
            Get Detailed Analysis
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Investment;
