-- Gamification tables for XP, Skills, and Badges

-- Child stats table for XP and level tracking
create table child_stats (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade unique not null,
  xp_balance int default 0 not null,
  current_level int default 1 not null,
  total_xp_earned int default 0 not null,
  current_streak int default 0 not null,
  longest_streak int default 0 not null,
  last_activity_date date,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

-- Skills table for tracking skill progression
create table skills (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade not null,
  skill_name text not null check (skill_name in ('communication', 'problem_solving', 'leadership')),
  current_level int default 1 not null check (current_level >= 1 and current_level <= 5),
  xp_in_level int default 0 not null,
  xp_to_next_level int default 100 not null,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null,
  unique(user_id, skill_name)
);

-- Badge definitions
create table badge_definitions (
  id uuid primary key default gen_random_uuid(),
  name text unique not null,
  description text not null,
  icon text not null,
  category text not null check (category in ('learning', 'streak', 'skill', 'achievement')),
  requirement_type text not null,
  requirement_value int not null,
  created_at timestamp with time zone default now() not null
);

-- User badges (earned badges)
create table user_badges (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade not null,
  badge_id uuid references badge_definitions(id) on delete cascade not null,
  earned_at timestamp with time zone default now() not null,
  unique(user_id, badge_id)
);

-- Activity log for XP transactions
create table xp_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade not null,
  amount int not null,
  reason text not null,
  skill_affected text check (skill_affected in ('communication', 'problem_solving', 'leadership', null)),
  created_at timestamp with time zone default now() not null
);

-- Enable RLS
alter table child_stats enable row level security;
alter table skills enable row level security;
alter table badge_definitions enable row level security;
alter table user_badges enable row level security;
alter table xp_transactions enable row level security;

-- RLS Policies for child_stats
create policy "Users can view own stats" on child_stats for select using (auth.uid() = user_id);
create policy "Users can update own stats" on child_stats for update using (auth.uid() = user_id);
create policy "Users can insert own stats" on child_stats for insert with check (auth.uid() = user_id);

-- RLS Policies for skills
create policy "Users can view own skills" on skills for select using (auth.uid() = user_id);
create policy "Users can update own skills" on skills for update using (auth.uid() = user_id);
create policy "Users can insert own skills" on skills for insert with check (auth.uid() = user_id);

-- RLS Policies for badge_definitions (public read)
create policy "Anyone can view badges" on badge_definitions for select using (true);

-- RLS Policies for user_badges
create policy "Users can view own badges" on user_badges for select using (auth.uid() = user_id);
create policy "Users can insert own badges" on user_badges for insert with check (auth.uid() = user_id);

-- RLS Policies for xp_transactions
create policy "Users can view own transactions" on xp_transactions for select using (auth.uid() = user_id);
create policy "Users can insert own transactions" on xp_transactions for insert with check (auth.uid() = user_id);

-- Parents can view their children's data
create policy "Parents can view children stats" on child_stats for select using (
  exists (
    select 1 from profiles p
    where p.id = auth.uid()
    and p.role = 'parent'
  )
);

create policy "Parents can view children skills" on skills for select using (
  exists (
    select 1 from profiles p
    where p.id = auth.uid()
    and p.role = 'parent'
  )
);

create policy "Parents can view children badges" on user_badges for select using (
  exists (
    select 1 from profiles p
    where p.id = auth.uid()
    and p.role = 'parent'
  )
);

-- Triggers for updated_at
create trigger on_child_stats_updated
  before update on child_stats
  for each row execute procedure public.handle_updated_at();

create trigger on_skills_updated
  before update on skills
  for each row execute procedure public.handle_updated_at();

-- Insert default badges
insert into badge_definitions (name, description, icon, category, requirement_type, requirement_value) values
  ('First Steps', 'Complete your first chat session', 'rocket', 'learning', 'sessions', 1),
  ('Curious Mind', 'Ask 10 questions', 'brain', 'learning', 'questions', 10),
  ('Conversation Starter', 'Have 5 chat sessions', 'message-circle', 'learning', 'sessions', 5),
  ('Week Warrior', 'Maintain a 7-day streak', 'flame', 'streak', 'streak', 7),
  ('Month Master', 'Maintain a 30-day streak', 'trophy', 'streak', 'streak', 30),
  ('Communication Pro', 'Reach Level 3 in Communication', 'message-square', 'skill', 'communication_level', 3),
  ('Problem Solver', 'Reach Level 3 in Problem Solving', 'puzzle', 'skill', 'problem_solving_level', 3),
  ('Young Leader', 'Reach Level 3 in Leadership', 'star', 'skill', 'leadership_level', 3),
  ('XP Hunter', 'Earn 500 total XP', 'zap', 'achievement', 'total_xp', 500),
  ('XP Champion', 'Earn 2000 total XP', 'award', 'achievement', 'total_xp', 2000),
  ('Level Up', 'Reach Level 5', 'trending-up', 'achievement', 'level', 5),
  ('Explorer', 'Try all three skill areas', 'compass', 'achievement', 'skills_tried', 3);

-- Function to calculate level from XP
create or replace function calculate_level(xp int)
returns int as $$
begin
  -- Level thresholds: 0, 100, 250, 500, 1000, 2000, 4000, 8000, 16000, 32000
  if xp >= 32000 then return 10;
  elsif xp >= 16000 then return 9;
  elsif xp >= 8000 then return 8;
  elsif xp >= 4000 then return 7;
  elsif xp >= 2000 then return 6;
  elsif xp >= 1000 then return 5;
  elsif xp >= 500 then return 4;
  elsif xp >= 250 then return 3;
  elsif xp >= 100 then return 2;
  else return 1;
  end if;
end;
$$ language plpgsql;

-- Function to get XP required for next level
create or replace function xp_for_level(level int)
returns int as $$
begin
  case level
    when 1 then return 100;
    when 2 then return 250;
    when 3 then return 500;
    when 4 then return 1000;
    when 5 then return 2000;
    when 6 then return 4000;
    when 7 then return 8000;
    when 8 then return 16000;
    when 9 then return 32000;
    else return 64000;
  end case;
end;
$$ language plpgsql;

-- Function to initialize child stats and skills
create or replace function initialize_child_gamification(child_user_id uuid)
returns void as $$
begin
  -- Create child stats if not exists
  insert into child_stats (user_id)
  values (child_user_id)
  on conflict (user_id) do nothing;

  -- Create skills if not exist
  insert into skills (user_id, skill_name)
  values
    (child_user_id, 'communication'),
    (child_user_id, 'problem_solving'),
    (child_user_id, 'leadership')
  on conflict (user_id, skill_name) do nothing;
end;
$$ language plpgsql;
