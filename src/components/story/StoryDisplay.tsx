
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, Volume2, VolumeX, Save, Share2, Heart, Loader2, RefreshCw, ImageIcon } from 'lucide-react';
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
  const [selectedVoice, setSelectedVoice] = useState("adam");
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { id } = useParams<{ id: string }>();
  const { currentStory, savedStories, saveStory } = useStory();

  const storyObj = currentStory?.id === id 
    ? currentStory 
    : savedStories.find(s => s.id === id);

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
      
      audioRef.current = new Audio(audioUrl);
      
      audioRef.current.addEventListener('timeupdate', updateProgress);
      audioRef.current.addEventListener('ended', handleAudioEnded);
      audioRef.current.addEventListener('error', handleAudioError);
      audioRef.current.addEventListener('canplaythrough', handleCanPlayThrough);
      
      audioRef.current.volume = volume;
      
      console.log("Audio element initialized with URL:", audioUrl);
      setAudioError(null);
      
      return () => {
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
    } else {
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
    
    try {
      toast.info("Regenerating image...");
      
      let imagePrompt = storyObj.prompt || "";
      const imageModel = storyObj.imageModel || 'replicate-sd';
      
      if (content.length > 0) {
        const relatedParagraphIndex = Math.min(index * 3, content.length - 1);
        
        if (relatedParagraphIndex < content.length) {
          imagePrompt = content[relatedParagraphIndex].substring(0, 200);
        }
      }
      
      console.log("Regenerating image with model:", imageModel, "prompt:", imagePrompt);
      
      // Get the API key from localStorage to check if it exists
      const providerKeyMap: Record<string, string> = {
        'replicate-sd': 'replicate_api_key',
        'openai-dalle': 'openai_api_key',
        'stability-ai': 'stability_api_key',
      };
      
      const keyName = providerKeyMap[imageModel];
      const apiKey = keyName ? localStorage.getItem(keyName) : null;
      
      if (!apiKey && imageModel !== 'local-diffusion') {
        toast.error(`No API key found for ${imageModel}. Please add it in settings.`);
        setIsGeneratingImage(false);
        return;
      }
      
      const newImage = await generateImage(imagePrompt, storyObj.genre, imageModel);
      
      if (newImage && newImage.startsWith('http')) {
        console.log("New image generated:", newImage);
        const updatedImages = [...storyObj.images];
        updatedImages[index] = newImage;
        
        const updatedStory = {
          ...storyObj,
          images: updatedImages
        };
        
        saveStory(updatedStory);
        
        toast.success("Image regenerated successfully!");
      } else {
        toast.error("Failed to generate a new image");
      }
    } catch (error) {
      console.error("Error regenerating image:", error);
      toast.error("Failed to regenerate image. Please try again.");
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const isValidImageUrl = (url: string): boolean => {
    return !!url && url.trim() !== "" && url.startsWith("http");
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
              {index > 0 && index % 3 === 0 && images && images[Math.floor(index / 3) - 1] && (
                <div className="my-8 relative">
                  <img 
                    src={isValidImageUrl(images[Math.floor(index / 3) - 1]) ? 
                      images[Math.floor(index / 3) - 1] : 
                      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23"} 
                    alt={`Illustration for "${title}" - scene ${Math.floor(index / 3)}`}
                    className="w-full h-auto rounded-lg shadow-md" 
                    loading="lazy"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "https://images.unsplash.com/photo-1518709268805-4e9042af9f23";
                      console.error("Image failed to load, replaced with placeholder");
                    }}
                  />
                  <div className="absolute top-2 right-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="bg-white bg-opacity-70 hover:bg-white"
                      onClick={() => handleRegenerateImage(Math.floor(index / 3) - 1)}
                      disabled={isGeneratingImage && currentImageIndex === Math.floor(index / 3) - 1}
                    >
                      {isGeneratingImage && currentImageIndex === Math.floor(index / 3) - 1 ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <RefreshCw className="h-4 w-4" />
                      )}
                      <span className="ml-1">Regenerate</span>
                    </Button>
                  </div>
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
          
          {content.length > 3 && images && images[Math.floor(content.length / 3)] && (
            <div className="my-8 relative">
              <img 
                src={isValidImageUrl(images[Math.floor(content.length / 3)]) ? 
                  images[Math.floor(content.length / 3)] : 
                  "https://images.unsplash.com/photo-1518709268805-4e9042af9f23"} 
                alt={`Final illustration for "${title}"`}
                className="w-full h-auto rounded-lg shadow-md" 
                loading="lazy"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "https://images.unsplash.com/photo-1518709268805-4e9042af9f23";
                }}
              />
              <div className="absolute top-2 right-2">
                <Button
                  variant="secondary"
                  size="sm"
                  className="bg-white bg-opacity-70 hover:bg-white"
                  onClick={() => handleRegenerateImage(Math.floor(content.length / 3))}
                  disabled={isGeneratingImage && currentImageIndex === Math.floor(content.length / 3)}
                >
                  {isGeneratingImage && currentImageIndex === Math.floor(content.length / 3) ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4" />
                  )}
                  <span className="ml-1">Regenerate</span>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StoryDisplay;
