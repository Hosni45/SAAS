import React, { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot, updateDoc, doc, orderBy } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuthStore } from '../../store/authStore';
import { Header, BottomNav } from '../../components/Navigation';
import { Card, Button } from '../../components/UI';
import { Clock, CheckCircle2, XCircle, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ProviderDashboard() {
  const { user } = useAuthStore();
  const [jobs, setJobs] = useState<any[]>([]);
  const [filter, setFilter] = useState<'pending' | 'active' | 'completed'>('pending');

  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, 'jobs'), 
      where('providerId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setJobs(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, [user]);

  const handleStatusUpdate = async (jobId: string, status: string) => {
    await updateDoc(doc(db, 'jobs', jobId), { status });
  };

  const filteredJobs = jobs.filter(job => {
    if (filter === 'pending') return job.status === 'pending';
    if (filter === 'active') return job.status === 'accepted';
    if (filter === 'completed') return job.status === 'completed';
    return true;
  });

  return (
    <div className="pb-20">
      <Header title="Provider Dashboard" />
      
      <main className="p-4 space-y-6">
        {/* Stats Summary */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="p-3 text-center bg-indigo-50 border-indigo-100">
            <p className="text-[10px] font-bold text-indigo-600 uppercase">Pending</p>
            <p className="text-xl font-bold">{jobs.filter(j => j.status === 'pending').length}</p>
          </Card>
          <Card className="p-3 text-center bg-emerald-50 border-emerald-100">
            <p className="text-[10px] font-bold text-emerald-600 uppercase">Active</p>
            <p className="text-xl font-bold">{jobs.filter(j => j.status === 'accepted').length}</p>
          </Card>
          <Card className="p-3 text-center bg-slate-50 border-slate-100">
            <p className="text-[10px] font-bold text-slate-500 uppercase">Total</p>
            <p className="text-xl font-bold">{jobs.length}</p>
          </Card>
        </div>

        {/* Filter Tabs */}
        <div className="flex rounded-xl bg-slate-100 p-1">
          {(['pending', 'active', 'completed'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`flex-1 rounded-lg py-2 text-xs font-bold capitalize transition-all ${
                filter === t ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Jobs List */}
        <div className="space-y-4">
          {filteredJobs.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-slate-400 text-sm">No {filter} jobs found.</p>
            </div>
          ) : (
            filteredJobs.map((job) => (
              <Card key={job.id} className="p-4 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900">{job.customerName}</h3>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                      <Clock size={14} />
                      <span>{job.date} at {job.time}</span>
                    </div>
                  </div>
                  <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                    job.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                    job.status === 'accepted' ? 'bg-emerald-100 text-emerald-700' :
                    'bg-slate-100 text-slate-700'
                  }`}>
                    {job.status}
                  </span>
                </div>

                <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 italic">
                  "{job.details}"
                </p>

                <div className="flex gap-2 pt-2">
                  {job.status === 'pending' && (
                    <>
                      <Button 
                        className="flex-1" 
                        variant="secondary" 
                        size="sm"
                        onClick={() => handleStatusUpdate(job.id, 'accepted')}
                      >
                        <CheckCircle2 size={16} className="mr-1.5" /> Accept
                      </Button>
                      <Button 
                        className="flex-1" 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleStatusUpdate(job.id, 'declined')}
                      >
                        <XCircle size={16} className="mr-1.5" /> Decline
                      </Button>
                    </>
                  )}
                  {job.status === 'accepted' && (
                    <>
                      <Button 
                        className="flex-1" 
                        size="sm"
                        onClick={() => handleStatusUpdate(job.id, 'completed')}
                      >
                        Mark Completed
                      </Button>
                      <Link to={`/chat/${job.id}`} className="flex-none">
                        <Button variant="outline" size="icon">
                          <MessageSquare size={18} />
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
              </Card>
            ))
          )}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
