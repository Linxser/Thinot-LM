import React from 'react';
import { cn } from '@/lib/utils';

const PRESETS = [
  { name: 'Normal', filters: { brightness: 100, contrast: 100, saturation: 100, blur: 0, sepia: 0, hueRotate: 0, grayscale: 0 } },
  { name: 'Cálido', filters: { brightness: 105, contrast: 105, saturation: 120, blur: 0, sepia: 20, hueRotate: 0, grayscale: 0 } },
  { name: 'Frío', filters: { brightness: 100, contrast: 110, saturation: 80, blur: 0, sepia: 0, hueRotate: 200, grayscale: 0 } },
  { name: 'Vintage', filters: { brightness: 95, contrast: 90, saturation: 70, blur: 0, sepia: 40, hueRotate: 0, grayscale: 0 } },
  { name: 'B&N', filters: { brightness: 105, contrast: 120, saturation: 0, blur: 0, sepia: 0, hueRotate: 0, grayscale: 100 } },
  { name: 'Dramático', filters: { brightness: 90, contrast: 150, saturation: 130, blur: 0, sepia: 0, hueRotate: 0, grayscale: 0 } },
  { name: 'Soñador', filters: { brightness: 110, contrast: 85, saturation: 110, blur: 1, sepia: 10, hueRotate: 0, grayscale: 0 } },
  { name: 'Neón', filters: { brightness: 110, contrast: 130, saturation: 180, blur: 0, sepia: 0, hueRotate: 30, grayscale: 0 } },
];

export default function FilterPresets({ currentFilters, onApply }) {
  const isActive = (preset) => {
    return Object.keys(preset.filters).every(key => preset.filters[key] === currentFilters[key]);
  };

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-foreground">Presets Rápidos</h3>
      <div className="grid grid-cols-4 gap-2">
        {PRESETS.map((preset) => (
          <button
            key={preset.name}
            onClick={() => onApply(preset.filters)}
            className={cn(
              "flex flex-col items-center gap-1.5 p-2 rounded-lg border transition-all",
              isActive(preset)
                ? "border-primary bg-primary/10 text-primary"
                : "border-border bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground"
            )}
          >
            <div
              className="w-8 h-8 rounded-md bg-gradient-to-br from-purple-400 to-blue-400"
              style={{
                filter: `brightness(${preset.filters.brightness}%) contrast(${preset.filters.contrast}%) saturate(${preset.filters.saturation}%) sepia(${preset.filters.sepia}%) grayscale(${preset.filters.grayscale}%) hue-rotate(${preset.filters.hueRotate}deg)`
              }}
            />
            <span className="text-[10px] font-medium">{preset.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
