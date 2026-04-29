import React, { useState, useRef, useEffect } from 'react';
import { Music, Upload, Trash2, Volume2, VolumeX, Mic, Play, Pause, FileAudio } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';

export default function AudioPanel({ audioState, onAudioChange }) {
  const audioInputRef = useRef(null);
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const { audioSrc, audioName, volume, muted, videoVolume, videoMuted, fadeIn, fadeOut } = audioState;

  const update = (key, value) => onAudioChange({ ...audioState, [key]: value });

  const handleAudioFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    onAudioChange({ ...audioState, audioSrc: url, audioName: file.name });
  };

  const removeAudio = () => {
    if (audioSrc) URL.revokeObjectURL(audioSrc);
    onAudioChange({ ...audioState, audioSrc: null, audioName: '' });
    setIsPlaying(false);
  };

  const togglePreview = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = muted ? 0 : Math.min(1, volume / 100);
    }
  }, [volume, muted]);

  return (
    <div className="space-y-5">
      <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
        <Music className="w-4 h-4" />
        Audio
      </h3>

      {/* Video Audio Controls */}
      <div className="space-y-3 p-3 rounded-lg bg-secondary/40 border border-border">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Audio del Video</p>
        <div className="flex items-center justify-between">
          <Label className="text-xs flex items-center gap-1.5">
            {videoMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            Silenciar video
          </Label>
          <Switch
            checked={videoMuted}
            onCheckedChange={(v) => update('videoMuted', v)}
          />
        </div>
        <div className={cn("space-y-1", videoMuted && "opacity-40 pointer-events-none")}>
          <div className="flex justify-between">
            <Label className="text-xs text-muted-foreground">Volumen video</Label>
            <span className="text-xs text-primary font-mono">{videoVolume}%</span>
          </div>
          <Slider
            value={[videoVolume]}
            min={0}
            max={100}
            step={1}
            onValueChange={(v) => update('videoVolume', v[0])}
          />
        </div>
      </div>

      {/* Background Music */}
      <div className="space-y-3">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Música de Fondo</p>

        <input
          ref={audioInputRef}
          type="file"
          accept="audio/mp3,audio/wav,audio/ogg,audio/aac,audio/m4a"
          className="hidden"
          onChange={handleAudioFile}
        />

        {!audioSrc ? (
          <button
            onClick={() => audioInputRef.current?.click()}
            className="w-full p-4 border-2 border-dashed border-border rounded-xl flex flex-col items-center gap-2 hover:border-primary/50 hover:bg-primary/5 transition-all group"
          >
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <Upload className="w-4 h-4 text-primary" />
            </div>
            <div className="text-center">
              <p className="text-xs font-medium">Importar audio</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">MP3, WAV, OGG, AAC</p>
            </div>
          </button>
        ) : (
          <div className="space-y-3 p-3 rounded-lg bg-secondary/40 border border-border">
            <div className="flex items-center gap-2">
              <FileAudio className="w-4 h-4 text-primary shrink-0" />
              <span className="text-xs font-medium truncate flex-1">{audioName}</span>
              <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={removeAudio}>
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>

            {audioSrc && (
              <audio ref={audioRef} src={audioSrc} onEnded={() => setIsPlaying(false)} />
            )}

            <Button variant="secondary" size="sm" className="w-full h-7 text-xs" onClick={togglePreview}>
              {isPlaying ? <Pause className="w-3 h-3 mr-1.5" /> : <Play className="w-3 h-3 mr-1.5" />}
              {isPlaying ? 'Pausar preview' : 'Preview audio'}
            </Button>
          </div>
        )}

        {audioSrc && (
          <div className={cn("space-y-3", !audioSrc && "opacity-40 pointer-events-none")}>
            <div className="flex items-center justify-between">
              <Label className="text-xs flex items-center gap-1.5">
                {muted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                Silenciar música
              </Label>
              <Switch
                checked={muted}
                onCheckedChange={(v) => update('muted', v)}
              />
            </div>
            <div className={cn("space-y-1", muted && "opacity-40 pointer-events-none")}>
              <div className="flex justify-between">
                <Label className="text-xs text-muted-foreground">Volumen música</Label>
                <span className="text-xs text-primary font-mono">{volume}%</span>
              </div>
              <Slider
                value={[volume]}
                min={0}
                max={100}
                step={1}
                onValueChange={(v) => update('volume', v[0])}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label className="text-xs">Fade In</Label>
              <Switch checked={fadeIn} onCheckedChange={(v) => update('fadeIn', v)} />
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-xs">Fade Out</Label>
              <Switch checked={fadeOut} onCheckedChange={(v) => update('fadeOut', v)} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
