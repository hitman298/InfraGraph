// src/hooks/useAIEngine.js
import { infraRules } from '../lib/infraSchema';

export function useAIEngine() {
  const suggestNextComponent = (type) => {
    return infraRules[type]?.suggestedNext || [];
  };

  const getDefaultProps = (type) => {
    return infraRules[type]?.defaultProperties || {};
  };

  return {
    suggestNextComponent,
    getDefaultProps,
  };
}
