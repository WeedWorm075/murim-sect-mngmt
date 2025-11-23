import React from 'react';
import { Home } from 'lucide-react';
import type { Sect } from '../../types/gameTypes';

interface SectStatsProps {
  sect: Sect;
}

export const SectStats: React.FC<SectStatsProps> = ({ sect }) => {
  return (
    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-6 rounded-lg border-2 border-emerald-600 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-emerald-900">{sect.name}</h3>
        <Home className="text-emerald-600" />
      </div>
      <div className="flex flex-wrap gap-3">
        <div className="flex-1 min-w-28 text-center p-3 bg-yellow-100 rounded-lg">
          <p className="text-yellow-900 font-bold text-lg">{sect.gold}</p>
          <p className="text-yellow-700 text-xs">Or</p>
        </div>
        <div className="flex-1 min-w-28 text-center p-3 bg-purple-100 rounded-lg">
          <p className="text-purple-900 font-bold text-lg">{sect.spiritualQi}</p>
          <p className="text-purple-700 text-xs">Qi</p>
        </div>
        <div className="flex-1 min-w-28 text-center p-3 bg-blue-100 rounded-lg">
          <p className="text-blue-900 font-bold text-lg">{sect.disciples}</p>
          <p className="text-blue-700 text-xs">Disciples</p>
        </div>
        <div className="flex-1 min-w-28 text-center p-3 bg-pink-100 rounded-lg">
          <p className="text-pink-900 font-bold text-lg">{sect.reputation}</p>
          <p className="text-pink-700 text-xs">Réputation</p>
        </div>
      </div>
    </div>
  );
};