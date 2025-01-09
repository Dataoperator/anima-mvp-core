import { Principal } from '@dfinity/principal';

export interface AnimaData {
  owner: Principal;
  designation: string;
  created_at: bigint;
  level: bigint;
  experience: bigint;
  payment_memo: bigint;
}

export interface MintResult {
  token_id: bigint;
  designation: string;
}

export interface PaymentRecord {
  principal: Principal;
  memo: bigint;
  timestamp: bigint;
  amount: bigint;
  status: "pending" | "completed";
}

export interface InteractionResponse {
  message: string;
  experience_gained: bigint;
}