import React from 'react';
import { Scissors } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';

export default function TrimControl({ trimStart, trimEnd, duration, onTrimChange }) {
  const formatTime = (t) => {
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60);
    const ms = Math.floor((t % 1) * 10);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}.${ms}`;
  };

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
        <Scissors className="w-4 h-4" />
        Recortar Video
      </h3>

      <div className="space-y-3">
        <div>
          <div className="flex justify-between mb-1">
            <Label className="text-xs text-muted-foreground">Inicio</Label>
            <span className="text-xs text-primary font-mono">{formatTime(trimStart)}</span>
          </div>
          <Slider
            value={[trimStart]}
            min={0}
            max={duration}
            step={0.1}
            onValueChange={(val) => onTrimChange(val[0], trimEnd)}
          />
        </div>

        <div>
          <div className="flex justify-between mb-1">
            <Label className="text-xs text-muted-foreground">Fin</Label>
            <span className="text-xs text-primary font-mono">{formatTime(trimEnd)}</span>
          </div>
          <Slider
            value={[trimEnd]}
            min={0}
            max={duration}
            step={0.1}
            onValueChange={(val) => onTrimChange(trimStart, val[0])}
          />
        </div>

        <div className="flex items-center justify-between p-2 rounded-md bg-primary/5 border border-primary/20">
          <span className="text-xs text-muted-foreground">Duración del recorte</span>
          <span className="text-xs font-semibold text-primary font-mono">
            {formatTime(Math.max(0, trimEnd - trimStart))}
          </span>
        </div>
      </div>
    </div>
  );
}
