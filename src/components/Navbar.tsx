'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Menu, X } from 'lucide-react';

interface User {
  id: number;
  name: string;
  email: string;
  createdAt: string;
  token: string;
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser.users) {
          setUser(parsedUser.users);
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    router.push('/login');
  };

  return (
    <nav className="bg-blue-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">Brand</Link>
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        <ul className={`md:flex space-x-4 hidden`}> 
          <li><Link href="/" className="hover:underline">Setting</Link></li>
          <li><Link href="/report" className="hover:underline">Create Report</Link></li>
          <li><Link href="/send" className="hover:underline">Send Report</Link></li>
          {user ? (
            <li className="flex items-center space-x-2">
              <span> {user.name}</span>
              <button onClick={handleLogout} className="bg-red-500 px-2 py-1 rounded">Logout</button>
            </li>
          ) : (
            <li><Link href="/login" className="hover:underline">Login</Link></li>
          )}
        </ul>
      </div>
      {isOpen && (
        <div className="md:hidden mt-2 space-y-2">
          <Link href="/" className="block p-2 bg-blue-500 rounded">Setting</Link>
          <Link href="/report" className="block p-2 bg-blue-500 rounded">Create Report</Link>
          <Link href="/send" className="block p-2 bg-blue-500 rounded">Send Report</Link>
          {user ? (
            <div className="p-2 bg-blue-500 rounded flex justify-between items-center">
              <span>{user.name}</span>
              <button onClick={handleLogout} className="bg-red-500 px-2 py-1 rounded">Logout</button>
            </div>
          ) : (
            <Link href="/login" className="block p-2 bg-blue-500 rounded">Login</Link>
          )}
        </div>
      )}
    </nav>
  );
}
