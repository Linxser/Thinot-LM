import React from 'react';
import { Sun, Contrast, Droplets, Wind, Palette, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';

const EFFECTS = [
  { key: 'brightness', label: 'Brillo', icon: Sun, min: 0, max: 200, default: 100 },
  { key: 'contrast', label: 'Contraste', icon: Contrast, min: 0, max: 200, default: 100 },
  { key: 'saturation', label: 'Saturación', icon: Droplets, min: 0, max: 200, default: 100 },
  { key: 'blur', label: 'Desenfoque', icon: Wind, min: 0, max: 10, default: 0 },
  { key: 'sepia', label: 'Sepia', icon: Palette, min: 0, max: 100, default: 0 },
  { key: 'hueRotate', label: 'Rotación Tono', icon: RotateCcw, min: 0, max: 360, default: 0 },
  { key: 'grayscale', label: 'Escala Grises', icon: Palette, min: 0, max: 100, default: 0 },
];

export default function EffectsPanel({ filters, onFilterChange }) {
  const handleChange = (key, value) => {
    onFilterChange({ ...filters, [key]: value[0] });
  };

  const resetAll = () => {
    const defaults = {};
    EFFECTS.forEach(e => { defaults[e.key] = e.default; });
    onFilterChange(defaults);
  };

  const resetOne = (key) => {
    const effect = EFFECTS.find(e => e.key === key);
    if (effect) {
      onFilterChange({ ...filters, [key]: effect.default });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">Efectos y Filtros</h3>
        <Button variant="ghost" size="sm" className="text-xs h-7 text-muted-foreground hover:text-foreground" onClick={resetAll}>
          <RotateCcw className="w-3 h-3 mr-1" />
          Reiniciar
        </Button>
      </div>

      <div className="space-y-3">
        {EFFECTS.map(({ key, label, icon: Icon, min, max, default: def }) => (
          <div key={key} className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label className="text-xs flex items-center gap-1.5 text-muted-foreground">
                <Icon className="w-3 h-3" />
                {label}
              </Label>
              <div className="flex items-center gap-1">
                <span className="text-xs font-mono text-primary tabular-nums w-8 text-right">
                  {filters[key]}
                </span>
                {filters[key] !== def && (
                  <button
                    onClick={() => resetOne(key)}
                    className="text-muted-foreground/50 hover:text-muted-foreground text-xs"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>
            <Slider
              value={[filters[key]]}
              min={min}
              max={max}
              step={1}
              onValueChange={(val) => handleChange(key, val)}
              className="w-full"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
