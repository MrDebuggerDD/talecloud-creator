
import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import StoryDisplay from '@/components/story/StoryDisplay';
import { Button } from '@/components/ui/button';
import { useStory } from '@/context/StoryContext';
import { ChevronLeft, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const Story: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { currentStory, savedStories } = useStory();
  const navigate = useNavigate();
  
  // Find the story by id, first checking currentStory, then savedStories
  const story = currentStory?.id === id 
    ? currentStory 
    : savedStories.find(s => s.id === id);

  useEffect(() => {
    if (!story) {
      toast.error("Story not found");
    }
  }, [story]);

  if (!story) {
    return (
      <Layout>
        <div className="min-h-[70vh] flex flex-col items-center justify-center">
          <p className="text-xl text-gray-700 mb-6">Story not found</p>
          <Link to="/">
            <Button variant="outline">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </Layout>
    );
  }

  // Get related stories from the same genre (up to 3)
  const relatedStories = savedStories
    .filter(s => s.genre === story.genre && s.id !== story.id)
    .slice(0, 3);

  // Make sure we have at least placeholder images if needed
  const ensureImages = () => {
    if (!story.images || story.images.length === 0) {
      // Return local placeholder images instead of using Unsplash (which has issues)
      return ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"];
    }
    
    // Filter out invalid image URLs (empty strings, null, undefined)
    const validImages = story.images.filter(img => img && img.trim() !== "");
    
    if (validImages.length === 0) {
      // If all images were invalid, return placeholders
      return ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"];
    }
    
    return validImages;
  };

  const storyImages = ensureImages();

  // Display a placeholder card for related stories
  const renderRelatedStoryCard = (relatedStory: typeof story) => {
    const cardImage = relatedStory.images && relatedStory.images[0] 
      ? relatedStory.images[0] 
      : `/placeholder.svg`;
      
    return (
      <Link to={`/story/${relatedStory.id}`} key={relatedStory.id}>
        <div className="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow">
          <div className="h-40 relative bg-gray-100">
            <img 
              src={cardImage} 
              alt={relatedStory.title} 
              className="w-full h-40 object-cover"
              onError={(e) => {
                // On error, replace with local placeholder
                e.currentTarget.src = "/placeholder.svg";
              }}
            />
          </div>
          <div className="p-4">
            <h4 className="font-medium text-gray-900">{relatedStory.title}</h4>
          </div>
        </div>
      </Link>
    );
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="mb-6">
          <Link to="/">
            <Button variant="ghost" className="pl-0 text-tale-primary">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
        
        <StoryDisplay 
          title={story.title} 
          content={story.content} 
          images={storyImages} 
          audioUrl={story.audioUrl}
        />
        
        {relatedStories.length > 0 && (
          <div className="max-w-4xl mx-auto mt-12">
            <h3 className="text-xl font-semibold mb-4">More Like This</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {relatedStories.map(relatedStory => renderRelatedStoryCard(relatedStory))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Story;
