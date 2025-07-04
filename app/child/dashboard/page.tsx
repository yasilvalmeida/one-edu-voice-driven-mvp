'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/lib/auth-context';
import { useToast } from '@/components/toast';
import Header from '@/components/layout/header';
import XPProgressBar from '@/components/dashboard/xp-progress-bar';
import SkillCard from '@/components/dashboard/skill-card';
import BadgeDisplay from '@/components/dashboard/badge-display';
import DashboardStats from '@/components/dashboard/dashboard-stats';

export default function ChildDashboardPage() {
  const { user, profile, loading, signOut } = useUser();
  const router = useRouter();
  const { showToast } = useToast();

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
  }, [user, profile, loading, router]);

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

  // Static mock data for XP system
  const mockData = {
    totalXP: 1250,
    currentLevel: 3,
    targetXP: 1500,
    streakDays: 5,
    skills: [
      {
        name: 'Communication',
        level: 3,
        maxLevel: 5,
        icon: '💬',
        color: 'primary' as const,
        description: 'Express yourself clearly and listen actively',
      },
      {
        name: 'Problem Solving',
        level: 2,
        maxLevel: 5,
        icon: '🧩',
        color: 'secondary' as const,
        description: 'Think critically and find creative solutions',
      },
      {
        name: 'Leadership',
        level: 1,
        maxLevel: 5,
        icon: '🌟',
        color: 'accent' as const,
        description: 'Guide others and take initiative',
      },
    ],
    badges: [
      {
        id: 'first-conversation',
        name: 'First Chat',
        description: 'Started your first conversation with Astra',
        icon: '💬',
        color: '#10B981',
        unlocked: true,
        unlockedAt: new Date('2024-01-15'),
      },
      {
        id: 'curious-learner',
        name: 'Curious Learner',
        description: 'Asked 10 thoughtful questions',
        icon: '🤔',
        color: '#3B82F6',
        unlocked: true,
        unlockedAt: new Date('2024-01-18'),
      },
      {
        id: 'problem-solver',
        name: 'Problem Solver',
        description: 'Solved your first challenge',
        icon: '🧩',
        color: '#8B5CF6',
        unlocked: false,
      },
      {
        id: 'streak-master',
        name: 'Streak Master',
        description: 'Maintained a 7-day learning streak',
        icon: '🔥',
        color: '#EF4444',
        unlocked: false,
      },
    ],
  };

  if (loading) {
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
          level: mockData.currentLevel,
          xp: mockData.totalXP,
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
            totalXP={mockData.totalXP}
            level={mockData.currentLevel}
            badgesEarned={mockData.badges.filter((b) => b.unlocked).length}
            totalBadges={mockData.badges.length}
            streakDays={mockData.streakDays}
            childName={profile.name || 'there'}
          />
        </div>

        {/* XP Progress */}
        <div className='mb-8'>
          <XPProgressBar
            currentXP={mockData.totalXP}
            targetXP={mockData.targetXP}
            level={mockData.currentLevel}
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
              {mockData.skills.map((skill, index) => (
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
            <BadgeDisplay badges={mockData.badges} />
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
              <button
                className='bg-gradient-to-r from-secondary-500 to-secondary-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-secondary-600 hover:to-secondary-700 transition-all duration-200 shadow-md hover:shadow-lg'
              >
                🔄 Refresh Progress
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
