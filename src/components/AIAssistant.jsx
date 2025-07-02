// src/components/AIAssistant.jsx
import React, { useState } from 'react';
import { useAIEngine } from '../hooks/useAIEngine';

const AIAssistant = ({ onGenerate }) => {
  const [prompt, setPrompt] = useState('');

  const handleGenerate = () => {
    onGenerate(prompt); // hook into backend/gen logic
  };

  return (
    <div className="p-4 border-t border-zinc-800">
      <textarea
        placeholder="Describe your architecture..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        className="w-full p-2 text-sm bg-zinc-800 text-white border border-zinc-700 rounded"
      />
      <button onClick={handleGenerate} className="mt-2 px-4 py-1 bg-blue-600 text-white text-sm rounded">
        Generate
      </button>
    </div>
  );
};

export default AIAssistant;
