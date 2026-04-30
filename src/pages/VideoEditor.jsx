import React, { useState } from 'react';
import { Film, ChevronUp, ChevronDown } from 'lucide-react';
import VideoPreview from '@/components/editor/VideoPreview';
import ToolsSidebar from '@/components/editor/ToolsSidebar';
import EffectsPanel from '@/components/editor/EffectsPanel';
import FilterPresets from '@/components/editor/FilterPresets';
import TextOverlayPanel from '@/components/editor/TextOverlayPanel';
import SpeedControl from '@/components/editor/SpeedControl';
import TrimControl from '@/components/editor/TrimControl';
import ImportPanel from '@/components/editor/ImportPanel';
import ExportPanel from '@/components/editor/ExportPanel';
import AudioPanel from '@/components/editor/AudioPanel';
import Timeline from '@/components/editor/Timeline';
import { ScrollArea } from '@/components/ui/scroll-area';

const DEFAULT_FILTERS = {
  brightness: 100,
  contrast: 100,
  saturation: 100,
  blur: 0,
  sepia: 0,
  hueRotate: 0,
  grayscale: 0,
};

const DEFAULT_TEXT = {
  text: '',
  size: 24,
  color: '#ffffff',
  bold: false,
  italic: false,
  x: 50,
  y: 50,
};

export default function VideoEditor() {
  const [videoSrc, setVideoSrc] = useState(null);
  const [videoName, setVideoName] = useState('');
  const [activeTool, setActiveTool] = useState('import');
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [textOverlay, setTextOverlay] = useState(DEFAULT_TEXT);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [trimStart, setTrimStart] = useState(0);
  const [trimEnd, setTrimEnd] = useState(0);
  const [audioState, setAudioState] = useState({
    audioSrc: null,
    audioName: '',
    volume: 80,
    muted: false,
    videoVolume: 100,
    videoMuted: false,
    fadeIn: false,
    fadeOut: false,
  });

  const handleImport = (src, name) => {
    setVideoSrc(src);
    setVideoName(name);
    setActiveTool('effects');
    setTrimStart(0);
    setCurrentTime(0);
  };

  const handleClear = () => {
    if (videoSrc) URL.revokeObjectURL(videoSrc);
    setVideoSrc(null);
    setVideoName('');
    setFilters(DEFAULT_FILTERS);
    setTextOverlay(DEFAULT_TEXT);
    setPlaybackSpeed(1);
    setCurrentTime(0);
    setDuration(0);
    setTrimStart(0);
    setTrimEnd(0);
  };

  const handleTimeUpdate = (time) => {
    if (duration === 0) {
      const video = document.querySelector('video');
      if (video?.duration) {
        setDuration(video.duration);
        setTrimEnd(video.duration);
      }
    }
  };

  const handleTrimChange = (start, end) => {
    setTrimStart(Math.max(0, start));
    setTrimEnd(Math.min(duration, end));
  };

  const handleSeek = (time) => {
    setCurrentTime(time);
    const video = document.querySelector('video');
    if (video) video.currentTime = time;
  };

  const renderToolPanel = () => {
    switch (activeTool) {
      case 'import':
        return <ImportPanel videoSrc={videoSrc} videoName={videoName} onImport={handleImport} onClear={handleClear} />;
      case 'effects':
        return (
          <div className="space-y-6">
            <FilterPresets currentFilters={filters} onApply={setFilters} />
            <div className="h-px bg-border" />
            <EffectsPanel filters={filters} onFilterChange={setFilters} />
          </div>
        );
      case 'text':
        return <TextOverlayPanel textOverlay={textOverlay} onTextChange={setTextOverlay} />;
      case 'speed':
        return <SpeedControl speed={playbackSpeed} onSpeedChange={setPlaybackSpeed} />;
      case 'audio':
        return <AudioPanel audioState={audioState} onAudioChange={setAudioState} />;
      case 'trim':
        return <TrimControl trimStart={trimStart} trimEnd={trimEnd} duration={duration} onTrimChange={handleTrimChange} />;
      case 'export':
        return <ExportPanel videoSrc={videoSrc} filters={filters} textOverlay={textOverlay} />;
      default:
        return null;
    }
  };

  const [headerVisible, setHeaderVisible] = useState(true);

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {/* Header — tablet-friendly height */}
      {headerVisible && (
        <header className="h-12 flex items-center justify-between px-4 border-b border-border bg-card shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-primary/20 flex items-center justify-center">
              <Film className="w-4 h-4 text-primary" />
            </div>
            <span className="text-base font-semibold tracking-tight">LM</span>
            <span className="text-[10px] text-muted-foreground bg-secondary px-2 py-0.5 rounded-full font-medium">v1.0</span>
          </div>
          <div className="flex items-center gap-2">
            {videoName && (
              <span className="text-xs text-muted-foreground truncate max-w-[200px] bg-secondary/60 px-2 py-1 rounded-md">
                {videoName}
              </span>
            )}
            <button
              onClick={() => setHeaderVisible(false)}
              className="h-7 w-7 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              title="Ocultar barra"
            >
              <ChevronUp className="w-4 h-4" />
            </button>
          </div>
        </header>
      )}

      {/* Show header button when hidden */}
      {!headerVisible && (
        <button
          onClick={() => setHeaderVisible(true)}
          className="h-6 w-full flex items-center justify-center bg-card border-b border-border text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors shrink-0"
          title="Mostrar barra"
        >
          <ChevronDown className="w-3.5 h-3.5" />
        </button>
      )}

      <div className="flex flex-1 min-h-0">
        {/* Tools Sidebar */}
        <ToolsSidebar activeTool={activeTool} onToolChange={setActiveTool} />

        {/* Main Content — always row on tablet */}
        <div className="flex flex-row flex-1 min-w-0">
          {/* Video Preview + Timeline */}
          <div className="flex-1 flex flex-col p-3 min-w-0">
            <div className="flex-1 min-h-0">
              <VideoPreview
                videoSrc={videoSrc}
                filters={filters}
                textOverlay={textOverlay}
                playbackSpeed={playbackSpeed}
                onTimeUpdate={handleTimeUpdate}
                isPlaying={isPlaying}
                setIsPlaying={setIsPlaying}
                currentTime={currentTime}
                setCurrentTime={setCurrentTime}
              />
            </div>

            {/* Timeline */}
            {videoSrc && (
              <div className="mt-3 shrink-0">
                <Timeline
                  duration={duration}
                  currentTime={currentTime}
                  trimStart={trimStart}
                  trimEnd={trimEnd}
                  onSeek={handleSeek}
                />
              </div>
            )}
          </div>

          {/* Right Panel — fixed width optimized for 7" tablet */}
          <div className="w-72 border-l border-border bg-card shrink-0">
            <ScrollArea className="h-full">
              <div className="p-4">
                {renderToolPanel()}
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  );
}
