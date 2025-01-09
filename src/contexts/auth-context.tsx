import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthClient } from '@dfinity/auth-client';
import { Actor, Identity } from '@dfinity/agent';
import { animaCanister } from '@/config/canister';

interface AuthContextType {
  identity: Identity | null;
  actor: typeof animaCanister;
  connecting: boolean;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [identity, setIdentity] = useState<Identity | null>(null);
  const [connecting, setConnecting] = useState(true);
  const [actor, setActor] = useState(animaCanister);

  useEffect(() => {
    const init = async () => {
      try {
        const connected = await window.ic?.plug?.isConnected();
        if (connected) {
          const plugIdentity = await window.ic.plug.agent.getPrincipal();
          setIdentity(plugIdentity);
        }
      } catch (err) {
        console.error('Failed to check connection:', err);
      } finally {
        setConnecting(false);
      }
    };

    init();
  }, []);

  const connect = async () => {
    try {
      setConnecting(true);
      const whitelist = [process.env.ANIMA_CANISTER_ID];
      const host = process.env.DFX_NETWORK === 'ic' ? 'https://mainnet.dfinity.network' : 'http://localhost:4943';

      const result = await window.ic.plug.requestConnect({
        whitelist,
        host
      });

      if (result) {
        const plugIdentity = await window.ic.plug.agent.getPrincipal();
        setIdentity(plugIdentity);
      }
    } catch (err) {
      console.error('Failed to connect:', err);
      throw err;
    } finally {
      setConnecting(false);
    }
  };

  const disconnect = async () => {
    try {
      await window.ic?.plug?.disconnect();
      setIdentity(null);
    } catch (err) {
      console.error('Failed to disconnect:', err);
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        identity,
        actor,
        connecting,
        connect,
        disconnect,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}