"use client";

import React, { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function InsightsPage() {
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date().toISOString().slice(0, 7)); // Format YYYY-MM

  useEffect(() => {
    async function fetchData() {
      try {
        const transactionsRes = await fetch(`/api/transactions?month=${currentMonth}`);
        const budgetsRes = await fetch(`/api/budgets?month=${currentMonth}`);
        
        const transactionsData = await transactionsRes.json();
        const budgetsData = await budgetsRes.json();
        
        setTransactions(transactionsData);
        setBudgets(budgetsData);
      } catch (error) {
        console.error("❌ Error fetching data:", error);
      }
    }
    fetchData();
  }, [currentMonth]);

  // Find the biggest expense category
  const expenseTotals = transactions.filter(t => t.type === "expense")
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + Math.abs(t.amount);
      return acc;
    }, {});

  const biggestExpenseCategory = Object.keys(expenseTotals).reduce((a, b) => expenseTotals[a] > expenseTotals[b] ? a : b, "");
  const biggestExpenseAmount = expenseTotals[biggestExpenseCategory] || 0;

  return (
    <div className="p-6">
      {/* Page Header */}
      <h1 className="text-2xl font-bold text-white mb-4">📊 Spending Insights</h1>

      {/* Spending Trends Over Time */}
      <div className="bg-gray-900 p-4 rounded-lg shadow-lg">
        <h2 className="text-white text-lg font-semibold mb-4">📈 Spending Trends</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={transactions}>
            <XAxis dataKey="date" tick={{ fill: "white" }} />
            <YAxis tick={{ fill: "white" }} />
            <Tooltip />
            <Line type="monotone" dataKey="amount" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Biggest Expense Category */}
      <div className="bg-gray-900 p-4 rounded-lg shadow-lg mt-6">
        <h2 className="text-white text-lg font-semibold mb-4">💸 Biggest Expense</h2>
        {biggestExpenseCategory ? (
          <p className="text-white text-xl font-bold">{biggestExpenseCategory}: ₹{biggestExpenseAmount.toFixed(2)}</p>
        ) : (
          <p className="text-gray-400 text-center">No expenses recorded.</p>
        )}
      </div>
    </div>
  );
}
