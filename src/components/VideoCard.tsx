import { useRef, useState } from "react";
import { Play } from "lucide-react";

type VideoCardProps = {
  videoSrc: string;
  poster?: string;
  title: string;
  subtitle: string;
  gradient?: string;      // kept so existing usages don't break (used as fallback when no poster)
  textColor?: string;     // kept for compatibility (text is now always white)
  buttonColor: string;    // play icon color
  className?: string;     // wrapper classes (width / snap)
  aspect?: string;        // e.g. "aspect-[9/14]" or "aspect-[16/9]"
};

export default function VideoCard({
  videoSrc,
  poster,
  title,
  subtitle,
  gradient = "from-stone-600 to-stone-900",
  buttonColor,
  className = "flex-[0_0_65%] snap-start",
  aspect = "aspect-[9/14]",
}: VideoCardProps) {
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlay = () => {
    setPlaying(true);
    requestAnimationFrame(() => {
      videoRef.current?.play().catch(() => {});
    });
  };

  return (
    <div className={className}>
      <div className={`${aspect} rounded-xl overflow-hidden relative bg-black`}>
        {playing ? (
          <video
            ref={videoRef}
            src={videoSrc}
            poster={poster}
            controls
            playsInline
            preload="metadata"
            className="w-full h-full object-cover"
            onEnded={() => setPlaying(false)}
          />
        ) : (
          <button
            type="button"
            onClick={handlePlay}
            aria-label={`Play video: ${title}`}
            className={`group relative block w-full h-full overflow-hidden ${
              poster ? "" : `bg-gradient-to-br ${gradient}`
            }`}
            style={
              poster
                ? {
                    backgroundImage: `url(${poster})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }
                : undefined
            }
          >
            {/* Dark gradient overlay (stronger at the bottom for text) */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10 pointer-events-none" />

            {/* Centered play button */}
            <span className="absolute inset-0 flex items-center justify-center">
              <span
                className={`w-12 h-12 rounded-full bg-white flex items-center justify-center ${buttonColor} shadow-lg transition-transform duration-200 group-hover:scale-110`}
              >
                <Play className="w-5 h-5 fill-current ml-0.5" />
              </span>
            </span>

            {/* Text at the bottom, white */}
            <span className="absolute inset-x-0 bottom-0 p-3 md:p-4 text-left text-white">
              <b className="block text-xs md:text-sm font-bold leading-tight">{title}</b>
              <small className="block text-[10px] md:text-xs text-white/80 mt-0.5">
                {subtitle}
              </small>
            </span>
          </button>
        )}
      </div>
    </div>
  );
}