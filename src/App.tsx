import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { AuthProvider } from '@/contexts/auth-context';
import { AnimaProvider } from '@/contexts/AnimaContext';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AnimaProvider>
        <RouterProvider router={router} />
      </AnimaProvider>
    </AuthProvider>
  );
};

export default App;