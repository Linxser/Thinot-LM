import React from 'react';
import { Sparkles, Type, Gauge, Scissors, Upload, Download, Music } from 'lucide-react';
import { cn } from '@/lib/utils';

const TOOLS = [
  { id: 'import', icon: Upload, label: 'Importar' },
  { id: 'effects', icon: Sparkles, label: 'Efectos' },
  { id: 'text', icon: Type, label: 'Texto' },
  { id: 'audio', icon: Music, label: 'Audio' },
  { id: 'speed', icon: Gauge, label: 'Velocidad' },
  { id: 'trim', icon: Scissors, label: 'Recortar' },
  { id: 'export', icon: Download, label: 'Exportar' },
];

export default function ToolsSidebar({ activeTool, onToolChange }) {
  return (
    <div className="flex flex-col items-center py-3 gap-1 bg-card border-r border-border w-[72px] shrink-0">
      {TOOLS.map(({ id, icon: Icon, label }) => (
        <button
          key={id}
          onClick={() => onToolChange(id)}
          className={cn(
            "flex flex-col items-center gap-1 w-14 py-2.5 rounded-xl transition-all",
            activeTool === id
              ? "bg-primary/15 text-primary"
              : "text-muted-foreground hover:text-foreground hover:bg-secondary"
          )}
        >
          <Icon className="w-5 h-5" />
          <span className="text-[10px] font-medium leading-none">{label}</span>
        </button>
      ))}
    </div>
  );
}
