// src/types/types.ts

import { User } from '@supabase/supabase-js';

export interface UserProfile {
  id: string;
  updated_at: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  website: string | null;
  user_type: 'client' | 'freelancer' | 'individual' | 'admin';
  skills: string[] | null;
  bio: string | null;
  headline: string | null;
  location: string | null;
  cover_url: string | null;
  email: string | null;
}

export interface Project {
  id: string;
  created_at: string;
  title: string;
  description: string;
  budget: number;
  skills: string[];
  client_id: string;
  status: 'open' | 'in_progress' | 'completed' | 'closed';
  profiles: UserProfile; // The client's profile
}

export interface Application {
  id: string;
  created_at: string;
  project_id: string;
  freelancer_id: string;
  proposal: string;
  status: 'pending' | 'accepted' | 'rejected';
  profiles: UserProfile; // The applicant's profile
}

export interface Message {
    id: number;
    sender_id: string;
    chat_id: number;
    content: string;
    created_at: string;
    sender_profile: {
        full_name: string;
        avatar_url: string;
    };
}

export interface Event {
    id: string;
    created_at: string;
    type: 'new_project' | 'milestone' | 'new_freelancer' | 'announcement' | 'discussion';
    title: string;
    description: string;
    metadata?: {
        author?: string;
        project_id?: string;
        user_id?: string;
    };
}

export interface Conversation {
  chat_id: number;
  other_participant: {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
  };
  last_message: {
    content: string;
    created_at: string;
    sender_id: string;
  } | null;
}

export interface Transaction {
    id: string;
    created_at: string;
    project_id: string | null;
    payer_id: string | null;
    payee_id: string | null;
    amount: number;
    currency: string;
    status: 'pending' | 'completed' | 'failed' | 'refunded' | 'processed';
    platform_fee: number;
    projects?: { title: string } | null; // Optional relation
}

export interface PaymentMethod {
    id: string;
    user_id: string;
    method_type: 'card' | 'bank_account';
    details: {
        brand?: string;
        last4?: string;
        bank_name?: string;
    };
    is_default: boolean;
}
