
import React from 'react';
import { useParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import StoryDisplay from '@/components/story/StoryDisplay';
import { Loader2 } from 'lucide-react';
import { useStory } from '@/context/StoryContext';

const Story: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { currentStory, savedStories } = useStory();
  
  // Find the story by id, first checking currentStory, then savedStories
  const story = currentStory?.id === id 
    ? currentStory 
    : savedStories.find(s => s.id === id);

  if (!story) {
    return (
      <Layout>
        <div className="min-h-[70vh] flex flex-col items-center justify-center">
          <p className="text-xl text-gray-700">Story not found</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 md:py-12">
        <StoryDisplay 
          title={story.title} 
          content={story.content} 
          images={story.images} 
          audioUrl={story.audioUrl}
        />
        
        <div className="max-w-4xl mx-auto mt-12">
          <h3 className="text-xl font-semibold mb-4">More Like This</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {/* This would be populated with related story cards */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1534447677768-be436bb09401?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80" 
                alt="Related story" 
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h4 className="font-medium text-gray-900">Whispers of the Stars</h4>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1515166306582-9677cd204acb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1528&q=80" 
                alt="Related story" 
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h4 className="font-medium text-gray-900">The Last Guardian</h4>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Story;
