import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useApiKey } from '../contexts/ApiKeyContext';
import { SettingsIcon, CheckCircleIcon, ExclamationCircleIcon } from './icons';
import Button from './Button';
import { validateApiKey } from '../services/geminiService';
import { Spinner } from './Spinner';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ValidationStatus = 'idle' | 'testing' | 'valid' | 'invalid';

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { t } = useLanguage();
  const { apiKey, setApiKey } = useApiKey();
  const [localApiKey, setLocalApiKey] = useState(apiKey);
  const [showSuccess, setShowSuccess] = useState(false);
  const [validationStatus, setValidationStatus] = useState<ValidationStatus>('idle');

  useEffect(() => {
    setLocalApiKey(apiKey);
    // Reset validation status when modal is opened or key changes
    setValidationStatus('idle');
  }, [apiKey, isOpen]);

  useEffect(() => {
    // Reset validation status if the user modifies the key after testing
    setValidationStatus('idle');
  }, [localApiKey]);

  const handleSave = () => {
    setApiKey(localApiKey);
    setShowSuccess(true);
    setTimeout(() => {
        setShowSuccess(false);
        onClose();
    }, 1500);
  };

  const handleTestKey = async () => {
    if (!localApiKey) {
        setValidationStatus('invalid');
        return;
    }
    setValidationStatus('testing');
    const isValid = await validateApiKey(localApiKey);
    setValidationStatus(isValid ? 'valid' : 'invalid');
  };

  const renderValidationStatus = () => {
      switch (validationStatus) {
        case 'testing':
          return (
            <div className="flex items-center gap-2 text-sm text-yellow-400">
              <Spinner className="w-4 h-4" />
              <span>{t('apiKeyTesting')}</span>
            </div>
          );
        case 'valid':
          return (
            <div className="flex items-center gap-2 text-sm text-green-400">
              <CheckCircleIcon className="w-5 h-5" />
              <span>{t('apiKeyValid')}</span>
            </div>
          );
        case 'invalid':
          return (
            <div className="flex items-center gap-2 text-sm text-red-400">
              <ExclamationCircleIcon className="w-5 h-5" />
              <span>{t('apiKeyInvalid')}</span>
            </div>
          );
        default:
          return null;
      }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="bg-gray-800 rounded-lg shadow-xl w-full max-w-md m-4 p-6 border border-gray-700 text-gray-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-3">
            <SettingsIcon className="w-6 h-6" />
            {t('settingsTitle')}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl leading-none">&times;</button>
        </div>
        
        <div className="space-y-4">
            <div>
              <label htmlFor="api-key-input" className="block text-sm font-medium text-gray-300 mb-2">
                {t('apiKeyLabel')}
              </label>
              <div className="relative">
                <input 
                  type="password"
                  id="api-key-input"
                  value={localApiKey}
                  onChange={(e) => setLocalApiKey(e.target.value)}
                  placeholder={t('apiKeyPlaceholder')}
                  className="w-full bg-gray-900/80 border border-gray-700 text-white rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-lime-500 transition"
                />
              </div>
              <div className="h-6 mt-2 flex items-center">
                  {renderValidationStatus()}
              </div>
            </div>

            <div className="pt-2 flex items-center gap-3">
                 <Button onClick={handleSave} className="w-full">
                    {t('saveButton')}
                 </Button>
                 <Button 
                    variant="secondary" 
                    onClick={handleTestKey} 
                    className="w-full" 
                    disabled={validationStatus === 'testing'}
                 >
                    {t('testApiKeyButton')}
                 </Button>
            </div>

            {showSuccess && (
                <p className="text-center text-sm text-lime-400 mt-2">{t('apiKeySaved')}</p>
            )}
        </div>
      </div>
    </div>
  );
};
   
export default SettingsModal;