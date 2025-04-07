
import React, { useState, useEffect } from 'react';
import { Settings } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';

const ApiKeySettings: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('api');
  const [useCloudApi, setUseCloudApi] = useState(false);
  
  // API Keys
  const [openaiApiKey, setOpenaiApiKey] = useState('');
  const [stableDiffusionApiKey, setStableDiffusionApiKey] = useState('');
  const [elevenlabsApiKey, setElevenlabsApiKey] = useState('');
  const [claudeApiKey, setClaudeApiKey] = useState('');
  const [geminiApiKey, setGeminiApiKey] = useState('');
  const [mistralApiKey, setMistralApiKey] = useState('');
  const [deepseekApiKey, setDeepseekApiKey] = useState('');

  useEffect(() => {
    // Load API keys from localStorage
    const openaiKey = localStorage.getItem('openai_api_key');
    const sdKey = localStorage.getItem('replicate_api_key');
    const elKey = localStorage.getItem('elevenlabs_api_key');
    const clKey = localStorage.getItem('claude_api_key');
    const gmKey = localStorage.getItem('gemini_api_key');
    const msKey = localStorage.getItem('mistral_api_key');
    const dsKey = localStorage.getItem('deepseek_api_key');
    
    // Load API mode from localStorage
    const cloudApiSetting = localStorage.getItem('use_cloud_api');
    
    if (openaiKey) setOpenaiApiKey('•'.repeat(16));
    if (sdKey) setStableDiffusionApiKey('•'.repeat(16));
    if (elKey) setElevenlabsApiKey('•'.repeat(16));
    if (clKey) setClaudeApiKey('•'.repeat(16));
    if (gmKey) setGeminiApiKey('•'.repeat(16));
    if (msKey) setMistralApiKey('•'.repeat(16));
    if (dsKey) setDeepseekApiKey('•'.repeat(16));
    
    if (cloudApiSetting) {
      setUseCloudApi(cloudApiSetting === 'true');
    }
    
    // For testing/demo purposes, set default keys if not already set
    if (!localStorage.getItem('replicate_api_key')) {
      localStorage.setItem('replicate_api_key', 'r8_3ZnMuSsi4jfNnUpjHHfSp31GrI4btcx1Sfbn3');
      if (!sdKey) setStableDiffusionApiKey('•'.repeat(16));
    }
    
    if (!localStorage.getItem('elevenlabs_api_key')) {
      localStorage.setItem('elevenlabs_api_key', 'sk_c91ce9c1e81ef5695bb7dd85ba2d51509f8beec837ca59a2');
      if (!elKey) setElevenlabsApiKey('•'.repeat(16));
    }
  }, []);

  const handleSaveSettings = () => {
    // Save API mode to localStorage
    localStorage.setItem('use_cloud_api', useCloudApi.toString());
    
    // Save API keys if they were changed (not placeholders)
    if (openaiApiKey && !openaiApiKey.includes('•')) {
      localStorage.setItem('openai_api_key', openaiApiKey);
    }
    
    if (stableDiffusionApiKey && !stableDiffusionApiKey.includes('•')) {
      localStorage.setItem('replicate_api_key', stableDiffusionApiKey);
    }
    
    if (elevenlabsApiKey && !elevenlabsApiKey.includes('•')) {
      localStorage.setItem('elevenlabs_api_key', elevenlabsApiKey);
    }
    
    if (claudeApiKey && !claudeApiKey.includes('•')) {
      localStorage.setItem('claude_api_key', claudeApiKey);
    }
    
    if (geminiApiKey && !geminiApiKey.includes('•')) {
      localStorage.setItem('gemini_api_key', geminiApiKey);
    }
    
    if (mistralApiKey && !mistralApiKey.includes('•')) {
      localStorage.setItem('mistral_api_key', mistralApiKey);
    }
    
    if (deepseekApiKey && !deepseekApiKey.includes('•')) {
      localStorage.setItem('deepseek_api_key', deepseekApiKey);
    }
    
    toast.success('Settings saved successfully!');
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
          <Settings className="h-5 w-5 text-gray-600" />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Configure TaleCloud settings and API keys
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="api">API Mode</TabsTrigger>
            <TabsTrigger value="keys">API Keys</TabsTrigger>
          </TabsList>
          
          <TabsContent value="api">
            <div className="space-y-4">
              <h3 className="font-medium mb-2">AI Generation Mode</h3>
              
              <RadioGroup 
                value={useCloudApi ? "cloud" : "local"} 
                onValueChange={(val) => setUseCloudApi(val === "cloud")}
              >
                <div className="flex items-start space-x-2 mb-3">
                  <RadioGroupItem value="local" id="local" />
                  <div className="grid gap-1.5">
                    <Label htmlFor="local" className="font-medium">Local Mode (Ollama)</Label>
                    <p className="text-sm text-gray-500">
                      Use Ollama running locally on your machine. No API keys needed, 
                      but you must install and run Ollama separately.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-2">
                  <RadioGroupItem value="cloud" id="cloud" />
                  <div className="grid gap-1.5">
                    <Label htmlFor="cloud" className="font-medium">Cloud Mode</Label>
                    <p className="text-sm text-gray-500">
                      Use cloud-based AI services. Requires API keys, but no local 
                      installation needed. More powerful models available.
                    </p>
                  </div>
                </div>
              </RadioGroup>
            </div>
          </TabsContent>
          
          <TabsContent value="keys">
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
              <div>
                <Label htmlFor="openai" className="text-sm font-medium">OpenAI API Key</Label>
                <Input
                  id="openai"
                  value={openaiApiKey}
                  onChange={(e) => setOpenaiApiKey(e.target.value)}
                  placeholder="sk-..."
                  className="mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Used for GPT-4o and GPT-3.5 Turbo story generation
                </p>
              </div>
              
              <div>
                <Label htmlFor="claude" className="text-sm font-medium">Anthropic API Key</Label>
                <Input
                  id="claude"
                  value={claudeApiKey}
                  onChange={(e) => setClaudeApiKey(e.target.value)}
                  placeholder="sk-ant-..."
                  className="mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Used for Claude 3 and 3.5 Sonnet story generation
                </p>
              </div>
              
              <div>
                <Label htmlFor="gemini" className="text-sm font-medium">Google Gemini API Key</Label>
                <Input
                  id="gemini"
                  value={geminiApiKey}
                  onChange={(e) => setGeminiApiKey(e.target.value)}
                  placeholder="AIza..."
                  className="mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Used for Gemini Pro story generation
                </p>
              </div>
              
              <div>
                <Label htmlFor="mistral" className="text-sm font-medium">Mistral AI API Key</Label>
                <Input
                  id="mistral"
                  value={mistralApiKey}
                  onChange={(e) => setMistralApiKey(e.target.value)}
                  placeholder="..."
                  className="mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Used for Mistral Large story generation
                </p>
              </div>
              
              <div>
                <Label htmlFor="deepseek" className="text-sm font-medium">Deepseek API Key</Label>
                <Input
                  id="deepseek"
                  value={deepseekApiKey}
                  onChange={(e) => setDeepseekApiKey(e.target.value)}
                  placeholder="..."
                  className="mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Used for Deepseek Coder V2 story generation
                </p>
              </div>
              
              <div>
                <Label htmlFor="stable" className="text-sm font-medium">Replicate API Key</Label>
                <Input
                  id="stable"
                  value={stableDiffusionApiKey}
                  onChange={(e) => setStableDiffusionApiKey(e.target.value)}
                  placeholder="r8_..."
                  className="mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Used for Stable Diffusion image generation
                </p>
              </div>
              
              <div>
                <Label htmlFor="elevenlabs" className="text-sm font-medium">ElevenLabs API Key</Label>
                <Input
                  id="elevenlabs"
                  value={elevenlabsApiKey}
                  onChange={(e) => setElevenlabsApiKey(e.target.value)}
                  placeholder="..."
                  className="mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Used for AI voice narration
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSaveSettings}>
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ApiKeySettings;
