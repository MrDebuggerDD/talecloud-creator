
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
    // Check if Stable Diffusion API is available (this is a placeholder - in real implementation,
    // you would integrate with your local Stable Diffusion instance or a hosted API)
    console.log("Image generation requested for prompt:", prompt);
    
    // For now, return a placeholder image based on genre
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
    
    // Simulate delay for async operation
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return genreImageMap[genre] || genreImageMap.fantasy;
  } catch (error) {
    console.error("Error generating image:", error);
    throw new Error("Failed to generate image. Using placeholder image instead.");
  }
}

// New function for text-to-speech generation (currently a placeholder)
export const generateAudio = async (text: string, voice: string = "default"): Promise<string> => {
  console.log("Audio generation requested for text of length:", text.length);
  
  // This is a placeholder for future audio integration
  // In a real implementation, you would call a TTS API like ElevenLabs, Bark, or local TTS service
  
  // For now, return a placeholder audio URL
  return "";  // Empty string means no audio available yet
}
