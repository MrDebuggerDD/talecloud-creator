
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Play, Pause, Volume2, Save, Share2, Heart } from 'lucide-react';
import { useStory } from '@/context/StoryContext';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';

interface StoryDisplayProps {
  title: string;
  content: string[];
  images: string[];
  audioUrl?: string;
}

const StoryDisplay: React.FC<StoryDisplayProps> = ({ title, content, images, audioUrl }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [currentParagraph, setCurrentParagraph] = useState(0);
  const { id } = useParams<{ id: string }>();
  const { currentStory, savedStories, saveStory } = useStory();

  // Find the full story object
  const storyObj = currentStory?.id === id 
    ? currentStory 
    : savedStories.find(s => s.id === id);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    // In a real implementation, this would control the audio playback
  };

  const toggleFavorite = () => {
    setIsFavorited(!isFavorited);
    if (storyObj) {
      saveStory(storyObj);
    }
  };

  const handleSave = () => {
    if (storyObj) {
      saveStory(storyObj);
      toast.success('Story saved successfully!');
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: title,
          text: 'Check out this amazing AI-generated story!',
          url: window.location.href,
        })
        .then(() => console.log('Successful share'))
        .catch((error) => console.log('Error sharing', error));
    } else {
      // Fallback
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Story Header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">{title}</h1>
        
        {/* Audio Controls */}
        {audioUrl && (
          <div className="flex items-center justify-center gap-3 mb-6">
            <Button 
              onClick={togglePlay} 
              variant="outline" 
              className="rounded-full w-12 h-12 p-0 flex items-center justify-center"
            >
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </Button>
            <div className="bg-gray-200 h-2 flex-1 max-w-md rounded-full overflow-hidden">
              <div 
                className="bg-tale-primary h-full rounded-full" 
                style={{ width: '30%' }}
              ></div>
            </div>
            <Button variant="ghost" className="rounded-full w-10 h-10 p-0">
              <Volume2 className="h-5 w-5" />
            </Button>
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-2">
          <Button variant="outline" size="sm" onClick={toggleFavorite}>
            <Heart className={`h-4 w-4 mr-1 ${isFavorited ? 'fill-red-500 text-red-500' : ''}`} /> 
            {isFavorited ? 'Favorited' : 'Favorite'}
          </Button>
          <Button variant="outline" size="sm" onClick={handleSave}>
            <Save className="h-4 w-4 mr-1" /> Save
          </Button>
          <Button variant="outline" size="sm" onClick={handleShare}>
            <Share2 className="h-4 w-4 mr-1" /> Share
          </Button>
        </div>
      </div>
      
      {/* Story Content */}
      <div className="paper-bg p-6 md:p-10 rounded-xl shadow-md">
        <div className="story-text prose max-w-none">
          {content.map((paragraph, index) => (
            <React.Fragment key={index}>
              {index > 0 && index % 3 === 0 && images[Math.floor(index / 3) - 1] && (
                <div className="my-8">
                  <img 
                    src={images[Math.floor(index / 3) - 1]} 
                    alt={`Illustration for ${title}`}
                    className="w-full h-auto rounded-lg shadow-md" 
                  />
                </div>
              )}
              <p className={`${currentParagraph === index && isPlaying ? 'bg-tale-light bg-opacity-50 p-2 -m-2 rounded transition-all' : ''}`}>
                {paragraph}
              </p>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StoryDisplay;
