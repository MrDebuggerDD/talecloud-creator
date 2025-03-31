
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Settings, KeyRound, Check } from 'lucide-react';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ApiKeySettings: React.FC = () => {
  const [elevenlabsApiKey, setElevenlabsApiKey] = useState('');
  const [stableDiffusionApiKey, setStableDiffusionApiKey] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [elevenLabsKeySaved, setElevenLabsKeySaved] = useState(false);
  const [stableDiffusionKeySaved, setStableDiffusionKeySaved] = useState(false);

  useEffect(() => {
    // Load saved API keys from localStorage
    const savedElevenLabsKey = localStorage.getItem('elevenlabs_api_key');
    const savedStableDiffusionKey = localStorage.getItem('stable_diffusion_api_key');
    
    if (savedElevenLabsKey) {
      setElevenlabsApiKey(savedElevenLabsKey);
      setElevenLabsKeySaved(true);
    }
    
    if (savedStableDiffusionKey) {
      setStableDiffusionApiKey(savedStableDiffusionKey);
      setStableDiffusionKeySaved(true);
    }
  }, []);

  const saveElevenLabsKey = () => {
    if (elevenlabsApiKey.trim()) {
      localStorage.setItem('elevenlabs_api_key', elevenlabsApiKey);
      setElevenLabsKeySaved(true);
      toast.success('ElevenLabs API key saved!');
    } else {
      toast.error('Please enter a valid API key');
    }
  };

  const saveStableDiffusionKey = () => {
    if (stableDiffusionApiKey.trim()) {
      localStorage.setItem('stable_diffusion_api_key', stableDiffusionApiKey);
      setStableDiffusionKeySaved(true);
      toast.success('Stable Diffusion API key saved!');
    } else {
      toast.error('Please enter a valid API key');
    }
  };

  const clearElevenLabsKey = () => {
    localStorage.removeItem('elevenlabs_api_key');
    setElevenlabsApiKey('');
    setElevenLabsKeySaved(false);
    toast.info('ElevenLabs API key removed');
  };

  const clearStableDiffusionKey = () => {
    localStorage.removeItem('stable_diffusion_api_key');
    setStableDiffusionApiKey('');
    setStableDiffusionKeySaved(false);
    toast.info('Stable Diffusion API key removed');
  };

  // Check if any API key is saved
  const anyKeySaved = elevenLabsKeySaved || stableDiffusionKeySaved;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Settings className="h-5 w-5" />
          <span className="sr-only">Settings</span>
          {anyKeySaved && (
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full border-2 border-white" />
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>API Settings</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="text-to-speech" className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="text-to-speech">Text-to-Speech</TabsTrigger>
            <TabsTrigger value="image-generation">Image Generation</TabsTrigger>
          </TabsList>
          
          <TabsContent value="text-to-speech" className="py-2">
            <div className="mb-4">
              <Label htmlFor="elevenlabs-api-key" className="text-sm font-medium flex items-center mb-2">
                <KeyRound className="h-4 w-4 mr-2" /> 
                ElevenLabs API Key
              </Label>
              <div className="text-xs text-gray-500 mb-2">
                Required for Text-to-Speech functionality. Get your API key from{' '}
                <a 
                  href="https://elevenlabs.io/speech-synthesis" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-tale-primary hover:underline"
                >
                  elevenlabs.io
                </a>
              </div>
              <Input
                id="elevenlabs-api-key"
                type="password"
                placeholder="Your ElevenLabs API Key"
                value={elevenlabsApiKey}
                onChange={(e) => setElevenlabsApiKey(e.target.value)}
                className="mb-2"
              />
              <div className="flex gap-2">
                <Button onClick={saveElevenLabsKey} className="flex-1">
                  {elevenLabsKeySaved ? (
                    <>
                      <Check className="h-4 w-4 mr-1" /> Updated
                    </>
                  ) : (
                    'Save API Key'
                  )}
                </Button>
                {elevenLabsKeySaved && (
                  <Button variant="outline" onClick={clearElevenLabsKey}>
                    Remove Key
                  </Button>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="image-generation" className="py-2">
            <div className="mb-4">
              <Label htmlFor="stable-diffusion-api-key" className="text-sm font-medium flex items-center mb-2">
                <KeyRound className="h-4 w-4 mr-2" /> 
                Replicate API Key (for Stable Diffusion)
              </Label>
              <div className="text-xs text-gray-500 mb-2">
                Required for AI image generation. Get your API key from{' '}
                <a 
                  href="https://replicate.com/account/api-tokens" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-tale-primary hover:underline"
                >
                  replicate.com
                </a>
              </div>
              <Input
                id="stable-diffusion-api-key"
                type="password"
                placeholder="Your Replicate API Key"
                value={stableDiffusionApiKey}
                onChange={(e) => setStableDiffusionApiKey(e.target.value)}
                className="mb-2"
              />
              <div className="flex gap-2">
                <Button onClick={saveStableDiffusionKey} className="flex-1">
                  {stableDiffusionKeySaved ? (
                    <>
                      <Check className="h-4 w-4 mr-1" /> Updated
                    </>
                  ) : (
                    'Save API Key'
                  )}
                </Button>
                {stableDiffusionKeySaved && (
                  <Button variant="outline" onClick={clearStableDiffusionKey}>
                    Remove Key
                  </Button>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
      </DialogContent>
    </Dialog>
  );
};

export default ApiKeySettings;
