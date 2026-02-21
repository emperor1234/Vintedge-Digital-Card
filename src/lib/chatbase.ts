/**
 * Chatbase API integration for automatic bot creation
 */

interface ChatbaseBotResponse {
  botId?: string;
  error?: string;
}

/**
 * Creates a new Chatbase bot with Q&A data
 */
export async function createChatbaseBot(
  name: string,
  qaData: string,
  firstMessage?: string
): Promise<ChatbaseBotResponse> {
  const apiKey = process.env.CHATBASE_API_KEY;
  
  if (!apiKey) {
    console.error('Chatbase API key not configured');
    return { error: 'Chatbase not configured' };
  }

  try {
    // First, create a new chatbot
    const response = await fetch('https://www.chatbase.co/api/v1/chatbots', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        name: name,
        description: `AI assistant for ${name}`,
        firstMessage: firstMessage || `Hi! I'm ${name}'s AI assistant. How can I help you today?`,
        model: 'gemini-1.5-pro',
        isPublic: false,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Chatbase create bot error:', errorText);
      return { error: 'Failed to create chatbot' };
    }

    const botData = await response.json();
    const botId = botData.botId;

    if (!botId) {
      console.error('No botId returned from Chatbase');
      return { error: 'Failed to get chatbot ID' };
    }

    // Now add the Q&A data as a source
    const sourcesResponse = await fetch(`https://www.chatbase.co/api/v1/chatbots/${botId}/sources`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      body: JSON.stringify({
        type: 'text',
        name: `${name}'s Q&A`,
        text: qaData,
      } as any),
    });

    if (!sourcesResponse.ok) {
      console.error('Chatbase add source error:', await sourcesResponse.text());
      // Bot was created but source failed - still return the botId
    }

    return { botId };
  } catch (error) {
    console.error('Chatbase API error:', error);
    return { error: 'Chatbase API error' };
  }
}

/**
 * Updates an existing Chatbase bot with new Q&A data
 */
export async function updateChatbaseBot(
  botId: string,
  qaData: string
): Promise<ChatbaseBotResponse> {
  const apiKey = process.env.CHATBASE_API_KEY;
  
  if (!apiKey) {
    return { error: 'Chatbase not configured' };
  }

  try {
    // Add new Q&A data source to existing bot
    const response = await fetch(`https://www.chatbase.co/api/v1/chatbots/${botId}/sources`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      body: JSON.stringify({
        type: 'text',
        name: 'Updated Q&A',
        text: qaData,
      } as any),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Chatbase update source error:', errorText);
      return { error: 'Failed to update chatbot' };
    }

    return { botId };
  } catch (error) {
    console.error('Chatbase API error:', error);
    return { error: 'Chatbase API error' };
  }
}
