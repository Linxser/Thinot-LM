import React, { useRef } from 'react';
import { Upload, Film, FileVideo, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ImportPanel({ videoSrc, videoName, onImport, onClear }) {
  const inputRef = useRef(null);

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      onImport(url, file.name);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
        <Film className="w-4 h-4" />
        Importar Video
      </h3>

      <input
        ref={inputRef}
        type="file"
        accept="video/mp4,video/webm,video/ogg"
        className="hidden"
        onChange={handleFile}
      />

      {!videoSrc ? (
        <button
          onClick={() => inputRef.current?.click()}
          className="w-full p-6 border-2 border-dashed border-border rounded-xl flex flex-col items-center gap-3 hover:border-primary/50 hover:bg-primary/5 transition-all group"
        >
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
            <Upload className="w-5 h-5 text-primary" />
          </div>
          <div className="text-center">
            <p className="text-xs font-medium text-foreground">Toca para importar</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">MP4, WebM, OGG</p>
          </div>
        </button>
      ) : (
        <div className="p-3 rounded-lg bg-secondary/50 border border-border space-y-3">
          <div className="flex items-center gap-2">
            <FileVideo className="w-4 h-4 text-primary shrink-0" />
            <span className="text-xs font-medium truncate">{videoName}</span>
          </div>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              className="flex-1 h-7 text-xs"
              onClick={() => inputRef.current?.click()}
            >
              <Upload className="w-3 h-3 mr-1" />
              Cambiar
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs text-destructive hover:text-destructive"
              onClick={onClear}
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        </div>
      )}

      <div className="text-[10px] text-muted-foreground/60 space-y-1">
        <p>• Optimizado para Android 10 (32-bit)</p>
        <p>• Los efectos se aplican en tiempo real</p>
        <p>• Procesamiento ligero en el navegador</p>
      </div>
    </div>
  );
}
