// components/invest/SnapshotCard.tsx
import { Card } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Button } from "../ui/button";

type SnapshotCardProps = {
  indexName: string;
  indexLabel: string;
  price: string;
  changePercent: number;
  currency?: string;
};

export default function SnapshotCard({
  indexName,
  indexLabel,
  price,
  changePercent,
  currency = "JPY",
}: SnapshotCardProps) {
  const isPositive = changePercent >= 0;

  return (
    <Card className="bg-[#0F0F0F] text-white p-4 rounded-xl min-w-full max-w-xs shadow-lg border border-neutral-800">
      <div className="flex items-center space-x-3 mb-2">
        <div className="bg-blue-600 w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold">225</div>
        <div>
          <div className="text-sm font-semibold">{indexName}</div>
          <div className="text-xs text-gray-400">{indexLabel}</div>
        </div>
      </div>
      <div className="text-2xl font-semibold">{price} <span className="text-sm">{currency}</span></div>
      <div className={`text-sm font-medium mt-1 ${isPositive ? "text-green-400" : "text-red-400"} flex items-center`}>
        {isPositive ? <ArrowUpRight className="w-4 h-4 mr-1" /> : <ArrowDownRight className="w-4 h-4 mr-1" />}
        {changePercent > 0 ? "+" : ""}
        {changePercent}%
      </div>
      <Button className="bg-white text-black w-full mt-4 hover:border-white hover:bg-black hover:text-white">View Snapshot</Button>
    </Card>
  );
}
