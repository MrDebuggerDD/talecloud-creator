import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface Story {
  id: string;
  title: string;
  content: string[];
  images: string[];
  audioUrl?: string;
  createdAt: Date;
  genre: string;
  prompt: string;
  model?: string;
  imageModel?: string;
  voice?: string;
}

interface StoryContextType {
  currentStory: Story | null;
  savedStories: Story[];
  generateNewStory: (title: string, prompt: string, genre: string, length: string, model?: string, imageModel?: string) => Promise<void>;
  saveStory: (story: Story) => void;
  isGenerating: boolean;
}

const StoryContext = createContext<StoryContextType | undefined>(undefined);

export const useStory = () => {
  const context = useContext(StoryContext);
  if (!context) {
    throw new Error('useStory must be used within a StoryProvider');
  }
  return context;
};

export const StoryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentStory, setCurrentStory] = useState<Story | null>(null);
  const [savedStories, setSavedStories] = useState<Story[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const navigate = useNavigate();

  // Load saved stories from localStorage on initial render
  React.useEffect(() => {
    const savedStoriesFromStorage = localStorage.getItem('savedStories');
    if (savedStoriesFromStorage) {
      try {
        const parsedStories = JSON.parse(savedStoriesFromStorage);
        // Convert string dates back to Date objects
        const storiesWithDates = parsedStories.map((story: any) => ({
          ...story,
          createdAt: new Date(story.createdAt)
        }));
        setSavedStories(storiesWithDates);
      } catch (error) {
        console.error('Failed to parse saved stories:', error);
        toast.error('Failed to load saved stories');
      }
    }
  }, []);

  // Save stories to localStorage whenever they change
  React.useEffect(() => {
    if (savedStories.length > 0) {
      localStorage.setItem('savedStories', JSON.stringify(savedStories));
    }
  }, [savedStories]);

  const generateNewStory = async (
    title: string, 
    prompt: string, 
    genre: string, 
    length: string, 
    model: string = 'ollama-mistral',
    imageModel: string = 'replicate-sdxl'
  ) => {
    if (isGenerating) {
      toast.info('A story is already being generated');
      return;
    }
    
    setIsGenerating(true);
    
    try {
      toast.info('Generating your story...');
      
      // Import the service dynamically to avoid circular dependencies
      const { generateStory, generateImage } = await import('../services/OllamaService');
      
      console.log("Starting story generation with model:", model);
      console.log("Image generation with model:", imageModel);
      console.log("Story prompt:", prompt);
      
      // Generate content from the selected AI model
      const content = await generateStory(prompt, genre, length, model);
      
      console.log("Story content generated, length:", content.length);
      
      // Split content into paragraphs
      const paragraphs = content
        .split('\n\n')
        .filter(p => p.trim().length > 0);
      
      console.log("Paragraphs extracted:", paragraphs.length);
      
      // Generate images with more specific prompts from the content
      toast.info('Creating illustrations for your story...');
      
      // Determine how many images to generate based on story length
      const imageCount = Math.min(5, Math.max(2, Math.ceil(paragraphs.length / 3)));
      console.log("Generating", imageCount, "images");
      
      // Create specific image prompts based on key paragraphs
      const imagePrompts = [];
      
      // Add the main story prompt
      imagePrompts.push(prompt);
      
      // Extract key moments from the story for additional images
      if (paragraphs.length > 3) {
        // Get paragraphs from different parts of the story
        const middleIndex = Math.floor(paragraphs.length / 2);
        const endIndex = paragraphs.length - 1;
        
        // Add first paragraph content
        imagePrompts.push(paragraphs[0].substring(0, 200));
        
        // Add middle paragraph content if story is long enough
        if (paragraphs.length > 6) {
          imagePrompts.push(paragraphs[middleIndex].substring(0, 200));
        }
        
        // Add content near the end
        imagePrompts.push(paragraphs[endIndex].substring(0, 200));
      }
      
      // Fill remaining image prompts if needed
      while (imagePrompts.length < imageCount) {
        const randomIndex = Math.floor(Math.random() * paragraphs.length);
        imagePrompts.push(paragraphs[randomIndex].substring(0, 200));
      }
      
      // Only keep unique prompts up to the desired count
      const uniquePrompts = [...new Set(imagePrompts)].slice(0, imageCount);
      
      // Generate images in parallel
      const imagePromises = uniquePrompts.map(imagePrompt => generateImage(imagePrompt, genre, imageModel));
      const images = await Promise.all(imagePromises);
      
      console.log("Images generated:", images.length);
      
      // Use provided title or generate one from the content
      const storyTitle = title || `Story about ${prompt.slice(0, 20)}...`;
      
      // Create the story object
      const story: Story = {
        id: `story-${Date.now()}`,
        title: storyTitle,
        content: paragraphs,
        images: images,
        genre: genre,
        prompt: prompt,
        createdAt: new Date(),
        model: model,
        imageModel: imageModel,
        voice: 'adam' // Default voice
      };
      
      console.log("Story object created:", story.id);
      
      // Audio will be generated on the story page
      setCurrentStory(story);
      navigate(`/story/${story.id}`);
      toast.success('Your story has been created!');
    } catch (error) {
      console.error('Error generating story:', error);
      toast.error(`Failed to generate story: ${(error as Error).message || 'Please try again'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const saveStory = (story: Story) => {
    setSavedStories(prev => {
      // Check if story already exists and update it
      const existingStoryIndex = prev.findIndex(s => s.id === story.id);
      if (existingStoryIndex >= 0) {
        const updatedStories = [...prev];
        updatedStories[existingStoryIndex] = story;
        return updatedStories;
      }
      // Otherwise add as new story
      return [...prev, story];
    });
    
    // Also update currentStory if this is the current story
    if (currentStory && currentStory.id === story.id) {
      setCurrentStory(story);
    }
    
    toast.success('Story saved to library!');
  };

  const value = {
    currentStory,
    savedStories,
    generateNewStory,
    saveStory,
    isGenerating
  };

  return <StoryContext.Provider value={value}>{children}</StoryContext.Provider>;
};
