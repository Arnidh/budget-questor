
import { Card } from "@/components/ui/card";
import { ExpenseForm } from "./ExpenseForm";

interface Expense {
  id: string;
  category: string;
  amount: number;
  date: string;
}

interface ExpenseListProps {
  expenses: Expense[];
  onAddExpense: (expense: Omit<Expense, "id">) => void;
}

export function ExpenseList({ expenses, onAddExpense }: ExpenseListProps) {
  return (
    <section>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Recent Expenses</h2>
        <ExpenseForm onSubmit={onAddExpense} />
      </div>
      <div className="space-y-3">
        {expenses.map((expense) => (
          <Card key={expense.id} className="p-4">
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
  );
}
