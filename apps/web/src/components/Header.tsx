"use client";

import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <header className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-b border-gray-700 shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-orange-500/25 transition-all duration-300">
                <span className="text-white font-bold text-lg">DF</span>
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full animate-pulse"></div>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                DailyForm
              </h1>
              <p className="text-xs text-gray-400 -mt-1">Track. Transform. Thrive.</p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                isActive("/")
                  ? "bg-orange-500 text-white shadow-lg shadow-orange-500/25"
                  : "text-gray-300 hover:text-white hover:bg-gray-800"
              }`}
            >
              Home
            </Link>
            <Link
              href="/notes"
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                isActive("/notes")
                  ? "bg-orange-500 text-white shadow-lg shadow-orange-500/25"
                  : "text-gray-300 hover:text-white hover:bg-gray-800"
              }`}
            >
              Notes
            </Link>
            <Link
              href="/fitness"
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                isActive("/fitness")
                  ? "bg-orange-500 text-white shadow-lg shadow-orange-500/25"
                  : "text-gray-300 hover:text-white hover:bg-gray-800"
              }`}
            >
              Fitness
            </Link>
            <Link
              href="/extra"
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                isActive("/extra")
                  ? "bg-orange-500 text-white shadow-lg shadow-orange-500/25"
                  : "text-gray-300 hover:text-white hover:bg-gray-800"
              }`}
            >
              Extra Features
            </Link>
            <Link
              href="/setup"
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                isActive("/setup")
                  ? "bg-orange-500 text-white shadow-lg shadow-orange-500/25"
                  : "text-gray-300 hover:text-white hover:bg-gray-800"
              }`}
            >
              Setup Profile
            </Link>
          </nav>

          {/* User Button */}
          <div className="flex items-center space-x-4">
            <UserButton 
              appearance={{
                elements: {
                  avatarBox: "w-10 h-10",
                  userButtonPopoverCard: "bg-gray-800 border border-gray-700",
                  userButtonPopoverActionButton: "text-gray-300 hover:text-white hover:bg-gray-700",
                }
              }}
            />
          </div>
        </div>

        {/* Mobile Navigation */}
        <nav className="md:hidden mt-4 flex justify-center space-x-4">
          <Link
            href="/"
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              isActive("/")
                ? "bg-orange-500 text-white shadow-lg shadow-orange-500/25"
                : "text-gray-300 hover:text-white hover:bg-gray-800"
            }`}
          >
            Home
          </Link>
          <Link
            href="/notes"
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              isActive("/notes")
                ? "bg-orange-500 text-white shadow-lg shadow-orange-500/25"
                : "text-gray-300 hover:text-white hover:bg-gray-800"
            }`}
          >
            Notes
          </Link>
          <Link
            href="/fitness"
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              isActive("/fitness")
                ? "bg-orange-500 text-white shadow-lg shadow-orange-500/25"
                : "text-gray-300 hover:text-white hover:bg-gray-800"
            }`}
          >
            Fitness
          </Link>
          <Link
            href="/extra"
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              isActive("/extra")
                ? "bg-orange-500 text-white shadow-lg shadow-orange-500/25"
                : "text-gray-300 hover:text-white hover:bg-gray-800"
            }`}
          >
            Extra
          </Link>
          <Link
            href="/setup"
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              isActive("/setup")
                ? "bg-orange-500 text-white shadow-lg shadow-orange-500/25"
                : "text-gray-300 hover:text-white hover:bg-gray-800"
            }`}
          >
            Setup
          </Link>
        </nav>
      </div>
    </header>
  );
}
