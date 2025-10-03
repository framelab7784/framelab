import React, { useState, useCallback } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useApiKey } from '../contexts/ApiKeyContext';
import { generateVideoPrompt, generateVideoPromptFromImage } from '../services/geminiService';
import type { ImageInput } from '../types';
import { ImageUploader } from './ImageUploader';
import TextAreaInput from './TextAreaInput';
import Button from './Button';
import { Spinner } from './Spinner';
import { LightbulbIcon } from './icons';

const fileToImageInput = (file: File): Promise<ImageInput> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const [mimePart, dataPart] = result.split(';base64,');
      const mimeType = mimePart.split(':')[1];
      resolve({ data: dataPart, mimeType });
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};

type PromptMode = 'text' | 'image';

export const VideoPromptGenerator: React.FC = () => {
    const { t } = useLanguage();
    const { apiKey, isApiKeySet } = useApiKey();
    const [mode, setMode] = useState<PromptMode>('text');
    const [description, setDescription] = useState('');
    const [imageFile, setImageFile] = useState<File[]>([]);
    const [imageInput, setImageInput] = useState<ImageInput | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [generatedPrompt, setGeneratedPrompt] = useState('');
    const [copySuccess, setCopySuccess] = useState(false);

    const handleFilesChange = useCallback(async (files: File[]) => {
        setImageFile(files);
        if (files.length > 0) {
            const imgInput = await fileToImageInput(files[0]);
            setImageInput(imgInput);
        } else {
            setImageInput(null);
        }
    }, []);

    const handleGenerate = async () => {
        if (!isApiKeySet) {
            setError(t('apiKeyMissingError'));
            return;
        }
        if (mode === 'text' && !description.trim()) {
            setError(t('descriptionForPromptError'));
            return;
        }
        if (mode === 'image' && !imageInput) {
            setError(t('imageForPromptError'));
            return;
        }

        setIsLoading(true);
        setError(null);
        setGeneratedPrompt('');
        setCopySuccess(false);

        try {
            let result;
            if (mode === 'text') {
                result = await generateVideoPrompt(apiKey, description);
            } else if (imageInput) {
                // We need to know aspect ratio for the prompt, let's calculate it from the image
                const img = new Image();
                img.src = `data:${imageInput.mimeType};base64,${imageInput.data}`;
                await img.decode();
                const aspectRatio = (img.width / img.height).toFixed(2);
                result = await generateVideoPromptFromImage(apiKey, { image: imageInput, aspectRatio: `${img.width}:${img.height} (approx ${aspectRatio}:1)` });
            }
            if (result) {
                setGeneratedPrompt(result);
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleCopy = () => {
        if (generatedPrompt) {
            navigator.clipboard.writeText(generatedPrompt);
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 h-full bg-gray-900">
            <aside className="lg:col-span-4 p-4 border-r border-gray-800 overflow-y-auto h-full">
                <div className="space-y-6">
                    <header>
                        <h1 className="text-xl font-bold text-white">{t('videoPromptTitle')}</h1>
                        <p className="text-sm text-gray-400">{t('videoPromptSubtitle')}</p>
                    </header>
                    
                    <div className="p-1 bg-gray-800 rounded-lg flex gap-1">
                        <button onClick={() => setMode('text')} className={`w-full py-2 text-sm font-semibold rounded-md transition-colors ${mode === 'text' ? 'bg-gray-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}>{t('promptFromText')}</button>
                        <button onClick={() => setMode('image')} className={`w-full py-2 text-sm font-semibold rounded-md transition-colors ${mode === 'image' ? 'bg-gray-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}>{t('promptFromImage')}</button>
                    </div>

                    <div style={{ display: mode === 'text' ? 'block' : 'none' }}>
                        <TextAreaInput 
                            label={t('promptDescriptionLabel')}
                            value={description}
                            onChange={setDescription}
                            placeholder={t('promptDescriptionPlaceholder')}
                            rows={6}
                        />
                    </div>

                    <div style={{ display: mode === 'image' ? 'block' : 'none' }}>
                        <ImageUploader 
                            files={imageFile}
                            onFilesChange={handleFilesChange}
                            label={t('yourImageLabel')}
                        />
                    </div>
                    
                    <Button 
                        onClick={handleGenerate} 
                        disabled={isLoading || !isApiKeySet || (mode === 'text' && !description) || (mode === 'image' && !imageInput)}
                        className="w-full"
                        title={!isApiKeySet ? t('apiKeyMissingError') : ''}
                    >
                        {isLoading ? <><Spinner/> {t('generatingPrompt')}</> : t('generatePromptButton')}
                    </Button>

                    {error && <p className="text-center text-sm text-red-400 bg-red-900/30 p-2 rounded-md">{error}</p>}
                </div>
            </aside>
            <main className="lg:col-span-8 bg-black p-4 md:p-8 overflow-y-auto h-full flex flex-col">
                 <h2 className="text-lg font-semibold text-gray-300 mb-4">{t('generatedPromptTitle')}</h2>
                 <div className="flex-grow bg-gray-800/50 rounded-lg p-1 relative flex flex-col">
                    {generatedPrompt ? (
                        <>
                           <textarea
                                readOnly
                                value={generatedPrompt}
                                className="w-full h-full flex-grow bg-transparent text-gray-300 font-mono text-sm p-3 focus:outline-none resize-none"
                            />
                            <Button variant="secondary" onClick={handleCopy} className="absolute top-3 right-3">
                                {copySuccess ? t('promptCopied') : t('copyPromptButton')}
                            </Button>
                        </>
                    ) : (
                         <div className="flex items-center justify-center h-full text-center text-gray-600">
                             <div>
                                 <LightbulbIcon className="w-16 h-16 mx-auto mb-4" />
                                 <p>{t('promptIdeasAppearHere')}</p>
                             </div>
                         </div>
                    )}
                </div>
            </main>
        </div>
    );
};