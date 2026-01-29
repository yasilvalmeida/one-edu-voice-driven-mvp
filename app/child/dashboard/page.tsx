'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/lib/auth-context';
import { useToast } from '@/components/toast';
import Header from '@/components/layout/header';
import XPProgressBar from '@/components/dashboard/xp-progress-bar';
import SkillCard from '@/components/dashboard/skill-card';
import BadgeDisplay from '@/components/dashboard/badge-display';
import DashboardStats from '@/components/dashboard/dashboard-stats';
import {
  getChildGamificationData,
  initializeChildGamification,
  xpForNextLevel,
  ChildStats,
  Skill,
  BadgeDefinition,
  UserBadge,
} from '@/lib/gamification';

interface GamificationData {
  stats: ChildStats | null;
  skills: Skill[];
  earnedBadges: UserBadge[];
  allBadges: BadgeDefinition[];
}

export default function ChildDashboardPage() {
  const { user, profile, loading, signOut } = useUser();
  const router = useRouter();
  const { showToast } = useToast();
  const [gamificationData, setGamificationData] = useState<GamificationData | null>(null);
  const [dataLoading, setDataLoading] = useState(true);

  const loadGamificationData = useCallback(async () => {
    if (!user?.id) return;

    try {
      // Initialize gamification if needed
      await initializeChildGamification(user.id);

      // Fetch gamification data
      const data = await getChildGamificationData(user.id);
      setGamificationData(data);
    } catch (error) {
      console.error('Failed to load gamification data:', error);
    } finally {
      setDataLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.push('/auth');
      return;
    }

    if (!profile) {
      router.push('/role');
      return;
    }

    if (profile.role !== 'child') {
      router.push('/role');
      return;
    }

    // Load gamification data
    loadGamificationData();
  }, [user, profile, loading, router, loadGamificationData]);

  const handleLogout = async () => {
    try {
      await signOut();
      showToast({
        type: 'success',
        title: 'Logged out',
        message: 'You have been logged out successfully.',
        duration: 3000,
      });
      router.replace('/auth');
    } catch (error) {
      console.error('Error logging out:', error);
      showToast({
        type: 'error',
        title: 'Logout Error',
        message: 'Failed to log out. Please try again.',
        duration: 4000,
      });
      router.replace('/auth');
    }
  };

  // Transform gamification data for components
  const stats = gamificationData?.stats;
  const skills = gamificationData?.skills || [];
  const earnedBadgeIds = new Set(gamificationData?.earnedBadges?.map(b => b.badge_id) || []);
  const allBadges = gamificationData?.allBadges || [];

  const totalXP = stats?.total_xp_earned || 0;
  const currentLevel = stats?.current_level || 1;
  const targetXP = xpForNextLevel(currentLevel);
  const streakDays = stats?.current_streak || 0;

  // Map skills to component format
  const skillIcons: Record<string, string> = {
    communication: '💬',
    problem_solving: '🧩',
    leadership: '🌟',
  };

  const skillColors: Record<string, 'primary' | 'secondary' | 'accent'> = {
    communication: 'primary',
    problem_solving: 'secondary',
    leadership: 'accent',
  };

  const skillDescriptions: Record<string, string> = {
    communication: 'Express yourself clearly and listen actively',
    problem_solving: 'Think critically and find creative solutions',
    leadership: 'Guide others and take initiative',
  };

  const skillNames: Record<string, string> = {
    communication: 'Communication',
    problem_solving: 'Problem Solving',
    leadership: 'Leadership',
  };

  const formattedSkills = skills.map((skill) => ({
    name: skillNames[skill.skill_name] || skill.skill_name,
    level: skill.current_level,
    maxLevel: 5,
    icon: skillIcons[skill.skill_name] || '📚',
    color: skillColors[skill.skill_name] || 'primary' as const,
    description: skillDescriptions[skill.skill_name] || '',
  }));

  // Map badges to component format
  const badgeIcons: Record<string, string> = {
    'First Steps': '🚀',
    'Curious Mind': '🧠',
    'Conversation Starter': '💬',
    'Week Warrior': '🔥',
    'Month Master': '🏆',
    'Communication Pro': '💬',
    'Problem Solver': '🧩',
    'Young Leader': '⭐',
    'XP Hunter': '⚡',
    'XP Champion': '🏅',
    'Level Up': '📈',
    'Explorer': '🧭',
  };

  const badgeColors: Record<string, string> = {
    learning: '#10B981',
    streak: '#EF4444',
    skill: '#8B5CF6',
    achievement: '#3B82F6',
  };

  const formattedBadges = allBadges.map((badge) => ({
    id: badge.id,
    name: badge.name,
    description: badge.description,
    icon: badgeIcons[badge.name] || '🏅',
    color: badgeColors[badge.category] || '#6B7280',
    unlocked: earnedBadgeIds.has(badge.id),
    unlockedAt: gamificationData?.earnedBadges?.find(eb => eb.badge_id === badge.id)?.earned_at
      ? new Date(gamificationData.earnedBadges.find(eb => eb.badge_id === badge.id)!.earned_at)
      : undefined,
  }));

  if (loading || dataLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto'></div>
          <p className='mt-4 text-gray-600'>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user || !profile || profile.role !== 'child') {
    return null;
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50'>
      {/* Header */}
      <Header
        subtitle='Your Progress'
        showBackButton={true}
        userInfo={{
          level: currentLevel,
          xp: totalXP,
        }}
        actionButtons={[
          {
            label: 'Chat with Astra',
            icon: '💬',
            onClick: () => router.push('/child/chat'),
            variant: 'primary',
            hideTextOnMobile: true,
          },
        ]}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {/* Welcome Stats */}
        <div className='mb-8'>
          <DashboardStats
            totalXP={totalXP}
            level={currentLevel}
            badgesEarned={formattedBadges.filter((b) => b.unlocked).length}
            totalBadges={formattedBadges.length}
            streakDays={streakDays}
            childName={profile.name || 'there'}
          />
        </div>

        {/* XP Progress */}
        <div className='mb-8'>
          <XPProgressBar
            currentXP={totalXP}
            targetXP={targetXP}
            level={currentLevel}
          />
        </div>

        {/* Skills and Badges Grid */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          {/* Skills Section */}
          <div className='space-y-6'>
            <h2 className='text-xl font-semibold text-gray-900 mb-4'>
              Your Skills
            </h2>
            <div className='space-y-4'>
              {formattedSkills.map((skill) => (
                <SkillCard
                  key={skill.name}
                  name={skill.name}
                  level={skill.level}
                  maxLevel={skill.maxLevel}
                  icon={skill.icon}
                  color={skill.color}
                  description={skill.description}
                />
              ))}
            </div>
          </div>

          {/* Badges Section */}
          <div>
            <h2 className='text-xl font-semibold text-gray-900 mb-4'>
              Your Achievements
            </h2>
            <BadgeDisplay badges={formattedBadges} />
          </div>
        </div>

        {/* Call to Action */}
        <div className='mt-12 text-center'>
          <div className='bg-white rounded-xl p-8 shadow-lg border border-gray-100'>
            <h3 className='text-2xl font-bold text-gray-900 mb-4'>
              Ready to learn more? 🚀
            </h3>
            <p className='text-gray-600 mb-6'>
              Chat with Astra to earn more XP, unlock new skills, and discover
              exciting badges!
            </p>
            <div className='flex flex-col sm:flex-row gap-4 justify-center'>
              <button
                onClick={() => router.push('/child/chat')}
                className='bg-gradient-to-r from-primary-500 to-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-primary-600 hover:to-primary-700 transition-all duration-200 shadow-md hover:shadow-lg'
              >
                💬 Start Chatting
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
