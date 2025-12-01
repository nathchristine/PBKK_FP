"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../components/sidebar";
import { Trash2 } from "lucide-react";

const API_URL = "http://localhost:8080";

interface Member {
  ID: number;
  name: string;
  email: string;
  role: string;
  created_at?: string;
}

const MembersTable = ({
  members,
  onDelete,
}: {
  members: Member[];
  onDelete: (id: number) => void;
}) => (
  <table className="w-full border-collapse bg-white/60 backdrop-blur-md rounded-xl shadow-md overflow-hidden">
    <thead className="bg-[#f9fafb]/50 border-b border-gray-200">
      <tr>
        <th className="py-4 px-6 text-left text-sm font-bold text-[#6d6e6f]">
          ID
        </th>
        <th className="py-4 px-6 text-left text-sm font-bold text-[#6d6e6f]">
          Name
        </th>
        <th className="py-4 px-6 text-left text-sm font-bold text-[#6d6e6f]">
          Email
        </th>
        <th className="py-4 px-6 text-left text-sm font-bold text-[#6d6e6f]">
          Role
        </th>
        <th className="py-4 px-6 text-left text-sm font-bold text-[#6d6e6f]">
          Action
        </th>
      </tr>
    </thead>
    <tbody>
      {/* if no members found show message */}
      {members.length === 0 ? (
        <tr className="border-b border-gray-100">
          <td className="py-4 px-6 text-center text-[#6d6e6f]" colSpan={5}>
            No members found.
          </td>
        </tr>
      ) : (
        members.map((m) => (
          <tr
            key={m.ID}
            className="border-b border-gray-100 hover:bg-white/40 transition"
          >
            <td className="py-4 px-6 text-[#6d6e6f] text-sm">#{m.ID}</td>
            <td className="py-4 px-6 text-[#262626] font-medium">{m.name}</td>
            <td className="py-4 px-6 text-[#6d6e6f]">{m.email}</td>
            <td className="py-4 px-6">
              <span
                className={`px-2 py-1 rounded text-xs font-bold uppercase flex items-center gap-1 w-fit ${
                  m.role === "admin"
                    ? "bg-[#262626] text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {m.role}
              </span>
            </td>
            <td className="py-4 px-6">
              {/* if user is not admin show delete button */}
              {m.role !== "admin" && (
                <button
                  onClick={() => onDelete(m.ID)}
                  className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                  title="Remove Member"
                >
                  <Trash2 size={18} />
                </button>
              )}
            </td>
          </tr>
        ))
      )}
    </tbody>
  </table>
);

export default function MembersPage() {
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [error, setError] = useState<string | null>(null);

  // check user role for sidebar and access control
  useEffect(() => {
    const storedRole = localStorage.getItem("userRole");
    if (!storedRole) {
      router.push("/login");
    } else if (storedRole !== "admin") {
      router.push("/books");
    } else {
      setRole(storedRole);
    }
  }, [router]);

  // get members from backend
  useEffect(() => {
    if (!role) return;

    const getMembers = async () => {
      try {
        const res = await fetch(`${API_URL}/users`);
        const data = await res.json();
        setMembers(data.users || []);
      } catch (err) {
        console.error("Error:", err);
        setError("Failed to load members.");
      }
    };

    getMembers();
  }, [role]);

  // handle member deletion
  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to remove this member?")) return;

    try {
      const res = await fetch(`${API_URL}/users/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete user");
      }
    } catch (err) {
      alert("Failed to delete user on server");
    }
  };

  // don't render page until role is verified
  if (!role) return null;

  return (
    <div className="min-h-screen w-full font-sans flex overflow-hidden bg-gradient-to-br from-[#f7cac9] to-[#92a8d1]">
      <Sidebar role={role} activePage="members" />

      <main className="flex-1 ml-64 p-4 h-screen">
        <div className="bg-[#f3f4f6]/90 backdrop-blur-2xl rounded-[32px] shadow-2xl w-full h-full flex flex-col border border-white/60 overflow-hidden">
          <header className="px-10 py-8 bg-white/50 backdrop-blur-sm border-b border-white/40 sticky top-0 z-10">
            <h2 className="text-2xl font-extrabold text-[#262626]">
              Member Management
            </h2>
            <p className="text-sm text-[#6d6e6f] mt-1">
              View and manage registered library members
            </p>
          </header>

          <div className="p-10 overflow-y-auto flex-1">
            <MembersTable members={members} onDelete={handleDelete} />
          </div>
        </div>
      </main>
    </div>
  );
}
