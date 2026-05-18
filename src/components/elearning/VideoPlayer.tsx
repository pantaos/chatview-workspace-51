import { useEffect, useRef } from "react";

interface Props {
  url: string;
  initialProgress?: number;
  onProgress?: (pct: number) => void;
}

// YouTube embeds can't track progress without API; for MVP mark 100% on open after 3s.
// MP4 URLs use <video> with timeupdate.
export default function VideoPlayer({ url, initialProgress = 0, onProgress }: Props) {
  const isYouTube = /youtube\.com\/embed|youtu\.be/.test(url);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (isYouTube && onProgress && initialProgress < 90) {
      const t = setTimeout(() => onProgress(100), 3000);
      return () => clearTimeout(t);
    }
  }, [isYouTube, onProgress, initialProgress]);

  if (isYouTube) {
    return (
      <div className="aspect-video w-full rounded-lg overflow-hidden bg-black">
        <iframe
          src={url}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="Video"
        />
      </div>
    );
  }

  return (
    <video
      ref={videoRef}
      src={url}
      controls
      className="w-full rounded-lg bg-black"
      onTimeUpdate={(e) => {
        const v = e.currentTarget;
        if (v.duration > 0) {
          const pct = Math.round((v.currentTime / v.duration) * 100);
          onProgress?.(pct);
        }
      }}
    />
  );
}
