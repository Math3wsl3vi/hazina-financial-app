// components/invest/InvestmentForm.tsx

import {
  Frequency,
  InvestmentEntry,
  InvestmentType,
  RiskLevel,
} from "@/lib/types";
import { useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "../ui/textarea";

interface InvestmentFormProps {
  onInvest: (entry: InvestmentEntry) => void;
}

export default function InvestmentForm({ onInvest }: InvestmentFormProps) {
  const [amount, setAmount] = useState<string>("");
  const [frequency, setFrequency] = useState<Frequency>("monthly");
  const [investmentType, setInvestmentType] = useState<InvestmentType>("local");
  const [riskLevel, setRiskLevel] = useState<RiskLevel>("medium");
  const [notes, setNotes] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onInvest({
      amount: parseFloat(amount),
      frequency,
      investmentType,
      riskLevel,
      notes,
      date: new Date().toISOString(),
    });
    setAmount("");
    setNotes("");
  };

  const getRiskExamples = (): string[] => {
    const examples = {
      local: {
        low: ["Treasury bonds", "Treasury bill", "Money market funds","Commercial papers"],
        medium: ["Fixed Income Funds", "Balanced Fund", "Corporate bonds"],
        high: ["Equities", "Sector-specific funds", "Growth-oriented Unit Trusts"],
      },
      global: {
        low: ["Money market fund(EUR/USD)", "US Treasury Bills", "German bunds","High-Grade Corporate Bonds"],
        medium: [
          "Diversified Bond ETFs",
          "Real Estate ETFs",
          "Index funds",
        ],
        high: ["Emerging market ETFs", "Crypto currency", "Tech-focused ETFs","Single stock investing"],
      },
    };
    return examples[investmentType][riskLevel];
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 p-4 border rounded-lg font-poppins"
    >
      <h2 className="text-xl font-semibold">Add New Investment</h2>
      <div className="flex items-center gap-4">
        <div className="flex gap-2 flex-col">
          <Label className="block text-sm font-medium text-gray-700">
            Frequency
          </Label>
          <Select
            onValueChange={(value: Frequency) => setFrequency(value)}
            value={frequency}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Timeline" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-2">
          <Label className="block text-sm font-medium text-gray-700">
            Amount (Ksh)
          </Label>
          <Input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
            required
          />
        </div>
      </div>

      <div>
        <Label className="block text-sm font-medium text-gray-700 mb-1">
          Investment Type
        </Label>
        <div className="flex gap-4">
          {(["local", "global"] as InvestmentType[]).map((type) => (
            <Button
              key={type}
              type="button"
              onClick={() => setInvestmentType(type)}
              className={`px-4 py-2 rounded-md text-sm font-medium border transition w-full
          ${
            investmentType === type
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
          }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      <div>
        <Label className="block text-sm font-medium text-gray-700">
          Risk Level
        </Label>
        <div className="mt-2 space-x-4">
          {(["low", "medium", "high"] as RiskLevel[]).map((level) => (
            <Label key={level} className="inline-flex items-center">
              <Input
                type="radio"
                value={level}
                checked={riskLevel === level}
                onChange={() => setRiskLevel(level)}
                className="h-4 w-4 text-blue-600"
              />
              <span className="ml-2 capitalize">{level}</span>
            </Label>
          ))}
        </div>
      </div>

      <div className="bg-blue-50 p-3 rounded-md">
        <h4 className="text-sm font-medium text-blue-800">
          Examples for {investmentType} {riskLevel} risk:
        </h4>
        <div className="flex flex-wrap gap-2 mt-2">
          {getRiskExamples().map((example, i) => (
            <Button
              key={i}
              type="button"
              onClick={() => setNotes(example)} // or handle however you want
              className="px-3 py-1 rounded-full border text-sm bg-blue-100 text-blue-700 hover:bg-blue-200 transition"
            >
              {example}
            </Button>
          ))}
        </div>
      </div>

      <div>
        <Label className="block text-sm font-medium text-gray-700">Notes</Label>
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
          rows={2}
        />
      </div>

      <Button
        type="submit"
        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 w-full"
      >
        Add Investment
      </Button>
    </form>
  );
}
