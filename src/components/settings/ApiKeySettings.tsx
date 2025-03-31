
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Settings, KeyRound, Check } from 'lucide-react';
import { toast } from 'sonner';

const ApiKeySettings: React.FC = () => {
  const [elevenlabsApiKey, setElevenlabsApiKey] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [keySaved, setKeySaved] = useState(false);

  useEffect(() => {
    // Load saved API key from localStorage
    const savedApiKey = localStorage.getItem('elevenlabs_api_key');
    if (savedApiKey) {
      setElevenlabsApiKey(savedApiKey);
      setKeySaved(true);
    }
  }, []);

  const saveApiKey = () => {
    if (elevenlabsApiKey.trim()) {
      localStorage.setItem('elevenlabs_api_key', elevenlabsApiKey);
      setKeySaved(true);
      toast.success('ElevenLabs API key saved!');
      setIsOpen(false);
    } else {
      toast.error('Please enter a valid API key');
    }
  };

  const clearApiKey = () => {
    localStorage.removeItem('elevenlabs_api_key');
    setElevenlabsApiKey('');
    setKeySaved(false);
    toast.info('API key removed');
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Settings className="h-5 w-5" />
          <span className="sr-only">Settings</span>
          {keySaved && (
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full border-2 border-white" />
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>API Settings</DialogTitle>
        </DialogHeader>
        <div className="py-4">
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
              <Button onClick={saveApiKey} className="flex-1">
                {keySaved ? (
                  <>
                    <Check className="h-4 w-4 mr-1" /> Updated
                  </>
                ) : (
                  'Save API Key'
                )}
              </Button>
              {keySaved && (
                <Button variant="outline" onClick={clearApiKey}>
                  Remove Key
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ApiKeySettings;
