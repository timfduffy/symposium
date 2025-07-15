class AIAgent {
  constructor(name, model, systemPrompt) {
    this.name = name;
    this.model = model;
    this.systemPrompt = systemPrompt;
    this.conversationHistory = [];
  }

  addMessage(role, content) {
    this.conversationHistory.push({ role, content });
  }

  getMessages() {
    const messages = [{ role: "system", content: this.systemPrompt }];
    messages.push(...this.conversationHistory);
    return messages;
  }

  async generateResponse(apiKey, maxRetries = 3) {
    const headers = {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    };

    const payload = {
      model: this.model,
      messages: this.getMessages(),
      temperature: 0.7,
      max_tokens: 1000
    };

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: 'POST',
          headers,
          body: JSON.stringify(payload)
        });

        if (response.status >= 400 && response.status < 500) {
          if (attempt < maxRetries - 1) {
            const waitTime = (2 ** attempt) + 1;
            await new Promise(resolve => setTimeout(resolve, waitTime * 1000));
            continue;
          } else {
            const errorText = await response.text();
            return `Error after ${maxRetries} attempts: ${response.status} - ${errorText}`;
          }
        }

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.choices[0].message.content;

      } catch (error) {
        if (attempt < maxRetries - 1) {
          const waitTime = (2 ** attempt) + 1;
          await new Promise(resolve => setTimeout(resolve, waitTime * 1000));
          continue;
        } else {
          return `Error after ${maxRetries} attempts: ${error.message}`;
        }
      }
    }

    return `Error: Failed to generate response after ${maxRetries} attempts`;
  }
}

export async function onRequestPost(context) {
  try {
    const { request } = context;
    const data = await request.json();

    // Extract parameters
    const apiKey = data.api_key;
    const agent1Model = data.agent1_model || 'openai/gpt-3.5-turbo';
    const agent2Model = data.agent2_model || 'openai/gpt-3.5-turbo';
    const agent1SystemPrompt = data.agent1_system_prompt || 'You are a helpful AI assistant.';
    const agent2SystemPrompt = data.agent2_system_prompt || 'You are a helpful AI assistant.';
    const initialMessage = data.initial_message || 'Hello! How are you today?';

    // Validate API key
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "API key is required" }), {
        status: 400,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    // Get existing conversation history if provided
    const existingConversation = data.existing_conversation || [];
    const agent1History = data.agent1_history || [];
    const agent2History = data.agent2_history || [];

    // Create agents
    const agent1 = new AIAgent("Agent 1", agent1Model, agent1SystemPrompt);
    const agent2 = new AIAgent("Agent 2", agent2Model, agent2SystemPrompt);

    // If we have existing history, load it into the agents
    if (agent1History.length > 0) {
      agent1.conversationHistory = agent1History;
    } else {
      // Initialize conversation with initial message
      agent1.addMessage("user", initialMessage);
      agent2.addMessage("user", initialMessage);
    }

    if (agent2History.length > 0) {
      agent2.conversationHistory = agent2History;
    }

    const conversation = [...existingConversation];
    const currentTurn = Math.floor(conversation.length / 2) + 1;

    // Determine which agent should speak next
    let nextAgent = "Agent 1";
    if (conversation.length > 0) {
      const lastAgent = conversation[conversation.length - 1].agent;
      nextAgent = lastAgent === "Agent 1" ? "Agent 2" : "Agent 1";
    }

    let response;
    if (nextAgent === "Agent 1") {
      // Agent 1 responds
      response = await agent1.generateResponse(apiKey);
      if (typeof response === 'string' && !response.startsWith('Error')) {
        agent1.addMessage("assistant", response);
        agent2.addMessage("user", response);

        conversation.push({
          turn: currentTurn,
          agent: "Agent 1",
          message: response
        });
      } else {
        throw new Error(response);
      }
    } else {
      // Agent 2 responds
      response = await agent2.generateResponse(apiKey);
      if (typeof response === 'string' && !response.startsWith('Error')) {
        agent2.addMessage("assistant", response);
        agent1.addMessage("user", response);

        conversation.push({
          turn: currentTurn,
          agent: "Agent 2",
          message: response
        });
        
        nextAgent = "Agent 1";
      } else {
        throw new Error(response);
      }
    }

    return new Response(JSON.stringify({
      conversation: conversation,
      agent1_history: agent1.conversationHistory,
      agent2_history: agent2.conversationHistory,
      cancelled: false,
      next_agent: nextAgent
    }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });

  } catch (error) {
    console.error('Chat-single API error:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Failed to generate response',
      details: 'Please check your API key and try again'
    }), {
      status: 500,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
} 