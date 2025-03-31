
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

export const generateStory = async (
  prompt: string,
  genre: string,
  length: string
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

    console.log("Calling Ollama with prompt:", fullPrompt.substring(0, 100) + "...");

    const request: OllamaRequest = {
      model: "mistral", // or llama3, gemma or any model you have in Ollama
      prompt: fullPrompt,
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
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    const data: OllamaResponse = await response.json();
    console.log("Story generated successfully");
    return data.response;
  } catch (error) {
    console.error("Error calling Ollama:", error);
    // Return a more user-friendly error message
    if ((error as Error).message?.includes("Failed to fetch")) {
      throw new Error("Could not connect to Ollama. Make sure Ollama is running on your computer.");
    }
    throw new Error(`Story generation failed: ${(error as Error).message || "Unknown error"}`);
  }
}

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

