
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
}

interface StoryContextType {
  currentStory: Story | null;
  savedStories: Story[];
  generateNewStory: (title: string, prompt: string, genre: string, length: string, model?: string) => Promise<void>;
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

  const generateNewStory = async (title: string, prompt: string, genre: string, length: string, model: string = 'ollama-mistral') => {
    if (isGenerating) {
      toast.info('A story is already being generated');
      return;
    }
    
    setIsGenerating(true);
    
    try {
      toast.info('Generating your story...');
      
      // Import the service dynamically to avoid circular dependencies
      const { generateStory, generateImage, generateAudio } = await import('../services/OllamaService');
      
      // Generate content from the selected AI model
      const content = await generateStory(prompt, genre, length, model);
      
      // Split content into paragraphs
      const paragraphs = content
        .split('\n\n')
        .filter(p => p.trim().length > 0);
      
      // Generate images (placeholder for now)
      const imageCount = Math.max(1, Math.ceil(paragraphs.length / 3));
      const imagePromises = Array(imageCount).fill('').map(() => generateImage(prompt, genre));
      
      // Use provided title or generate one from the content
      const storyTitle = title || `Story about ${prompt.slice(0, 20)}...`;
      
      // Create the story object
      const story: Story = {
        id: `story-${Date.now()}`,
        title: storyTitle,
        content: paragraphs,
        images: await Promise.all(imagePromises),
        genre: genre,
        prompt: prompt,
        createdAt: new Date(),
        model: model
      };
      
      // Try to generate audio (placeholder for future implementation)
      try {
        const firstParagraph = paragraphs[0] || '';
        const audioUrl = await generateAudio(firstParagraph);
        if (audioUrl) {
          story.audioUrl = audioUrl;
        }
      } catch (error) {
        console.error('Audio generation failed:', error);
        // Don't throw here, just continue without audio
      }
      
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
