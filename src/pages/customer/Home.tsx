import React, { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAppStore, Category } from '../../store/appStore';
import { Header, BottomNav } from '../../components/Navigation';
import { Card, Input } from '../../components/UI';
import { Search, Star, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function CustomerHome() {
  const { categories, setCategories } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const q = query(collection(db, 'categories'), where('isActive', '==', true));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const cats = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category));
      setCategories(cats);
    });
    return () => unsubscribe();
  }, [setCategories]);

  const filteredCategories = categories.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="pb-20">
      <Header title="FixIt Marketplace" />
      
      <main className="p-4 space-y-6">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <Input 
            placeholder="Search for services..." 
            className="pl-12"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Categories Grid */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold tracking-tight">Categories</h2>
            <button className="text-sm font-semibold text-indigo-600">See All</button>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {filteredCategories.map((category) => (
              <Link key={category.id} to={`/category/${category.id}`}>
                <motion.div 
                  whileTap={{ scale: 0.95 }}
                  className="flex flex-col items-center gap-2"
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 shadow-sm border border-indigo-100">
                    <img 
                      src={category.iconUrl || `https://picsum.photos/seed/${category.name}/100/100`} 
                      alt={category.name}
                      className="h-10 w-10 object-contain"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <span className="text-center text-xs font-semibold text-slate-700">{category.name}</span>
                </motion.div>
              </Link>
            ))}
          </div>
        </section>

        {/* Featured Providers (Mock/Real) */}
        <section>
          <h2 className="mb-4 text-lg font-bold tracking-tight">Top Rated Providers</h2>
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <Card key={i} className="flex gap-4 p-3">
                <img 
                  src={`https://picsum.photos/seed/provider${i}/200/200`} 
                  alt="Provider" 
                  className="h-20 w-20 rounded-xl object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="flex flex-1 flex-col justify-between py-0.5">
                  <div>
                    <h3 className="font-bold">Alex Johnson</h3>
                    <p className="text-xs text-slate-500">Expert Electrician • 5 years exp.</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-amber-500">
                      <Star size={14} fill="currentColor" />
                      <span className="text-xs font-bold">4.9 (120 reviews)</span>
                    </div>
                    <span className="text-xs font-bold text-indigo-600">$40/hr</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>
      </main>

      <BottomNav />
    </div>
  );
}
