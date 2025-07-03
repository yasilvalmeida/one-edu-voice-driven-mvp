-- Create profiles table
create table profiles (
  id uuid primary key references auth.users(id),
  role text not null check (role in ('child','parent')),
  name text,
  age int,
  interests text,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

-- Enable RLS (Row Level Security)
alter table profiles enable row level security;

-- Create policies
create policy "Users can view own profile" on profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);
create policy "Users can insert own profile" on profiles for insert with check (auth.uid() = id);

-- Create updated_at trigger
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger on_profiles_updated
  before update on profiles
  for each row execute procedure public.handle_updated_at(); 