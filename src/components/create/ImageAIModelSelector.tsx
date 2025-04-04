
import React, { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Image, ImageIcon, Sparkles } from "lucide-react";

export interface ImageAIModel {
  id: string;
  name: string;
  provider: string;
  description: string;
  requiresApiKey: boolean;
  apiKeyName: string;
}

const imageAIModels: ImageAIModel[] = [
  {
    id: 'replicate-sdxl',
    name: 'Stable Diffusion XL',
    provider: 'Replicate',
    description: 'High-quality image generation with detailed control',
    requiresApiKey: true,
    apiKeyName: 'stable_diffusion_api_key'
  },
  {
    id: 'replicate-midjourney',
    name: 'Midjourney Style',
    provider: 'Replicate',
    description: 'Artistic style similar to Midjourney',
    requiresApiKey: true,
    apiKeyName: 'stable_diffusion_api_key'
  },
  {
    id: 'replicate-dreamshaper',
    name: 'DreamShaper',
    provider: 'Replicate',
    description: 'Creative and dreamlike image generation',
    requiresApiKey: true,
    apiKeyName: 'stable_diffusion_api_key'
  },
  {
    id: 'replicate-openjourney',
    name: 'OpenJourney',
    provider: 'Replicate',
    description: 'Open-source alternative to Midjourney',
    requiresApiKey: true,
    apiKeyName: 'stable_diffusion_api_key'
  },
  {
    id: 'default',
    name: 'Default Style',
    provider: 'TaleCloud',
    description: 'Our standard image generation style',
    requiresApiKey: false,
    apiKeyName: ''
  }
];

interface ImageAIModelSelectorProps {
  selectedModel: string;
  onSelectModel: (modelId: string) => void;
}

const ImageAIModelSelector: React.FC<ImageAIModelSelectorProps> = ({ selectedModel, onSelectModel }) => {
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [selectedModelData, setSelectedModelData] = useState<ImageAIModel | null>(
    imageAIModels.find(model => model.id === selectedModel) || null
  );

  const handleModelSelect = (modelId: string) => {
    const model = imageAIModels.find(m => m.id === modelId);
    if (model) {
      setSelectedModelData(model);
      onSelectModel(modelId);
      
      // Check if API key exists in localStorage
      if (model.requiresApiKey) {
        const savedKey = localStorage.getItem(model.apiKeyName);
        if (!savedKey) {
          setShowApiKeyInput(true);
        } else {
          setShowApiKeyInput(false);
        }
      } else {
        setShowApiKeyInput(false);
      }
    }
  };

  const saveApiKey = () => {
    if (!selectedModelData) return;
    
    if (!apiKey.trim()) {
      toast.error("Please enter a valid API key");
      return;
    }
    
    localStorage.setItem(selectedModelData.apiKeyName, apiKey.trim());
    toast.success(`${selectedModelData.provider} API key saved successfully`);
    setShowApiKeyInput(false);
    setApiKey("");
  };
  
  const handleManageKey = () => {
    if (!selectedModelData?.requiresApiKey) return;
    
    // Toggle the API key input
    setShowApiKeyInput(!showApiKeyInput);
    setApiKey("");
  };

  return (
    <div className="bg-white rounded-lg shadow p-5 mb-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <ImageIcon className="h-5 w-5 text-tale-primary" />
        Select Image Generator
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
        {imageAIModels.map((model) => (
          <div
            key={model.id}
            className={`border rounded-lg p-3 cursor-pointer transition-all ${
              selectedModel === model.id 
                ? 'border-tale-primary bg-tale-light' 
                : 'border-gray-200 hover:border-tale-primary hover:bg-gray-50'
            }`}
            onClick={() => handleModelSelect(model.id)}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                <Image className="h-4 w-4 text-tale-primary" />
              </div>
              <div>
                <div className="font-medium">{model.name}</div>
                <div className="text-xs text-gray-500">{model.provider}</div>
              </div>
            </div>
            <p className="text-xs text-gray-600 mt-2">{model.description}</p>
            {model.requiresApiKey && (
              <div className="mt-2 flex justify-end">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-xs py-1 h-auto"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedModelData(model);
                    handleManageKey();
                  }}
                >
                  {localStorage.getItem(model.apiKeyName) ? "Update API Key" : "Add API Key"}
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>

      {showApiKeyInput && selectedModelData && (
        <div className="mt-4 border-t pt-4">
          <Label htmlFor="imageApiKey" className="block text-sm font-medium text-gray-700 mb-1">
            Enter {selectedModelData.provider} API Key
          </Label>
          <div className="flex items-center gap-2">
            <Input
              id="imageApiKey"
              type="password"
              placeholder={`Your ${selectedModelData.provider} API key`}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="flex-1"
            />
            <Button onClick={saveApiKey} type="button">Save</Button>
          </div>
          <p className="mt-2 text-xs text-gray-500">
            Your API key will be stored securely in your browser's local storage.
          </p>
        </div>
      )}
    </div>
  );
};

export default ImageAIModelSelector;
