import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  Calendar,
  ClipboardList,
  MessageSquare,
  Users,
  Settings,
  Menu,
  X,
  Bell,
  ChevronDown,
} from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { useTheme, ThemeToggle } from './ThemeProvider';

const navItems = [
  { icon: Home, label: 'Home', href: '/' },
  { icon: Calendar, label: 'Schedule', href: '/schedule' },
  { icon: ClipboardList, label: 'Care & Tasks', href: '/tasks' },
  { icon: MessageSquare, label: 'Messages', href: '/messages' },
  { icon: Users, label: 'People', href: '/people' },
  { icon: Settings, label: 'Settings', href: '/settings' },
];

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gradient-to-br from-emerald-50 via-blue-50/20 to-emerald-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transform transition-transform duration-300",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-slate-200 dark:border-slate-800">
          <div className="font-bold text-xl text-emerald-600">
            Home Care
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-6 w-6" />
          </Button>
        </div>

        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;

            return (
              <Link
                key={item.label}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all",
                  isActive
                    ? "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                )}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Area */}
      <div className="flex flex-col flex-1 h-full overflow-hidden">

        {/* Header (Wireframe Spec) */}
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6">

          {/* Left side */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </Button>

            {/* Context Switcher */}
            <div className="flex items-center gap-1 cursor-pointer text-slate-700 dark:text-slate-300 font-medium">
              My Family
              <ChevronDown className="h-4 w-4" />
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            <Bell className="h-5 w-5 text-slate-500" />
            <ThemeToggle />
            <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white font-semibold">
              A
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-slate-50 dark:bg-slate-950">
          {children}
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
