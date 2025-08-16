"use client";

import React, { useState } from "react";
import type { TopFilm } from "../types/profile";

interface TopFilmsEditorProps {
  initial: TopFilm[];
  onSave: (films: TopFilm[]) => Promise<void>;
}

const MAX_FILMS = 8;

export default function TopFilmsEditor({ initial, onSave }: TopFilmsEditorProps) {
  const [films, setFilms] = useState<TopFilm[]>(initial.slice(0, MAX_FILMS));
  const [isSaving, setIsSaving] = useState(false);

  const addFilm = () => {
    if (films.length < MAX_FILMS) {
      setFilms([...films, { title: "", year: undefined }]);
    }
  };

  const removeFilm = (index: number) => {
    setFilms(films.filter((_, i) => i !== index));
  };

  const updateFilm = (index: number, field: keyof TopFilm, value: string | number | undefined) => {
    const newFilms = [...films];
    newFilms[index] = { ...newFilms[index], [field]: value };
    setFilms(newFilms);
  };

  const sanitizeText = (text: string, maxLength: number): string => {
    return text.trim().slice(0, maxLength);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Sanitize all films before saving
      const sanitizedFilms = films
        .filter(film => film.title.trim()) // Remove films with empty titles
        .map(film => ({
          title: sanitizeText(film.title, 100),
          year: film.year && film.year > 1900 && film.year < 2030 ? film.year : undefined
        }))
        .slice(0, MAX_FILMS);

      await onSave(sanitizedFilms);
      setFilms(sanitizedFilms);
    } catch (error) {
      console.error('Failed to save top films:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const canAdd = films.length < MAX_FILMS;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-2">
          Favorite Movies
        </h3>
        <p className="text-sm text-gray-300">
          Share your favorite films. Add up to 8 movies with titles and years.
        </p>
      </div>

      {/* Films List */}
      <div className="space-y-4">
        {films.map((film, index) => (
          <div key={index} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="flex justify-between items-start mb-3">
              <h4 className="text-sm font-medium text-white">
                Film #{index + 1}
              </h4>
              <button
                onClick={() => removeFilm(index)}
                className="text-red-500 hover:text-red-700 text-sm px-2 py-1 rounded hover:bg-red-900/20"
              >
                Remove
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-white mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  value={film.title}
                  onChange={(e) => updateFilm(index, 'title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-600 rounded-md text-sm"
                  placeholder="Film Title"
                  maxLength={100}
                  required
                />
              </div>

              {/* Year */}
              <div>
                <label className="block text-sm font-medium text-white mb-1">
                  Year
                </label>
                <input
                  type="number"
                  value={film.year || ''}
                  onChange={(e) => updateFilm(index, 'year', e.target.value ? parseInt(e.target.value) : undefined)}
                  className="w-full px-3 py-2 border border-gray-600 rounded-md text-sm"
                  placeholder="2024"
                  min="1900"
                  max="2030"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Film Button */}
      <div className="flex justify-center">
        <button
          onClick={addFilm}
          disabled={!canAdd}
          className={`px-6 py-3 rounded-md font-medium transition-colors ${
            canAdd
              ? 'bg-amber-500 hover:opacity-90 text-black'
              : 'bg-gray-600 text-gray-400 cursor-not-allowed'
          }`}
        >
          {canAdd ? 'Add Film' : `Maximum ${MAX_FILMS} films reached`}
        </button>
      </div>

      {/* Save Button */}
      <div className="pt-4 border-t border-gray-700">
        <button
          onClick={handleSave}
          disabled={isSaving || films.length === 0}
          className="w-full bg-amber-500 hover:opacity-90 disabled:opacity-50 text-black font-medium py-2 px-4 rounded-md transition-colors"
        >
          {isSaving ? 'Saving...' : `Save Top ${films.length} Films`}
        </button>
      </div>

      {/* Info */}
      <div className="text-xs text-gray-400 text-center">
        <p>• Only films with titles will be saved</p>
        <p>• Maximum of {MAX_FILMS} films allowed</p>
      </div>
    </div>
  );
}
