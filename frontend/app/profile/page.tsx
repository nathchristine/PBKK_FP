"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User } from "lucide-react";
import Sidebar from "../components/sidebar";

const API_URL = "http://localhost:8080";

interface UserData {
  id: number;
  name: string;
  email: string;
  role: string;
}

export default function ProfilePage() {
  const Router = useRouter();
  const [role, setRole] = useState<string | null>(null);
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    // get user role and id from local storage
    const storedRole = localStorage.getItem("userRole");
    const userId = localStorage.getItem("userId");

    // redirect to login if no role or userId found
    if (!storedRole || !userId) {
      Router.push("/login");
      return;
    }

    setRole(storedRole);

    // get user data from backend
    fetch(`${API_URL}/users`)
      .then((res) => res.json())
      .then((data) => {
        const allUsers = data.users;
        const found = allUsers.find((u: any) => String(u.ID) === userId);

        if (found) {
          setUser({
            id: found.ID,
            name: found.name,
            email: found.email,
            role: found.role,
          });
        }
      });
  }, []);

  // handle user logout
  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    Router.push("/login");
  };

  if (!role) return null;

  return (
    <div className="min-h-screen w-full font-sans flex overflow-hidden bg-gradient-to-br from-[#f7cac9] to-[#92a8d1]">
      <Sidebar role={role} activePage="profile" />

      <main className="flex-1 ml-64 p-4 h-screen">
        <div className="bg-[#f3f4f6]/90 backdrop-blur-2xl rounded-[32px] shadow-2xl w-full h-full flex flex-col border border-white/60 overflow-hidden">
          <header className="px-10 py-8 bg-white/50 backdrop-blur-sm border-b border-white/40 sticky top-0 z-10">
            <h2 className="text-2xl font-extrabold text-[#262626] tracking-tight">
              My Profile
            </h2>
          </header>

          <div className="p-10 overflow-y-auto flex-1">
            <div className="max-w-xl mx-auto bg-white p-10 rounded-3xl shadow-md border border-gray-200">
              <div className="w-24 h-24 mx-auto bg-[#92a8d1] rounded-full flex items-center justify-center text-white shadow-md mb-6">
                <User size={36} />
              </div>

              <div className="space-y-4 text-[#262626] text-lg">
                <p>
                  <strong>Name: </strong> {user?.name}
                </p>
                <p>
                  <strong>Email: </strong> {user?.email}
                </p>
                <p>
                  <strong>Role: </strong> {user?.role}
                </p>
              </div>

              <button
                onClick={handleLogout}
                className="mt-10 w-full bg-[#92a8d1] hover:bg-[#7a8fb8] text-white font-bold py-4 rounded-xl shadow-md"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
