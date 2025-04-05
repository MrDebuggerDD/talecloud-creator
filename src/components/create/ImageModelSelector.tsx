
import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageIcon, Wand2 } from 'lucide-react';
import { toast } from 'sonner';

interface ImageModelSelectorProps {
  selectedModel: string;
  onSelectModel: (model: string) => void;
}

const ImageModelSelector: React.FC<ImageModelSelectorProps> = ({ 
  selectedModel, 
  onSelectModel 
}) => {
  const [showApiKeyDialog, setShowApiKeyDialog] = useState(false);
  const [currentProvider, setCurrentProvider] = useState<string>('');
  const [apiKey, setApiKey] = useState<string>('');
  
  const imageProviders = [
    { id: 'replicate-sd', name: 'Stable Diffusion (Replicate)', requiresKey: true, keyName: 'replicate_api_key' },
    { id: 'openai-dalle', name: 'DALL-E 3 (OpenAI)', requiresKey: true, keyName: 'openai_api_key' },
    { id: 'stability-ai', name: 'Stability AI', requiresKey: true, keyName: 'stability_api_key' },
    { id: 'midjourney-api', name: 'Midjourney (via API)', requiresKey: true, keyName: 'midjourney_api_key' },
    { id: 'local-diffusion', name: 'Local Diffusion (Ollama)', requiresKey: false }
  ];

  // Find provider details for the selected model
  const getProviderDetails = (modelId: string) => {
    return imageProviders.find(provider => provider.id === modelId);
  };

  // Check if an API key exists for the initially selected provider
  useEffect(() => {
    const providerDetails = getProviderDetails(selectedModel);
    if (providerDetails?.requiresKey) {
      const savedKey = localStorage.getItem(providerDetails.keyName);
      if (!savedKey) {
        setCurrentProvider(selectedModel);
        setShowApiKeyDialog(true);
      }
    }
  }, []);

  const handleModelSelect = (modelId: string) => {
    const providerDetails = getProviderDetails(modelId);
    
    if (providerDetails?.requiresKey) {
      const savedKey = localStorage.getItem(providerDetails.keyName);
      
      if (!savedKey) {
        setCurrentProvider(modelId);
        setShowApiKeyDialog(true);
        return;
      }
    }
    
    onSelectModel(modelId);
  };

  const handleSaveApiKey = () => {
    const providerDetails = getProviderDetails(currentProvider);
    
    if (!apiKey.trim()) {
      toast.error('Please enter an API key');
      return;
    }
    
    if (providerDetails?.keyName) {
      localStorage.setItem(providerDetails.keyName, apiKey.trim());
      toast.success(`${providerDetails.name} API key saved`);
      setShowApiKeyDialog(false);
      setApiKey('');
      onSelectModel(currentProvider);
    }
  };

  const getProviderIcon = (providerId: string) => {
    return <ImageIcon className="h-4 w-4 mr-2" />;
  };
  
  // Debug stored keys
  useEffect(() => {
    imageProviders.forEach(provider => {
      if (provider.requiresKey) {
        const key = localStorage.getItem(provider.keyName);
        console.log(`${provider.name} key in localStorage:`, key ? "Present" : "Not present");
      }
    });
  }, []);

  return (
    <div className="mb-6">
      <div className="flex items-center mb-2">
        <div className="flex-grow">
          <label htmlFor="image-model" className="block text-sm font-medium text-gray-700 mb-1">
            Image Generation Model
          </label>
        </div>
      </div>

      <Select value={selectedModel} onValueChange={handleModelSelect}>
        <SelectTrigger className="input-tale">
          <SelectValue placeholder="Select an image model" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {imageProviders.map((provider) => (
              <SelectItem key={provider.id} value={provider.id}>
                <div className="flex items-center">
                  {getProviderIcon(provider.id)}
                  {provider.name}
                </div>
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      <Dialog open={showApiKeyDialog} onOpenChange={setShowApiKeyDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Enter API Key</DialogTitle>
            <DialogDescription>
              {currentProvider && getProviderDetails(currentProvider)?.name} requires an API key for image generation.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="api-key" className="text-right">
                API Key
              </Label>
              <Input
                id="api-key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="col-span-3"
                placeholder="Enter your API key"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowApiKeyDialog(false);
              onSelectModel('replicate-sd'); // Default back to first option
            }}>
              Cancel
            </Button>
            <Button onClick={handleSaveApiKey}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <p className="mt-2 text-sm text-gray-500">
        Select the AI model that will generate images for your story.
      </p>
    </div>
  );
};

export default ImageModelSelector;
