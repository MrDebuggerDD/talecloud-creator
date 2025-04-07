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
const USE_CLOUD_API = true; // Force cloud API mode since we have keys

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
    Begin writing the story immediately without any introductions or meta-commentary.
    IMPORTANT: Make sure the story is unique and specific to the prompt. DO NOT reuse story structure or elements.`;
    
    const fullPrompt = `${systemPrompt}\n\nPROMPT: ${prompt}`;

    console.log("Generating story with model:", model);
    console.log("Prompt:", fullPrompt.substring(0, 100) + "...");
    console.log("Using Cloud API mode");

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
      // Default to OpenAI since we have cloud API enabled and keys set
      console.log("No specific model matched, defaulting to OpenAI GPT-3.5");
      return await generateStoryFromOpenAI(fullPrompt, maxTokens, "openai-gpt-3.5");
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
  // Use a default OpenAI API key for demo purposes if not set
  const apiKey = localStorage.getItem('openai_api_key');
  
  if (!apiKey) {
    console.warn("No OpenAI API key found. Using fallback model.");
    return generateFallbackStory(prompt);
  }
  
  let model = "gpt-3.5-turbo";
  if (modelId === "openai-gpt-4o") {
    model = "gpt-4o";
  }
  
  try {
    console.log("Calling OpenAI API with model:", model);
    
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
      console.error("OpenAI API error details:", errorData);
      throw new Error(`OpenAI API error: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    console.log("Story generated successfully from OpenAI API");
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Error with OpenAI story generation:", error);
    return generateFallbackStory(prompt);
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

const generateFallbackStory = (prompt: string): string => {
  console.warn("Using fallback story generation");
  
  // Extract potential characters or themes from the prompt
  const words = prompt.split(' ');
  const characters = words.filter(word => word.length > 5).slice(0, 2);
  const character = characters.length > 0 ? characters[0] : "protagonist";
  
  return `Once upon a time, there was a ${character} who embarked on an extraordinary journey.
  
  The world was full of wonder and mystery, and our hero was determined to explore it all.
  
  Through forests deep and mountains high, across rushing rivers and vast plains, the adventure continued.
  
  Along the way, friendships were formed, challenges were overcome, and valuable lessons were learned.
  
  And though the path wasn't always clear, the journey itself proved to be the greatest treasure of all.
  
  In the end, returning home with stories to tell and wisdom to share, our hero found that the greatest adventures often lead us back to ourselves, forever changed by the paths we've walked.`;
};

export const generateImage = async (prompt: string, genre: string, imageModel: string = 'replicate-sd'): Promise<string> => {
  try {
    console.log("Image generation requested for prompt:", prompt);
    console.log("Using image model:", imageModel);
    
    // Handle different image generation services based on the selected model
    if (imageModel === 'replicate-sd') {
      return await generateImageWithReplicate(prompt, genre);
    } else if (imageModel === 'openai-dalle') {
      return await generateImageWithOpenAI(prompt, genre);
    } else if (imageModel === 'stability-ai') {
      return await generateImageWithStabilityAI(prompt, genre);
    } else if (imageModel === 'local-diffusion') {
      return await generateImageWithLocalDiffusion(prompt, genre);
    } else {
      // Default to Replicate if the model is not recognized
      console.warn("Unknown image model, defaulting to Replicate Stable Diffusion");
      return await generateImageWithReplicate(prompt, genre);
    }
  } catch (error) {
    console.error("Error generating image:", error);
    return getPlaceholderImage(genre);
  }
}

// Generate image with Replicate API (Stable Diffusion)
const generateImageWithReplicate = async (prompt: string, genre: string): Promise<string> => {
  try {
    // Get API key from localStorage
    const apiKey = localStorage.getItem('replicate_api_key');
    
    if (!apiKey) {
      console.warn("No Replicate API key found. Using placeholder image instead.");
      return getPlaceholderImage(genre);
    }
    
    // Create a more detailed and specific prompt based on the story prompt and genre
    const styleMap: Record<string, string> = {
      fantasy: "fantasy art style, magical, mystical, detailed fantasy environment",
      "sci-fi": "science fiction style, futuristic, high-tech, cinematic lighting",
      mystery: "dark atmospheric style, moody lighting, noir aesthetic, mysterious",
      romance: "romantic style, soft lighting, warm colors, emotional scene",
      horror: "horror style, dark, eerie, unsettling, atmospheric horror scene",
      adventure: "adventure style, dynamic, epic landscape, dramatic lighting",
      historical: "historical style, period accurate details, vintage aesthetic",
      "fairy-tale": "fairy tale style, enchanted, whimsical, storybook illustration"
    };
    
    const stylePrompt = styleMap[genre] || styleMap.fantasy;
    const enhancedPrompt = `${stylePrompt}, ${prompt.substring(0, 200)}`;
    
    console.log("Calling Replicate API with enhanced prompt:", enhancedPrompt);
    console.log("Using Replicate API key:", apiKey.substring(0, 5) + "..." + apiKey.substring(apiKey.length - 5));
    
    // First try: Direct call to Replicate API
    try {
      // Call Stable Diffusion API via Replicate with improved parameters
      const response = await fetch("https://api.replicate.com/v1/predictions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Token ${apiKey}`,
        },
        body: JSON.stringify({
          version: "39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b", // SD v2.1
          input: {
            prompt: enhancedPrompt,
            negative_prompt: "blurry, bad anatomy, extra limbs, deformed, disfigured, text, watermark, signature, low quality, pixelated",
            width: 768,
            height: 512,
            num_outputs: 1,
            guidance_scale: 7.5,
            num_inference_steps: 30,
            seed: Math.floor(Math.random() * 1000000)
          }
        }),
      });
      
      if (!response.ok) {
        console.error("Replicate API error status:", response.status);
        const errorText = await response.text();
        console.error("Replicate API error:", errorText);
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Replicate prediction started:", data.id);
      
      // Poll for the result (Replicate runs asynchronously)
      let imageUrl = await pollForResult(data.urls.get, apiKey);
      console.log("Generated image URL:", imageUrl);
      
      if (!imageUrl) {
        console.warn("Failed to get image URL from Replicate. Using placeholder instead.");
        return getPlaceholderImage(genre);
      }
      
      return imageUrl;
    } catch (fetchError) {
      console.error("Fetch error during Replicate API call:", fetchError);
      
      // Try a different public API as a fallback
      console.log("Trying alternative image generation API...");
      
      try {
        const huggingfaceApiKey = "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"; // A public demo key for this app
        const fallbackUrl = `https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5`;
        
        const fallbackResponse = await fetch(fallbackUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${huggingfaceApiKey}`
          },
          body: JSON.stringify({ inputs: enhancedPrompt }),
        });
        
        if (!fallbackResponse.ok) {
          throw new Error(`Fallback API error: ${fallbackResponse.status}`);
        }
        
        const blob = await fallbackResponse.blob();
        return URL.createObjectURL(blob);
      } catch (fallbackError) {
        console.error("Fallback API also failed:", fallbackError);
        return getPlaceholderImage(genre);
      }
    }
  } catch (error) {
    console.error("Error with Replicate generation:", error);
    return getPlaceholderImage(genre);
  }
};

// Generate image with OpenAI DALL-E
const generateImageWithOpenAI = async (prompt: string, genre: string): Promise<string> => {
  try {
    const apiKey = localStorage.getItem('openai_api_key');
    
    if (!apiKey) {
      console.warn("No OpenAI API key found. Using placeholder image instead.");
      return getPlaceholderImage(genre);
    }
    
    // Create a more detailed prompt based on genre
    const styleMap: Record<string, string> = {
      fantasy: "fantasy style with magical elements",
      "sci-fi": "futuristic sci-fi scene",
      mystery: "mysterious noir scene",
      romance: "romantic scene with soft lighting",
      horror: "unsettling horror scene",
      adventure: "epic adventure scene",
      historical: "detailed historical scene",
      "fairy-tale": "whimsical fairy tale illustration"
    };
    
    const stylePrompt = styleMap[genre] || '';
    const enhancedPrompt = `${prompt}. ${stylePrompt}`;
    
    console.log("Calling DALL-E API with prompt:", enhancedPrompt);
    
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "dall-e-3",
        prompt: enhancedPrompt,
        n: 1,
        size: "1024x1024",
        quality: "standard",
        response_format: "url"
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`OpenAI API error: ${errorData.error?.message || response.statusText}`);
    }
    
    const data = await response.json();
    return data.data[0].url;
    
  } catch (error) {
    console.error("Error with OpenAI image generation:", error);
    return getPlaceholderImage(genre);
  }
};

// Generate image with Stability AI
const generateImageWithStabilityAI = async (prompt: string, genre: string): Promise<string> => {
  try {
    const apiKey = localStorage.getItem('stability_api_key');
    
    if (!apiKey) {
      console.warn("No Stability AI API key found. Using placeholder image instead.");
      return getPlaceholderImage(genre);
    }
    
    // Create enhanced prompt similar to other providers
    const styleMap: Record<string, string> = {
      fantasy: "fantasy art style, magical, mystical",
      "sci-fi": "science fiction style, futuristic, high-tech",
      mystery: "dark atmospheric style, moody lighting, noir aesthetic",
      romance: "romantic style, soft lighting, warm colors",
      horror: "horror style, dark, eerie, unsettling",
      adventure: "adventure style, dynamic, epic landscape",
      historical: "historical style, period accurate details",
      "fairy-tale": "fairy tale style, enchanted, whimsical"
    };
    
    const stylePrompt = styleMap[genre] || '';
    const enhancedPrompt = `${prompt}. ${stylePrompt}`;
    
    console.log("Calling Stability AI API with prompt:", enhancedPrompt);
    
    const response = await fetch('https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        text_prompts: [
          {
            text: enhancedPrompt,
            weight: 1
          },
          {
            text: "blurry, bad anatomy, extra limbs, deformed, disfigured, text, watermark, signature, low quality",
            weight: -1
          }
        ],
        cfg_scale: 7,
        height: 1024,
        width: 1024,
        samples: 1,
        steps: 30
      })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Stability AI API error: ${errorText}`);
    }
    
    const responseJSON = await response.json();
    
    // Base64 decode and create URL
    const base64Image = responseJSON.artifacts[0].base64;
    const blob = await fetch(`data:image/png;base64,${base64Image}`).then(res => res.blob());
    return URL.createObjectURL(blob);
    
  } catch (error) {
    console.error("Error with Stability AI image generation:", error);
    return getPlaceholderImage(genre);
  }
};

// Generate image with Midjourney API (placeholder, since Midjourney doesn't have a direct API)
const generateImageWithMidjourney = async (prompt: string, genre: string): Promise<string> => {
  try {
    const apiKey = localStorage.getItem('midjourney_api_key');
    
    if (!apiKey) {
      console.warn("No Midjourney API key found. Using placeholder image instead.");
      return getPlaceholderImage(genre);
    }
    
    // This is a placeholder. In a real implementation, you would 
    // use a third-party service that provides access to Midjourney
    console.log("Midjourney API not directly available. Using placeholder.");
    
    // For now, just return a placeholder image
    return getPlaceholderImage(genre);
    
  } catch (error) {
    console.error("Error with Midjourney image generation:", error);
    return getPlaceholderImage(genre);
  }
};

// Generate image with local Ollama (using a Diffusion model)
const generateImageWithLocalDiffusion = async (prompt: string, genre: string): Promise<string> => {
  try {
    // Using local Ollama for diffusion models
    console.log("Using local Ollama for image generation:", prompt);
    
    // Create a stylized prompt similar to other services
    const styleMap: Record<string, string> = {
      fantasy: "fantasy art style, magical, mystical",
      "sci-fi": "science fiction style, futuristic, high-tech",
      mystery: "dark atmospheric style, moody lighting, noir aesthetic",
      romance: "romantic style, soft lighting, warm colors",
      horror: "horror style, dark, eerie, unsettling",
      adventure: "adventure style, dynamic, epic landscape",
      historical: "historical style, period accurate details",
      "fairy-tale": "fairy tale style, enchanted, whimsical"
    };
    
    const stylePrompt = styleMap[genre] || '';
    const enhancedPrompt = `${prompt}. ${stylePrompt}`;
    
    // Call to Ollama running locally with a diffusion model
    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "sdxl", // Assuming the SDXL model is installed in Ollama
        prompt: enhancedPrompt,
        stream: false,
        format: "png"
      }),
    });
    
    if (!response.ok) {
      console.error("Ollama diffusion API error:", response.status);
      throw new Error("Failed to generate image with local Ollama. Make sure the SDXL model is installed.");
    }
    
    // Response should be binary image data
    const blob = await response.blob();
    return URL.createObjectURL(blob);
    
  } catch (error) {
    console.error("Error with local diffusion image generation:", error);
    return getPlaceholderImage(genre);
  }
};

// Helper function to poll for Replicate results
const pollForResult = async (resultUrl: string, apiKey: string): Promise<string> => {
  let attempts = 0;
  const maxAttempts = 30; // Timeout after 30 attempts (about 60 seconds)
  
  while (attempts < maxAttempts) {
    try {
      console.log(`Polling attempt ${attempts + 1}/${maxAttempts} for result...`);
      const response = await fetch(resultUrl, {
        headers: {
          "Authorization": `Token ${apiKey}`,
        },
      });
      
      if (!response.ok) {
        console.error(`Poll response not OK: ${response.status}`, response.statusText);
        throw new Error(`Poll error: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Poll attempt", attempts, "status:", data.status);
      
      if (data.status === "succeeded") {
        // Return the first generated image
        console.log("Image generation succeeded, output:", data.output);
        return data.output[0];
      } else if (data.status === "failed") {
        console.error("Image generation failed, error:", data.error);
        throw new Error(`Image generation failed: ${data.error || "Unknown error"}`);
      }
      
      // Wait before trying again (increasing delay to avoid rate limits)
      const delay = Math.min(2000 + attempts * 500, 5000);
      await new Promise(resolve => setTimeout(resolve, delay));
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
    
    // Get ElevenLabs API key from localStorage
    const apiKey = localStorage.getItem('elevenlabs_api_key');
    
    if (!apiKey) {
      console.warn("No ElevenLabs API key found. Please add your API key in settings.");
      throw new Error("No ElevenLabs API key found. Please add your API key in settings.");
    }
    
    // Truncate text if it's too long (ElevenLabs has character limits)
    const truncatedText = text.length > 5000 ? text.substring(0, 5000) : text;
    
    const voiceId = getVoiceId(voice);
    const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`;
    
    console.log("Calling ElevenLabs API with voice:", voice, "voiceId:", voiceId);
    
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
      const errorText = await response.text();
      console.error(`ElevenLabs API error: ${response.status} ${response.statusText}`, errorText);
      throw new Error(`ElevenLabs API error: ${response.status} ${response.statusText}`);
    }
    
    // The response is the audio file itself
    const blob = await response.blob();
    const audioUrl = URL.createObjectURL(blob);
    return audioUrl;
  } catch (error) {
    console.error("Error generating audio:", error);
    throw new Error(`Audio generation failed: ${(error as Error).message || "Unknown error"}`);
  }
};

// Helper function to map voice names to ElevenLabs voice IDs
const getVoiceId = (voice: string): string => {
  const voiceMap: Record<string, string> = {
    adam: "pNInz6obpgDQGcFmaJgB", // Adam
    antoni: "ErXwobaYiN019PkySvjV", // Antoni
    bella: "EXAVITQu4vr4xnSDxMaL", // Bella
    elli: "MF3mGyEYCl7XYWbV9V6O", // Elli
    josh: "TxGEqnHWrfWFTfGW9XjX", // Josh
    rachel: "21m00Tcm4TlvDq8ikWAM", // Rachel
    sam: "yoZ06aMxZJJ28mfd3POQ", // Sam
    domi: "AZnzlk1XvdvUeBnXmlld", // Domi
    onyx: "IKne3meq5aSn9XLyUdCD", // Onyx
    default: "IKne3meq5aSn9XLyUdCD" // Default to Onyx
  };
  
  return voiceMap[voice] || voiceMap.default;
};
