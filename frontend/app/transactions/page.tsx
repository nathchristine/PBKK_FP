"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../components/sidebar";
import { Check, Trash2 } from "lucide-react";

const API_URL = "http://localhost:8080";

interface Transaction {
  id: number;
  user_name?: string;
  book_title: string;
  book_id: number;
  borrow_date: string;
  return_date: string;
  status: string;
}

type AdminAction = "returned" | "remove";

const MemberTransactionsTable = ({
  transactions,
}: {
  transactions: Transaction[];
}) => (
  <table className="w-full border-collapse bg-white/60 backdrop-blur-md rounded-xl shadow-md overflow-hidden">
    <thead className="bg-[#f9fafb]/50 border-b border-gray-200">
      <tr>
        <th className="py-4 px-6 text-left text-sm font-bold text-[#6d6e6f]">
          Book
        </th>
        <th className="py-4 px-6 text-left text-sm font-bold text-[#6d6e6f]">
          Borrow Date
        </th>
        <th className="py-4 px-6 text-left text-sm font-bold text-[#6d6e6f]">
          Return Date
        </th>
        <th className="py-4 px-6 text-left text-sm font-bold text-[#6d6e6f]">
          Status
        </th>
      </tr>
    </thead>
    <tbody>
      {transactions.length === 0 ? (
        <tr className="border-b border-gray-100">
          <td className="py-4 px-6 text-center text-[#6d6e6f]" colSpan={4}>
            No transactions found.
          </td>
        </tr>
      ) : (
        transactions.map((t) => (
          <tr
            key={t.id}
            className="border-b border-gray-100 hover:bg-white/40 transition"
          >
            <td className="py-4 px-6 text-[#262626] font-medium">
              {t.book_title}
            </td>
            <td className="py-4 px-6 text-[#6d6e6f]">{t.borrow_date}</td>
            <td className="py-4 px-6 text-[#6d6e6f]">{t.return_date ?? "-"}</td>
            <td className="py-4 px-6">
              <span
                className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                  t.status.toLowerCase() === "returned"
                    ? "bg-green-100 text-green-600"
                    : "bg-yellow-100 text-yellow-600"
                }`}
              >
                {t.status}
              </span>
            </td>
          </tr>
        ))
      )}
    </tbody>
  </table>
);

interface AdminTableProps {
  transactions: Transaction[];
  onAction: (id: number, action: AdminAction) => void;
}

const AdminTransactionsTable = ({
  transactions,
  onAction,
}: AdminTableProps) => (
  <table className="w-full border-collapse bg-white/60 backdrop-blur-md rounded-xl shadow-md overflow-hidden">
    <thead className="bg-[#f9fafb]/50 border-b border-gray-200">
      <tr>
        <th className="py-4 px-6 text-left text-sm font-bold text-[#6d6e6f]">
          Borrower
        </th>
        <th className="py-4 px-6 text-left text-sm font-bold text-[#6d6e6f]">
          Book
        </th>
        <th className="py-4 px-6 text-left text-sm font-bold text-[#6d6e6f]">
          Borrow Date
        </th>
        <th className="py-4 px-6 text-left text-sm font-bold text-[#6d6e6f]">
          Return Date
        </th>
        <th className="py-4 px-6 text-left text-sm font-bold text-[#6d6e6f]">
          Status
        </th>
        <th className="py-4 px-6 text-left text-sm font-bold text-[#6d6e6f]">
          Action
        </th>
      </tr>
    </thead>
    <tbody>
      {transactions.length === 0 ? (
        <tr className="border-b border-gray-100">
          <td className="py-4 px-6 text-center text-[#6d6e6f]" colSpan={6}>
            No transactions found.
          </td>
        </tr>
      ) : (
        transactions.map((t) => (
          <tr
            key={t.id}
            className="border-b border-gray-100 hover:bg-white/40 transition"
          >
            <td className="py-4 px-6 text-[#262626] font-medium">
              {t.user_name}
            </td>
            <td className="py-4 px-6 text-[#262626]">{t.book_title}</td>
            <td className="py-4 px-6 text-[#6d6e6f]">{t.borrow_date}</td>
            <td className="py-4 px-6 text-[#6d6e6f]">{t.return_date ?? "-"}</td>
            <td className="py-4 px-6">
              <span
                className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                  t.status.toLowerCase() === "returned"
                    ? "bg-green-100 text-green-600"
                    : "bg-yellow-100 text-yellow-600"
                }`}
              >
                {t.status}
              </span>
            </td>
            <td className="py-4 px-6">
              <div className="flex items-center gap-2">
                {t.status.toLowerCase() !== "returned" && (
                  <button
                    onClick={() => onAction(t.id, "returned")}
                    className="p-2 bg-green-50 text-green-600 rounded-full hover:bg-green-100 transition-colors shadow-sm"
                    title="Mark as Returned"
                  >
                    <Check size={16} />
                  </button>
                )}

                <button
                  onClick={() => onAction(t.id, "remove")}
                  className="p-2 bg-red-50 text-red-500 rounded-full hover:bg-red-100 transition-colors shadow-sm"
                  title="Delete Transaction"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </td>
          </tr>
        ))
      )}
    </tbody>
  </table>
);

export default function TransactionsPage() {
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // check user role for sidebar and access control, get user name for transaction filtering
  useEffect(() => {
    const storedRole = localStorage.getItem("userRole");
    const storedUserName = localStorage.getItem("userName");
    if (!storedRole) {
      router.push("/login");
    } else {
      setRole(storedRole);
      setUserName(storedUserName);
    }
  }, [router]);

  // get transactions from backend
  useEffect(() => {
    const getTransaction = async () => {
      try {
        const res = await fetch(`${API_URL}/transactions`);
        const data = await res.json();
        const allTransactions = data.transactions || [];

        // if member, filter transactions to only their own transactions
        if (role === "member" && userName) {
          const myTransactions = allTransactions.filter(
            (t: Transaction) => t.user_name === userName
          );
          setTransactions(myTransactions);
          // if admin, show all transactions
        } else {
          setTransactions(allTransactions);
        }
      } catch (err) {
        console.error("Error:", err);
      }
    };

    if (role) {
      getTransaction();
    }
  }, [role, userName]);

  // handle user logout
  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("userName");
    router.push("/login");
  };

  // handle admin actions on transactions
  const handleAdminAction = async (id: number, action: AdminAction) => {
    try {
      if (action === "returned") {
        // confirm action
        if (!confirm("Mark this transaction as returned? This will make the book available."))
          return;

        // find the transaction by id
        const tr = transactions.find((t) => t.id === id);
        if (!tr) return;

        // update transaction status to 'returned'
        const res = await fetch(`${API_URL}/transactions/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "returned" }),
        });
        if (!res.ok) throw new Error("Failed to update status");

        // update book status to 'available'
        if (tr.book_id) {
          try {
            // get book details from backend
            const bookRes = await fetch(`${API_URL}/books/${tr.book_id}`);
            const bookData = await bookRes.json();
            const book = bookData.book;

            // update book status to available
            await fetch(`${API_URL}/books/${tr.book_id}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                title: book.title,
                author: book.author,
                genre: book.genre,
                year: book.year,
                cover: book.cover,
                status: "Available", 
              }),
            });
          } catch (bookErr) {
            console.error("Failed to update book status", bookErr);
          }
        }
      }

      // handle transaction deletion
      if (action === "remove") {
        if (!confirm("Delete this transaction?")) 
          return;

        // delete transaction from backend
        const res = await fetch(`${API_URL}/transactions/${id}`, {
          method: "DELETE",
        });

        if (!res.ok) throw new Error("Failed to delete");
      }
    } catch (err) {
      console.error(err);
      alert("Action failed.");
    }
  };

  if (!role) return null;

  return (
    <div className="min-h-screen w-full font-sans flex overflow-hidden bg-gradient-to-br from-[#f7cac9] to-[#92a8d1]">
      <Sidebar role={role} activePage="transactions" />

      <main className="flex-1 ml-64 p-4 h-screen">
        <div className="bg-[#f3f4f6]/90 backdrop-blur-2xl rounded-[32px] shadow-2xl w-full h-full flex flex-col border border-white/60 overflow-hidden">
          <header className="px-10 py-8 bg-white/50 backdrop-blur-sm border-b border-white/40 sticky top-0 z-10">
            {/* different header for admin and member */}
            <h2 className="text-2xl font-extrabold text-[#262626]">
              {role === "admin" ? "All Transactions" : "My Transactions"}
            </h2>
            <p className="text-sm text-[#6d6e6f] mt-1">
              {role === "admin"
                ? "View and manage all transactions"
                : `Viewing history for ${userName || "User"}`}
            </p>
          </header>

          {/* different tables for admin and member */}
          <div className="p-10 overflow-y-auto flex-1">
            {role === "admin" ? (
              <AdminTransactionsTable
                transactions={transactions}
                onAction={handleAdminAction}
              />
            ) : (
              <MemberTransactionsTable transactions={transactions} />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
