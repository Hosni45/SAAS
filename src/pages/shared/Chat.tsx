import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { collection, query, orderBy, onSnapshot, addDoc, doc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuthStore } from '../../store/authStore';
import { Header } from '../../components/Navigation';
import { Button, Input } from '../../components/UI';
import { Send } from 'lucide-react';

export default function Chat() {
  const { jobId } = useParams();
  const { user } = useAuthStore();
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [job, setJob] = useState<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!jobId) return;
    
    // Fetch job details to get participant names
    const fetchJob = async () => {
      const docSnap = await getDoc(doc(db, 'jobs', jobId));
      if (docSnap.exists()) {
        setJob(docSnap.data());
      }
    };
    fetchJob();

    // Fetch messages
    const q = query(
      collection(db, 'jobs', jobId, 'messages'),
      orderBy('createdAt', 'asc')
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, [jobId]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user || !jobId) return;

    try {
      await addDoc(collection(db, 'jobs', jobId, 'messages'), {
        text: newMessage,
        senderId: user.uid,
        senderName: user.displayName || 'User',
        createdAt: new Date(),
      });
      setNewMessage('');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex h-screen flex-col bg-slate-50">
      <Header title={job ? `Chat with ${user?.uid === job.providerId ? job.customerName : job.providerName}` : 'Chat'} showBack />
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => {
          const isMe = msg.senderId === user?.uid;
          return (
            <div 
              key={msg.id} 
              className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
            >
              <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm shadow-sm ${
                isMe ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white text-slate-900 rounded-tl-none border border-slate-100'
              }`}>
                {msg.text}
              </div>
              <span className="mt-1 text-[10px] text-slate-400">
                {msg.createdAt?.toDate ? msg.createdAt.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
              </span>
            </div>
          );
        })}
        <div ref={scrollRef} />
      </div>

      <div className="border-t border-slate-100 bg-white p-4 pb-8 lg:pb-4">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <Input 
            placeholder="Type a message..." 
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="rounded-full"
          />
          <Button type="submit" size="icon" className="rounded-full flex-none">
            <Send size={18} />
          </Button>
        </form>
      </div>
    </div>
  );
}
