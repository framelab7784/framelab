import React from 'react';

export interface Option {
  value: string;
  label: React.ReactNode;
}

export interface ImageInput {
  data: string; // base64 encoded string
  mimeType: string;
}

export type Tab = 'videoGenerator' | 'imageEditor' | 'videoPrompt';

export type ImageEditorSubTab = 'edit' | 'aspectRatio';

// FIX: Updated deprecated model name to 'gemini-2.5-flash-image'.
export type ImageModel = 'gemini-2.5-flash-image' | 'imagen-4.0-generate-001';

export type ImageAspectRatio = '16:9' | '9:16' | '1:1';

export type PhotoshootResult = 
  | { status: 'fulfilled'; value: string }
  | { status: 'rejected'; reason: any };

// New types for Video Generator
export type VeoModel = 'veo-3.0-generate-preview' | 'veo-3.0-generate-001' | 'veo-3.0-fast-generate-001' | 'veo-2.0-generate-001';
export type AspectRatio = '16:9' | '9:16';
export type Resolution = '1080p' | '720p';
export type VisualStyle = 'Cinematic' | 'Realistic' | 'Anime' | 'Pixar3D' | 'Cyberpunk' | "Retro 80's";
export type CharacterVoice = 'none' | 'english' | 'bahasa-indonesia';

export interface Scene {
  id: number;
  prompt: string;
  usePreviousScene: boolean;
  isJsonPrompt: boolean;
}
