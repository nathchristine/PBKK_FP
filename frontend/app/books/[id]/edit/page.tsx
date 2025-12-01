"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Save, X, UploadCloud, BookOpen, ChevronDown } from "lucide-react";
import Sidebar from "../../../components/sidebar";

const API_URL = "http://localhost:8080";

export default function EditBookPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const [role, setRole] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    genre: "",
    year: "",
    cover: "",
    status: "",
  });

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

  // get existing book data from backend
  useEffect(() => {
    if (!id) return;
    const getBooks = async () => {
      try {
        const res = await fetch(`${API_URL}/books/${id}`);
        if (!res.ok) throw new Error("Failed to fetch book details");
        const data = await res.json();

        // pre-fill form with existing data
        setFormData({
          title: data.book.title,
          author: data.book.author,
          genre: data.book.genre,
          year: data.book.year.toString(),
          cover: data.book.cover,
          status: data.book.status,
        });
      } catch (err: any) {
        setError("Could not load book details.");
      }
    };
    getBooks();
  }, [id]);

  // handle form input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    const payload = {
      ...formData,
      year: parseInt(formData.year) || 0,
    };

    try {
      // update book via API
      const res = await fetch(`${API_URL}/books/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Failed to update book");
      }

      setSuccess(true);
      setTimeout(() => router.push(`/books/${id}`), 1000); // Redirect back to detail page
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    }
  };

  // wait for role check 
  if (!role) return null;

  return (
    <div className="min-h-screen w-full font-sans flex overflow-hidden bg-gradient-to-br from-[#f7cac9] to-[#92a8d1]">
      <Sidebar role={role} activePage="books"/>

      <main className="flex-1 ml-64 p-4 h-screen">
        <div className="bg-[#f3f4f6]/90 backdrop-blur-2xl rounded-[32px] shadow-2xl w-full h-full flex flex-col border border-white/60 overflow-hidden relative">
          <header className="px-10 py-8 bg-white/50 backdrop-blur-sm border-b border-white/40 sticky top-0 z-10 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-extrabold text-[#262626]">
                Edit Book
              </h2>
              <p className="text-sm text-[#6d6e6f] mt-1">
                Update details for "{formData.title}"
              </p>
            </div>
            <button
              onClick={() => router.push(`/books/${id}`)}
              className="p-2 rounded-full hover:bg-white/50 transition-colors text-[#6d6e6f]"
            >
              <X size={24} />
            </button>
          </header>

          <div className="flex-1 overflow-y-auto p-10">
            <div className="max-w-4xl mx-auto">
              <form
                onSubmit={handleSubmit}
                className="grid grid-cols-1 md:grid-cols-2 gap-8"
              >
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-[#6d6e6f] ml-1">
                      Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      required
                      value={formData.title}
                      onChange={handleChange}
                      className="w-full p-4 rounded-xl bg-white border border-gray-200 focus:ring-2 focus:ring-[#92a8d1] outline-none transition-all text-[#262626]"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-[#6d6e6f] ml-1">
                      Author
                    </label>
                    <input
                      type="text"
                      name="author"
                      required
                      value={formData.author}
                      onChange={handleChange}
                      className="w-full p-4 rounded-xl bg-white border border-gray-200 focus:ring-2 focus:ring-[#92a8d1] outline-none transition-all text-[#262626]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-[#6d6e6f] ml-1">
                        Genre
                      </label>
                      <input
                        type="text"
                        name="genre"
                        required
                        value={formData.genre}
                        onChange={handleChange}
                        className="w-full p-4 rounded-xl bg-white border border-gray-200 focus:ring-2 focus:ring-[#92a8d1] outline-none transition-all text-[#262626]"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-[#6d6e6f] ml-1">
                        Year
                      </label>
                      <input
                        type="number"
                        name="year"
                        required
                        value={formData.year}
                        onChange={handleChange}
                        className="w-full p-4 rounded-xl bg-white border border-gray-200 focus:ring-2 focus:ring-[#92a8d1] outline-none transition-all text-[#262626]"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-[#6d6e6f] ml-1">
                      Status
                    </label>
                    <div className="relative">
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="w-full p-4 pr-12 rounded-xl bg-white border border-gray-200 focus:ring-2 focus:ring-[#92a8d1] outline-none transition-all cursor-pointer appearance-none text-[#262626]"
                      >
                        <option value="Available">Available</option>
                        <option value="Borrowed">Borrowed</option>
                      </select>
                      <ChevronDown
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                        size={20}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-6 flex flex-col">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-[#6d6e6f] ml-1">
                      Cover Image URL
                    </label>
                    <div className="relative">
                      <UploadCloud
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                        size={20}
                      />
                      <input
                        type="text"
                        name="cover"
                        required
                        value={formData.cover}
                        onChange={handleChange}
                        className="w-full pl-12 p-4 rounded-xl bg-white border border-gray-200 focus:ring-2 focus:ring-[#92a8d1] outline-none transition-all text-[#262626]"
                      />
                    </div>
                  </div>

                  <div className="flex-1 bg-white/50 rounded-2xl border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden relative group">
                    {formData.cover ? (
                      <img
                        src={formData.cover}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // @ts-ignore
                          e.target.style.display = "none";
                          // @ts-ignore
                          e.target.nextSibling.style.display = "flex";
                        }}
                      />
                    ) : null}

                    <div
                      className={`absolute inset-0 flex flex-col items-center justify-center text-gray-400 ${
                        formData.cover ? "hidden" : "flex"
                      }`}
                    >
                      <BookOpen size={48} className="mb-2 opacity-50" />
                      <span className="text-sm font-medium">Cover Preview</span>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2 mt-4 flex justify-end">
                  <button
                    type="submit"
                    className="px-8 py-4 bg-[#262626] text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all flex items-center gap-2"
                  >
                    <Save size={20} /> Update Book
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}