
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import StoryDisplay from '@/components/story/StoryDisplay';
import { Loader2 } from 'lucide-react';

const Story: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [story, setStory] = useState<{
    title: string;
    content: string[];
    images: string[];
    audioUrl?: string;
  } | null>(null);

  // Simulating API fetch for a story
  useEffect(() => {
    // This would normally be an API call
    setTimeout(() => {
      // Mock story data
      const mockStory = {
        title: "The Crystal Caverns",
        content: [
          "Deep beneath the mountain, where sunlight never touched and shadows danced with ancient magic, Elara found herself standing at the entrance of a cavern unlike any she had ever seen. Crystals of every color jutted from the walls, ceiling, and floor, casting prismatic light across the chamber. The air was thick with mystery, a tangible force that seemed to whisper secrets from the dawn of time.",
          "Elara adjusted the strap of her leather satchel, its weight a comfort against her hip. Inside lay her grandmother's journal, filled with sketches and notes about these legendary caves—the Crystal Caverns that few believed existed. But Elara had always believed. Even when the villagers mocked her family's tales, even when her own father dismissed them as fantasy, she had known the truth.",
          "\"Hello?\" she called, her voice reverberating through the vast chamber. No response came except the gentle tinkling of crystals as they vibrated with her voice. She withdrew her lantern, though it seemed almost unnecessary amid the glow of the formations surrounding her.",
          "As she ventured deeper, the crystals began to change. No longer were they simply reflecting light—they were pulsing with it. Throbbing like heartbeats, each crystal seemed alive in some fundamental way that Elara couldn't explain. She reached out hesitantly, her fingers hovering just above the surface of a particularly large amethyst formation.",
          "The moment her skin made contact, a jolt of energy coursed through her body. Images flooded her mind: soaring mountains, rushing rivers, blooming flowers, all moving at impossible speed. She gasped and pulled away, but the connection wasn't severed. Instead, it seemed to strengthen, the crystal's light intensifying as it focused on her.",
          "\"You have returned,\" a voice echoed in her mind, ancient and powerful. \"The last of the Crystal Keepers.\"",
          "Elara stumbled backward, nearly losing her footing on the uneven ground. \"I'm not—I don't—who are you?\" she stammered, eyes darting around the chamber for the source of the voice.",
          "\"We are the Guardians,\" the voice replied, now seeming to emanate from all the crystals at once. \"We have waited centuries for the bloodline to return. For you, Elara.\"",
          "Her heart pounded. How did they know her name? Was this what her grandmother had discovered before disappearing ten years ago? Elara had been only a child then, but she remembered the promises her grandmother had made: that one day, Elara would understand everything.",
          "\"My grandmother,\" Elara whispered, \"did she come here?\"",
          "In response, the light from the crystals shifted, coalescing into a human form before her—the translucent, glowing figure of an elderly woman with familiar kind eyes and a resolute expression. Her grandmother, rendered in pure crystal light.",
          "\"She never left,\" the crystal chorus replied. \"She became one with us, as all Keepers eventually must. And now, Elara, it is your turn to learn. To see the truth of the world through our light, and to help us maintain the balance that keeps darkness at bay.\"",
          "Elara's hand instinctively went to her grandmother's journal. All these years, she had thought she was chasing a mystery, following clues to understand what had happened. But now she realized: she hadn't been following the breadcrumbs her grandmother left behind—she had been answering a call that sang in her very blood.",
          "\"I don't understand,\" she said, though a part of her did. A part of her had always known she was different, that she could sometimes see things others couldn't, feel energies that no one else seemed aware of.",
          "The crystalline form of her grandmother smiled, reaching out a hand that wasn't quite solid. \"You will, my dear. The Caverns have much to teach you. Your journey—your real journey—begins now.\"",
          "As if in response to these words, the entire cavern began to glow brighter, the crystals humming with energy that Elara could feel vibrating through the ground beneath her feet. Passages that had been shrouded in darkness now revealed themselves, leading deeper into the mountain, promising wonders and knowledge beyond imagining.",
          "Elara took a deep breath, squaring her shoulders as she made her decision. She had come looking for answers about her grandmother. Instead, she had found her destiny. With one hand clutching the precious journal and the other extended toward the light, she took her first step forward as the last of the Crystal Keepers, into a world of magic that had been waiting for her all along.",
        ],
        images: [
          "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1684&q=80",
          "https://images.unsplash.com/photo-1566936737687-8f392a237b8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80",
          "https://images.unsplash.com/photo-1580982327559-c1202864eb05?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80",
        ],
        audioUrl: "#" // This would be a real audio URL in a full implementation
      };

      if (id === "1") {
        setStory(mockStory);
      } else {
        // Handle case where story isn't found
      }
      
      setLoading(false);
    }, 1500);
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <div className="min-h-[70vh] flex flex-col items-center justify-center">
          <Loader2 className="h-12 w-12 text-tale-primary animate-spin mb-4" />
          <p className="text-gray-600">Loading your magical story...</p>
        </div>
      </Layout>
    );
  }

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
