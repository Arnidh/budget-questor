
import { Card } from "@/components/ui/card";

interface DashboardStatsProps {
  totalSpent: number;
  budgetAmount: number;
  budgetLeft: number;
}

export function DashboardStats({ totalSpent, budgetAmount, budgetLeft }: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="p-6">
        <h3 className="font-semibold text-sm text-muted-foreground">
          Monthly Spent
        </h3>
        <p className="text-2xl font-bold">₹{totalSpent.toFixed(2)}</p>
      </Card>
      <Card className="p-6">
        <h3 className="font-semibold text-sm text-muted-foreground">
          Monthly Budget
        </h3>
        <p className="text-2xl font-bold">₹{budgetAmount.toFixed(2) || '0.00'}</p>
      </Card>
      <Card className="p-6">
        <h3 className="font-semibold text-sm text-muted-foreground">
          Budget Left
        </h3>
        <p className="text-2xl font-bold text-mint-500">₹{budgetLeft.toFixed(2)}</p>
      </Card>
    </div>
  );
}
