import React from 'react';
import { Gauge } from 'lucide-react';
import { cn } from '@/lib/utils';

const SPEEDS = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2, 3];

export default function SpeedControl({ speed, onSpeedChange }) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
        <Gauge className="w-4 h-4" />
        Velocidad de Reproducción
      </h3>
      <div className="grid grid-cols-4 gap-1.5">
        {SPEEDS.map((s) => (
          <button
            key={s}
            onClick={() => onSpeedChange(s)}
            className={cn(
              "py-1.5 px-2 rounded-md text-xs font-medium transition-all",
              speed === s
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                : "bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground"
            )}
          >
            {s}x
          </button>
        ))}
      </div>
    </div>
  );
}
