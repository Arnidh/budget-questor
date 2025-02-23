
interface PeriodHeaderProps {
  startDate?: string;
  endDate?: string;
}

export function PeriodHeader({ startDate, endDate }: PeriodHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-3xl font-bold">Monthly Dashboard</h1>
      <div className="text-sm text-muted-foreground">
        Period: {startDate} to {endDate}
      </div>
    </div>
  );
}
