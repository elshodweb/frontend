"use client";

import { useAuth } from "../contexts/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user && pathname !== "/login") {
      router.push("/login");
    }
  }, [user, loading, pathname]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (pathname === "/login") {
    return <>{children}</>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-8">
              <span className="text-2xl font-extrabold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent select-none tracking-tight">
                Document Chain
              </span>
              <div className="hidden sm:flex gap-2">
                <a
                  href="/documents"
                  className={`relative px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200
                    ${
                      pathname === "/documents"
                        ? "text-indigo-700 bg-indigo-50 shadow"
                        : "text-gray-600 hover:text-indigo-600 hover:bg-indigo-50"
                    }
                  `}
                >
                  Documents
                  {pathname === "/documents" && (
                    <span className="absolute left-1/2 -bottom-1 w-2 h-2 bg-indigo-500 rounded-full -translate-x-1/2"></span>
                  )}
                </a>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold text-base">
                  {user?.email ? user.email[0].toUpperCase() : "U"}
                </span>
                <span className="text-sm text-gray-700 font-medium">
                  {user?.email}{" "}
                  <span className="text-gray-400">({user?.role})</span>
                </span>
              </div>
              <button
                onClick={logout}
                className="inline-flex items-center gap-2 px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow transition-all"
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}
