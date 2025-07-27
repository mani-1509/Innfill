-- supabase/migrations/20240729130000_create_payments_schema.sql

-- Create a table for storing user payment methods
create table if not exists payment_methods (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references public.profiles(id) on delete cascade not null,
    method_type text not null, -- e.g., 'card', 'bank_account'
    details jsonb not null, -- e.g., card brand, last4, bank name
    is_default boolean default false,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create a table for transactions
create table if not exists transactions (
    id uuid primary key default gen_random_uuid(),
    project_id uuid references public.projects(id) on delete set null,
    payer_id uuid references public.profiles(id) on delete set null,
    payee_id uuid references public.profiles(id) on delete set null,
    amount numeric(10, 2) not null,
    currency text not null default 'USD',
    status text not null, -- e.g., 'pending', 'completed', 'failed', 'refunded'
    payment_method_id uuid references public.payment_methods(id) on delete set null,
    platform_fee numeric(10, 2) not null default 0.00,
    payout_id text, -- For tracking payouts to bank accounts, e.g., Stripe Payout ID
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Add RLS policies for payment_methods
-- Users can view and manage their own payment methods.
-- Admins can view all payment methods.
alter table payment_methods enable row level security;

create policy "Users can manage their own payment methods" on payment_methods
    for all using (auth.uid() = user_id);

create policy "Admins can view all payment methods" on payment_methods
    for select using (public.is_admin(auth.uid()));

-- Add RLS policies for transactions
-- Users can view their own transactions (as payer or payee).
-- Admins can view all transactions.
alter table transactions enable row level security;

create policy "Users can view their own transactions" on transactions
    for select using (auth.uid() = payer_id or auth.uid() = payee_id);

create policy "Admins can view all transactions" on transactions
    for select using (public.is_admin(auth.uid()));

-- Function to update the updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

-- Trigger to automatically update the updated_at timestamp on transactions
create trigger on_transaction_update
  before update on public.transactions
  for each row execute procedure public.handle_updated_at();
