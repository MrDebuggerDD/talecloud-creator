
import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageIcon, Wand2, ExternalLink } from 'lucide-react';
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
    { id: 'replicate-sd', name: 'Stable Diffusion (Replicate)', requiresKey: true, keyName: 'replicate_api_key', apiUrl: 'https://replicate.com/account/api-tokens' },
    { id: 'openai-dalle', name: 'DALL-E 3 (OpenAI)', requiresKey: true, keyName: 'openai_api_key', apiUrl: 'https://platform.openai.com/api-keys' },
    { id: 'stability-ai', name: 'Stability AI', requiresKey: true, keyName: 'stability_api_key', apiUrl: 'https://platform.stability.ai/account/keys' },
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
      
      // Force a page reload to apply the new API key
      window.location.reload();
    }
  };

  const getProviderIcon = (providerId: string) => {
    return <ImageIcon className="h-4 w-4 mr-2" />;
  };
  
  // Display for API Keys
  const getApiKeyStatus = (providerId: string) => {
    const provider = getProviderDetails(providerId);
    if (!provider?.requiresKey) return "No key required";
    
    const key = provider.keyName ? localStorage.getItem(provider.keyName) : null;
    return key ? "API key set ✓" : "API key required";
  };

  return (
    <div className="mb-6">
      <div className="flex items-center mb-2">
        <div className="flex-grow">
          <label htmlFor="image-model" className="block text-sm font-medium text-gray-700 mb-1">
            Image Generation Model
          </label>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="ml-2 p-1 h-8 w-8"
          onClick={() => {
            const provider = getProviderDetails(selectedModel);
            if (provider?.requiresKey) {
              setCurrentProvider(selectedModel);
              setShowApiKeyDialog(true);
            }
          }}
        >
          <Wand2 className="h-4 w-4" />
        </Button>
      </div>

      <Select value={selectedModel} onValueChange={handleModelSelect}>
        <SelectTrigger className="input-tale">
          <SelectValue placeholder="Select an image model" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {imageProviders.map((provider) => (
              <SelectItem key={provider.id} value={provider.id}>
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center">
                    {getProviderIcon(provider.id)}
                    {provider.name}
                  </div>
                  <span className={`text-xs ml-2 ${provider.requiresKey && !localStorage.getItem(provider.keyName) ? 'text-red-500' : 'text-green-500'}`}>
                    {getApiKeyStatus(provider.id)}
                  </span>
                </div>
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      <Dialog open={showApiKeyDialog} onOpenChange={setShowApiKeyDialog}>
        <DialogContent className="sm:max-w-[500px]">
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
            
            {currentProvider && getProviderDetails(currentProvider)?.apiUrl && (
              <div className="text-sm text-gray-500 mt-2">
                <a 
                  href={getProviderDetails(currentProvider)?.apiUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center text-tale-primary hover:underline"
                >
                  Get your API key here
                  <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowApiKeyDialog(false);
              onSelectModel('local-diffusion'); // Default to local option that doesn't need API key
            }}>
              Cancel
            </Button>
            <Button onClick={handleSaveApiKey}>Save & Reload</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <p className="mt-2 text-sm text-gray-500">
        Select the AI model that will generate images for your story. For best results, use Replicate with a valid API key.
      </p>
    </div>
  );
};

export default ImageModelSelector;
