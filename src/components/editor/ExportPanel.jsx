import React, { useState, useRef } from 'react';
import { Download, Loader2, Check, AlertCircle, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function ExportPanel({ videoSrc, filters, textOverlay }) {
  const [exporting, setExporting] = useState(false);
  const [done, setDone] = useState(false);
  const [format, setFormat] = useState('webm');

  const captureFrame = () => {
    const video = document.querySelector('video');
    if (!video) return;

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');

    // Apply filters
    if (filters) {
      const parts = [];
      if (filters.brightness !== 100) parts.push(`brightness(${filters.brightness}%)`);
      if (filters.contrast !== 100) parts.push(`contrast(${filters.contrast}%)`);
      if (filters.saturation !== 100) parts.push(`saturate(${filters.saturation}%)`);
      if (filters.sepia > 0) parts.push(`sepia(${filters.sepia}%)`);
      if (filters.hueRotate !== 0) parts.push(`hue-rotate(${filters.hueRotate}deg)`);
      if (filters.grayscale > 0) parts.push(`grayscale(${filters.grayscale}%)`);
      ctx.filter = parts.join(' ') || 'none';
    }

    ctx.drawImage(video, 0, 0);

    // Draw text overlay
    if (textOverlay?.text) {
      ctx.filter = 'none';
      ctx.font = `${textOverlay.bold ? 'bold' : ''} ${textOverlay.italic ? 'italic' : ''} ${textOverlay.size || 24}px Inter, sans-serif`;
      ctx.fillStyle = textOverlay.color || '#ffffff';
      ctx.shadowColor = 'rgba(0,0,0,0.8)';
      ctx.shadowBlur = 4;
      ctx.textAlign = 'center';
      const x = (textOverlay.x / 100) * canvas.width;
      const y = (textOverlay.y / 100) * canvas.height;
      ctx.fillText(textOverlay.text, x, y);
    }

    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `captura_${Date.now()}.png`;
      a.click();
      URL.revokeObjectURL(url);
    }, 'image/png');
  };

  const handleExport = async () => {
    if (!videoSrc) return;
    setExporting(true);
    setDone(false);

    const video = document.querySelector('video');
    if (!video) {
      setExporting(false);
      return;
    }

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext('2d');

    const mimeType = format === 'webm' ? 'video/webm;codecs=vp8' : 'video/mp4';
    const stream = canvas.captureStream(30);
    
    // Add audio if available
    if (video.captureStream) {
      const videoStream = video.captureStream();
      const audioTracks = videoStream.getAudioTracks();
      audioTracks.forEach(track => stream.addTrack(track));
    }

    const recorder = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp8' });
    const chunks = [];

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data);
    };

    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `video_editado_${Date.now()}.webm`;
      a.click();
      URL.revokeObjectURL(url);
      setExporting(false);
      setDone(true);
      setTimeout(() => setDone(false), 3000);
    };

    recorder.start();
    video.currentTime = 0;
    await video.play();

    const drawFrame = () => {
      if (video.paused || video.ended) {
        recorder.stop();
        return;
      }

      // Apply filters
      const parts = [];
      if (filters?.brightness !== 100) parts.push(`brightness(${filters.brightness}%)`);
      if (filters?.contrast !== 100) parts.push(`contrast(${filters.contrast}%)`);
      if (filters?.saturation !== 100) parts.push(`saturate(${filters.saturation}%)`);
      if (filters?.sepia > 0) parts.push(`sepia(${filters.sepia}%)`);
      if (filters?.hueRotate !== 0) parts.push(`hue-rotate(${filters.hueRotate}deg)`);
      if (filters?.grayscale > 0) parts.push(`grayscale(${filters.grayscale}%)`);
      ctx.filter = parts.join(' ') || 'none';

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Draw text
      if (textOverlay?.text) {
        ctx.filter = 'none';
        ctx.font = `${textOverlay.bold ? 'bold' : ''} ${textOverlay.italic ? 'italic' : ''} ${textOverlay.size || 24}px Inter, sans-serif`;
        ctx.fillStyle = textOverlay.color || '#ffffff';
        ctx.shadowColor = 'rgba(0,0,0,0.8)';
        ctx.shadowBlur = 4;
        ctx.textAlign = 'center';
        const x = (textOverlay.x / 100) * canvas.width;
        const y = (textOverlay.y / 100) * canvas.height;
        ctx.fillText(textOverlay.text, x, y);
      }

      requestAnimationFrame(drawFrame);
    };

    drawFrame();
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
        <Download className="w-4 h-4" />
        Exportar
      </h3>

      <div className="space-y-3">
        <div>
          <Label className="text-xs text-muted-foreground">Formato</Label>
          <Select value={format} onValueChange={setFormat}>
            <SelectTrigger className="mt-1 h-8 text-sm bg-secondary">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="webm">WebM (Recomendado)</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-[10px] text-muted-foreground/60 mt-1">WebM es compatible con Android 10</p>
        </div>

        <Button
          className="w-full h-9 text-sm"
          onClick={handleExport}
          disabled={!videoSrc || exporting}
        >
          {exporting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Exportando...
            </>
          ) : done ? (
            <>
              <Check className="w-4 h-4 mr-2" />
              ¡Listo!
            </>
          ) : (
            <>
              <Download className="w-4 h-4 mr-2" />
              Exportar Video
            </>
          )}
        </Button>

        <Button
          variant="secondary"
          className="w-full h-8 text-xs"
          onClick={captureFrame}
          disabled={!videoSrc}
        >
          <Camera className="w-3.5 h-3.5 mr-1.5" />
          Capturar Fotograma
        </Button>

        {!videoSrc && (
          <div className="flex items-center gap-2 p-2 rounded-md bg-destructive/10 border border-destructive/20">
            <AlertCircle className="w-3.5 h-3.5 text-destructive shrink-0" />
            <span className="text-[10px] text-destructive">Importa un video primero</span>
          </div>
        )}
      </div>
    </div>
  );
}
