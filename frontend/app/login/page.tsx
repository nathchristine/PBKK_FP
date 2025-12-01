"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, ArrowRight } from "lucide-react";

const API_URL = "http://localhost:8080";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [formData, setFormData] = useState({ email: "", password: "" });

  // handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Invalid credentials");

      // store user data in localStorage
      localStorage.setItem("userId", data.userId);
      localStorage.setItem("userRole", data.role);
      localStorage.setItem("userName", data.name);

      // redirect to books
      setTimeout(() => router.push("/books"), 1000);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen w-full font-sans flex overflow-hidden bg-gradient-to-br from-[#f7cac9] to-[#92a8d1]">
      <div className="w-full flex items-center justify-center p-4">
        <div className="bg-white/40 backdrop-blur-lg border border-white/50 shadow-2xl rounded-2xl p-8 w-full max-w-md relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#f7cac9] to-[#92a8d1]"></div>

          <h1 className="text-3xl font-bold text-center mb-2 text-[#262626]">
            Welcome Back
          </h1>
          <p className="text-center text-[#6d6e6f] mb-8 text-sm">
            Please enter your account details to sign in.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative group">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                required
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 bg-white/60 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#92a8d1] text-[#262626]"
              />
            </div>

            <div className="relative group">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="password"
                name="password"
                placeholder="Password"
                required
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 bg-white/60 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#92a8d1] text-[#262626]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-[#92a8d1] to-[#7a8fb8] hover:translate-y-[-2px] transition-all shadow-lg flex justify-center items-center gap-2"
            > Sign In <ArrowRight size={18} />
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-[#6d6e6f] border-t border-gray-200 pt-4">
            Don't have an account?
            <button
              type="button"
              onClick={() => router.push("/signup")}
              className="ml-2 font-bold text-[#92a8d1] underline decoration-2 underline-offset-2"
            > Sign up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
