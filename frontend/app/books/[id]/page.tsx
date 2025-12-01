"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Edit, Trash2, BookOpen, Calendar, Tag, AlertCircle, Loader2 } from "lucide-react";
import Sidebar from "../../components/sidebar";

const API_URL = "http://localhost:8080";

interface Book {
  ID: number;
  title: string;
  author: string;
  genre: string;
  year: number;
  cover: string;
  status: string;
}

export default function BookDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [role, setRole] = useState<string | null>(null);
  const [book, setBook] = useState<Book | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // check user role for sidebar and access control
  useEffect(() => {
    const storedRole = localStorage.getItem("userRole");
    if (!storedRole) {
      router.push("/login");
    } else {
      setRole(storedRole);
    }
  }, [router]);

  // get book details from backend
  useEffect(() => {
    if (!id) return;
    getBooks();
  }, [id]);

  const getBooks = async () => {
    try {
      const res = await fetch(`${API_URL}/books/${id}`);
      if (!res.ok) throw new Error("Book not found");
      const data = await res.json();
      setBook(data.book);
    } catch (error) {
      console.error(error);
    }
  };

  // delete book function
  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this book?")) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`${API_URL}/books/${id}`, { method: "DELETE" });

      if (res.ok) {
        router.push("/books");
      } else {
        alert("Failed to delete book");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  // borrow book function
  const handleBorrow = async () => {
    if (!book) return;

    // check availability
    if (book.status.toLowerCase() !== 'available') {
        alert("This book is currently unavailable.");
        return;
    }

    // borrow confirmation
    const userId = Number(localStorage.getItem("userId"));
    if (!userId) {
        alert("User ID not found. Please log in again.");
        return;
    }

    if (!confirm(`Confirm borrowing "${book.title}"?\n\nBorrow Date: Today\nReturn Date: 7 Days from now`)) {
        return;
    }

    try {
        const today = new Date().toISOString().split('T')[0]; // borrow date
        const nextWeekDate = new Date();
        nextWeekDate.setDate(nextWeekDate.getDate() + 7); // return date 7 days later
        const returnDate = nextWeekDate.toISOString().split('T')[0];

        // create transaction 
        const newTransaction = await fetch(`${API_URL}/transactions`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                book_id: book.ID,
                user_id: userId,
                borrow_date: today,
                return_date: returnDate,
                status: "Borrowed",
            }),
        });

        if (!newTransaction.ok) throw new Error("Failed to create transaction");

        // update book status to borrowed
        await fetch(`${API_URL}/books/${book.ID}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                title: book.title,
                author: book.author,
                genre: book.genre,
                year: book.year,
                cover: book.cover,
                status: "Borrowed" 
            }),
        });

        
        alert("Success! Book borrowed. Please return it within 7 days.");
        getBooks(); // refresh data to show borrowed status immediately
        
    } catch (error) {
        console.error("Borrow error:", error);
        alert("Failed to borrow book. Please try again.");
    } 
  };

  if (!role || !book) return null;

  const isAvailable = book.status.toLowerCase() === "available";

  return (
    <div className="min-h-screen w-full font-sans flex overflow-hidden bg-gradient-to-br from-[#f7cac9] to-[#92a8d1]">
      <Sidebar role={role} activePage="books"/>


      <main className="flex-1 ml-64 p-4 h-screen">
        <div className="bg-[#f3f4f6]/90 backdrop-blur-2xl rounded-[32px] shadow-2xl w-full h-full flex flex-col border border-white/60 overflow-hidden relative">
          <header className="px-10 py-8 bg-white/50 backdrop-blur-sm border-b border-white/40 sticky top-0 z-10 flex items-center gap-4">
            <button
              onClick={() => router.push("/books")}
              className="p-2 rounded-full hover:bg-white/50 transition-colors text-[#6d6e6f]"
            >
              <ArrowLeft size={24} />
            </button>

            <h2 className="text-xl font-extrabold text-[#262626]">
              Book Details
            </h2>
          </header>

          <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
            <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-sm p-8 flex flex-col md:flex-row gap-10">
              
              <div className="w-full md:w-1/3 flex flex-col gap-4">
                <div className="aspect-[2/3] rounded-2xl overflow-hidden shadow-lg bg-gray-100 relative">
                  <img src={book.cover} className="w-full h-full object-cover" />
                  <div
                    className={`absolute top-4 right-4 px-3 py-1 text-xs font-bold uppercase rounded-md tracking-wider text-white shadow-sm ${
                      isAvailable ? "bg-[#92a8d1]" : "bg-[#f7cac9] text-[#262626]"
                    }`}
                  >
                    {book.status}
                  </div>
                </div>
              </div>

              <div className="flex-1 flex flex-col">
                <h1 className="text-4xl font-black text-[#262626] mb-2">
                  {book.title}
                </h1>
                <p className="text-xl text-[#6d6e6f] font-medium mb-8">
                  by {book.author}
                </p>

                <div className="grid grid-cols-2 gap-6 mb-10">
                  <div className="bg-gray-50 p-4 rounded-2xl">
                    <div className="flex items-center gap-2 text-[#92a8d1] mb-1">
                      <Tag size={18} />
                      <span className="text-xs font-bold uppercase tracking-wider">
                        Genre
                      </span>
                    </div>
                    <p className="text-[#262626] font-bold text-lg">{book.genre}</p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-2xl">
                    <div className="flex items-center gap-2 text-[#92a8d1] mb-1">
                      <Calendar size={18} />
                      <span className="text-xs font-bold uppercase tracking-wider">
                        Year
                      </span>
                    </div>
                    <p className="text-[#262626] font-bold text-lg">{book.year}</p>
                  </div>
                </div>

                {/* if admin show edit button, if member show borrow button */}
                <div className="mt-auto pt-8 border-t border-gray-100 flex gap-4">
                  {role === "admin" ? (
                    <>
                      <button
                        onClick={() => router.push(`/books/${id}/edit`)}
                        className="flex-1 py-4 bg-[#262626] text-white font-bold rounded-xl shadow-lg hover:translate-y-[-2px] transition-all flex justify-center items-center gap-2"
                      >
                        <Edit size={20} /> Edit Book
                      </button>

                      <button
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="px-6 py-4 bg-red-50 text-red-500 border border-red-100 font-bold rounded-xl hover:bg-red-100 transition-all flex justify-center items-center gap-2"
                      >
                        <Trash2 size={20} />
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={handleBorrow}
                      disabled={!isAvailable} 
                      className={`w-full py-4 font-bold rounded-xl shadow-lg transition-all flex justify-center items-center gap-2
                        ${isAvailable 
                            ? 'bg-[#92a8d1] text-white hover:bg-[#7a8fb8] hover:translate-y-[-2px]' 
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'}
                      `}
                    >
                      {/* if available show borrow button, else show unavailable message */}
                      {isAvailable ? (
                        <><BookOpen size={20} /> Borrow Now (7 Days)</>
                      ) : (
                         <><AlertCircle size={20} /> Currently Unavailable</>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}