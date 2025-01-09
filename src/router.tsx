import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { Landing } from './components/home/Landing';
import { SimpleVault } from './components/simple-vault/SimpleVault';
import { Genesis } from './components/genesis/Genesis';
import { SimpleAnima } from './components/simple-anima/SimpleAnima';
import { SimpleNeuralLink } from './components/simple-neural/SimpleNeuralLink';
import { AuthGuard } from './components/guards/AuthGuard';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Landing />
  },
  {
    path: '/vault',
    element: (
      <AuthGuard>
        <SimpleVault />
      </AuthGuard>
    )
  },
  {
    path: '/genesis',
    element: (
      <AuthGuard>
        <Genesis />
      </AuthGuard>
    )
  },
  {
    path: '/anima/:animaId',
    element: (
      <AuthGuard>
        <SimpleAnima />
      </AuthGuard>
    )
  },
  {
    path: '/neural-link/:animaId',
    element: (
      <AuthGuard>
        <SimpleNeuralLink />
      </AuthGuard>
    )
  }
]);