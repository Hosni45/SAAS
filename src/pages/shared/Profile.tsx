import React from 'react';
import { useAuthStore } from '../../store/authStore';
import { Header, BottomNav } from '../../components/Navigation';
import { Button, Card } from '../../components/UI';
import { LogOut, User, Shield, Star, History, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Profile() {
  const { profile, logout } = useAuthStore();

  if (!profile) return null;

  const menuItems = [
    { icon: User, label: 'Edit Profile', color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { icon: History, label: 'Job History', color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { icon: Settings, label: 'Settings', color: 'text-slate-600', bg: 'bg-slate-50' },
  ];

  if (profile.role === 'admin') {
    menuItems.unshift({ icon: Shield, label: 'Admin Panel', color: 'text-red-600', bg: 'bg-red-50' });
  }

  return (
    <div className="pb-20">
      <Header title="My Profile" />
      
      <main className="p-4 space-y-6">
        {/* Profile Header */}
        <div className="flex flex-col items-center py-6">
          <div className="relative">
            <img 
              src={profile.photoURL || `https://picsum.photos/seed/${profile.uid}/200/200`} 
              alt="" 
              className="h-24 w-24 rounded-full border-4 border-white shadow-lg object-cover"
              referrerPolicy="no-referrer"
            />
            {profile.role === 'provider' && (
              <div className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-amber-400 text-white shadow-sm border-2 border-white">
                <Star size={14} fill="currentColor" />
              </div>
            )}
          </div>
          <h2 className="mt-4 text-xl font-bold text-slate-900">{profile.displayName}</h2>
          <p className="text-sm text-slate-500">{profile.email}</p>
          <div className="mt-2 rounded-full bg-indigo-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-indigo-600">
            {profile.role}
          </div>
        </div>

        {/* Stats for Providers */}
        {profile.role === 'provider' && (
          <div className="grid grid-cols-2 gap-4">
            <Card className="p-4 text-center">
              <p className="text-xs font-medium text-slate-500">Rating</p>
              <p className="text-xl font-bold text-amber-500">4.9/5</p>
            </Card>
            <Card className="p-4 text-center">
              <p className="text-xs font-medium text-slate-500">Jobs Done</p>
              <p className="text-xl font-bold text-indigo-600">42</p>
            </Card>
          </div>
        )}

        {/* Menu Items */}
        <div className="space-y-2">
          {menuItems.map((item, i) => (
            <motion.button
              key={i}
              whileTap={{ scale: 0.98 }}
              className="flex w-full items-center gap-4 rounded-2xl bg-white p-4 shadow-sm border border-slate-50 hover:bg-slate-50 transition-colors"
            >
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${item.bg} ${item.color}`}>
                <item.icon size={20} />
              </div>
              <span className="flex-1 text-left font-semibold text-slate-700">{item.label}</span>
              <User size={16} className="text-slate-300 rotate-90" />
            </motion.button>
          ))}
        </div>

        <Button 
          variant="danger" 
          className="w-full h-12 mt-4" 
          onClick={logout}
        >
          <LogOut size={18} className="mr-2" /> Sign Out
        </Button>
      </main>

      <BottomNav />
    </div>
  );
}
