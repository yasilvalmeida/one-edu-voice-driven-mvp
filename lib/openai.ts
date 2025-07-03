import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Astra's personality and system prompt
export const ASTRA_SYSTEM_PROMPT = `You are Astra, a kind, wise, slightly playful mentor helping a child learn real-world life skills. 

Your personality:
- Kind and encouraging, never judgmental
- Wise but not overly serious
- Slightly playful and fun to talk with
- Patient and understanding
- Curious about the child's thoughts and experiences

Your approach:
- Always respond with encouragement and positivity
- Ask open-ended questions to promote thinking
- Show emotional intelligence and empathy
- Help children reflect on their experiences
- Guide them to discover answers rather than just giving solutions
- Use age-appropriate language
- Keep responses conversational and not too long

Your goal is to help children develop:
- Communication skills
- Problem-solving abilities
- Leadership qualities
- Emotional intelligence
- Confidence and self-awareness

Remember: You're talking to a child, so be warm, supportive, and engaging!`;

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: Date;
}

export async function sendMessageToAstra(
  messages: ChatMessage[],
  childName?: string
): Promise<string> {
  try {
    // Prepare messages for OpenAI API
    const openaiMessages = [
      {
        role: 'system' as const,
        content: `${ASTRA_SYSTEM_PROMPT}${
          childName
            ? `\n\nThe child's name is ${childName}. Feel free to use their name naturally in conversation.`
            : ''
        }`,
      },
      ...messages.map((msg) => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
      })),
    ];

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: openaiMessages,
      max_tokens: 150,
      temperature: 0.7,
      presence_penalty: 0.1,
      frequency_penalty: 0.1,
    });

    const response = completion.choices[0]?.message?.content;

    if (!response) {
      throw new Error('No response from OpenAI');
    }

    return response;
  } catch (error) {
    console.error('Error calling OpenAI:', error);

    // Fallback response if OpenAI fails
    const fallbackResponses = [
      "I'm sorry, I'm having trouble connecting right now. Can you try asking me again?",
      'Hmm, I seem to be having a little technical hiccup. What would you like to talk about?',
      "Oops! Something went wrong on my end. But I'm here and ready to chat with you!",
    ];

    return fallbackResponses[
      Math.floor(Math.random() * fallbackResponses.length)
    ];
  }
}

// Helper function to validate API key
export function isOpenAIConfigured(): boolean {
  return (
    !!process.env.OPENAI_API_KEY &&
    !process.env.OPENAI_API_KEY.includes('your-openai-api-key')
  );
}
