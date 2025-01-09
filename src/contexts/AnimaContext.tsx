import React, { createContext, useContext, useState } from 'react';

interface AnimaContextType {
  refreshTrigger: number;
  triggerRefresh: () => void;
}

const AnimaContext = createContext<AnimaContextType | null>(null);

export function AnimaProvider({ children }: { children: React.ReactNode }) {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const triggerRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <AnimaContext.Provider
      value={{
        refreshTrigger,
        triggerRefresh,
      }}
    >
      {children}
    </AnimaContext.Provider>
  );
}

export function useAnima() {
  const context = useContext(AnimaContext);
  if (!context) {
    throw new Error('useAnima must be used within an AnimaProvider');
  }
  return context;
}