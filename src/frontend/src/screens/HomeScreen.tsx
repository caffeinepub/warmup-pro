import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw, Settings } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef } from "react";
import type { Exercise } from "../backend.d";
import ExerciseCard from "../components/ExerciseCard";
import { useGetAllExercises } from "../hooks/useQueries";

const FALLBACK_EXERCISES: Omit<Exercise, "image" | "video">[] = [
  { id: "say-hi", title: "Say Hi!", order: BigInt(1) },
  { id: "clap", title: "Clap", order: BigInt(2) },
  { id: "throw-it", title: "Throw It!", order: BigInt(3) },
  { id: "point", title: "Point!", order: BigInt(4) },
  { id: "lets-walk", title: "Let's Walk", order: BigInt(5) },
  { id: "lets-run", title: "Let's Run", order: BigInt(6) },
  { id: "jump", title: "Now Jump!", order: BigInt(7) },
  { id: "boxing", title: "Boxing", order: BigInt(8) },
  { id: "change-hand", title: "Change Hand", order: BigInt(9) },
  { id: "line-drawing", title: "Line Drawing", order: BigInt(10) },
  { id: "all-in-one", title: "All In One", order: BigInt(11) },
];

const FALLBACK_IMAGES: Record<string, string> = {
  "say-hi": "/assets/uploads/video_capture_1774019574186-7.jpeg",
  clap: "/assets/uploads/video_capture_1774019569340-10.jpeg",
  "throw-it": "/assets/uploads/video_capture_1774019834898-4.jpeg",
  point: "/assets/uploads/video_capture_1774019575717-8.jpeg",
  "lets-walk": "/assets/uploads/video_capture_1774019570810-9.jpeg",
  "lets-run": "/assets/uploads/video_capture_1774019569912-11.jpeg",
  jump: "/assets/uploads/video_capture_1774019573119-6.jpeg",
  boxing: "/assets/uploads/video_capture_1774019933849-01-2.jpeg",
  "change-hand": "/assets/uploads/video_capture_1774019574998-3.jpeg",
  "line-drawing": "/assets/uploads/video_capture_1774019934625-01-1.jpeg",
  "all-in-one": "/assets/uploads/video_capture_1774019934256-01-5.jpeg",
};

const CARD_GRADIENTS = [
  "from-orange-900/60 to-red-900/60",
  "from-red-900/60 to-rose-900/60",
  "from-amber-900/60 to-orange-900/60",
  "from-orange-800/60 to-amber-900/60",
  "from-red-800/60 to-orange-900/60",
  "from-rose-900/60 to-red-800/60",
  "from-orange-900/60 to-amber-800/60",
  "from-red-900/60 to-orange-800/60",
  "from-amber-800/60 to-red-900/60",
  "from-rose-800/60 to-orange-900/60",
  "from-orange-800/60 to-rose-900/60",
];

function makeBlob(url: string) {
  return {
    getDirectURL: () => url,
    getBytes: async () => new Uint8Array(),
    withUploadProgress: () => makeBlob(url) as any,
    static: { fromURL: () => makeBlob(url), fromBytes: () => makeBlob("") },
  } as any;
}

interface Props {
  onSelectExercise: (exercise: Exercise) => void;
  onExercisesLoaded: (exercises: Exercise[]) => void;
}

export default function HomeScreen({
  onSelectExercise,
  onExercisesLoaded,
}: Props) {
  const { data: exercises, isLoading, isError, refetch } = useGetAllExercises();
  const loadedRef = useRef(false);

  const displayExercises: Exercise[] =
    exercises && exercises.length > 0
      ? exercises
      : FALLBACK_EXERCISES.map((ex) => ({
          ...ex,
          image: makeBlob(FALLBACK_IMAGES[ex.id] ?? ""),
          video: makeBlob(""),
        }));

  useEffect(() => {
    if (!loadedRef.current && displayExercises.length > 0) {
      loadedRef.current = true;
      onExercisesLoaded(displayExercises);
    }
  }, [displayExercises, onExercisesLoaded]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col h-screen bg-background overflow-hidden"
    >
      {/* Header */}
      <header className="flex items-center justify-between px-5 pt-6 pb-4 shrink-0">
        <div className="flex items-center gap-2.5">
          <img
            src="/assets/uploads/IMG_20260320_203247-1.jpg"
            alt="WarmUp Pro Logo"
            className="w-9 h-9 rounded-xl object-cover"
          />
          <span className="font-heading text-xl font-extrabold tracking-tight">
            WarmUp <span className="gradient-fire-text">Pro</span>
          </span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary"
          data-ocid="home.settings.button"
        >
          <Settings className="w-5 h-5" />
        </Button>
      </header>

      {/* Hero text */}
      <div className="px-5 pb-5 shrink-0">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <h2 className="font-heading text-3xl font-extrabold leading-tight">
            Today's
            <br />
            <span className="gradient-fire-text">Warm-Up</span>
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            {displayExercises.length} exercises · Tap to begin
          </p>
        </motion.div>
      </div>

      {/* Error state */}
      {isError && (
        <div
          className="mx-5 mb-4 p-3 rounded-xl bg-destructive/10 border border-destructive/20 flex items-center gap-3"
          data-ocid="home.error_state"
        >
          <AlertCircle className="w-4 h-4 text-destructive shrink-0" />
          <p className="text-destructive text-sm flex-1">
            Failed to load exercises
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => refetch()}
            className="text-destructive hover:text-destructive shrink-0 h-7 px-2"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </Button>
        </div>
      )}

      {/* Exercise grid */}
      <div className="flex-1 overflow-y-auto px-5 pb-8">
        {isLoading ? (
          <div
            className="grid grid-cols-2 sm:grid-cols-3 gap-4"
            data-ocid="home.loading_state"
          >
            {["s1", "s2", "s3", "s4", "s5", "s6"].map((k) => (
              <div key={k} className="rounded-2xl overflow-hidden">
                <div className="shimmer-card aspect-[4/3]" />
                <div className="shimmer-card h-10 mt-2 rounded-xl" />
              </div>
            ))}
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-3 gap-4"
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.07 } },
            }}
          >
            {displayExercises.map((exercise, index) => (
              <ExerciseCard
                key={exercise.id}
                exercise={exercise}
                index={index}
                gradientClass={CARD_GRADIENTS[index % CARD_GRADIENTS.length]}
                fallbackImage={FALLBACK_IMAGES[exercise.id]}
                onClick={() => onSelectExercise(exercise)}
              />
            ))}
          </motion.div>
        )}
      </div>

      {/* Footer */}
      <footer className="text-center py-3 text-muted-foreground text-xs shrink-0">
        © {new Date().getFullYear()}. Built with ❤️ using{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          caffeine.ai
        </a>
      </footer>
    </motion.div>
  );
}
