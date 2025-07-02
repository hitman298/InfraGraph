// src/components/SmartSuggestions.jsx
import React from 'react';
import { useAIEngine } from '../hooks/useAIEngine';

const SmartSuggestions = ({ selectedComponent }) => {
  // Destructure the suggestNextComponent function from the useAIEngine hook.
  // This hook is responsible for providing AI-powered suggestions based on the component type.
  const { suggestNextComponent } = useAIEngine();

  // If no component is selected, there are no suggestions to display, so return null.
  if (!selectedComponent) return null;

  // Get suggestions for the currently selected component's type using the AI engine.
  const suggestions = suggestNextComponent(selectedComponent.data.type);

  return (
    <div className="p-4">
      {/* Header for the suggested components section */}
      <h4 className="text-sm font-bold mb-2">Suggested Components</h4>
      
      {/* List to display the suggestions */}
      <ul className="list-disc list-inside text-xs text-zinc-300">
        {/* Map over the suggestions array and render each suggestion as a list item */}
        {suggestions.map((s) => (
          <li key={s}>{s}</li> // Use the suggestion string as both key and content
        ))}
      </ul>
    </div>
  );
};

export default SmartSuggestions;
