"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, PlusSquare, BarChart, Wallet, Clock } from "lucide-react"; // ✅ Added Clock for "View Transactions"

const navItems = [
  { name: "Home", href: "/", icon: Home },
  { name: "Add", href: "/add-transaction", icon: PlusSquare },
  { name: "Transactions", href: "/transactions", icon: Clock }, // ✅ Added Transactions
  { name: "Budget", href: "/budget", icon: BarChart },
  { name: "Accounts", href: "/accounts", icon: Wallet },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-gray-900 p-3 border-t border-gray-700 flex justify-around items-center text-gray-400">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;
        return (
          <Link
            key={item.name}
            href={item.href}
            className={`flex flex-col items-center ${
              isActive ? "text-blue-500" : "text-gray-400 hover:text-white"
            }`}
          >
            <Icon className="w-6 h-6" />
            <span className="text-xs">{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}
