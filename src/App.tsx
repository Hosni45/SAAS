import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './lib/firebase';
import { useAuthStore } from './store/authStore';

// Pages
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import CustomerHome from './pages/customer/Home';
import ProviderDashboard from './pages/provider/Dashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import Profile from './pages/shared/Profile';
import Chat from './pages/shared/Chat';
import ProviderList from './pages/customer/ProviderList';
import Booking from './pages/customer/Booking';

const AuthGuard = ({ children, allowedRoles }: { children: React.ReactNode, allowedRoles?: string[] }) => {
  const { user, profile, loading } = useAuthStore();

  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (allowedRoles && profile && !allowedRoles.includes(profile.role)) return <Navigate to="/" />;

  return <>{children}</>;
};

export default function App() {
  const { setUser, setProfile, setLoading, profile } = useAuthStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true);
      if (user) {
        setUser(user);
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfile(docSnap.data() as any);
        }
      } else {
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          <Route path="/" element={
            <AuthGuard>
              {profile?.role === 'customer' ? <CustomerHome /> : 
               profile?.role === 'provider' ? <ProviderDashboard /> : 
               profile?.role === 'admin' ? <AdminDashboard /> : <div className="p-8">Welcome! Please wait...</div>}
            </AuthGuard>
          } />

          <Route path="/category/:categoryId" element={
            <AuthGuard allowedRoles={['customer']}>
              <ProviderList />
            </AuthGuard>
          } />

          <Route path="/book/:providerId" element={
            <AuthGuard allowedRoles={['customer']}>
              <Booking />
            </AuthGuard>
          } />

          <Route path="/admin" element={
            <AuthGuard allowedRoles={['admin']}>
              <AdminDashboard />
            </AuthGuard>
          } />

          <Route path="/profile" element={
            <AuthGuard>
              <Profile />
            </AuthGuard>
          } />

          <Route path="/chat/:jobId" element={
            <AuthGuard>
              <Chat />
            </AuthGuard>
          } />
        </Routes>
      </div>
    </Router>
  );
}
