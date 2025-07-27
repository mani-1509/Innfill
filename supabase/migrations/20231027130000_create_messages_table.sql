-- Create the messages table
create table public.messages (
  id uuid not null default gen_random_uuid(),
  created_at timestamp with time zone not null default now(),
  content text null,
  project_id uuid not null,
  sender_id uuid not null,
  constraint messages_pkey primary key (id),
  constraint messages_project_id_fkey foreign key (project_id) references projects (id) on delete cascade,
  constraint messages_sender_id_fkey foreign key (sender_id) references profiles (id) on delete cascade
);

-- Enable Row Level Security
alter table public.messages enable row level security;

-- Create policy for users to view messages in their projects
create policy "Users can view messages in their projects." on public.messages
  for select using (
    auth.uid() in (
      select client_id from public.projects where id = project_id
    ) or
    auth.uid() in (
      select freelancer_id from public.projects where id = project_id
    )
  );

-- Create policy for users to insert messages in their projects
create policy "Users can insert messages in their projects." on public.messages
  for insert with check (
    auth.uid() in (
      select client_id from public.projects where id = project_id
    ) or
    auth.uid() in (
      select freelancer_id from public.projects where id = project_id
    )
  );

-- Enable realtime on the messages table
alter publication supabase_realtime add table public.messages;
