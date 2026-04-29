import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Maximize } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

export default function VideoPreview({ videoSrc, filters, textOverlay, playbackSpeed, onTimeUpdate, isPlaying, setIsPlaying, currentTime, setCurrentTime }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [duration, setDuration] = React.useState(0);
  const [volume, setVolume] = React.useState(1);
  const [muted, setMuted] = React.useState(false);

  const getFilterString = useCallback(() => {
    if (!filters) return 'none';
    const parts = [];
    if (filters.brightness !== 100) parts.push(`brightness(${filters.brightness}%)`);
    if (filters.contrast !== 100) parts.push(`contrast(${filters.contrast}%)`);
    if (filters.saturation !== 100) parts.push(`saturate(${filters.saturation}%)`);
    if (filters.blur > 0) parts.push(`blur(${filters.blur}px)`);
    if (filters.sepia > 0) parts.push(`sepia(${filters.sepia}%)`);
    if (filters.hueRotate !== 0) parts.push(`hue-rotate(${filters.hueRotate}deg)`);
    if (filters.grayscale > 0) parts.push(`grayscale(${filters.grayscale}%)`);
    return parts.length > 0 ? parts.join(' ') : 'none';
  }, [filters]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = playbackSpeed || 1;
    }
  }, [playbackSpeed]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = muted ? 0 : volume;
    }
  }, [volume, muted]);

  const togglePlay = () => {
    if (!videoRef.current || !videoSrc) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      onTimeUpdate?.(videoRef.current.currentTime);
    }
  };

  const handleSeek = (val) => {
    if (videoRef.current) {
      videoRef.current.currentTime = val[0];
      setCurrentTime(val[0]);
    }
  };

  const skip = (seconds) => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(0, Math.min(duration, videoRef.current.currentTime + seconds));
    }
  };

  const formatTime = (t) => {
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col h-full">
      {/* Video Display */}
      <div className="flex-1 relative bg-black/40 rounded-lg overflow-hidden flex items-center justify-center min-h-0">
        {videoSrc ? (
          <div className="relative w-full h-full flex items-center justify-center">
            <video
              ref={videoRef}
              src={videoSrc}
              className="max-w-full max-h-full object-contain"
              style={{ filter: getFilterString() }}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={() => setDuration(videoRef.current?.duration || 0)}
              onEnded={() => setIsPlaying(false)}
            />
            {/* Text Overlay */}
            {textOverlay?.text && (
              <div
                className="absolute pointer-events-none"
                style={{
                  top: `${textOverlay.y || 50}%`,
                  left: `${textOverlay.x || 50}%`,
                  transform: 'translate(-50%, -50%)',
                  fontSize: `${textOverlay.size || 24}px`,
                  color: textOverlay.color || '#ffffff',
                  fontWeight: textOverlay.bold ? 'bold' : 'normal',
                  fontStyle: textOverlay.italic ? 'italic' : 'normal',
                  textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                  whiteSpace: 'nowrap',
                }}
              >
                {textOverlay.text}
              </div>
            )}
          </div>
        ) : (
          <div className="text-muted-foreground text-center p-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-secondary flex items-center justify-center">
              <Play className="w-7 h-7 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium">Importa un video para comenzar</p>
            <p className="text-xs mt-1 text-muted-foreground/70">Formatos: MP4, WebM, OGG</p>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="mt-3 space-y-2">
        {/* Seek bar */}
        <Slider
          value={[currentTime]}
          max={duration || 100}
          step={0.1}
          onValueChange={handleSeek}
          className="w-full"
          disabled={!videoSrc}
        />

        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground font-mono tabular-nums">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-10 w-10" onClick={() => skip(-5)} disabled={!videoSrc}>
              <SkipBack className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-11 w-11 bg-primary/20 hover:bg-primary/30 rounded-full"
              onClick={togglePlay}
              disabled={!videoSrc}
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
            </Button>
            <Button variant="ghost" size="icon" className="h-10 w-10" onClick={() => skip(5)} disabled={!videoSrc}>
              <SkipForward className="w-5 h-5" />
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => setMuted(!muted)}>
              {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </Button>
            <span className="text-xs text-primary font-medium bg-primary/10 px-2.5 py-1 rounded-md">
              {playbackSpeed}x
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
