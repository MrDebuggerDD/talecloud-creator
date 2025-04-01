
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Settings, KeyRound, Check, Cloud, Laptop } from 'lucide-react';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";

const ApiKeySettings: React.FC = () => {
  const [elevenlabsApiKey, setElevenlabsApiKey] = useState('');
  const [stableDiffusionApiKey, setStableDiffusionApiKey] = useState('');
  const [openaiApiKey, setOpenaiApiKey] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [elevenLabsKeySaved, setElevenLabsKeySaved] = useState(false);
  const [stableDiffusionKeySaved, setStableDiffusionKeySaved] = useState(false);
  const [openaiKeySaved, setOpenaiKeySaved] = useState(false);
  const [useCloudApi, setUseCloudApi] = useState(false);

  useEffect(() => {
    // Load saved API keys from localStorage
    const savedElevenLabsKey = localStorage.getItem('elevenlabs_api_key');
    const savedStableDiffusionKey = localStorage.getItem('stable_diffusion_api_key');
    const savedOpenaiKey = localStorage.getItem('openai_api_key');
    const cloudApiSetting = localStorage.getItem('use_cloud_api');
    
    if (savedElevenLabsKey) {
      setElevenlabsApiKey(savedElevenLabsKey);
      setElevenLabsKeySaved(true);
    }
    
    if (savedStableDiffusionKey) {
      setStableDiffusionApiKey(savedStableDiffusionKey);
      setStableDiffusionKeySaved(true);
    }
    
    if (savedOpenaiKey) {
      setOpenaiApiKey(savedOpenaiKey);
      setOpenaiKeySaved(true);
    }
    
    if (cloudApiSetting) {
      setUseCloudApi(cloudApiSetting === 'true');
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

  const saveOpenaiKey = () => {
    if (openaiApiKey.trim()) {
      localStorage.setItem('openai_api_key', openaiApiKey);
      setOpenaiKeySaved(true);
      toast.success('OpenAI API key saved!');
    } else {
      toast.error('Please enter a valid API key');
    }
  };

  const toggleCloudApi = () => {
    const newValue = !useCloudApi;
    setUseCloudApi(newValue);
    localStorage.setItem('use_cloud_api', String(newValue));
    
    // Set environment variable
    if (typeof window !== 'undefined') {
      (window as any).VITE_USE_CLOUD_API = String(newValue);
    }
    
    toast.info(`Switched to ${newValue ? 'cloud API' : 'local Ollama'} for story generation`);
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
  
  const clearOpenaiKey = () => {
    localStorage.removeItem('openai_api_key');
    setOpenaiApiKey('');
    setOpenaiKeySaved(false);
    toast.info('OpenAI API key removed');
  };

  // Check if any API key is saved
  const anyKeySaved = elevenLabsKeySaved || stableDiffusionKeySaved || openaiKeySaved;

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
        
        <div className="flex items-center space-x-2 py-2 mb-4 bg-gray-50 p-3 rounded-md">
          <div className="flex-1 space-y-1">
            <div className="flex items-center">
              {useCloudApi ? (
                <Cloud className="h-4 w-4 mr-2 text-blue-500" />
              ) : (
                <Laptop className="h-4 w-4 mr-2 text-gray-500" />
              )}
              <span className="font-medium text-sm">
                {useCloudApi ? "Using Cloud API" : "Using Local Ollama"}
              </span>
            </div>
            <p className="text-xs text-gray-500">
              {useCloudApi 
                ? "Story generation via OpenAI API (requires API key)" 
                : "Story generation via local Ollama installation (no API key needed)"
              }
            </p>
          </div>
          <Switch 
            checked={useCloudApi}
            onCheckedChange={toggleCloudApi}
          />
        </div>
        
        <Tabs defaultValue="text-to-speech" className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="text-to-speech">Text-to-Speech</TabsTrigger>
            <TabsTrigger value="image-generation">Image Generation</TabsTrigger>
            <TabsTrigger value="text-generation">Text Generation</TabsTrigger>
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
          
          <TabsContent value="text-generation" className="py-2">
            <div className="mb-4">
              <Label htmlFor="openai-api-key" className="text-sm font-medium flex items-center mb-2">
                <KeyRound className="h-4 w-4 mr-2" /> 
                OpenAI API Key
              </Label>
              <div className="text-xs text-gray-500 mb-2">
                Required for cloud-based text generation. Get your API key from{' '}
                <a 
                  href="https://platform.openai.com/api-keys" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-tale-primary hover:underline"
                >
                  platform.openai.com
                </a>
              </div>
              <Input
                id="openai-api-key"
                type="password"
                placeholder="Your OpenAI API Key"
                value={openaiApiKey}
                onChange={(e) => setOpenaiApiKey(e.target.value)}
                className="mb-2"
              />
              <div className="flex gap-2">
                <Button onClick={saveOpenaiKey} className="flex-1">
                  {openaiKeySaved ? (
                    <>
                      <Check className="h-4 w-4 mr-1" /> Updated
                    </>
                  ) : (
                    'Save API Key'
                  )}
                </Button>
                {openaiKeySaved && (
                  <Button variant="outline" onClick={clearOpenaiKey}>
                    Remove Key
                  </Button>
                )}
              </div>
            </div>
            
            {useCloudApi && !openaiKeySaved && (
              <div className="bg-amber-50 p-3 rounded-md border border-amber-200 text-amber-800 text-sm mb-2">
                ⚠️ Cloud API is enabled but no OpenAI API key is set. Story generation will fail until you add an API key.
              </div>
            )}
            
            <div className="text-xs text-gray-500 mt-2">
              <p>
                <strong>Note:</strong> For local story generation, ensure you have{' '}
                <a 
                  href="https://ollama.ai/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-tale-primary hover:underline"
                >
                  Ollama
                </a>
                {' '}installed and running on your computer.
              </p>
            </div>
          </TabsContent>
        </Tabs>
        
      </DialogContent>
    </Dialog>
  );
};

export default ApiKeySettings;
