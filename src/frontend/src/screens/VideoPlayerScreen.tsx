import { Maximize2, Pause, Play } from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Exercise } from "../backend.d";

interface Props {
  exercise: Exercise;
  onComplete: () => void;
}

const DEMO_DURATION = 30;

export default function VideoPlayerScreen({ exercise, onComplete }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [duration, setDuration] = useState(DEMO_DURATION);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const elapsedRef = useRef(0);
  const durationRef = useRef(DEMO_DURATION);

  const videoUrl = exercise.video?.getDirectURL?.() || "";
  const hasVideo = !!videoUrl;

  const stopDemoTimer = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsPlaying(false);
  }, []);

  const startDemoTimer = useCallback(() => {
    setIsPlaying(true);
    const start = Date.now() - elapsedRef.current * 1000;
    intervalRef.current = setInterval(() => {
      const now = (Date.now() - start) / 1000;
      const capped = Math.min(now, durationRef.current);
      elapsedRef.current = capped;
      setElapsed(capped);
      setProgress((capped / durationRef.current) * 100);
      if (capped >= durationRef.current) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setIsPlaying(false);
        onComplete();
      }
    }, 100);
  }, [onComplete]);

  useEffect(() => {
    if (hasVideo) {
      const vid = videoRef.current;
      if (vid) {
        vid.play().catch(() => {});
        vid.requestFullscreen?.().catch(() => {});
      }
    } else {
      startDemoTimer();
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [hasVideo, startDemoTimer]);

  const handleVideoEnded = () => {
    document.exitFullscreen?.().catch(() => {});
    onComplete();
  };

  const handleVideoTimeUpdate = () => {
    const vid = videoRef.current;
    if (vid?.duration) {
      durationRef.current = vid.duration;
      setDuration(vid.duration);
      setElapsed(vid.currentTime);
      setProgress((vid.currentTime / vid.duration) * 100);
    }
  };

  const togglePlay = () => {
    if (hasVideo) {
      const vid = videoRef.current;
      if (vid) {
        if (vid.paused) {
          vid.play();
          setIsPlaying(true);
        } else {
          vid.pause();
          setIsPlaying(false);
        }
      }
    } else {
      if (isPlaying) stopDemoTimer();
      else startDemoTimer();
    }
  };

  const formatTime = (s: number) =>
    `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black flex flex-col z-50"
    >
      {/* Progress bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-white/10 z-10">
        <motion.div
          className="h-full gradient-fire"
          style={{ width: `${progress}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>

      {/* Video or placeholder */}
      <div className="flex-1 relative flex items-center justify-center">
        {hasVideo ? (
          // biome-ignore lint/a11y/useMediaCaption: exercise videos don't have captions
          <video
            ref={videoRef}
            src={videoUrl}
            className="w-full h-full object-contain"
            onEnded={handleVideoEnded}
            onTimeUpdate={handleVideoTimeUpdate}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            playsInline
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center relative">
            <div
              className="absolute inset-0 bg-cover bg-center opacity-30"
              style={{
                backgroundImage: `url(${exercise.image?.getDirectURL?.() || ""})`,
              }}
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse 60% 50% at 50% 50%, oklch(0.62 0.24 25 / 0.3) 0%, transparent 70%)",
              }}
            />
            <motion.div
              animate={{ scale: [1, 1.08, 1], opacity: [0.9, 1, 0.9] }}
              transition={{
                duration: 1.5,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
              className="relative z-10 text-9xl mb-6"
            >
              {exercise.title === "Jump" && "🦘"}
              {exercise.title === "Push-Up" && "💪"}
              {exercise.title === "Run" && "🏃"}
              {exercise.title === "Clap" && "👏"}
              {exercise.title === "Stretch" && "🧘"}
              {exercise.title === "Squat" && "🏋️"}
              {!["Jump", "Push-Up", "Run", "Clap", "Stretch", "Squat"].includes(
                exercise.title,
              ) && "⚡"}
            </motion.div>
            <h2 className="font-heading text-4xl font-extrabold text-white relative z-10 text-center">
              {exercise.title}
            </h2>
            {isPlaying && (
              <motion.p
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-white/60 text-lg mt-2 relative z-10"
              >
                Keep going! 🔥
              </motion.p>
            )}
          </div>
        )}

        {/* Controls overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={togglePlay}
              className="w-12 h-12 rounded-full gradient-fire flex items-center justify-center"
              data-ocid="player.toggle"
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 text-white fill-white" />
              ) : (
                <Play className="w-5 h-5 text-white fill-white ml-0.5" />
              )}
            </button>

            <div className="flex-1">
              <div className="flex justify-between text-white/60 text-xs mb-1.5">
                <span>{formatTime(elapsed)}</span>
                <span>{formatTime(duration)}</span>
              </div>
              <div className="h-1 bg-white/20 rounded-full">
                <div
                  className="h-full gradient-fire rounded-full transition-all duration-100"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {hasVideo && (
              <button
                type="button"
                onClick={() => videoRef.current?.requestFullscreen?.()}
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center"
                data-ocid="player.fullscreen.button"
              >
                <Maximize2 className="w-4 h-4 text-white" />
              </button>
            )}
          </div>
        </div>

        {/* Exercise name top */}
        <div className="absolute top-6 left-0 right-0 flex items-center justify-center">
          <div className="px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm">
            <p className="text-white font-semibold text-sm">{exercise.title}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
