import React, { useState, useEffect } from 'react';
import { collection, addDoc, updateDoc, doc, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Category } from '../../store/appStore';
import { Header, BottomNav } from '../../components/Navigation';
import { Button, Input, Card } from '../../components/UI';
import { Plus, Edit2, Eye, EyeOff, Trash2 } from 'lucide-react';

export default function AdminDashboard() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newCat, setNewCat] = useState({ name: '', iconUrl: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'categories'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setCategories(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category)));
    });
    return () => unsubscribe();
  }, []);

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, 'categories'), {
        ...newCat,
        isActive: true,
        createdAt: new Date(),
      });
      setNewCat({ name: '', iconUrl: '' });
      setIsAdding(false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleVisibility = async (id: string, current: boolean) => {
    await updateDoc(doc(db, 'categories', id), {
      isActive: !current,
    });
  };

  return (
    <div className="pb-20">
      <Header title="Admin Dashboard" />
      
      <main className="p-4 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold tracking-tight">Manage Categories</h2>
          <Button size="sm" onClick={() => setIsAdding(!isAdding)}>
            <Plus size={16} className="mr-1" /> Add New
          </Button>
        </div>

        {isAdding && (
          <Card className="p-4 animate-in fade-in slide-in-from-top-4">
            <form onSubmit={handleAddCategory} className="space-y-4">
              <Input 
                placeholder="Category Name (e.g. Plumbing)" 
                value={newCat.name}
                onChange={(e) => setNewCat({ ...newCat, name: e.target.value })}
                required
              />
              <Input 
                placeholder="Icon URL (Optional)" 
                value={newCat.iconUrl}
                onChange={(e) => setNewCat({ ...newCat, iconUrl: e.target.value })}
              />
              <div className="flex gap-2">
                <Button type="submit" className="flex-1" isLoading={loading}>Save</Button>
                <Button type="button" variant="outline" onClick={() => setIsAdding(false)}>Cancel</Button>
              </div>
            </form>
          </Card>
        )}

        <div className="space-y-3">
          {categories.map((cat) => (
            <Card key={cat.id} className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-slate-100 p-2">
                  <img 
                    src={cat.iconUrl || `https://picsum.photos/seed/${cat.name}/100/100`} 
                    alt="" 
                    className="h-full w-full object-contain"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div>
                  <h3 className="font-semibold">{cat.name}</h3>
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${cat.isActive ? 'text-emerald-600' : 'text-slate-400'}`}>
                    {cat.isActive ? 'Visible' : 'Hidden'}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                  size="icon" 
                  variant="ghost" 
                  onClick={() => toggleVisibility(cat.id, cat.isActive)}
                >
                  {cat.isActive ? <EyeOff size={18} /> : <Eye size={18} />}
                </Button>
                <Button size="icon" variant="ghost">
                  <Edit2 size={18} />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
