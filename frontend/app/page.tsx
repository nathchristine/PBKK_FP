import { redirect } from 'next/navigation';

export default function Home() {
  // automatically redirect users to "/books"
  redirect('/books');
}