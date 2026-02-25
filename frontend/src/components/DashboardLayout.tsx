import React, { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import {
  Home,
  Users,
  UserCheck,
  Bell,
  Menu,
  X,
  ChevronDown,
  Calendar,
  FileText,
  MessageSquare,
  Settings,
  LogOut,
  Search,
} from "lucide-react";

function cn(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

const navItems = [
  { icon: Home, label: "Dashboard", href: "/" },
  { icon: Users, label: "Patients", href: "/patients" },
  { icon: UserCheck, label: "Caregivers", href: "/caregivers" },
  { icon: Users, label: "People", href: "/people" },
  { icon: Calendar, label: "Schedule", href: "/schedule" },
  { icon: FileText, label: "Care Plan", href: "/careplan" },
  { icon: MessageSquare, label: "Messages", href: "/messages" },
];

export function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const location = useLocation();

  return (
    <div className="flex h-screen bg-slate-50">

      {/* Sidebar */}
      <aside
        className={cn(
          "w-64 bg-white border-r border-slate-200 transition-all duration-300",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
          "lg:translate-x-0 lg:relative fixed inset-y-0 left-0 z-50"
        )}
      >
        {/* Logo Section */}
        <div className="h-16 px-6 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
              <Home className="h-5 w-5 text-white" />
            </div>
            <span className="font-semibold text-slate-900 text-lg">CareSys</span>
          </div>
          <button
            className="lg:hidden p-2 hover:bg-slate-100 rounded-lg transition-smooth"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5 text-slate-600" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/"
                ? location.pathname === "/"
                : location.pathname.startsWith(item.href);

            return (
              <Link
                key={item.label}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-smooth",
                  isActive
                    ? "bg-orange-50 text-orange-600 border-l-2 border-orange-600"
                    : "text-slate-600 hover:bg-slate-50"
                )}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer Navigation */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-200 space-y-1.5">
          <Link
            to="/profile"
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-smooth"
          >
            <Settings className="h-5 w-5" />
            Settings
          </Link>
          <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-smooth">
            <LogOut className="h-5 w-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-col flex-1">

        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6">
          {/* Left Section */}
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden p-2 hover:bg-slate-100 rounded-lg transition-smooth"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5 text-slate-600" />
            </button>

            {/* Search Bar */}
            <div className="hidden md:flex items-center gap-2 bg-slate-100 rounded-lg px-3 py-2 w-64">
              <Search className="h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent text-sm text-slate-900 placeholder-slate-400 outline-none w-full"
              />
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {/* Notifications */}
            <button className="relative p-2 hover:bg-slate-100 rounded-lg transition-smooth">
              <Bell className="h-5 w-5 text-slate-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-3 p-2 hover:bg-slate-100 rounded-lg transition-smooth"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                  AC
                </div>
                <ChevronDown className="h-4 w-4 text-slate-600" />
              </button>

              {/* Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-2 z-10">
                  <div className="px-4 py-2 border-b border-slate-200">
                    <p className="text-sm font-medium text-slate-900">Admin User</p>
                    <p className="text-xs text-slate-500">admin@homecare.com</p>
                  </div>
                  <Link to="/profile" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-smooth">
                    Profile Settings
                  </Link>
                  <Link to="/organization" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-smooth">
                    Organization
                  </Link>
                  <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-smooth border-t border-slate-200 mt-2 pt-2">
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Routed Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-6 lg:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
