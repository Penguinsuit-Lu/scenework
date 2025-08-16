"use client";

import React, { useState } from "react";
import type { SceneTheme, ThemeTexture } from "../types/profile";

interface ThemeEditorProps {
  initial: SceneTheme;
  onSave: (theme: SceneTheme) => Promise<void>;
}

const presetPalettes = [
  {
    name: "Amber + Green (Default)",
    accentColor: '#F59E0B',
    secondaryColor: '#34D399',
    textColor: '#F5F7F7',
    cardColor: '#13171A'
  },
  {
    name: "Amber Heavy",
    accentColor: '#F59E0B',
    secondaryColor: '#F97316',
    textColor: '#FEF3C7',
    cardColor: '#1F2937'
  },
  {
    name: "Green Heavy",
    accentColor: '#10B981',
    secondaryColor: '#34D399',
    textColor: '#D1FAE5',
    cardColor: '#064E3B'
  },
  {
    name: "Slate Minimal",
    accentColor: '#64748B',
    secondaryColor: '#94A3B8',
    textColor: '#F1F5F9',
    cardColor: '#1E293B'
  }
];

const textureOptions: ThemeTexture[] = ['none', 'diagonal', 'dots', 'grid'];

export default function ThemeEditor({ initial, onSave }: ThemeEditorProps) {
  const [theme, setTheme] = useState<SceneTheme>({ ...initial });
  const [isSaving, setIsSaving] = useState(false);

  const handlePaletteChange = (palette: typeof presetPalettes[0]) => {
    setTheme(prev => ({
      ...prev,
      accentColor: palette.accentColor,
      secondaryColor: palette.secondaryColor,
      textColor: palette.textColor,
      cardColor: palette.cardColor
    }));
  };

  const handleTextureChange = (texture: ThemeTexture) => {
    setTheme(prev => ({ ...prev, texture }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(theme);
    } catch (error) {
      console.error('Failed to save theme:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Palette Selection */}
      <div>
        <label className="block text-sm font-medium text-white mb-3">
          Color Palette
        </label>
        <div className="grid grid-cols-1 gap-3">
          {presetPalettes.map((palette, index) => (
            <button
              key={index}
              onClick={() => handlePaletteChange(palette)}
              className={`p-3 rounded-lg border-2 transition-all text-left ${
                theme.accentColor === palette.accentColor &&
                theme.secondaryColor === palette.secondaryColor &&
                theme.textColor === palette.textColor &&
                theme.cardColor === palette.cardColor
                  ? 'border-amber-500 bg-amber-900/20'
                  : 'border-gray-600 hover:border-gray-500'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-white">{palette.name}</span>
                <div className="flex space-x-2">
                  <div 
                    className="w-4 h-4 rounded border border-white/20" 
                    style={{ backgroundColor: palette.accentColor }}
                  />
                  <div 
                    className="w-4 h-4 rounded border border-white/20" 
                    style={{ backgroundColor: palette.secondaryColor }}
                  />
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Texture Selection */}
      <div>
        <label className="block text-sm font-medium text-white mb-3">
          Background Texture
        </label>
        <div className="grid grid-cols-2 gap-3">
          {textureOptions.map((texture) => (
            <button
              key={texture}
              onClick={() => handleTextureChange(texture)}
              className={`p-3 rounded-lg border-2 transition-all ${
                theme.texture === texture
                  ? 'border-amber-500 bg-amber-900/20'
                  : 'border-gray-600 hover:border-gray-500'
              }`}
            >
              <div className="text-sm font-medium text-white capitalize">
                {texture}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Save Button */}
      <div className="pt-2">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="w-full bg-amber-500 hover:opacity-90 disabled:opacity-50 text-black font-medium py-2 px-4 rounded-md transition-colors"
        >
          {isSaving ? 'Saving...' : 'Save Theme'}
        </button>
      </div>
    </div>
  );
}
