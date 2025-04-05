
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, Volume2, VolumeX, Save, Share2, Heart, Loader2, RefreshCw, Image } from 'lucide-react';
import { useStory } from '@/context/StoryContext';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { generateAudio, generateImage } from '@/services/OllamaService';

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
  const [audioLoaded, setAudioLoaded] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState("adam");
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imagesLoading, setImagesLoading] = useState<Record<number, boolean>>({});
  const [imagesError, setImagesError] = useState<Record<number, boolean>>({});

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { id } = useParams<{ id: string }>();
  const { currentStory, savedStories, saveStory } = useStory();

  const storyObj = currentStory?.id === id 
    ? currentStory 
    : savedStories.find(s => s.id === id);

  // Check if images are valid URLs
  useEffect(() => {
    const checkImages = () => {
      if (images && images.length > 0) {
        images.forEach((imgUrl, index) => {
          setImagesLoading(prev => ({ ...prev, [index]: true }));
          
          const img = new Image();
          img.onload = () => {
            setImagesLoading(prev => ({ ...prev, [index]: false }));
            setImagesError(prev => ({ ...prev, [index]: false }));
          };
          img.onerror = () => {
            setImagesLoading(prev => ({ ...prev, [index]: false }));
            setImagesError(prev => ({ ...prev, [index]: true }));
            console.error(`Failed to load image at index ${index}:`, imgUrl);
          };
          img.src = imgUrl;
        });
      }
    };
    
    checkImages();
  }, [images]);

  useEffect(() => {
    if (!audioUrl && content.length > 0 && !isGeneratingAudio) {
      handleGenerateAudio();
    }
  }, [content, audioUrl]);

  useEffect(() => {
    if (audioUrl) {
      if (audioRef.current) {
        audioRef.current.removeEventListener('timeupdate', updateProgress);
        audioRef.current.removeEventListener('ended', handleAudioEnded);
        audioRef.current.pause();
      }
      
      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      
      const handleCanPlayThrough = () => {
        console.log("Audio can play through");
        setAudioLoaded(true);
      };

      const handleAudioLoaded = () => {
        console.log("Audio loaded successfully");
        setAudioLoaded(true);
      };
      
      const handleAudioLoadError = (e: Event) => {
        console.error("Audio error:", e);
        setAudioError("Failed to load audio. Please try again.");
        setIsPlaying(false);
        setAudioLoaded(false);
        toast.error("Failed to play audio. Please try regenerating the audio.");
      };
      
      audio.addEventListener('timeupdate', updateProgress);
      audio.addEventListener('ended', handleAudioEnded);
      audio.addEventListener('error', handleAudioLoadError);
      audio.addEventListener('canplaythrough', handleCanPlayThrough);
      audio.addEventListener('loadeddata', handleAudioLoaded);
      
      audio.volume = volume;
      
      console.log("Audio element initialized with URL:", audioUrl);
      setAudioError(null);
      
      // Attempting preload
      audio.preload = "auto";
      
      // Force a load attempt
      audio.load();
      
      return () => {
        audio.removeEventListener('timeupdate', updateProgress);
        audio.removeEventListener('ended', handleAudioEnded);
        audio.removeEventListener('error', handleAudioLoadError);
        audio.removeEventListener('canplaythrough', handleCanPlayThrough);
        audio.removeEventListener('loadeddata', handleAudioLoaded);
        audio.pause();
        setIsPlaying(false);
      };
    }
  }, [audioUrl, volume]);

  const updateProgress = () => {
    if (audioRef.current) {
      const progress = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setAudioProgress(progress);
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
    setAudioProgress(0);
    
    if (currentParagraph < content.length - 1) {
      const nextParagraph = currentParagraph + 1;
      setCurrentParagraph(nextParagraph);
      
      handleGenerateAudio(nextParagraph);
    }
  };

  const handleGenerateAudio = async (paragraphIndex = currentParagraph) => {
    if (isGeneratingAudio) return;
    
    try {
      setIsGeneratingAudio(true);
      setAudioError(null);
      setAudioLoaded(false);
      toast.info("Generating audio narration...");
      
      const newAudioUrl = await generateAudio(content[paragraphIndex], selectedVoice);
      
      if (newAudioUrl) {
        setAudioUrl(newAudioUrl);
        setCurrentParagraph(paragraphIndex);
        
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
      setIsPlaying(false);
    } else {
      if (!audioLoaded) {
        toast.error("Audio is not ready to play. Please wait or try regenerating.");
        return;
      }
      
      audioRef.current.play().catch(error => {
        console.error("Error playing audio:", error);
        toast.error("Could not play audio. Please try again.");
      });
      setIsPlaying(true);
    }
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
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  const handleChangeVoice = (voice: string) => {
    setSelectedVoice(voice);
    if (content[currentParagraph]) {
      handleGenerateAudio(currentParagraph);
    }
  };

  const voices = [
    { id: "adam", name: "Adam (Male)" },
    { id: "antoni", name: "Antoni (Male)" },
    { id: "elli", name: "Elli (Female)" },
    { id: "bella", name: "Bella (Female)" },
    { id: "josh", name: "Josh (Male)" },
  ];

  const handleRegenerateImage = async (index: number) => {
    if (!storyObj || isGeneratingImage) return;
    
    setIsGeneratingImage(true);
    setCurrentImageIndex(index);
    setImagesLoading(prev => ({ ...prev, [index]: true }));
    setImagesError(prev => ({ ...prev, [index]: false }));
    
    try {
      toast.info("Regenerating image...");
      
      let imagePrompt = storyObj.prompt;
      
      if (content.length > 0) {
        const relatedParagraphIndex = index * 3;
        
        if (relatedParagraphIndex < content.length) {
          imagePrompt = content[relatedParagraphIndex].substring(0, 200);
        }
      }
      
      const newImage = await generateImage(imagePrompt, storyObj.genre);
      
      if (newImage) {
        const updatedImages = [...storyObj.images];
        updatedImages[index] = newImage;
        
        const updatedStory = {
          ...storyObj,
          images: updatedImages
        };
        
        saveStory(updatedStory);
        
        toast.success("Image regenerated successfully!");
      } else {
        throw new Error("Failed to generate image");
      }
    } catch (error) {
      console.error("Error regenerating image:", error);
      toast.error("Failed to regenerate image. Please try again.");
      setImagesError(prev => ({ ...prev, [index]: true }));
    } finally {
      setIsGeneratingImage(false);
      setImagesLoading(prev => ({ ...prev, [index]: false }));
    }
  };

  // Helper function to render image with loading/error states
  const renderImage = (imageUrl: string, index: number, alt: string) => {
    const isLoading = imagesLoading[index];
    const hasError = imagesError[index];
    
    if (isLoading || isGeneratingImage && currentImageIndex === index) {
      return (
        <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-10 w-10 animate-spin text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500 text-sm">Loading image...</p>
          </div>
        </div>
      );
    }
    
    if (hasError || !imageUrl || imageUrl.trim() === "") {
      return (
        <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <Image className="h-10 w-10 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500 text-sm">Image failed to load</p>
            <Button
              variant="secondary"
              size="sm"
              className="mt-2"
              onClick={() => handleRegenerateImage(index)}
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              Regenerate
            </Button>
          </div>
        </div>
      );
    }
    
    return (
      <div className="relative">
        <img 
          src={imageUrl} 
          alt={alt}
          className="w-full h-auto rounded-lg shadow-md" 
          loading="lazy"
        />
        <div className="absolute top-2 right-2">
          <Button
            variant="secondary"
            size="sm"
            className="bg-white bg-opacity-70 hover:bg-white"
            onClick={() => handleRegenerateImage(index)}
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            Regenerate
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">{title}</h1>
        
        <div className="mb-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            <label htmlFor="voice-select" className="text-sm text-gray-600">Voice:</label>
            <select
              id="voice-select"
              value={selectedVoice}
              onChange={(e) => handleChangeVoice(e.target.value)}
              className="text-sm border rounded px-2 py-1"
              disabled={isGeneratingAudio}
            >
              {voices.map(voice => (
                <option key={voice.id} value={voice.id}>{voice.name}</option>
              ))}
            </select>
            <Button
              variant="outline"
              size="sm"
              className="ml-2 p-1 h-8 w-8"
              onClick={() => handleGenerateAudio()}
              disabled={isGeneratingAudio}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
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
        
        {!audioLoaded && audioUrl && !audioError && (
          <div className="text-amber-500 mb-4 text-sm">
            <Loader2 className="h-4 w-4 inline-block animate-spin mr-1" />
            Loading audio... Please wait before playing.
          </div>
        )}
        
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
      
      <div className="paper-bg p-6 md:p-10 rounded-xl shadow-md">
        <div className="story-text prose max-w-none">
          {content.map((paragraph, index) => (
            <React.Fragment key={index}>
              {index > 0 && index % 3 === 0 && index / 3 - 1 < images.length && (
                <div className="my-8">
                  {renderImage(
                    images[Math.floor(index / 3) - 1], 
                    Math.floor(index / 3) - 1, 
                    `Illustration for "${title}" - scene ${Math.floor(index / 3)}`
                  )}
                  <p className="text-xs text-gray-500 mt-1 text-center italic">
                    Image generated from story content. Click "Regenerate" for a new version.
                  </p>
                </div>
              )}
              <p className={`${currentParagraph === index && isPlaying ? 'bg-tale-light bg-opacity-50 p-2 -m-2 rounded transition-all' : ''}`}>
                {paragraph}
              </p>
            </React.Fragment>
          ))}
          
          {content.length > 3 && Math.floor(content.length / 3) < images.length && (
            <div className="my-8">
              {renderImage(
                images[Math.floor(content.length / 3)], 
                Math.floor(content.length / 3), 
                `Final illustration for "${title}"`
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StoryDisplay;
