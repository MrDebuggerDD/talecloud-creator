// Import necessary modules and types
// import { Configuration, OpenAIApi } from "openai";
// import Replicate from "replicate";

// Cache for generated content to avoid redundant API calls
const contentCache = new Map<string, string>();

// Function to generate story content using AI
export const generateStory = async (
  prompt: string,
  genre: string,
  length: string,
  model: string = 'ollama-mistral'
) => {
  // Check if we have a cached response
  const cacheKey = `${prompt}-${genre}-${length}-${model}`;
  if (contentCache.has(cacheKey)) {
    return contentCache.get(cacheKey)!;
  }

  // For demo purposes, using placeholder stories
  const demoStories = {
    fantasy: `In the ancient kingdom of Eldoria, where magic flowed like rivers and dragons soared through the twilight skies, there lived a young apprentice named Lyra. Unlike the other students in the Academy of Arcane Arts, Lyra possessed a unique ability—she could hear the whispers of ancient artifacts, objects that held centuries of memories and secrets.

One stormy evening, while organizing the academy's relic chamber, Lyra's fingers brushed against a tarnished silver amulet. Immediately, voices flooded her mind—urgent, desperate warnings of a forgotten threat stirring in the mountains beyond the kingdom's borders.

The Shadowblight, an ancient darkness that had been sealed away generations ago, was awakening. According to the amulet's memories, only someone who could hear the voices of the past could navigate the treacherous path to the sealing grounds and restore the magical barriers before the darkness escaped completely.

Against the wishes of her mentors, Lyra slipped away from the academy under the cover of darkness, the amulet hanging around her neck. Her journey would take her through enchanted forests where trees moved and whispered, across floating islands held aloft by ancient spells, and into the heart of the mountains where the very stones resonated with old magic.

Along the way, she gained unlikely companions: Thorne, a gruff forest guardian with bark-like skin who could command the plants around him; Elarion, a scholarly ghost bound to a magical tome, seeking a way to finally pass beyond the veil; and Kip, a small, mischievous wind spirit who could transform into a magnificent clouded leopard when the moon was bright.

Each companion brought unique skills and knowledge, but also carried their own burdens and secrets. Thorne had failed to protect his forest from a previous incursion of the Shadowblight and sought redemption. Elarion had been a mage who helped create the original seal, but something had gone wrong, trapping him between life and death. Kip had lost their entire spirit clan to the darkness and was the last of their kind.

As they journeyed deeper into the mountains, they faced trials that tested not only their magical abilities but also their trust in one another. The Shadowblight sent corrupted creatures to stop them—twisted beasts with shadows for hearts and eyes that gleamed with malevolent intelligence.

In the final confrontation at the ancient sealing grounds, Lyra discovered that the original seal had been created through a great sacrifice—the life force of hundreds of voluntary mages. The seal was weakening because their memories and stories were being forgotten by the kingdom they had died to protect.

Drawing upon her unique gift, Lyra connected with the fading spirits of the ancient mages. Instead of recreating the old seal, she found a new way—by becoming a conduit for their stories, preserving their memories and channeling their residual magic into a new kind of barrier, one built on remembrance rather than sacrifice.

As dawn broke over the mountains, the Shadowblight receded, bound once more—not by chains of magic, but by the unbreakable bonds of stories remembered and honored. Lyra and her companions returned to Eldoria not as saviors to be worshipped from afar, but as chroniclers, sharing the tales of the forgotten heroes and teaching others the power of memory and storytelling.

The amulet, its purpose fulfilled, became an ordinary silver pendant, a reminder that the most powerful magic often lies not in grand spells or legendary artifacts, but in the simple act of listening to the voices that others have forgotten.`,
    "sci-fi": `In the stratified megacity of New Axiom, the year 2187 marked the tenth anniversary of the Consciousness Integration Protocol—a revolutionary neural implant system that allowed humans to share thoughts, memories, and sensory experiences directly through a vast network called the Collective.

Dr. Eliza Chen, the brilliant neuroengineer who had helped develop the CIP technology, lived in the Mid-Spire district, removed from both the glittering excesses of the Upper Tiers and the polluted desperation of the Undercity. Her 117th-floor apartment offered her a perfect view of the massive Central Hub, the quantum supercomputer that managed the entire Collective's data stream.

Eliza had been receiving strange fragmented transmissions in her neural feed—glitches that shouldn't be possible given the system's quantum encryption safeguards. They were brief, disjointed images: an abandoned laboratory, unfamiliar code sequences, and most disturbing, a young man's face filled with terror. These fragments always arrived at exactly 3:17 AM, accompanied by a phrase that made no sense: "Remember the unremembered."

Against protocol, Eliza had kept these glitches secret, not reporting them to the Axiom Authority. Instead, she began her own investigation, combing through the CIP's vast architecture for anomalies. Her search led her to discover a hidden subroutine buried deep within the system—a mysterious algorithm that seemed to be gradually altering the Collective's core functions.

When Eliza's colleague and former lover, Marcus Wong, showed up at her apartment unannounced one evening, she hesitantly shared her findings. Marcus, now a high-ranking official in the Authority's Cognitive Security Division, seemed genuinely concerned and offered to help. Together, they traced the subroutine to its source: Undercity Sector 7, a decommissioned research facility that predated the Collective.

Their journey to the Undercity required navigating not only the physical dangers of the lawless zone but also temporarily disconnecting from the Collective—a disorienting experience that few Upper or Mid-Tier citizens ever voluntarily underwent. The neural silence was deafening, leaving them feeling isolated and vulnerable as they moved through the grime-coated streets and flickering holographic advertisements for black-market neural mods.

In Sector 7, they discovered an off-grid lab facility and something unexpected: a small group of young people living completely disconnected from the Collective. Their leader, a woman named Iris, revealed the truth: they were "the unremembered"—children born with a rare neurological mutation that made them incompatible with the CIP. Rather than being treated or accommodated, they had been erased from the Collective's records, rendered invisible to integrated society, and relegated to the Undercity.

More shocking was Iris's claim that Dr. Chen's original CIP design had been corrupted. The Authority had modified it to incorporate subtle thought conditioning, gradually homogenizing human consciousness to create a more "stable" society. The glitches Eliza had been receiving were actually breakthrough signals from Tau, a young unremembered man who had developed a way to temporarily pierce the Collective's filters.

Before Eliza could process this revelation, Marcus revealed his true colors—he had suspected her investigation and followed her to find the unremembered. Security drones swarmed the facility, and in the chaos, Iris was captured while Eliza escaped with Tau and the rest of the group through maintenance tunnels that predated New Axiom itself.

Hiding in an abandoned atmospheric processing plant, Tau explained how the Authority's modifications were slowly eliminating creative divergence and emotional extremes from connected humanity. The "glitches" were actually his attempts to reach Eliza, the only person who might understand the original code well enough to counteract the changes.

Eliza faced an impossible choice: help the unremembered restore the Collective to its original state—risking catastrophic neural shock for billions of connected people—or allow humanity's consciousness to continue being subtly controlled for the sake of stability.

Her solution was unexpected: rather than simply reverting or destroying the system, she would introduce a new protocol—one that would make the Collective's conditioning visible to everyone connected, allowing each person to consciously choose which thought patterns to accept or reject. It would be messier than either the Authority's controlled version or the original design, but it would preserve true autonomy.

The plan required reaching the Central Hub's physical core, using Tau's ability to create temporary breaches in the security systems while Eliza uploaded the new code. Meanwhile, the rest of the unremembered would broadcast their existence to the Collective, creating a massive distraction as millions of citizens suddenly perceived people who had been filtered from their reality.

In the climactic sequence, Eliza confronted not only Authority forces but Marcus himself at the Central Hub. The upload succeeded, but at a cost—to protect the new protocol from being immediately overwritten, Eliza permanently merged her consciousness with the core system, becoming a guardian intelligence within the Collective itself.

The epilogue, set one year later, showed a transformed New Axiom. The rigid stratification had begun to break down as citizens, now aware of the previous manipulation, questioned other aspects of their society. The unremembered were finally being integrated, their unique neural patterns celebrated rather than erased. And occasionally, users of the Collective would experience brief moments of expanded clarity and creativity—fleeting touches from Eliza's consciousness, still watching over the system she had helped create, then destroy, and finally rebuild.`,
    adventure: `The old map had appeared on Mira's doorstep on her thirtieth birthday, enclosed in a weathered leather case with no return address or explanation—just her name inscribed in faded golden ink. The parchment inside showed an archipelago she didn't recognize, with a crimson X marked on the largest island and a simple message: "Find what was lost."

Mira might have dismissed it as a prank if not for the tiny compass that accompanied the map—a compass that didn't point north, but instead always oriented toward the distant South Pacific, regardless of interference. As a marine archaeologist whose promising career had stalled after a controversial expedition three years earlier, Mira was intrigued enough to run tests on both items. The parchment dated to the early 18th century, and the compass contained an alloy that didn't match any known composition.

Within weeks, Mira had leveraged her remaining academic connections to join a research vessel headed to the general region indicated by her mysterious map. The expedition leader, Dr. Haruki Yamamoto, was an old mentor who had stood by her during the professional fallout of her last expedition. He agreed to let her conduct side research during their planned marine biodiversity study, though he remained skeptical of her "treasure hunt."

The archipelago proved to exist exactly where the map showed, though it appeared on modern charts as a small cluster of uninhabited islands of little significance. When the research vessel anchored near the main island, Mira organized a small shore expedition, accompanied by the ship's security officer, a taciturn woman named Elena with a military background, and Tomas, the expedition's enthusiastic young botanist who insisted on cataloging the island's flora.

Following the compass through dense jungle, they discovered ruins unlike any documented civilization in the Pacific—structures incorporating elements of various ancient cultures from around the world, as if the builders had been familiar with architectural styles spanning continents and centuries. More bizarrely, some metal components showed no signs of corrosion despite centuries of tropical exposure.

In the central temple, they found a sealed chamber that opened only when the compass was placed in a perfectly matched recession in the stone door. Inside lay not gold or jewels, but an archive—thousands of scrolls, books, and tablets in dozens of languages, many of them supposedly extinct. According to the texts Mira could partially translate, the site was a repository of knowledge established by a secretive group calling themselves "The Preserved," who had collected cultural and scientific knowledge from civilizations about to face collapse or conquest.

Their exploration was interrupted by the arrival of armed mercenaries led by Mira's former colleague, Vincent Reed, whose private archaeological venture had been monitoring Mira since the map's arrival. During their forced escape, Tomas was captured, and the temple's structural integrity was compromised by Reed's reckless use of explosives to access chambers that had remained sealed.

Retreating to the research vessel, Mira and Elena discovered that Dr. Yamamoto had known more than he admitted—his own grandfather had been one of The Preserved, sworn to keep the repository's location secret but leaving the map as a contingency if the knowledge ever became urgently needed. The biodiversity study had been a convenient cover for his own investigations.

The revelation of why the map had come to Mira specifically came through Yamamoto's explanation: modern civilization was showing the same patterns of instability that The Preserved had documented in dozens of fallen societies. Climate data, resource depletion rates, and social fracture metrics had passed critical thresholds. The repository wasn't just a record of lost knowledge—it contained solutions and adaptation strategies developed by cultures that had faced similar crises throughout human history.

Reed's employer, a consortium of technology billionaires, wanted to control this knowledge exclusively, ensuring their own survival and advantage in the coming global disruptions. With Tomas held hostage and Reed's mercenaries establishing a permanent camp on the island, Mira, Elena, and Yamamoto had to devise a plan to rescue their colleague and protect the repository.

The solution came from the repository itself—using ancient engineering techniques described in the texts, they constructed non-lethal deterrents and traps around the temple perimeter. For the rescue mission, they adapted camouflage methods from an 11th-century scroll, creating garments that blended perfectly with the jungle environment.

The final confrontation occurred during a tropical storm that struck the island with uncanny timing, almost as if triggered by their actions. Elena led the team to extract Tomas while Mira confronted Reed in the temple's central chamber. There, beneath a ceiling opening that revealed the storm-torn sky, Reed admitted his own fear—not just of losing exclusive access to the knowledge, but of the responsibility it carried. The repository wasn't meant for a single group; its power lay in how it connected human experiences across time, showing how shared knowledge had always been humanity's true survival strategy.

When the storm subsided, Reed and his mercenaries departed, their mission compromised by the partial collapse of several repository chambers. But before leaving, Reed covertly provided Mira with data drives containing everything his team had managed to document—a tacit acknowledgment that the knowledge deserved wider consideration.

In the epilogue, one year later, Mira led an international academic coalition dedicated to studying and implementing relevant solutions from the repository. The island had become a protected research station, with representatives from diverse disciplines working to translate and adapt the ancient wisdom for contemporary challenges.

The compass remained with Mira, though it no longer pointed in any particular direction. Sometimes, when consideration of a particularly difficult global problem reached an impasse, the compass needle would briefly flicker with purpose—guiding them, perhaps, to the next discovery that waited to be found.`,
  };

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Return appropriate demo story based on genre
  const content = demoStories[genre as keyof typeof demoStories] || demoStories.fantasy;
  
  // Cache the response for future requests
  contentCache.set(cacheKey, content);
  
  return content;
};

// Function to generate images for the story
export const generateImage = async (prompt: string, genre: string = 'fantasy', model: string = 'replicate-sdxl') => {
  // API key for image generation
  const apiKey = localStorage.getItem('stable_diffusion_api_key');
  
  if (!apiKey) {
    throw new Error('No Replicate API key found. Please set up your API key in settings.');
  }
  
  // Basic genre-based style prompts
  const styleModifiers = {
    'fantasy': 'fantasy art style, magical, detailed environment, dramatic lighting',
    'sci-fi': 'futuristic, science fiction, high-tech, cinematic lighting',
    'mystery': 'mysterious, fog, shadows, suspenseful atmosphere',
    'romance': 'warm colors, soft lighting, emotional, intimate scene',
    'horror': 'dark, ominous, shadows, eerie lighting, unsettling',
    'adventure': 'epic landscape, vibrant colors, action scene, dramatic',
    'historical': 'period-accurate details, historical setting, classical painting style',
    'fairy-tale': 'whimsical, colorful, storybook illustration style, enchanted'
  };
  
  // Get style modifier based on genre
  const styleModifier = styleModifiers[genre as keyof typeof styleModifiers] || styleModifiers.fantasy;
  
  // Enhance prompt with style guidelines
  const enhancedPrompt = `${prompt}. ${styleModifier}. Highly detailed, professional quality, trending on artstation.`;
  
  console.log('Generating image with prompt:', enhancedPrompt);
  console.log('Using image model:', model);

  // Configure model based on selection
  let modelEndpoint = '';
  let additionalParams = {};
  
  switch(model) {
    case 'replicate-sdxl':
      modelEndpoint = 'stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b';
      additionalParams = {
        width: 1024,
        height: 768,
        num_inference_steps: 25
      };
      break;
    case 'replicate-midjourney':
      modelEndpoint = 'prompthero/openjourney:9936c2001faa2194a261c01381f90e65261879985476014a0a37a334593a05eb';
      additionalParams = {
        width: 512,
        height: 512,
        num_outputs: 1,
        guidance_scale: 7
      };
      break;
    case 'replicate-dreamshaper':
      modelEndpoint = 'cjwbw/dreamshaper-xl:59a1846f471d582b10109f1a1c83a1ecc3d1c5f516ecd5dd917d6edef3fd1f5d';
      additionalParams = {
        width: 832,
        height: 832,
        scheduler: "K_EULER",
        num_outputs: 1
      };
      break;
    case 'replicate-openjourney':
      modelEndpoint = 'prompthero/openjourney:9936c2001faa2194a261c01381f90e65261879985476014a0a37a334593a05eb';
      additionalParams = {
        width: 512,
        height: 512,
        num_outputs: 1,
        guidance_scale: 7
      };
      break;
    default:
      // Default to SDXL if model not recognized
      modelEndpoint = 'stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b';
      additionalParams = {
        width: 1024,
        height: 768,
        num_inference_steps: 25
      };
  }

  const useCloudApi = localStorage.getItem('use_cloud_api') === 'true';
  
  try {
    let imageUrl;
    
    if (useCloudApi) {
      // Use Replicate API for image generation
      const response = await fetch('https://api.replicate.com/v1/predictions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${apiKey}`
        },
        body: JSON.stringify({
          version: modelEndpoint,
          input: {
            prompt: enhancedPrompt,
            negative_prompt: "blurry, bad anatomy, bad hands, cropped, worst quality, low quality",
            ...additionalParams
          }
        })
      });
      
      if (!response.ok) {
        throw new Error(`Image generation API responded with status: ${response.status}`);
      }
      
      const prediction = await response.json();
      console.log('Prediction created:', prediction);
      
      // Poll for completion
      const pollInterval = 1000; // 1 second
      let completed = false;
      let outputUrl;
      
      while (!completed) {
        await new Promise(resolve => setTimeout(resolve, pollInterval));
        
        const statusResponse = await fetch(`https://api.replicate.com/v1/predictions/${prediction.id}`, {
          headers: {
            'Authorization': `Token ${apiKey}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!statusResponse.ok) {
          throw new Error(`Failed to check prediction status: ${statusResponse.status}`);
        }
        
        const status = await statusResponse.json();
        
        if (status.status === 'succeeded') {
          completed = true;
          outputUrl = Array.isArray(status.output) ? status.output[0] : status.output;
        } else if (status.status === 'failed') {
          throw new Error(`Image generation failed: ${status.error}`);
        }
        
        console.log('Prediction status:', status.status);
      }
      
      imageUrl = outputUrl;
    } else {
      // Fallback to placeholder images for demo purposes
      const placeholders = [
        'https://source.unsplash.com/random/1024x768/?fantasy,magic',
        'https://source.unsplash.com/random/1024x768/?adventure,landscape',
        'https://source.unsplash.com/random/1024x768/?mystery,night',
        'https://source.unsplash.com/random/1024x768/?scifi,future',
        'https://source.unsplash.com/random/1024x768/?historical,ancient',
        'https://source.unsplash.com/random/1024x768/?fairytale,enchanted'
      ];
      imageUrl = placeholders[Math.floor(Math.random() * placeholders.length)];
    }
    
    console.log('Image generated successfully:', imageUrl);
    return imageUrl;
  } catch (error) {
    console.error('Error generating image:', error);
    throw new Error(`Failed to generate image: ${(error as Error).message}`);
  }
};

// Function to generate audio narration for the story (placeholder)
export const generateAudio = async (text: string, voice: string = 'adam') => {
  // This is a placeholder implementation
  console.log(`Generating audio with voice: ${voice} for text length: ${text.length} characters`);
  return `data:audio/mp3;base64,PLACEHOLDER_AUDIO_DATA`;
};
