import React, { useState, useEffect, useCallback } from 'react';
import Autocomplete from './Autocomplete';
import { POPULAR_BRANDS, BODY_TYPES, ENGINE_TYPES, getYears } from '../services/staticData';
import { fetchModelsFromAI, generateTitleSuggestion, fetchBrandsFromAI } from '../services/geminiService';

const VehicleForm: React.FC = () => {
  const [formData, setFormData] = useState({
    title: '',
    brand: '',
    model: '',
    year: '',
    bodyType: '',
    engine: ''
  });

  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [isLoadingModels, setIsLoadingModels] = useState(false);
  const [modelError, setModelError] = useState<string | undefined>(undefined);
  const [isGeneratingTitle, setIsGeneratingTitle] = useState(false);
  const years = getYears();

  // When brand changes, load models
  useEffect(() => {
    const loadModels = async () => {
      setFormData(prev => ({ ...prev, model: '' })); // Reset model when brand changes
      setAvailableModels([]);
      setModelError(undefined);

      if (!formData.brand) return;

      setIsLoadingModels(true);
      
      // Always use AI to get the most exhaustive list possible including specific codes (LC200, etc.)
      const aiModels = await fetchModelsFromAI(formData.brand);
      if (aiModels.length > 0) {
        setAvailableModels(aiModels);
      } else {
        // Fallback allows manual entry
        setAvailableModels([]); 
      }
      setIsLoadingModels(false);
    };

    // Debounce slightly to avoid rapid calls if typing
    const timer = setTimeout(() => {
        if (formData.brand) loadModels();
    }, 500);

    return () => clearTimeout(timer);
  }, [formData.brand]);

  // Auto-generate title hint when key info is selected
  const handleAutoTitle = useCallback(async () => {
     if (formData.brand && formData.model && !formData.title) {
        setIsGeneratingTitle(true);
        const suggestion = await generateTitleSuggestion(
            formData.brand, 
            formData.model,
            formData.year || 'recent',
            formData.bodyType || 'car'
        );
        if (suggestion) {
            setFormData(prev => ({...prev, title: suggestion}));
        }
        setIsGeneratingTitle(false);
     }
  }, [formData.brand, formData.model, formData.title, formData.year, formData.bodyType]);

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Header Section */}
      <div className="p-6 md:p-8 border-b border-slate-100">
        <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-white border border-slate-200 rounded-2xl flex items-center justify-center text-slate-700 shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" /> 
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
                 <svg className="h-6 w-6 absolute" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 16H9m10 0h3v-3.15a1 1 0 0 0-.84-.99L16 11l-2.7-3.6a1 1 0 0 0-.8-.4H5.24a2 2 0 0 0-1.8 1.1l-.8 1.63A6 6 0 0 0 2 12.42V16h2"></path>
                    <circle cx="6.5" cy="16.5" r="2.5"></circle>
                    <circle cx="16.5" cy="16.5" r="2.5"></circle>
                </svg>
            </div>
            <div>
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    Étape 1 • Identité & typologie
                    <svg className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                </h2>
                <p className="text-slate-500 text-sm mt-1">
                    Renseignez les détails techniques pour une classification précise.
                </p>
            </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="p-6 md:p-8 space-y-8">
        
        {/* Subheader */}
        <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Caractéristiques techniques</h3>
            <p className="text-slate-600 font-medium">Ces informations permettent aux locataires de trouver votre véhicule via les filtres de recherche.</p>
        </div>

        {/* Inputs */}
        <div className="space-y-6">
            
            {/* Title Input */}
            <div>
                <div className="flex justify-between items-center mb-1.5">
                    <label htmlFor="title" className="block text-sm font-semibold text-slate-700">
                        Titre de l'annonce *
                    </label>
                    {/* Bonus Feature: AI Suggestion */}
                    {formData.brand && formData.model && (
                        <button 
                            type="button"
                            onClick={handleAutoTitle}
                            className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 transition-colors"
                        >
                            {isGeneratingTitle ? 'Génération...' : '✨ Suggérer un titre'}
                        </button>
                    )}
                </div>
                <input
                    id="title"
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="Ex: Clio 5 Hybride, idéal ville et route"
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all shadow-sm"
                />
            </div>

            {/* Brand and Model Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Autocomplete 
                    id="brand"
                    label="Marque"
                    placeholder="Rechercher une marque"
                    value={formData.brand}
                    onChange={(val) => setFormData(prev => ({...prev, brand: val}))}
                    options={POPULAR_BRANDS}
                    onSearch={fetchBrandsFromAI} 
                    required
                />

                <Autocomplete 
                    id="model"
                    label="Modèle"
                    placeholder={!formData.brand ? "Sélectionnez d'abord une marque" : "Rechercher ou ajouter un modèle"}
                    value={formData.model}
                    onChange={(val) => {
                        setFormData(prev => ({...prev, model: val}));
                        setModelError(undefined);
                    }}
                    options={availableModels}
                    loading={isLoadingModels}
                    disabled={!formData.brand}
                    required
                    error={modelError}
                />
            </div>

            {/* Year, Body, Engine Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Autocomplete 
                    id="year"
                    label="Année"
                    placeholder="Année"
                    value={formData.year}
                    onChange={(val) => setFormData(prev => ({...prev, year: val}))}
                    options={years}
                    required
                />

                 <Autocomplete 
                    id="bodyType"
                    label="Carrosserie"
                    placeholder="Type"
                    value={formData.bodyType}
                    onChange={(val) => setFormData(prev => ({...prev, bodyType: val}))}
                    options={BODY_TYPES}
                    required
                />

                <Autocomplete 
                    id="engine"
                    label="Motorisation"
                    placeholder="Carburant"
                    value={formData.engine}
                    onChange={(val) => setFormData(prev => ({...prev, engine: val}))}
                    options={ENGINE_TYPES}
                    required
                />
            </div>
            
            {/* Helper text for the "Manual" feature mentioned in prompt */}
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex gap-3">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-blue-800">
                    <strong>Véhicule introuvable ?</strong> Notre base de données évolue constamment. Vous pouvez ajouter manuellement n'importe quelle marque ou modèle en le saisissant entièrement et en cliquant sur "Ajouter".
                </p>
            </div>

        </div>
      </div>
    </div>
  );
};

export default VehicleForm;