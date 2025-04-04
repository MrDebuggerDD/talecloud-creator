
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
  console.log('Starting image generation with prompt:', prompt.substring(0, 50) + '...');
  
  // Get placeholder images ready in case API calls fail
  const placeholders = [
    'https://source.unsplash.com/featured/1024x768/?fantasy,magic',
    'https://source.unsplash.com/featured/1024x768/?adventure,landscape',
    'https://source.unsplash.com/featured/1024x768/?mystery,night',
    'https://source.unsplash.com/featured/1024x768/?scifi,future',
    'https://source.unsplash.com/featured/1024x768/?historical,ancient',
    'https://source.unsplash.com/featured/1024x768/?fairytale,enchanted'
  ];
  
  // Choose a placeholder based on the genre
  let placeholderIndex = 0;
  if (genre === 'fantasy') placeholderIndex = 0;
  else if (genre === 'adventure') placeholderIndex = 1;
  else if (genre === 'mystery' || genre === 'horror') placeholderIndex = 2;
  else if (genre === 'sci-fi') placeholderIndex = 3;
  else if (genre === 'historical') placeholderIndex = 4;
  else if (genre === 'fairy-tale') placeholderIndex = 5;
  else placeholderIndex = Math.floor(Math.random() * placeholders.length);
  
  // For local testing, we'll just return placeholder images
  const useLocalPlaceholders = true;
  if (useLocalPlaceholders) {
    console.log('Using local placeholder image for demo purposes');
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
    return placeholders[placeholderIndex];
  }
  
  // API key for image generation
  const apiKey = localStorage.getItem('stable_diffusion_api_key');
  
  if (!apiKey) {
    console.warn('No Replicate API key found. Using placeholder image instead.');
    return placeholders[placeholderIndex];
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
  
  console.log('Generating image with prompt:', enhancedPrompt.substring(0, 50) + '...');
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

  // Set to true to skip API call and use local placeholders (for demo/dev purposes)
  const useCloudApi = localStorage.getItem('use_cloud_api') !== 'false';
  
  try {
    if (useCloudApi) {
      try {
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
          const errorText = await response.text();
          console.error(`Image generation API responded with status: ${response.status}, Error: ${errorText}`);
          throw new Error(`Image generation API error: ${response.status} - ${errorText || 'Unknown error'}`);
        }
        
        const prediction = await response.json();
        console.log('Prediction created:', prediction);
        
        // Poll for completion
        const pollInterval = 1000; // 1 second
        let completed = false;
        let outputUrl;
        let pollAttempts = 0;
        const maxPollAttempts = 30; // 30 seconds max waiting time
        
        while (!completed && pollAttempts < maxPollAttempts) {
          await new Promise(resolve => setTimeout(resolve, pollInterval));
          pollAttempts++;
          
          const statusResponse = await fetch(`https://api.replicate.com/v1/predictions/${prediction.id}`, {
            headers: {
              'Authorization': `Token ${apiKey}`,
              'Content-Type': 'application/json'
            }
          });
          
          if (!statusResponse.ok) {
            console.error(`Failed to check prediction status: ${statusResponse.status}`);
            throw new Error(`Failed to check prediction status: ${statusResponse.status}`);
          }
          
          const status = await statusResponse.json();
          
          if (status.status === 'succeeded') {
            completed = true;
            outputUrl = Array.isArray(status.output) ? status.output[0] : status.output;
            return outputUrl;
          } else if (status.status === 'failed') {
            console.error(`Image generation failed: ${status.error}`);
            throw new Error(`Image generation failed: ${status.error}`);
          }
          
          console.log('Prediction status:', status.status, 'Attempt:', pollAttempts);
        }
        
        if (!completed) {
          throw new Error('Image generation timed out');
        }
      } catch (apiError) {
        console.error('API error, falling back to placeholders:', apiError);
        // Fallback to placeholders if API call fails
        throw apiError;
      }
    }
    
    // If we reach here, it means either Cloud API is disabled or we didn't get an image URL
    console.log('Using placeholder image');
    return placeholders[placeholderIndex];
    
  } catch (error) {
    console.error('Error generating image, using fallback:', error);
    // Always fallback to placeholders when any error occurs
    return placeholders[placeholderIndex];
  }
};

// Function to generate audio narration for the story
export const generateAudio = async (text: string, voice: string = 'adam') => {
  console.log(`Generating audio with voice: ${voice} for text length: ${text.length} characters`);
  
  try {
    // For demo purposes, return a dummy mp3 file
    // In a real implementation, you would call ElevenLabs or another TTS API here
    
    // Simulate API delay to make it feel more realistic
    await new Promise(resolve => setTimeout(resolve, Math.min(1500, text.length * 5)));
    
    // Use a base64 encoded audio sample or a dummy URL
    // This is a very short audio clip for testing
    return 'data:audio/mp3;base64,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0cUvS//7ssTeAA61O17uYYXJzTQsXcwgvV1VaqOpWur10JqFfU9qT+vbC0RhkUZIuUIAWclAYDAeAIwNe8wakwRDQwlA+eCa9T6X+1tTVlSVa3u3q6d2vQr9+i7sXZVfR72qqqnXdvSrQy+ml/6rlr///+76f/XppZ0u669iZtFp/3+uVqq+/9/V/r17+9+qm//31JcnVaMgxCaRpKE0us9q1K0bpVwrVolTt6L0nuohNE7K1dqZKLqXXcfbpextLKrXpm06KHt0U7uTXporXsrp2pQ1zLVqXf6+SfWthZLvY0xiQCCVCwDDfRJA1kiARhdmwS23RN3qtXO7lrU7t6a2ms1t+6y1LsWsrSilNdvbyJLuSvtQm5dv1NnVVtt3///9/0/77XJ0uuRumiZzrX3X/e+/+i/f9aF//0t6a39f//p+liCVGa5FjbVdSxdXLZda19afXajfZr6aXbrZ6nZdF3r//7ssTpgA5ZR17uYYXB5TVsHcwwuNb13q/u3SlFa1kOpWzf03Xsm9PXa0aLNFiDhuqolgwQJwACAEF+UgBg8AYZUQDDBk33/0qqrrdDstWtlVSy60b2qq9dKr0u+qXraq6H0VRv1KvRVSq32aq/7/+///0X/SntVWssezFubX/+y77tvZW3+3/++q3//rf/2Wn3tq0V76ON99luqWcnpddSlKUXbV6FVqsXVRfRZLG+p62+itPSp0qrpTUXvaq1a69KzttpL7UKu6pLq+r7lLnbbb9R72vWUvWtpUdgifU4VmTQaMeA4yOFzDgBQ8UXt7Ve6upr3X8ty1L2b2rVtW7vbS/S9F6VS+3+lblduv/1m+t/76/Vq/////fp/31brLHYgSm//3e/fvyX/+//7f//f///q6/u0MNzG79F67aepYusm2tOpdtuy6lU2WXxbI01+/Wtlsih3WvRKmmtWtOk9NpQ5Dv//7ssTygA5JO17mZYXBxrRsHcwwuTWspdHLnqKqqvoqXRJo0OfVAtGliHRCKEjLPwMfwYMCAMMDRZK5dnbpVet9K6VC96aedXV9aq6VzrSu+i1mdGnV9nKp190dROpe7of/W7/////6fuu1c7FbVuqVP/9tPvbfRW//+37f9KH///f/37fu1cG277UVbudfZSuirX09lK02b7bbet61rJetHnm0/a6XWffVX9yuX3u01luV9GuvdGv9Z3dkqa0q/XS71VtyLrsQNVEaINUVJkGLTsxnxxhwYkAoYAA1j2qy9uVdlfU5OyrVW9EuRStLsZRbt69S9U/Oi2tGtdlz/V+t2vv/////6f9+ulqmJ2P////7a//9v/99///t/9/W+7VrXVGKlKnctzl9FSlatl0XXVS9alKsrTWXKq1pSZStHWq702u3SbrepZRbnaNVpVS+1Vams0RK6GopcqpFNa9q2V9iX//7ss0yCU6BnWDuYSXB0DQsHckkuXWXWXWABWHRksTHRxMFgcpGAdLFW3aVXqp1roqr0qXVZlU0RS/ZJWXu29G9zVXsvr3RKVVbWdFr3L//+///170ftcj5Gr7f//V3X//2/7/9//9W6//f//0/6tJhEjtpnTTRZauq/RZGyhUu7fVaiXXNRVWp6X6tO7vlbsTbRqPbVb3smrOaTXtSzi97VtNL1OSvdR600Km+o3Yd26Twhe4ECEghPJgPK9SPMMCYYHAWXMmEte/Tn+tKXWZ0LifXW1PpUl6rpeizaqtapyl6pXWveu+9aXq7/+///99afR6tRNiyr//77Vd//2//f3//0v09///+/7lMbdJWeqs5a1L9KbPXXStPVTVs9Nnqu2vW3ShVzrqUVafiqt17PtSuupp1XqpsXqX2a1q7eiyVUftUi//7ss0qCE4Vo2LuYSXByLQsXcyYuKnWrfTXYgtYqCRgSLDFkFYAAKhSehgdtLbTcrJWutSpy1bqVXctP6MVcl6vprVVVdLrrau7p0LMlb3eq//3////uv/vUhiPZ6v///Wv//3/7f3/+3//9//f++zajdZKbVOa96a0681Um+7WXq+rKpa92jSnWtJ016rUkpTTV69VNrm1Kte6lqlp1TW1FvSSj9qKVKXrUtat7aWbteqzceSECFCIWfwYFhaYBASIu3Rexd6qXJWpTVXtqw16bpa9Kz1qetW7aVXWtCqqXt//+3//f+n/3pdu0zff//te///f/t9v19P/+7//9/7tpU5anoWVSrVS+tVk1KtuXRdTZ6ql1pqqtNtem6FVqUmr+ta9qFJUV3Krd5U1+9Gl1X07LnrfVe6m6033tS+7pXprQm4YsEBwWSIBOMMz/AaGA4+RAYBAAwBC//7sMzQjc2Bp2DOYSXBnDPsnPwguu7fXsfRcrvot06km2qrXolvd1XVrfei2ou1VOv6e////Tq9GiVL617//97f/379t/7f3/+1//9///6vtnbXappqL1K9S51K0XZpXnUvXfW9aNn0rp1rS/c1a2vTXZdXRrV96r0Sl01KVast3vQrKnWq97JdRuVCaF9atDzMBCF4uYCEQYaJGBRgkzP0RgaVDS3jyqs/S6WXKWtWVtVVS6V71eetlzqVVerWjfV///7//9v+vVW9ar//qbf//9vtv7ffev//v/////b9RZLVIrZPqWtVu+06cr1VX2uqp9PdN9Ku61m0OqiC9a6VUCz1ua1dNU1qrb3OXXTVSumvVrS1aLq1qq1EcRiMHABAzTdJ8RP+6REE0QFhmKUPasHlxIdp//swzKQVDWmfYO3gZdGJMuwdLBjvfirKPoVwhRpTpNJx7IC+9CfSo/dTXkbXeL3MUVJeRUREy3RNWwmXC3C4fRM1pHVIkQ1TzIM5FQdLKs0YnI0jZI+MhjPqHDyKQnqTSSJoTDLiJCNliaPmDh8XFyJXLJq4qPI1SSKTJw1i+0nFQ80WZX1UjEnFxU2MjP/7ss2qKM1Vn2DH4SXBkbPsWPecuHS8WNnalysYwwkXEihOzQ+dyiWTMMiYWKRI0XDyLJo+OGT5k6cLHjSamD5w8lT/y5gYLEs0PHDxw6VREP//////6Bg+ZMlUxUNCw4dMn////+6qkxBTUUzLjk5LjVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//uwzIMTDYGfYMfcZdFwM+wY+4y6VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV';
  } catch (error) {
    console.error("Error generating audio:", error);
    // Return a placeholder audio for testing
    return 'data:audio/mp3;base64,SUQzBAAAAAABEVRYWFgAAAAtAAADY29tbWVudABCaWdTb3VuZEJhbmsuY29tIC8gTGFTb25vdGhlcXVlLm9yZwBURU5DAAAAHQAAA1N3aXRjaCBQbHVzIMKpIE5DSCBTb2Z0d2FyZQBUSVQyAAAAFgAAAwoADQAFACMAIwAjAA0AQgBTAFMACgBUU1NFAAAADwAAAExhdmY1OC4yOS4xMDAAAAAAAAAAAAAAAP/7UGD/////////////////////////////xAJ/THE6MTE0NDQwNTlCNUIzRkQwMTVDQkIxRTcxQ0UxRThEQjk0MTNBNEIzNjUwQzMwNzkzNjQzMzdCQkMxMUYzQUQ5RUU4MkY3M0VDOEYxMTY2RDgxNEE1MTEzRjMxOEI1NTk5NzI3REQ4QTY4RDk3OEE=';
  }
};
