import React from 'react';
import { Type, Bold, Italic, Move } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const COLORS = ['#ffffff', '#000000', '#ff4444', '#44aaff', '#44ff88', '#ffaa00', '#ff44ff', '#aaaaaa'];

export default function TextOverlayPanel({ textOverlay, onTextChange }) {
  const update = (key, value) => {
    onTextChange({ ...textOverlay, [key]: value });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
        <Type className="w-4 h-4" />
        Texto Superpuesto
      </h3>

      <div className="space-y-3">
        <div>
          <Label className="text-xs text-muted-foreground">Texto</Label>
          <Input
            value={textOverlay.text || ''}
            onChange={(e) => update('text', e.target.value)}
            placeholder="Escribe tu texto aquí..."
            className="mt-1 h-8 text-sm bg-secondary border-border"
          />
        </div>

        <div>
          <Label className="text-xs text-muted-foreground">Tamaño: {textOverlay.size || 24}px</Label>
          <Slider
            value={[textOverlay.size || 24]}
            min={10}
            max={80}
            step={1}
            onValueChange={(val) => update('size', val[0])}
            className="mt-1"
          />
        </div>

        <div>
          <Label className="text-xs text-muted-foreground">Color</Label>
          <div className="flex gap-1.5 mt-1.5">
            {COLORS.map(color => (
              <button
                key={color}
                onClick={() => update('color', color)}
                className={cn(
                  "w-6 h-6 rounded-full border-2 transition-transform",
                  textOverlay.color === color ? "border-primary scale-110" : "border-transparent"
                )}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant={textOverlay.bold ? "default" : "secondary"}
            size="sm"
            className="h-7 w-7 p-0"
            onClick={() => update('bold', !textOverlay.bold)}
          >
            <Bold className="w-3.5 h-3.5" />
          </Button>
          <Button
            variant={textOverlay.italic ? "default" : "secondary"}
            size="sm"
            className="h-7 w-7 p-0"
            onClick={() => update('italic', !textOverlay.italic)}
          >
            <Italic className="w-3.5 h-3.5" />
          </Button>
        </div>

        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground flex items-center gap-1">
            <Move className="w-3 h-3" /> Posición
          </Label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="text-[10px] text-muted-foreground">X: {textOverlay.x || 50}%</span>
              <Slider
                value={[textOverlay.x || 50]}
                min={0}
                max={100}
                step={1}
                onValueChange={(val) => update('x', val[0])}
              />
            </div>
            <div>
              <span className="text-[10px] text-muted-foreground">Y: {textOverlay.y || 50}%</span>
              <Slider
                value={[textOverlay.y || 50]}
                min={0}
                max={100}
                step={1}
                onValueChange={(val) => update('y', val[0])}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
