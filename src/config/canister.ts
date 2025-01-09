import { Actor, HttpAgent } from '@dfinity/agent';
import { idlFactory } from '../declarations/anima/anima.did';

const host = process.env.DFX_NETWORK === 'ic' 
  ? 'https://mainnet.dfinity.network'
  : 'http://localhost:4943';

const agent = new HttpAgent({ host });

if (process.env.DFX_NETWORK !== 'ic') {
  agent.fetchRootKey().catch(err => {
    console.warn('Unable to fetch root key. Check if local replica is running');
    console.error(err);
  });
}

export const animaCanister = Actor.createActor(idlFactory, {
  agent,
  canisterId: process.env.ANIMA_CANISTER_ID!,
});