import { supabase } from './supabase';

// Types
export interface ChildStats {
  id: string;
  user_id: string;
  xp_balance: number;
  current_level: number;
  total_xp_earned: number;
  current_streak: number;
  longest_streak: number;
  last_activity_date: string | null;
}

export interface Skill {
  id: string;
  user_id: string;
  skill_name: 'communication' | 'problem_solving' | 'leadership';
  current_level: number;
  xp_in_level: number;
  xp_to_next_level: number;
}

export interface BadgeDefinition {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'learning' | 'streak' | 'skill' | 'achievement';
  requirement_type: string;
  requirement_value: number;
}

export interface UserBadge {
  id: string;
  user_id: string;
  badge_id: string;
  earned_at: string;
  badge?: BadgeDefinition;
}

export interface XPTransaction {
  id: string;
  user_id: string;
  amount: number;
  reason: string;
  skill_affected: string | null;
  created_at: string;
}

// Level calculation constants
const LEVEL_THRESHOLDS = [0, 100, 250, 500, 1000, 2000, 4000, 8000, 16000, 32000];
const SKILL_XP_PER_LEVEL = 100;

// Calculate level from total XP
export function calculateLevel(xp: number): number {
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_THRESHOLDS[i]) {
      return i + 1;
    }
  }
  return 1;
}

// Get XP required for next level
export function xpForNextLevel(currentLevel: number): number {
  if (currentLevel >= LEVEL_THRESHOLDS.length) {
    return LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1] * 2;
  }
  return LEVEL_THRESHOLDS[currentLevel];
}

// Get XP progress within current level
export function xpProgressInLevel(totalXp: number): { current: number; required: number; percentage: number } {
  const level = calculateLevel(totalXp);
  const currentLevelXp = level > 1 ? LEVEL_THRESHOLDS[level - 1] : 0;
  const nextLevelXp = xpForNextLevel(level);
  const xpInLevel = totalXp - currentLevelXp;
  const xpNeeded = nextLevelXp - currentLevelXp;

  return {
    current: xpInLevel,
    required: xpNeeded,
    percentage: Math.min(100, (xpInLevel / xpNeeded) * 100),
  };
}

// XP rewards for different actions
export const XP_REWARDS = {
  CHAT_MESSAGE: 5,
  QUESTION_ASKED: 10,
  SESSION_COMPLETE: 25,
  DAILY_LOGIN: 15,
  STREAK_BONUS: 5, // per day of streak
};

// Skill keywords for detection
const SKILL_KEYWORDS = {
  communication: [
    'explain', 'describe', 'tell', 'share', 'discuss', 'talk', 'express',
    'communicate', 'say', 'speak', 'write', 'story', 'conversation',
  ],
  problem_solving: [
    'solve', 'figure', 'how', 'why', 'what if', 'calculate', 'think',
    'puzzle', 'math', 'science', 'build', 'create', 'fix', 'solution',
  ],
  leadership: [
    'help', 'team', 'lead', 'organize', 'plan', 'decide', 'teach',
    'guide', 'support', 'responsible', 'goal', 'achieve', 'inspire',
  ],
};

// Detect which skill a message relates to
export function detectSkill(message: string): 'communication' | 'problem_solving' | 'leadership' | null {
  const lowerMessage = message.toLowerCase();

  let maxMatches = 0;
  let detectedSkill: 'communication' | 'problem_solving' | 'leadership' | null = null;

  for (const [skill, keywords] of Object.entries(SKILL_KEYWORDS)) {
    const matches = keywords.filter(kw => lowerMessage.includes(kw)).length;
    if (matches > maxMatches) {
      maxMatches = matches;
      detectedSkill = skill as 'communication' | 'problem_solving' | 'leadership';
    }
  }

  return maxMatches > 0 ? detectedSkill : null;
}

// Initialize gamification for a new child user
export async function initializeChildGamification(userId: string): Promise<void> {
  // Create child stats
  await supabase.from('child_stats').upsert({
    user_id: userId,
    xp_balance: 0,
    current_level: 1,
    total_xp_earned: 0,
    current_streak: 0,
    longest_streak: 0,
  }, { onConflict: 'user_id' });

  // Create skills
  const skills = ['communication', 'problem_solving', 'leadership'];
  for (const skill of skills) {
    await supabase.from('skills').upsert({
      user_id: userId,
      skill_name: skill,
      current_level: 1,
      xp_in_level: 0,
      xp_to_next_level: SKILL_XP_PER_LEVEL,
    }, { onConflict: 'user_id,skill_name' });
  }
}

// Get child's full gamification data
export async function getChildGamificationData(userId: string) {
  const [statsResult, skillsResult, badgesResult] = await Promise.all([
    supabase.from('child_stats').select('*').eq('user_id', userId).single(),
    supabase.from('skills').select('*').eq('user_id', userId),
    supabase.from('user_badges')
      .select('*, badge:badge_definitions(*)')
      .eq('user_id', userId),
  ]);

  const allBadgesResult = await supabase.from('badge_definitions').select('*');

  return {
    stats: statsResult.data as ChildStats | null,
    skills: (skillsResult.data || []) as Skill[],
    earnedBadges: (badgesResult.data || []) as UserBadge[],
    allBadges: (allBadgesResult.data || []) as BadgeDefinition[],
  };
}

// Award XP and update stats
export async function awardXP(
  userId: string,
  amount: number,
  reason: string,
  skillAffected?: 'communication' | 'problem_solving' | 'leadership'
): Promise<{ newXP: number; leveledUp: boolean; newLevel: number; badgesEarned: string[] }> {
  // Get current stats
  const { data: currentStats } = await supabase
    .from('child_stats')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (!currentStats) {
    await initializeChildGamification(userId);
    return awardXP(userId, amount, reason, skillAffected);
  }

  const newTotalXP = currentStats.total_xp_earned + amount;
  const newLevel = calculateLevel(newTotalXP);
  const leveledUp = newLevel > currentStats.current_level;

  // Update streak
  const today = new Date().toISOString().split('T')[0];
  const lastActivity = currentStats.last_activity_date;
  let newStreak = currentStats.current_streak;

  if (lastActivity) {
    const lastDate = new Date(lastActivity);
    const todayDate = new Date(today);
    const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      newStreak += 1;
    } else if (diffDays > 1) {
      newStreak = 1;
    }
  } else {
    newStreak = 1;
  }

  const newLongestStreak = Math.max(newStreak, currentStats.longest_streak);

  // Update child stats
  await supabase.from('child_stats').update({
    xp_balance: currentStats.xp_balance + amount,
    total_xp_earned: newTotalXP,
    current_level: newLevel,
    current_streak: newStreak,
    longest_streak: newLongestStreak,
    last_activity_date: today,
  }).eq('user_id', userId);

  // Log XP transaction
  await supabase.from('xp_transactions').insert({
    user_id: userId,
    amount,
    reason,
    skill_affected: skillAffected || null,
  });

  // Update skill if applicable
  if (skillAffected) {
    await updateSkillXP(userId, skillAffected, Math.ceil(amount / 2));
  }

  // Check for new badges
  const badgesEarned = await checkAndAwardBadges(userId, newTotalXP, newLevel, newStreak);

  return {
    newXP: newTotalXP,
    leveledUp,
    newLevel,
    badgesEarned,
  };
}

// Update skill XP
async function updateSkillXP(
  userId: string,
  skillName: 'communication' | 'problem_solving' | 'leadership',
  xpAmount: number
): Promise<void> {
  const { data: skill } = await supabase
    .from('skills')
    .select('*')
    .eq('user_id', userId)
    .eq('skill_name', skillName)
    .single();

  if (!skill) return;

  let newXpInLevel = skill.xp_in_level + xpAmount;
  let newLevel = skill.current_level;

  // Level up skill if enough XP
  while (newXpInLevel >= skill.xp_to_next_level && newLevel < 5) {
    newXpInLevel -= skill.xp_to_next_level;
    newLevel += 1;
  }

  await supabase.from('skills').update({
    current_level: newLevel,
    xp_in_level: newXpInLevel,
    xp_to_next_level: SKILL_XP_PER_LEVEL * newLevel,
  }).eq('id', skill.id);
}

// Check and award badges
async function checkAndAwardBadges(
  userId: string,
  totalXP: number,
  level: number,
  streak: number
): Promise<string[]> {
  const { data: allBadges } = await supabase.from('badge_definitions').select('*');
  const { data: earnedBadges } = await supabase
    .from('user_badges')
    .select('badge_id')
    .eq('user_id', userId);

  if (!allBadges) return [];

  const earnedBadgeIds = new Set((earnedBadges || []).map(b => b.badge_id));
  const newBadges: string[] = [];

  for (const badge of allBadges) {
    if (earnedBadgeIds.has(badge.id)) continue;

    let earned = false;

    switch (badge.requirement_type) {
      case 'total_xp':
        earned = totalXP >= badge.requirement_value;
        break;
      case 'level':
        earned = level >= badge.requirement_value;
        break;
      case 'streak':
        earned = streak >= badge.requirement_value;
        break;
      // Add more badge types as needed
    }

    if (earned) {
      await supabase.from('user_badges').insert({
        user_id: userId,
        badge_id: badge.id,
      });
      newBadges.push(badge.name);
    }
  }

  return newBadges;
}
