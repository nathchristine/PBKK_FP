"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../components/sidebar";

// backend API URL
const API_URL = "http://localhost:8080";

// initialize book data type
interface Book {
  ID: number;
  title: string;
  author: string;
  genre: string;
  year: number;
  cover: string;
  status: string;
}

// component 
const BookCard = ({ book }: { book: Book }) => {
  const router = useRouter();

  // check book availability from status
  const isAvailable = book.status === "Available"; 

  return (
    <div
      // navigate to book detail page on click
      onClick={() => router.push(`/books/${book.ID}`)}
      className="relative flex flex-col items-start cursor-pointer"
    >
      {/* book cover with status  */}
      <div className="relative w-full aspect-[2/3] rounded-xl overflow-hidden shadow-md mb-4 bg-[#f3f4f6]">
        <img src={book.cover} className="w-full h-full object-cover" />
        <div className={`absolute top-2 right-2 px-2.5 py-1 text-[10px] font-bold uppercase rounded-md tracking-wider text-white shadow-sm backdrop-blur-md ${isAvailable ? "bg-[#92a8d1]" : "bg-[#f7cac9] text-[#262626]"}`}
        > {book.status}
        </div>
      </div>

      {/* book title and author */}
      <div className="w-full">
        <h3 className="font-bold text-[#262626] text-lg leading-tight line-clamp-1 mb-1">{book.title}</h3>
        <p className="text-sm text-[#6d6e6f] font-medium">{book.author}</p>
      </div>
    </div>
  );
};

export default function BooksPage() {
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);
  const [books, setBooks] = useState<Book[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  // check user role for sidebar and access control
  useEffect(() => {
    const storedRole = localStorage.getItem("userRole");

    if (!storedRole) {
      router.push("/login");
    } else {
      setRole(storedRole);
    }
  }, [router]);

  // get book data from backend 
  useEffect(() => {
    const getBooks = async () => {
      try {
        const response = await fetch(`${API_URL}/books`);
        if (response.ok) {
          const data = await response.json();
          // save book data to array
          setBooks(data.books || []);
        } else {
          console.error(
            "Failed to get books from backend",
            response.statusText
          );
        }
      } catch (err) {
        console.error("Error getting books:", err);
      }
    };

    getBooks();
  }, []);

  // filter books based on search bar input
  const displayedBooks = useMemo(() => {
    
    // make input case insensitive
    const q = searchTerm.trim().toLowerCase();

    // if no input, show all books
    if (!q) return books;

    // filter books that match input in title, author, genre, or year
    return books.filter((b) => {
      return (
        b.title.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q) ||
        b.genre.toLowerCase().includes(q) ||
        String(b.year).includes(q)
      );
    });
  }, [books, searchTerm]);

  if (!role) {
    return null;
  }

  return (
    <div className="min-h-screen w-full font-sans flex overflow-hidden bg-gradient-to-br from-[#f7cac9] to-[#92a8d1]">
      <Sidebar role={role} activePage="books" />

      <main className="flex-1 ml-64 p-4 h-screen">
        <div className="bg-[#f3f4f6]/90 backdrop-blur-2xl rounded-[32px] shadow-2xl w-full h-full overflow-hidden flex flex-col relative border border-white/60">
          <header className="flex items-center justify-between px-10 py-8 flex-shrink-0 bg-white/50 backdrop-blur-sm sticky top-0 z-20 border-b border-white/40">
            <div>
              <h2 className="text-2xl font-extrabold text-[#262626] tracking-tight">
                Book Catalogue
              </h2>
              <p className="text-[#6d6e6f] text-sm mt-1">
                Browse and manage your library collection
              </p>
            </div>
            <div className="flex items-center gap-4">
              <label htmlFor="book-search" className="sr-only">
                Search books
              </label>
              <input
                id="book-search"
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search title, author, genre, year..."
                className="w-64 md:w-80 bg-white/80 border border-white/60 px-4 py-2 rounded-full text-sm text-[#262626] placeholder:text-[#6d6e6f] focus:outline-none focus:ring-2 focus:ring-[#92a8d1]"
              />
            </div>
          </header>

          <div className="flex-1 overflow-y-auto px-10 pb-10 pt-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
              {displayedBooks.map((book) => (
                <BookCard key={book.ID} book={book} />
              ))}
            </div>

            {displayedBooks.length === 0 && (
              <div className="text-center text-[#6d6e6f] py-20">
                No books found in the database.
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
