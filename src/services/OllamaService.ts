interface OllamaRequest {
  model: string;
  prompt: string;
  stream?: boolean;
  options?: {
    temperature?: number;
    top_k?: number;
    top_p?: number;
    max_tokens?: number;
  };
}

interface OllamaResponse {
  model: string;
  created_at: string;
  response: string;
  done: boolean;
}

interface ElevenLabsResponse {
  audioUrl: string;
}

// Environment configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:11434';
const USE_CLOUD_API = import.meta.env.VITE_USE_CLOUD_API === 'true';

export const generateStory = async (
  prompt: string,
  genre: string,
  length: string,
  model: string = 'ollama-mistral'
): Promise<string> => {
  try {
    const lengthMap: Record<string, number> = {
      short: 500,
      medium: 1000,
      long: 1500,
    };

    const maxTokens = lengthMap[length] || 1000;
    
    const systemPrompt = `You are a creative fiction writer specializing in ${genre} stories. 
    Write an engaging story based on the following prompt. 
    Make it approximately ${length} in length with vivid descriptions and compelling characters.
    Format the story in paragraphs separated by blank lines.
    Begin writing the story immediately without any introductions or meta-commentary.`;
    
    const fullPrompt = `${systemPrompt}\n\nPROMPT: ${prompt}`;

    console.log("Generating story with model:", model);
    console.log("Prompt:", fullPrompt.substring(0, 100) + "...");

    if (model.startsWith('ollama-')) {
      // Use local Ollama
      const ollamaModel = model.replace('ollama-', '');
      return await generateStoryFromLocalOllama(fullPrompt, maxTokens, ollamaModel);
    } else if (model.startsWith('openai-')) {
      // Use OpenAI
      return await generateStoryFromOpenAI(fullPrompt, maxTokens, model);
    } else if (model.startsWith('anthropic-')) {
      // Use Anthropic/Claude
      return await generateStoryFromClaude(fullPrompt, maxTokens, model);
    } else if (model.startsWith('deepseek-')) {
      // Use Deepseek
      return await generateStoryFromDeepseek(fullPrompt, maxTokens, model);
    } else if (model.startsWith('gemini-')) {
      // Use Gemini
      return await generateStoryFromGemini(fullPrompt, maxTokens, model);
    } else if (model.startsWith('mistral-')) {
      // Use Mistral AI
      return await generateStoryFromMistral(fullPrompt, maxTokens, model);
    } else {
      // Default to Ollama mistral
      return await generateStoryFromLocalOllama(fullPrompt, maxTokens, "mistral");
    }
  } catch (error) {
    console.error("Error generating story:", error);
    // Return a more user-friendly error message
    if ((error as Error).message?.includes("Failed to fetch")) {
      throw new Error("Could not connect to AI service. Please check your connection or try another AI model.");
    }
    throw new Error(`Story generation failed: ${(error as Error).message || "Unknown error"}`);
  }
};

// Function to generate story from local Ollama
const generateStoryFromLocalOllama = async (prompt: string, maxTokens: number, ollamaModel: string = "mistral"): Promise<string> => {
  const request: OllamaRequest = {
    model: ollamaModel, // or llama3, gemma or any model you have in Ollama
    prompt: prompt,
    options: {
      temperature: 0.7,
      top_p: 0.9,
      max_tokens: maxTokens
    }
  };

  const response = await fetch("http://localhost:11434/api/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    console.error("Ollama API error:", response.status, response.statusText);
    throw new Error(`Error: ${response.status} ${response.statusText}. Make sure Ollama is running and the model is installed.`);
  }

  const data: OllamaResponse = await response.json();
  console.log("Story generated successfully from local Ollama");
  return data.response;
};

// Function to generate story from OpenAI
const generateStoryFromOpenAI = async (prompt: string, maxTokens: number, modelId: string): Promise<string> => {
  const apiKey = localStorage.getItem('openai_api_key');
  
  if (!apiKey) {
    throw new Error("OpenAI API key is required. Please add it in settings.");
  }
  
  let model = "gpt-3.5-turbo";
  if (modelId === "openai-gpt-4o") {
    model = "gpt-4o";
  }
  
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: maxTokens,
        temperature: 0.7,
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`OpenAI API error: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    console.log("Story generated successfully from OpenAI API");
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Error with OpenAI story generation:", error);
    throw new Error(`OpenAI story generation failed: ${(error as Error).message}`);
  }
};

// Function to generate story from Claude/Anthropic
const generateStoryFromClaude = async (prompt: string, maxTokens: number, modelId: string): Promise<string> => {
  const apiKey = localStorage.getItem('claude_api_key');
  
  if (!apiKey) {
    throw new Error("Claude API key is required. Please add it in settings.");
  }
  
  let model = "claude-3-sonnet-20240229";
  if (modelId === "anthropic-claude-3.5") {
    model = "claude-3-5-sonnet-20240620";
  } else if (modelId === "anthropic-claude-3") {
    model = "claude-3-opus-20240229";
  }
  
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: maxTokens
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Claude API error: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    console.log("Story generated successfully from Claude API");
    return data.content[0].text;
  } catch (error) {
    console.error("Error with Claude story generation:", error);
    throw new Error(`Claude story generation failed: ${(error as Error).message}`);
  }
};

// Function to generate story from Deepseek
const generateStoryFromDeepseek = async (prompt: string, maxTokens: number, modelId: string): Promise<string> => {
  const apiKey = localStorage.getItem('deepseek_api_key');
  
  if (!apiKey) {
    throw new Error("Deepseek API key is required. Please add it in settings.");
  }
  
  try {
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: maxTokens
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Deepseek API error: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    console.log("Story generated successfully from Deepseek API");
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Error with Deepseek story generation:", error);
    throw new Error(`Deepseek story generation failed: ${(error as Error).message}`);
  }
};

// Function to generate story from Gemini
const generateStoryFromGemini = async (prompt: string, maxTokens: number, modelId: string): Promise<string> => {
  const apiKey = localStorage.getItem('gemini_api_key');
  
  if (!apiKey) {
    throw new Error("Gemini API key is required. Please add it in settings.");
  }
  
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          maxOutputTokens: maxTokens,
          temperature: 0.7
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Gemini API error: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    console.log("Story generated successfully from Gemini API");
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error("Error with Gemini story generation:", error);
    throw new Error(`Gemini story generation failed: ${(error as Error).message}`);
  }
};

// Function to generate story from Mistral AI
const generateStoryFromMistral = async (prompt: string, maxTokens: number, modelId: string): Promise<string> => {
  const apiKey = localStorage.getItem('mistral_api_key');
  
  if (!apiKey) {
    throw new Error("Mistral API key is required. Please add it in settings.");
  }
  
  try {
    const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "mistral-large-latest",
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: maxTokens
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Mistral API error: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    console.log("Story generated successfully from Mistral API");
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Error with Mistral story generation:", error);
    throw new Error(`Mistral story generation failed: ${(error as Error).message}`);
  }
};

export const generateImage = async (prompt: string, genre: string): Promise<string> => {
  try {
    console.log("Image generation requested for prompt:", prompt);
    
    // Get Stable Diffusion API key from localStorage
    const apiKey = localStorage.getItem('stable_diffusion_api_key');
    
    if (!apiKey) {
      console.warn("No Stable Diffusion API key found. Using placeholder image instead.");
      return getPlaceholderImage(genre);
    }
    
    try {
      // Create a concise prompt based on the story prompt and genre
      const imagePrompt = `${genre} style, ${prompt.substring(0, 200)}`;
      
      // Call Stable Diffusion API via Replicate
      const response = await fetch("https://api.replicate.com/v1/predictions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Token ${apiKey}`,
        },
        body: JSON.stringify({
          version: "39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b", // SD v2.1
          input: {
            prompt: imagePrompt,
            negative_prompt: "blurry, bad anatomy, extra limbs, deformed, disfigured, text, watermark",
            width: 768,
            height: 512,
            num_outputs: 1
          }
        }),
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Poll for the result (Replicate runs asynchronously)
      let imageUrl = await pollForResult(data.urls.get, apiKey);
      return imageUrl || getPlaceholderImage(genre);
      
    } catch (error) {
      console.error("Error with image generation API:", error);
      // Fallback to placeholder image if API fails
      return getPlaceholderImage(genre);
    }
  } catch (error) {
    console.error("Error generating image:", error);
    throw new Error("Failed to generate image. Using placeholder image instead.");
  }
}

// Helper function to poll for Replicate results
const pollForResult = async (resultUrl: string, apiKey: string): Promise<string> => {
  let attempts = 0;
  const maxAttempts = 30; // Timeout after 30 attempts (about 60 seconds)
  
  while (attempts < maxAttempts) {
    try {
      const response = await fetch(resultUrl, {
        headers: {
          "Authorization": `Token ${apiKey}`,
        },
      });
      
      if (!response.ok) {
        throw new Error(`Poll error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.status === "succeeded") {
        // Return the first generated image
        return data.output[0];
      } else if (data.status === "failed") {
        throw new Error("Image generation failed");
      }
      
      // Wait before trying again
      await new Promise(resolve => setTimeout(resolve, 2000));
      attempts++;
    } catch (error) {
      console.error("Error polling for image result:", error);
      return "";
    }
  }
  
  console.warn("Image generation timed out");
  return "";
}

// Fallback to placeholder images based on genre
const getPlaceholderImage = (genre: string): string => {
  const genreImageMap: Record<string, string> = {
    fantasy: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1684&q=80",
    "sci-fi": "https://images.unsplash.com/photo-1534447677768-be436bb09401?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80",
    mystery: "https://images.unsplash.com/photo-1580982327559-c1202864eb05?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80",
    romance: "https://images.unsplash.com/photo-1515166306582-9677cd204acb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1528&q=80",
    horror: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1528&q=80",
    adventure: "https://images.unsplash.com/photo-1566936737687-8f392a237b8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80",
    historical: "https://images.unsplash.com/photo-1461360370896-922624d12aa1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80",
    "fairy-tale": "https://images.unsplash.com/photo-1534447677768-be436bb09401?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80",
  };
  
  return genreImageMap[genre] || genreImageMap.fantasy;
}

export const generateAudio = async (text: string, voice: string = "onyx"): Promise<string> => {
  try {
    console.log("Audio generation requested for text of length:", text.length);
    
    // Get ElevenLabs API key from localStorage (temporary solution)
    const apiKey = localStorage.getItem('elevenlabs_api_key');
    
    if (!apiKey) {
      console.warn("No ElevenLabs API key found. Please add your API key in settings.");
      return "";
    }
    
    // Truncate text if it's too long (ElevenLabs has character limits)
    const truncatedText = text.length > 5000 ? text.substring(0, 5000) : text;
    
    const voiceId = getVoiceId(voice);
    const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`;
    
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "xi-api-key": apiKey,
      },
      body: JSON.stringify({
        text: truncatedText,
        model_id: "eleven_monolingual_v1",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.5,
        },
      }),
    });
    
    if (!response.ok) {
      throw new Error(`ElevenLabs API error: ${response.status} ${response.statusText}`);
    }
    
    // The response is the audio file itself
    const blob = await response.blob();
    const audioUrl = URL.createObjectURL(blob);
    
    return audioUrl;
  } catch (error) {
    console.error("Error generating audio:", error);
    return "";
  }
}

const getVoiceId = (voice: string): string => {
  const voiceMap: Record<string, string> = {
    onyx: "onyx", // Default male voice
    alloy: "alloy", // Default female voice
    echo: "echo", // Default neutral voice
    fable: "fable", // Child-like voice
    nova: "nova", // Expressive female voice
    shimmer: "shimmer", // Warm female voice
    // Premium voices
    rachel: "21m00Tcm4TlvDq8ikWAM", // Rachel
    domi: "AZnzlk1XvdvUeBnXmlld", // Domi
    bella: "EXAVITQu4vr4xnSDxMaL", // Bella
    antoni: "ErXwobaYiN019PkySvjV", // Antoni
    elli: "MF3mGyEYCl7XYWbV9V6O", // Elli
    josh: "TxGEqnHWrfWFTfGW9XjX", // Josh
    arnold: "VR6AewLTigWG4xSOukaG", // Arnold
    adam: "pNInz6obpgDQGcFmaJgB", // Adam
    sam: "yoZ06aMxZJJ28mfd3POQ", // Sam
  };
  
  return voiceMap[voice] || "onyx";
}
