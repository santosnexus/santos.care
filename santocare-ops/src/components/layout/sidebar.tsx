"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  CheckSquare,
  Building2,
  BarChart3,
  FileText,
  Target,
  Settings,
  TrendingUp,
  Briefcase,
  Menu,
  X,
} from "lucide-react";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/patients", label: "Patients", icon: Users },
  { href: "/tasks", label: "Tasks", icon: CheckSquare },
  { href: "/partners", label: "Partners", icon: Building2 },
  { href: "/marketing", label: "Marketing", icon: TrendingUp },
  { href: "/documents", label: "Documents", icon: FileText },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/roadmap", label: "90-Day Roadmap", icon: Target },
  { href: "/settings", label: "Settings", icon: Settings },
];

interface SidebarProps {
  open: boolean;
  onToggle: () => void;
}

export function Sidebar({ open, onToggle }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 flex h-full w-64 flex-col bg-sidebar border-r transition-transform duration-300 lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Briefcase className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-bold">SantoCare</div>
              <div className="text-xs text-muted-foreground">Operations Hub</div>
            </div>
          </Link>
          <button
            onClick={onToggle}
            className="lg:hidden rounded-md p-1 hover:bg-accent"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => {
                  if (window.innerWidth < 1024) onToggle();
                }}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t p-4">
          <div className="text-xs text-muted-foreground">
            Heal India Medi Tourism
          </div>
          <div className="text-xs text-muted-foreground">
            santos.care
          </div>
        </div>
      </aside>
    </>
  );
}

export function MobileHeader({ onToggle }: { onToggle: () => void }) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center border-b bg-background px-4 lg:hidden">
      <button
        onClick={onToggle}
        className="rounded-md p-2 hover:bg-accent"
      >
        <Menu className="h-5 w-5" />
      </button>
      <div className="ml-4 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Briefcase className="h-5 w-5" />
        </div>
        <span className="font-bold">SantoCare Ops</span>
      </div>
    </header>
  );
}