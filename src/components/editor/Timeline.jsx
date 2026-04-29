import React, { useRef } from 'react';
import { cn } from '@/lib/utils';

export default function Timeline({ duration, currentTime, trimStart, trimEnd, onSeek }) {
  const trackRef = useRef(null);

  const handleClick = (e) => {
    if (!trackRef.current || !duration) return;
    const rect = trackRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const ratio = x / rect.width;
    onSeek(ratio * duration);
  };

  const trimStartPct = duration ? (trimStart / duration) * 100 : 0;
  const trimEndPct = duration ? (trimEnd / duration) * 100 : 100;
  const playheadPct = duration ? (currentTime / duration) * 100 : 0;

  // Generate time markers
  const markers = [];
  if (duration > 0) {
    const step = duration <= 10 ? 1 : duration <= 60 ? 5 : duration <= 300 ? 15 : 30;
    for (let t = 0; t <= duration; t += step) {
      markers.push(t);
    }
  }

  return (
    <div className="space-y-2">
      {/* Time markers */}
      <div className="relative h-4 overflow-hidden">
        {markers.map(t => (
          <div
            key={t}
            className="absolute top-0 flex flex-col items-center"
            style={{ left: `${(t / duration) * 100}%` }}
          >
            <div className="w-px h-2 bg-muted-foreground/30" />
            <span className="text-[8px] text-muted-foreground/50 font-mono">{Math.floor(t / 60)}:{(t % 60).toString().padStart(2, '0')}</span>
          </div>
        ))}
      </div>

      {/* Track */}
      <div
        ref={trackRef}
        className="relative h-12 bg-secondary/50 rounded-lg cursor-pointer overflow-hidden border border-border"
        onClick={handleClick}
      >
        {/* Waveform-style pattern */}
        <div className="absolute inset-0 flex items-center px-1 gap-px">
          {Array.from({ length: 80 }).map((_, i) => (
            <div
              key={i}
              className="flex-1 bg-primary/20 rounded-sm min-w-[2px]"
              style={{ height: `${20 + Math.random() * 60}%` }}
            />
          ))}
        </div>

        {/* Trim overlay - outside region */}
        <div
          className="absolute top-0 bottom-0 left-0 bg-black/60"
          style={{ width: `${trimStartPct}%` }}
        />
        <div
          className="absolute top-0 bottom-0 right-0 bg-black/60"
          style={{ width: `${100 - trimEndPct}%` }}
        />

        {/* Trim handles */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-accent cursor-ew-resize z-10"
          style={{ left: `${trimStartPct}%` }}
        >
          <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-3 h-6 bg-accent rounded-sm" />
        </div>
        <div
          className="absolute top-0 bottom-0 w-1 bg-accent cursor-ew-resize z-10"
          style={{ left: `${trimEndPct}%` }}
        >
          <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-3 h-6 bg-accent rounded-sm" />
        </div>

        {/* Playhead */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-20 transition-all duration-100"
          style={{ left: `${playheadPct}%` }}
        >
          <div className="absolute -top-1 -left-1.5 w-3 h-3 bg-red-500 rounded-full" />
        </div>
      </div>
    </div>
  );
}
