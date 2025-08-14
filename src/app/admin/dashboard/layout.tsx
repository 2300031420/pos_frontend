"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  Typography,
  List,
  ListItem,
  ListItemPrefix,
} from "@material-tailwind/react";
import {
  FiHome,
  FiMenu,
  FiUsers,
  FiSettings,
} from "react-icons/fi";
import Link from "next/link";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();
  // Sidebar starts closed on mobile; remains visible on lg via CSS classes
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/signin");
    }
  }, [status, router]);

  // Listen for global toggle events dispatched from pages' navbars
  useEffect(() => {
    const toggle = () => setSidebarOpen((prev) => !prev);
    const open = () => setSidebarOpen(true);
    const close = () => setSidebarOpen(false);

    // Cast to EventListener to satisfy TS DOM typings
    window.addEventListener("toggle-admin-sidebar", toggle as unknown as EventListener);
    window.addEventListener("open-admin-sidebar", open as unknown as EventListener);
    window.addEventListener("close-admin-sidebar", close as unknown as EventListener);

    return () => {
      window.removeEventListener("toggle-admin-sidebar", toggle as unknown as EventListener);
      window.removeEventListener("open-admin-sidebar", open as unknown as EventListener);
      window.removeEventListener("close-admin-sidebar", close as unknown as EventListener);
    };
  }, []);

  const navItems = [
    { label: "Dashboard", icon: FiHome, href: "/admin/dashboard" },
    { label: "Menu", icon: FiMenu, href: "/admin/dashboard/menu" },
    { label: "Order Management", icon: FiHome, href: "/admin/dashboard/orders", png: "/image/order.png" },
    { label: "Users", icon: FiUsers, href: "/admin/dashboard/users" },
    { label: "Settings", icon: FiSettings, href: "/admin/dashboard/settings" },
  ];

  // Relax Material Tailwind types for JSX usage
  const M = {
    Typography: Typography as any,
    List: List as any,
    ListItem: ListItem as any,
    ListItemPrefix: ListItemPrefix as any,
  };

  const sectionSlug = (pathname?.split('/').filter(Boolean)[2] ?? 'dashboard');
  const profileRef = useRef<HTMLDivElement | null>(null);
  const [isProfileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (isProfileOpen && profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('click', onClickOutside);
    return () => document.removeEventListener('click', onClickOutside);
  }, [isProfileOpen]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Top Navbar (visible on all admin pages) */}
      <nav className="fixed top-0 inset-x-0 z-[80] bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 h-16 flex items-center">
          {/* Left cluster */}
          <div className="flex items-center gap-2 flex-none">
            <button
              className="lg:hidden p-2 rounded hover:bg-blue-50"
              aria-label="Toggle sidebar"
              onClick={() => window.dispatchEvent(new Event('toggle-admin-sidebar'))}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6 text-blue-600">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 6h18M3 12h18M3 18h18" />
              </svg>
            </button>
            <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent leading-none">
              Tastoria Cafe Admin
            </span>

            {/* Removed section slug badge */}
          </div>
          {/* Center cluster (desktop nav) */}
          <div className="hidden lg:flex items-center gap-6 justify-center flex-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium px-2 py-1 rounded hover:bg-gray-100 ${pathname === item.href ? 'text-blue-600' : 'text-gray-700'}`}
              >
                {item.label}
              </Link>
            ))}
          </div>
          {/* Right cluster */}
          <div className="flex items-center gap-2 flex-none ml-auto">
            {/* Profile dropdown with click toggle */}
            <div className="relative" ref={profileRef}>
              <button
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200"
                aria-haspopup="menu"
                aria-expanded={isProfileOpen}
                onClick={() => setProfileOpen((prev) => !prev)}
              >
                {session?.user?.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={session.user.image} alt="profile" className="h-6 w-6 rounded-full object-cover" />
                ) : (
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white text-xs font-semibold">
                    {(session?.user?.name?.[0] || 'A').toUpperCase()}
                  </span>
                )}
                <span className="text-sm font-medium text-gray-700 hidden sm:inline truncate max-w-[120px]">
                  {session?.user?.name || 'Admin'}
                </span>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`h-4 w-4 text-gray-600 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-auto min-w-[9rem] bg-white border border-gray-200 rounded-lg shadow-lg z-[90]" role="menu">
                  <button
                    className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
                    onClick={async () => {
                      await signOut({ redirect: false });
                      setProfileOpen(false);
                      router.push('/admin/signin');
                    }}
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="pt-16">
        {/* Mobile slide-in menu */}
        {isSidebarOpen && (
          <>
            <div
              className="fixed inset-x-0 top-16 bottom-0 bg-black bg-opacity-50 z-[60] lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <div className="fixed left-0 top-16 bottom-0 w-64 bg-white shadow-xl z-[70] p-4 lg:hidden">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-700">Menu</span>
                <button className="p-2 rounded hover:bg-gray-100" onClick={() => setSidebarOpen(false)} aria-label="Close menu">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <ul className="space-y-1">
                {navItems.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`block px-3 py-2 rounded text-sm ${pathname === item.href ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}

        {/* Main Content */}
        <div className="overflow-auto p-4">
          {status === "loading" ? (
            <div className="flex justify-center items-center min-h-screen">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : status === "unauthenticated" ? (
            <div className="flex justify-center items-center min-h-screen">
              <p>Redirecting to login...</p>
            </div>
          ) : (
            children
          )}
        </div>
      </div>
    </div>
  );
}
