import { NextRequest, NextResponse } from 'next/server';
import {
  sendMessageToAstra,
  ChatMessage,
  isOpenAIConfigured,
} from '@/lib/openai';
import { awardXP, detectSkill, XP_REWARDS } from '@/lib/gamification';

export async function POST(request: NextRequest) {
  try {
    // Check if OpenAI is configured
    if (!isOpenAIConfigured()) {
      return NextResponse.json(
        {
          error:
            'OpenAI API is not configured. Please add your OPENAI_API_KEY to .env.local',
          fallback: true,
          message:
            "Hi there! I'm Astra, your AI mentor. I'd love to chat with you, but it looks like the grown-ups need to set up my connection first. Ask them to check the setup instructions!",
        },
        { status: 200 }
      );
    }

    const body = await request.json();
    const { messages, childName, userId } = body;

    // Validate request
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      );
    }

    // Send to OpenAI
    const response = await sendMessageToAstra(messages, childName);

    // Award XP if userId is provided
    let xpReward = null;
    if (userId) {
      try {
        const lastMessage = messages[messages.length - 1];
        const userMessage = lastMessage?.content || '';

        // Detect skill from message
        const skill = detectSkill(userMessage);

        // Check if it's a question (bonus XP)
        const isQuestion = userMessage.includes('?') ||
          userMessage.toLowerCase().startsWith('why') ||
          userMessage.toLowerCase().startsWith('how') ||
          userMessage.toLowerCase().startsWith('what');

        const baseXP = isQuestion ? XP_REWARDS.QUESTION_ASKED : XP_REWARDS.CHAT_MESSAGE;
        const reason = isQuestion ? 'Asked a question' : 'Sent a message';

        xpReward = await awardXP(userId, baseXP, reason, skill || undefined);
      } catch (xpError) {
        console.error('Failed to award XP:', xpError);
        // Don't fail the request if XP awarding fails
      }
    }

    return NextResponse.json({
      message: response,
      timestamp: new Date().toISOString(),
      xpReward,
    });
  } catch (error) {
    console.error('Chat API error:', error);

    return NextResponse.json(
      {
        error: 'Failed to process message',
        fallback: true,
        message:
          "Oops! I'm having a little trouble right now. Can you try asking me something else?",
      },
      { status: 500 }
    );
  }
}
