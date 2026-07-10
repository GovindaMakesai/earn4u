import Link from 'next/link';
import {
  LayoutDashboard,
  Users,
  Radio,
  Mic,
  Gift,
  DollarSign,
  Shield,
  Settings,
  LogOut,
} from 'lucide-react';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/users', label: 'Users', icon: Users },
  { href: '/streams', label: 'Streams', icon: Radio },
  { href: '/rooms', label: 'Voice Rooms', icon: Mic },
  { href: '/gifts', label: 'Gifts', icon: Gift },
  { href: '/withdrawals', label: 'Withdrawals', icon: DollarSign },
  { href: '/moderation', label: 'Moderation', icon: Shield },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-[var(--primary-800)] border-r border-white/5 flex flex-col">
        <div className="p-6">
          <h1 className="text-xl font-bold bg-gradient-to-r from-amber-400 to-amber-200 bg-clip-text text-transparent">
            Earn4U Admin
          </h1>
          <p className="text-xs text-[var(--text-secondary)] mt-1">Platform Management</p>
        </div>

        <nav className="flex-1 px-3 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[var(--text-secondary)] hover:bg-white/5 hover:text-white transition-colors"
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5">
          <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[var(--text-secondary)] hover:bg-white/5 hover:text-white transition-colors w-full">
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
