'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function Navigation() {
  const { isAuthenticated, signOut, user } = useAuth();
  const pathname = usePathname();

  if (!isAuthenticated) {
    return null;
  }

  const navItems = [
    { name: 'Customers', href: '/customers' },
    { name: 'Jobs', href: '/jobs' },
    { name: 'Estimates', href: '/estimates' },
    { name: 'Invoices', href: '/invoices' },
  ];

  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-3">
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-xl font-bold">
              Electrician Business App
            </Link>
            <div className="hidden md:flex space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    pathname.startsWith(item.href)
                      ? 'bg-blue-700 text-white'
                      : 'text-blue-100 hover:bg-blue-500'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-blue-100">
              {user?.email}
            </div>
            <button
              onClick={signOut}
              className="bg-blue-700 hover:bg-blue-800 text-white px-3 py-2 rounded-md text-sm font-medium"
            >
              Sign Out
            </button>
          </div>
        </div>
        
        {/* Mobile navigation */}
        <div className="md:hidden pb-3">
          <div className="flex flex-col space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  pathname.startsWith(item.href)
                    ? 'bg-blue-700 text-white'
                    : 'text-blue-100 hover:bg-blue-500'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
} 