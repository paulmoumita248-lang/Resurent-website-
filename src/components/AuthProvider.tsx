import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { UserProfile, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Add the user's email from the prompt to the admin list
const BOOTSTRAP_ADMINS = ['paulmoumita248@gmail.com'];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        const profileRef = doc(db, 'users', user.uid);
        try {
          const profileSnap = await getDoc(profileRef);
          if (profileSnap.exists()) {
            const data = profileSnap.data() as UserProfile;
            const expectedRole: UserRole = BOOTSTRAP_ADMINS.includes(user.email || '') ? 'admin' : data.role;
            
            if (data.role !== expectedRole) {
              await updateDoc(profileRef, { role: expectedRole });
              setProfile({ ...data, role: expectedRole, uid: user.uid });
            } else {
              setProfile({ ...data, uid: user.uid });
            }
          } else {
            // Determine role Part of the "Bootstrapped Admin" Pillar
            const role: UserRole = BOOTSTRAP_ADMINS.includes(user.email || '') ? 'admin' : 'customer';
            
            const newProfile: Omit<UserProfile, 'uid'> = {
              displayName: user.displayName || 'Guest',
              email: user.email || '',
              role: role,
              createdAt: serverTimestamp(),
            };
            await setDoc(profileRef, newProfile);
            setProfile({ uid: user.uid, ...newProfile } as UserProfile);
          }
        } catch (error) {
          console.error("Error fetching profile:", error);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ user, profile, loading, isAdmin: profile?.role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
