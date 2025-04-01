
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, Volume2, VolumeX, Save, Share2, Heart, Loader2 } from 'lucide-react';
import { useStory } from '@/context/StoryContext';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { generateAudio } from '@/services/OllamaService';

interface StoryDisplayProps {
  title: string;
  content: string[];
  images: string[];
  audioUrl?: string;
}

const StoryDisplay: React.FC<StoryDisplayProps> = ({ title, content, images, audioUrl: initialAudioUrl }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [currentParagraph, setCurrentParagraph] = useState(0);
  const [audioProgress, setAudioProgress] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [audioUrl, setAudioUrl] = useState(initialAudioUrl || "");
  const [audioError, setAudioError] = useState<string | null>(null);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { id } = useParams<{ id: string }>();
  const { currentStory, savedStories, saveStory } = useStory();

  // Find the full story object
  const storyObj = currentStory?.id === id 
    ? currentStory 
    : savedStories.find(s => s.id === id);

  useEffect(() => {
    // If there's no audio URL but we have content, generate audio for the first paragraph
    if (!audioUrl && content.length > 0 && !isGeneratingAudio) {
      handleGenerateAudio();
    }
  }, [content, audioUrl]);

  useEffect(() => {
    // Initialize audio element
    if (audioUrl) {
      if (audioRef.current) {
        // Clean up previous audio instance
        audioRef.current.removeEventListener('timeupdate', updateProgress);
        audioRef.current.removeEventListener('ended', handleAudioEnded);
        audioRef.current.pause();
      }
      
      audioRef.current = new Audio(audioUrl);
      
      // Set up event listeners
      audioRef.current.addEventListener('timeupdate', updateProgress);
      audioRef.current.addEventListener('ended', handleAudioEnded);
      audioRef.current.addEventListener('error', handleAudioError);
      audioRef.current.addEventListener('canplaythrough', handleCanPlayThrough);
      
      // Set volume
      audioRef.current.volume = volume;
      
      console.log("Audio element initialized with URL:", audioUrl);
      setAudioError(null);
      
      return () => {
        // Clean up event listeners
        if (audioRef.current) {
          audioRef.current.removeEventListener('timeupdate', updateProgress);
          audioRef.current.removeEventListener('ended', handleAudioEnded);
          audioRef.current.removeEventListener('error', handleAudioError);
          audioRef.current.removeEventListener('canplaythrough', handleCanPlayThrough);
          audioRef.current.pause();
          setIsPlaying(false);
        }
      };
    }
  }, [audioUrl]);

  const handleCanPlayThrough = () => {
    console.log("Audio can play through");
  };

  const handleAudioError = (e: Event) => {
    console.error("Audio error:", e);
    setAudioError("Failed to load audio. Please try again.");
    setIsPlaying(false);
    toast.error("Failed to play audio. Please try regenerating the audio.");
  };

  // Handle audio progress updates
  const updateProgress = () => {
    if (audioRef.current) {
      const progress = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setAudioProgress(progress);
    }
  };

  // Handle audio end
  const handleAudioEnded = () => {
    setIsPlaying(false);
    setAudioProgress(0);
    
    // Auto-advance to next paragraph if available
    if (currentParagraph < content.length - 1) {
      const nextParagraph = currentParagraph + 1;
      setCurrentParagraph(nextParagraph);
      
      // Generate audio for the next paragraph
      handleGenerateAudio(nextParagraph);
    }
  };

  const handleGenerateAudio = async (paragraphIndex = 0) => {
    if (isGeneratingAudio) return;
    
    try {
      setIsGeneratingAudio(true);
      setAudioError(null);
      toast.info("Generating audio narration...");
      
      // Generate audio for the specified paragraph
      const newAudioUrl = await generateAudio(content[paragraphIndex], "onyx");
      
      if (newAudioUrl) {
        setAudioUrl(newAudioUrl);
        
        // If we have a story object, update it with the audio URL
        if (storyObj) {
          const updatedStory = {
            ...storyObj,
            audioUrl: newAudioUrl
          };
          saveStory(updatedStory);
          toast.success("Audio narration ready!");
        }
      } else {
        setAudioError("Failed to generate audio narration.");
        toast.error("Failed to generate audio narration.");
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      setAudioError(errorMessage);
      toast.error(`Error generating audio: ${errorMessage}`);
      console.error("Error generating audio:", error);
    } finally {
      setIsGeneratingAudio(false);
    }
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      // Check if the audio is ready before playing
      if (audioRef.current.readyState >= 2) {
        audioRef.current.play().catch(error => {
          console.error("Error playing audio:", error);
          toast.error("Could not play audio. Please try again.");
        });
      } else {
        toast.error("Audio is not ready to play. Please wait.");
        return;
      }
    }
    
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    
    if (isMuted) {
      audioRef.current.volume = volume;
    } else {
      audioRef.current.volume = 0;
    }
    
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (newVolume: number[]) => {
    if (!audioRef.current) return;
    
    const volumeValue = newVolume[0];
    audioRef.current.volume = volumeValue;
    setVolume(volumeValue);
    
    // Update mute state based on volume
    if (volumeValue === 0 && !isMuted) {
      setIsMuted(true);
    } else if (volumeValue > 0 && isMuted) {
      setIsMuted(false);
    }
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
        <div className="flex items-center justify-center gap-3 mb-6">
          <Button 
            onClick={audioError ? () => handleGenerateAudio() : togglePlay} 
            variant="outline" 
            className="rounded-full w-12 h-12 p-0 flex items-center justify-center"
            disabled={isGeneratingAudio || (!audioUrl && !audioError)}
          >
            {isGeneratingAudio ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : audioError ? (
              <Play className="h-5 w-5 text-red-500" />
            ) : isPlaying ? (
              <Pause className="h-5 w-5" />
            ) : (
              <Play className="h-5 w-5" />
            )}
          </Button>
          <div className="bg-gray-200 h-2 flex-1 max-w-md rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-300 ${audioError ? 'bg-red-400' : 'bg-tale-primary'}`}
              style={{ width: `${audioError ? 100 : audioProgress}%` }}
            ></div>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm"
              className="rounded-full w-8 h-8 p-0"
              onClick={toggleMute}
              disabled={!audioUrl || !!audioError}
            >
              {isMuted ? (
                <VolumeX className="h-4 w-4" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
            </Button>
            <Slider
              defaultValue={[0.7]}
              max={1}
              step={0.01}
              value={[volume]}
              onValueChange={handleVolumeChange}
              className="w-20"
              disabled={!audioUrl || !!audioError}
            />
          </div>
        </div>
        
        {audioError && (
          <div className="text-red-500 mb-4 text-sm">
            {audioError}
            <Button 
              variant="link" 
              className="text-sm text-red-600 underline ml-2"
              onClick={() => handleGenerateAudio()}
            >
              Try Again
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
              {index > 0 && index % 3 === 0 && images[(Math.floor(index / 3) - 1) % images.length] && (
                <div className="my-8">
                  <img 
                    src={images[(Math.floor(index / 3) - 1) % images.length]} 
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
