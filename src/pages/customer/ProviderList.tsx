import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Header, BottomNav } from '../../components/Navigation';
import { Card, Button } from '../../components/UI';
import { Star, MapPin, ChevronRight } from 'lucide-react';

export default function ProviderList() {
  const { categoryId } = useParams();
  const [providers, setProviders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, we'd filter by categoryId in the users collection
    // For this demo, we'll fetch all providers
    const q = query(collection(db, 'users'), where('role', '==', 'provider'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setProviders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
    return () => unsubscribe();
  }, [categoryId]);

  return (
    <div className="pb-20">
      <Header title="Available Providers" showBack />
      
      <main className="p-4 space-y-4">
        {loading ? (
          <p className="text-center py-10 text-slate-500">Searching for experts...</p>
        ) : providers.length === 0 ? (
          <p className="text-center py-10 text-slate-500">No providers found in this category.</p>
        ) : (
          providers.map((provider) => (
            <Link key={provider.id} to={`/book/${provider.id}`}>
              <Card className="flex gap-4 p-4 hover:border-indigo-200 transition-colors">
                <img 
                  src={provider.photoURL || `https://picsum.photos/seed/${provider.uid}/200/200`} 
                  alt={provider.displayName} 
                  className="h-20 w-20 rounded-2xl object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-slate-900">{provider.displayName}</h3>
                      <div className="flex items-center gap-1 text-amber-500">
                        <Star size={14} fill="currentColor" />
                        <span className="text-xs font-bold">{provider.rating || '5.0'}</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">{provider.bio || 'Professional service provider with years of experience.'}</p>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-1 text-slate-400">
                      <MapPin size={12} />
                      <span className="text-[10px] font-medium">Within 5 miles</span>
                    </div>
                    <Button size="sm" className="h-7 px-3 text-[10px]">Book Now</Button>
                  </div>
                </div>
              </Card>
            </Link>
          ))
        )}
      </main>

      <BottomNav />
    </div>
  );
}
