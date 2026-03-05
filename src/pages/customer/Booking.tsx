import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, addDoc, collection } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuthStore } from '../../store/authStore';
import { Header, BottomNav } from '../../components/Navigation';
import { Button, Input, Card } from '../../components/UI';
import { Calendar, Clock, FileText } from 'lucide-react';

export default function Booking() {
  const { providerId } = useParams();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [provider, setProvider] = useState<any>(null);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [details, setDetails] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProvider = async () => {
      if (!providerId) return;
      const docRef = doc(db, 'users', providerId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setProvider(docSnap.data());
      }
    };
    fetchProvider();
  }, [providerId]);

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !providerId) return;
    setLoading(true);
    try {
      await addDoc(collection(db, 'jobs'), {
        customerId: user.uid,
        providerId: providerId,
        providerName: provider?.displayName,
        customerName: user.displayName || 'Customer',
        date,
        time,
        details,
        status: 'pending',
        createdAt: new Date(),
      });
      alert('Booking request sent!');
      navigate('/');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!provider) return <div className="p-8 text-center">Loading provider details...</div>;

  return (
    <div className="pb-20">
      <Header title={`Book ${provider.displayName}`} showBack />
      
      <main className="p-4 space-y-6">
        <Card className="flex items-center gap-4 p-4 bg-indigo-50/50 border-indigo-100">
          <img 
            src={provider.photoURL || `https://picsum.photos/seed/${provider.uid}/200/200`} 
            alt="" 
            className="h-16 w-16 rounded-full object-cover border-2 border-white shadow-sm"
            referrerPolicy="no-referrer"
          />
          <div>
            <h3 className="font-bold text-indigo-900">{provider.displayName}</h3>
            <p className="text-xs text-indigo-600 font-medium">Service Provider</p>
          </div>
        </Card>

        <form onSubmit={handleBooking} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                <Calendar size={16} className="text-indigo-600" /> Select Date
              </label>
              <Input 
                type="date" 
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                <Clock size={16} className="text-indigo-600" /> Select Time
              </label>
              <Input 
                type="time" 
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                <FileText size={16} className="text-indigo-600" /> Job Details
              </label>
              <textarea 
                className="w-full rounded-xl border border-slate-200 p-4 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none min-h-[120px]"
                placeholder="Describe the problem or service you need..."
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                required
              />
            </div>
          </div>

          <Button type="submit" className="w-full h-14 text-lg" isLoading={loading}>
            Confirm Booking Request
          </Button>
        </form>
      </main>

      <BottomNav />
    </div>
  );
}
