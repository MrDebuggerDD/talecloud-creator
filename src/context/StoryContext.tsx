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
}

interface StoryContextType {
  currentStory: Story | null;
  savedStories: Story[];
  generateNewStory: (title: string, prompt: string, genre: string, length: string) => Promise<void>;
  saveStory: (story: Story) => void;
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
      }
    }
  }, []);

  // Save stories to localStorage whenever they change
  React.useEffect(() => {
    if (savedStories.length > 0) {
      localStorage.setItem('savedStories', JSON.stringify(savedStories));
    }
  }, [savedStories]);

  const generateNewStory = async (title: string, prompt: string, genre: string, length: string) => {
    try {
      // Import the service dynamically to avoid circular dependencies
      const { generateStory, generateImage } = await import('../services/OllamaService');
      
      // Generate content from Ollama
      const content = await generateStory(prompt, genre, length);
      
      // Split content into paragraphs
      const paragraphs = content
        .split('\n\n')
        .filter(p => p.trim().length > 0);
      
      // Generate images (placeholder for now)
      const imageCount = Math.ceil(paragraphs.length / 3);
      const images = Array(imageCount).fill('').map(() => generateImage(prompt, genre));
      
      // Use provided title or generate one from the content
      const storyTitle = title || `Story - ${new Date().toLocaleDateString()}`;
      
      const story: Story = {
        id: `story-${Date.now()}`,
        title: storyTitle,
        content: paragraphs,
        images: await Promise.all(images),
        audioUrl: undefined, // Placeholder for future audio integration
        createdAt: new Date()
      };
      
      setCurrentStory(story);
      navigate(`/story/${story.id}`);
    } catch (error) {
      console.error('Error generating story:', error);
      toast.error('Failed to generate story. Please try again.');
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
    saveStory
  };

  return <StoryContext.Provider value={value}>{children}</StoryContext.Provider>;
};
