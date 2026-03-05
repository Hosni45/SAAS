import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, ClipboardList, MessageSquare, User, Settings } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { cn } from './UI';

export const BottomNav = () => {
  const location = useLocation();
  const { profile } = useAuthStore();

  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: ClipboardList, label: 'Jobs', path: '/jobs' },
    { icon: MessageSquare, label: 'Chat', path: '/chat' },
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  if (profile?.role === 'admin') {
    navItems.push({ icon: Settings, label: 'Admin', path: '/admin' });
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t border-slate-100 bg-white/80 px-4 backdrop-blur-lg lg:hidden">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              'flex flex-col items-center justify-center gap-1 transition-colors',
              isActive ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'
            )}
          >
            <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
            <span className="text-[10px] font-medium">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};

export const Header = ({ title, showBack }: { title: string; showBack?: boolean }) => {
  return (
    <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-slate-100 bg-white/80 px-4 backdrop-blur-lg">
      <div className="flex items-center gap-3">
        {showBack && (
          <button onClick={() => window.history.back()} className="rounded-full p-1 hover:bg-slate-100">
            <User size={20} className="rotate-180" />
          </button>
        )}
        <h1 className="text-lg font-semibold tracking-tight">{title}</h1>
      </div>
      <div className="h-8 w-8 rounded-full bg-slate-100" />
    </header>
  );
};
