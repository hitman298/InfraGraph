import { memo } from 'react';

function InfraNode({ data }) {
  return (
    <div className="bg-zinc-900 text-white border border-zinc-700 rounded-lg px-4 py-2 shadow-md min-w-[160px] font-mono">
      <h4 className="text-sm font-semibold text-zinc-100">{data.label}</h4>
      {data.type && (
        <p className="text-xs text-zinc-400 mt-1">Type: {data.type}</p>
      )}
    </div>
  );
}

export default memo(InfraNode);
