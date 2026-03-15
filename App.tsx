import React from 'react';
import VehicleForm from './components/VehicleForm';

function App() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans text-slate-900">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Title / Context outside the card */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Mise en ligne de votre véhicule</h1>
          <p className="text-slate-500 text-lg">Complétez les informations ci-dessous pour commencer.</p>
        </div>

        <VehicleForm />
        
        {/* Footer actions simulating a real flow */}
        <div className="flex justify-end gap-4 pt-4">
             <button className="px-6 py-2.5 rounded-xl font-semibold text-slate-600 hover:bg-slate-200 transition-colors">
                 Retour
             </button>
             <button className="px-6 py-2.5 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 shadow-lg shadow-slate-900/20 transition-all transform active:scale-95">
                 Suivant
             </button>
        </div>
      </div>
    </div>
  );
}

export default App;