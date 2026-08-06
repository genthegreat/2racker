"use client";

import { Session, User, AuthChangeEvent, SupabaseClient } from "@supabase/supabase-js";
import {
  useContext,
  useState,
  useEffect,
  createContext,
  ReactNode,
  useCallback,
  useRef,
} from "react";
import { createClient } from "@/utils/supabase/client";

type AuthContextValue = {
  session: Session | null;
  user: User | null;
  event: AuthChangeEvent | null;
  loading: boolean;
  isPasswordRecovery: boolean;
  signOut: () => Promise<void>;
  clearPasswordRecovery: () => void;
};

const AuthContext = createContext<AuthContextValue>({
  session: null,
  user: null,
  event: null,
  loading: true,
  isPasswordRecovery: false,
  signOut: async () => {},
  clearPasswordRecovery: () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const supabaseRef = useRef<SupabaseClient | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [event, setEvent] = useState<AuthChangeEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPasswordRecovery, setIsPasswordRecovery] = useState(false);

  const getSupabase = useCallback(() => {
    if (!supabaseRef.current) {
      supabaseRef.current = createClient();
    }
    return supabaseRef.current;
  }, []);

  const applySession = useCallback(
    (nextSession: Session | null, nextEvent?: AuthChangeEvent | null) => {
      setSession(nextSession);
      setUser(nextSession?.user ?? null);

      if (nextEvent) {
        setEvent(nextEvent);
      }

      if (nextEvent === "PASSWORD_RECOVERY") {
        setIsPasswordRecovery(true);
      }

      if (nextEvent === "SIGNED_OUT" || !nextSession) {
        setIsPasswordRecovery(false);
      }
    },
    []
  );

  useEffect(() => {
    let mounted = true;
    const supabase = getSupabase();

    const syncSession = async () => {
      const {
        data: { session: currentSession },
        error,
      } = await supabase.auth.getSession();

      if (!mounted) {
        return;
      }

      if (error) {
        console.error("Failed to read auth session:", error.message);
        applySession(null, null);
      } else {
        applySession(currentSession, null);

        // Server-side OTP recovery (/auth/confirm?type=recovery) lands here with
        // a session cookie but without a PASSWORD_RECOVERY browser event.
        if (
          currentSession &&
          new URLSearchParams(window.location.search).get("recovery") === "1"
        ) {
          setIsPasswordRecovery(true);
        }
      }

      setLoading(false);
    };

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((authEvent, nextSession) => {
      applySession(nextSession, authEvent);
      setLoading(false);
    });

    void syncSession();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [applySession, getSupabase]);

  const signOut = useCallback(async () => {
    setIsPasswordRecovery(false);
    const { error } = await getSupabase().auth.signOut();
    if (error) {
      console.error("Failed to sign out:", error.message);
    }
    applySession(null, "SIGNED_OUT");
  }, [applySession, getSupabase]);

  const clearPasswordRecovery = useCallback(() => {
    setIsPasswordRecovery(false);
  }, []);

  const value: AuthContextValue = {
    session,
    event,
    user,
    loading,
    isPasswordRecovery,
    signOut,
    clearPasswordRecovery,
  };

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
