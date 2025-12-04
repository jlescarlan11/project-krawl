"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { ArrowLeft, Search, Plus, X, Edit2, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProgressDots } from "@/components/onboarding/ProgressDots";
import { useKrawlCreationStore } from "@/stores/krawl-creation-store";
import { MapGem } from "@/components/map/gem-types";
import { ContextInjectionForm } from "../ContextInjectionForm";
import { cn } from "@/lib/utils";

interface GemSelectionStepProps {
  onNext: () => void;
  onBack: () => void;
}

const MIN_GEMS = 2;
const MAX_GEMS = 20;

export function GemSelectionStep({ onNext, onBack }: GemSelectionStepProps) {
  const { selectedGems, addGem, removeGem, updateGemContext } =
    useKrawlCreationStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<MapGem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showContextForm, setShowContextForm] = useState(false);
  const [selectedGemForContext, setSelectedGemForContext] =
    useState<MapGem | null>(null);
  const [editingGemId, setEditingGemId] = useState<string | null>(null);

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim()) {
        performSearch(searchQuery);
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const performSearch = async (query: string) => {
    setIsSearching(true);
    try {
      const response = await fetch(
        `/api/gems/search?q=${encodeURIComponent(query)}&limit=20`
      );
      const data = await response.json();
      setSearchResults(data.gems || []);
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddClick = (gem: MapGem) => {
    // Check if already added
    if (selectedGems.some((g) => g.gemId === gem.id)) {
      return;
    }

    // Check max limit
    if (selectedGems.length >= MAX_GEMS) {
      alert(`Maximum ${MAX_GEMS} gems allowed`);
      return;
    }

    setSelectedGemForContext(gem);
    setEditingGemId(null);
    setShowContextForm(true);
  };

  const handleContextAdd = (creatorNote: string, lokalSecret: string) => {
    if (selectedGemForContext) {
      addGem(selectedGemForContext, creatorNote, lokalSecret);
      setShowContextForm(false);
      setSelectedGemForContext(null);
      setEditingGemId(null);
    }
  };

  const handleEditContext = (gemId: string) => {
    const gem = selectedGems.find((g) => g.gemId === gemId);
    if (gem) {
      setSelectedGemForContext(gem.gem);
      setEditingGemId(gemId);
      setShowContextForm(true);
    }
  };

  const handleContextUpdate = (creatorNote: string, lokalSecret: string) => {
    if (editingGemId) {
      updateGemContext(editingGemId, creatorNote, lokalSecret);
      setShowContextForm(false);
      setEditingGemId(null);
      setSelectedGemForContext(null);
    }
  };

  const handleContextCancel = () => {
    setShowContextForm(false);
    setSelectedGemForContext(null);
    setEditingGemId(null);
  };

  const isGemAdded = (gemId: string) => {
    return selectedGems.some((g) => g.gemId === gemId);
  };

  const canProceed = useMemo(() => {
    return (
      selectedGems.length >= MIN_GEMS &&
      selectedGems.every(
        (gem) =>
          gem.creatorNote.trim().length >= 10 &&
          gem.creatorNote.trim().length <= 500 &&
          gem.lokalSecret.trim().length >= 10 &&
          gem.lokalSecret.trim().length <= 500
      )
    );
  }, [selectedGems]);

  const handleContinue = () => {
    if (canProceed) {
      onNext();
    }
  };

  return (
    <div className="flex flex-col h-dvh bg-bg-white">
      {/* Header */}
      <header className="shrink-0 border-b border-border-subtle bg-bg-white">
        <div className="p-4">
          <div className="flex items-center gap-3 relative">
            <button
              onClick={onBack}
              className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-bg-light transition-colors shrink-0"
              aria-label="Go back"
              type="button"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex-1 flex flex-col items-center justify-center gap-3">
              <h1 className="text-xl font-bold text-text-primary">Create Krawl</h1>
              <ProgressDots total={3} currentIndex={1} />
            </div>
            <p className="text-sm text-text-secondary shrink-0">Step 2 of 3</p>
          </div>
        </div>
      </header>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-6">
          {/* Selected Gems Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-text-primary">
                Selected Gems ({selectedGems.length}/{MIN_GEMS} minimum)
              </h2>
            </div>
            {selectedGems.length === 0 ? (
              <div className="p-6 bg-bg-light rounded-lg text-center">
                <p className="text-text-secondary">No gems selected yet</p>
                <p className="text-sm text-text-tertiary mt-1">
                  Search and add at least {MIN_GEMS} gems to continue
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {selectedGems.map((selectedGem, index) => (
                  <div
                    key={selectedGem.gemId}
                    className="p-3 bg-bg-light rounded-lg flex items-start gap-3"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-text-secondary shrink-0">
                          #{index + 1}
                        </span>
                        <h3 className="font-semibold text-text-primary truncate">
                          {selectedGem.gem.name}
                        </h3>
                      </div>
                      <p className="text-sm text-text-secondary line-clamp-2">
                        {selectedGem.creatorNote}
                      </p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => handleEditContext(selectedGem.gemId)}
                        className="p-2 hover:bg-bg-white rounded-lg transition-colors"
                        aria-label="Edit context"
                        type="button"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => removeGem(selectedGem.gemId)}
                        className="p-2 hover:bg-bg-white rounded-lg transition-colors text-error"
                        aria-label="Remove gem"
                        type="button"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Search Section */}
          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-text-primary">
              Available Gems
            </h2>
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for gems..."
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>

          {/* Search Results */}
          {isSearching ? (
            <div className="text-center py-8">
              <p className="text-text-secondary">Searching...</p>
            </div>
          ) : searchResults.length === 0 && searchQuery ? (
            <div className="text-center py-8">
              <p className="text-text-secondary">No gems found</p>
            </div>
          ) : (
            <div className="space-y-2">
              {searchResults.map((gem) => {
                const added = isGemAdded(gem.id);
                return (
                  <div
                    key={gem.id}
                    className="p-3 bg-bg-light rounded-lg flex items-start gap-3"
                  >
                    {gem.thumbnailUrl ? (
                      <img
                        src={gem.thumbnailUrl}
                        alt={gem.name}
                        className="w-16 h-16 rounded-lg object-cover shrink-0"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-lg bg-bg-white flex items-center justify-center shrink-0">
                        <span className="text-2xl">📍</span>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-text-primary truncate">
                        {gem.name}
                      </h3>
                      <p className="text-sm text-text-secondary line-clamp-2">
                        {gem.shortDescription || gem.category}
                      </p>
                      {gem.coordinates && (
                        <div className="flex items-center gap-1 mt-1 text-xs text-text-tertiary">
                          <MapPin className="w-3 h-3" />
                          <span>Location available</span>
                        </div>
                      )}
                    </div>
                    <div className="shrink-0">
                      {added ? (
                        <div className="px-3 py-1 bg-success/10 text-success rounded-lg text-sm font-medium">
                          Added
                        </div>
                      ) : (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleAddClick(gem)}
                          disabled={selectedGems.length >= MAX_GEMS}
                          icon={<Plus className="w-4 h-4" />}
                          iconPosition="left"
                        >
                          Add
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="shrink-0 p-4 border-t border-border-subtle bg-bg-white">
        <Button
          variant="primary"
          size="lg"
          onClick={handleContinue}
          disabled={!canProceed}
          className="w-full"
        >
          Continue ({selectedGems.length}/{MIN_GEMS} gems)
        </Button>
        {selectedGems.length < MIN_GEMS && (
          <p className="text-sm text-error text-center mt-2">
            Please add at least {MIN_GEMS} gems to continue
          </p>
        )}
      </div>

      {/* Context Injection Form Modal */}
      {showContextForm && selectedGemForContext && (
        <ContextInjectionForm
          gem={selectedGemForContext}
          initialCreatorNote={
            editingGemId
              ? selectedGems.find((g) => g.gemId === editingGemId)
                  ?.creatorNote || ""
              : ""
          }
          initialLokalSecret={
            editingGemId
              ? selectedGems.find((g) => g.gemId === editingGemId)
                  ?.lokalSecret || ""
              : ""
          }
          onAdd={
            editingGemId ? handleContextUpdate : handleContextAdd
          }
          onCancel={handleContextCancel}
        />
      )}
    </div>
  );
}

