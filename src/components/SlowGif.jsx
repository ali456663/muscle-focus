import React, { useEffect, useRef, useState } from 'react';
import { parseGIF, decompressFrames } from 'gifuct-js';

export default function SlowGif({ src, alt, speed = 0.5, style }) {
  const canvasRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 300, height: 300 });

  const framesRef = useRef([]);
  const currentFrameIndexRef = useRef(0);
  const timeoutIdRef = useRef(null);
  const offscreenCanvasRef = useRef(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(false);
    framesRef.current = [];
    currentFrameIndexRef.current = 0;

    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current);
    }

    fetch(src)
      .then(res => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.arrayBuffer();
      })
      .then(buffer => {
        if (!active) return;
        try {
          const gif = parseGIF(buffer);
          const decompressed = decompressFrames(gif, true);
          
          if (!decompressed || decompressed.length === 0) {
            throw new Error('No frames decoded');
          }

          framesRef.current = decompressed;
          
          const firstFrame = decompressed[0];
          const w = firstFrame.dims.width;
          const h = firstFrame.dims.height;
          setDimensions({ width: w, height: h });

          const offscreen = document.createElement('canvas');
          offscreen.width = w;
          offscreen.height = h;
          offscreenCanvasRef.current = offscreen;

          setLoading(false);
          startPlaying();
        } catch (err) {
          console.error('GIF parsing failed:', err);
          setError(true);
          setLoading(false);
        }
      })
      .catch(err => {
        console.error('Fetch GIF failed:', err);
        setError(true);
        setLoading(false);
      });

    return () => {
      active = false;
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
      }
    };
  }, [src]);

  const startPlaying = () => {
    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current);
    }

    const renderNextFrame = () => {
      const frames = framesRef.current;
      if (frames.length === 0) return;

      const idx = currentFrameIndexRef.current;
      const frame = frames[idx];

      const canvas = canvasRef.current;
      const offscreen = offscreenCanvasRef.current;
      if (!canvas || !offscreen) return;

      const ctx = canvas.getContext('2d');
      const oCtx = offscreen.getContext('2d');
      if (!ctx || !oCtx) return;

      const patchData = new ImageData(frame.patch, frame.dims.width, frame.dims.height);
      
      if (frame.disposalType === 2) {
        oCtx.clearRect(frame.dims.left, frame.dims.top, frame.dims.width, frame.dims.height);
      }

      oCtx.putImageData(patchData, frame.dims.left, frame.dims.top);

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(offscreen, 0, 0, canvas.width, canvas.height);

      currentFrameIndexRef.current = (idx + 1) % frames.length;

      const delay = (frame.delay || 100) / speed;
      timeoutIdRef.current = setTimeout(renderNextFrame, delay);
    };

    renderNextFrame();
  };

  if (error) {
    return <img src={src} alt={alt} style={style} />;
  }

  const spinnerStyle = `
    @keyframes slow-gif-spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;

  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
      <style>{spinnerStyle}</style>
      {loading && (
        <div style={{ position: 'absolute', color: 'var(--text-silver)', fontSize: '0.8rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '24px', height: '24px', borderRadius: '50%',
            border: '2px solid rgba(255,255,255,0.1)', borderTopColor: 'var(--accent-gold)',
            animation: 'slow-gif-spin 1s linear infinite'
          }}></div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-silver)' }}>Anpassar tempo...</span>
        </div>
      )}
      <canvas
        ref={canvasRef}
        width={dimensions.width}
        height={dimensions.height}
        style={{
          ...style,
          display: loading ? 'none' : 'block',
          maxWidth: '100%',
          maxHeight: '100%',
          objectFit: 'contain'
        }}
      />
    </div>
  );
}
