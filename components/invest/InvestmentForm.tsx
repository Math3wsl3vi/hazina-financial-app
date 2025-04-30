import {
  Frequency,
  InvestmentEntry,
  InvestmentType,
  RiskLevel,
} from "@/lib/types";
import { useState, useEffect } from "react";
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

// Interface for storing investment history in local storage
interface InvestmentRecord {
  date: string;
  frequency: Frequency;
}

interface InvestmentFormProps {
  onInvest: (entry: Omit<InvestmentEntry, 'id' | 'userId' | 'createdAt'>) => void;
}

export default function InvestmentForm({ onInvest }: InvestmentFormProps) {
  const [amount, setAmount] = useState<string>("");
  const [frequency, setFrequency] = useState<Frequency>("monthly");
  const [investmentType, setInvestmentType] = useState<InvestmentType>("local");
  const [riskLevel, setRiskLevel] = useState<RiskLevel>("medium");
  const [notes, setNotes] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [streak, setStreak] = useState<number>(0);
  const [streakBroken, setStreakBroken] = useState<boolean>(false);
  const [investmentHistory, setInvestmentHistory] = useState<InvestmentRecord[]>([]);

  // Load investment history from local storage on mount
  useEffect(() => {
    const storedHistory = localStorage.getItem("investmentHistory");
    if (storedHistory) {
      const history: InvestmentRecord[] = JSON.parse(storedHistory);
      setInvestmentHistory(history);
      calculateStreak(history);
    }
  }, []);

  // Save investment history to local storage whenever it updates
  useEffect(() => {
    localStorage.setItem("investmentHistory", JSON.stringify(investmentHistory));
    calculateStreak(investmentHistory);
  }, [investmentHistory]);

  // Function to calculate streak and check if it's broken
  const calculateStreak = (history: InvestmentRecord[]) => {
    if (history.length === 0) {
      setStreak(0);
      setStreakBroken(false);
      return;
    }

    // Filter history by the current frequency to calculate streak
    const relevantHistory = history
      .filter((record) => record.frequency === frequency)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    if (relevantHistory.length === 0) {
      setStreak(0);
      setStreakBroken(false);
      return;
    }

    let currentStreak = 1;
    let streakIsBroken = false;
    const now = new Date();

    for (let i = 0; i < relevantHistory.length - 1; i++) {
      const currentDate = new Date(relevantHistory[i].date);
      const nextDate = new Date(relevantHistory[i + 1].date);

      // Calculate the expected interval based on frequency
      let expectedInterval: number;
      if (frequency === "daily") {
        expectedInterval = 24 * 60 * 60 * 1000; // 1 day in milliseconds
      } else if (frequency === "weekly") {
        expectedInterval = 7 * 24 * 60 * 60 * 1000; // 1 week in milliseconds
      } else {
        expectedInterval = 30 * 24 * 60 * 60 * 1000; // ~1 month in milliseconds
      }

      // Check if the current investment is within the expected interval from the previous one
      const timeDiff = currentDate.getTime() - nextDate.getTime();
      if (timeDiff <= expectedInterval * 1.1) { // Allow 10% buffer for flexibility
        currentStreak++;
      } else {
        break;
      }

      // Check if the streak is broken by comparing the latest investment to now
      const timeSinceLastInvestment = now.getTime() - currentDate.getTime();
      if (timeSinceLastInvestment > expectedInterval * 1.1) {
        streakIsBroken = true;
      }
    }

    setStreak(currentStreak);
    setStreakBroken(streakIsBroken);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const investmentData = {
      amount: parseFloat(amount),
      frequency,
      investmentType,
      riskLevel,
      name,
      notes,
      date: new Date().toISOString(),
      type: investmentType,
    };

    // Add the new investment to history
    const newRecord: InvestmentRecord = {
      date: investmentData.date,
      frequency,
    };
    setInvestmentHistory((prev) => [...prev, newRecord]);

    onInvest(investmentData);
    setAmount("");
    setName("");
    setNotes("");
  };

  const getRiskExamples = (): string[] => {
    const examples = {
      local: {
        low: ["Treasury bonds", "Treasury bill", "Money market funds", "Commercial papers"],
        medium: ["Fixed Income Funds", "Balanced Fund", "Corporate bonds"],
        high: ["Equities", "Sector-specific funds", "Growth-oriented Unit Trusts"],
      },
      global: {
        low: ["Money market fund(EUR/USD)", "US Treasury Bills", "German bunds", "High-Grade Corporate Bonds"],
        medium: ["Diversified Bond ETFs", "Real Estate ETFs", "Index funds"],
        high: ["Emerging market ETFs", "Crypto currency", "Tech-focused ETFs", "Single stock investing"],
      },
    };
    return examples[investmentType][riskLevel];
  };

  return (
    <div className="space-y-4  font-poppins">
      {/* Streak Display */}
        <div className={`rounded-xl p-6 shadow-sm transition-all duration-300 ${
    streakBroken ? "bg-red-50 border border-red-200" : "bg-white border border-green-200"
  }`}>
    <div className="flex items-center gap-3">
      <span className={`text-2xl ${streakBroken ? "text-red-500" : "text-green-600"}`}>
        {streakBroken ? "⚠️" : "🔥"}
      </span>
      <h3 className="text-xl font-semibold text-gray-800">
        Your {frequency} Investment Streak: {streak}
      </h3>
    </div>
    {streakBroken ? (
      <p className="mt-3 text-sm text-red-700">
        Streak Broken! You missed a {frequency} investment. Keep going to start a new one 💪
      </p>
    ) : (
      <p className="mt-3 text-sm text-green-700">
        Great job! You’ve invested consistently every {frequency}. Keep the momentum going 🚀
      </p>
    )}
  </div>


      {/* Investment Form */}
      <form onSubmit={handleSubmit} className="space-y-4 border rounded-lg p-4">
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
                onClick={() => setNotes(example)}
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
          className="px-4 py-2 bg-black text-white rounded-md w-full"
        >
          Add Investment
        </Button>
      </form>
    </div>
  );
}