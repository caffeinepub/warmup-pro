import { ChevronRight, Home, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import type { Exercise } from "../backend.d";
import { useActor } from "../hooks/useActor";

interface Props {
  exercise: Exercise;
  exercises: Exercise[];
  onNext: (exercise: Exercise) => void;
  onHome: () => void;
}

export default function PostVideoScreen({
  exercise,
  exercises,
  onNext,
  onHome,
}: Props) {
  const { actor } = useActor();
  const [isLoadingNext, setIsLoadingNext] = useState(false);

  const handleNext = async () => {
    // Try backend first
    if (actor) {
      setIsLoadingNext(true);
      try {
        const next = await actor.getNextExercise(exercise.id);
        if (next) {
          onNext(next);
          return;
        }
      } catch {
        // fall through to local logic
      } finally {
        setIsLoadingNext(false);
      }
    }

    // Local fallback: find next in sorted exercises
    if (exercises.length > 0) {
      const sorted = [...exercises].sort(
        (a, b) => Number(a.order) - Number(b.order),
      );
      const idx = sorted.findIndex((e) => e.id === exercise.id);
      if (idx >= 0 && idx < sorted.length - 1) {
        onNext(sorted[idx + 1]);
      } else {
        // Last exercise, go home
        onHome();
      }
    } else {
      onHome();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col h-screen bg-background items-center justify-center px-6"
    >
      {/* Celebration */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 40%, oklch(0.62 0.24 25 / 0.12) 0%, transparent 70%)",
        }}
      />

      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 300, damping: 18 }}
        className="text-8xl mb-6 select-none"
      >
        🎉
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.5 }}
        className="text-center mb-2"
      >
        <h1 className="font-heading text-4xl font-extrabold">
          Great <span className="gradient-fire-text">Job!</span>
        </h1>
        <p className="text-muted-foreground mt-2 text-base">
          You completed{" "}
          <span className="text-foreground font-semibold">
            {exercise.title}
          </span>
        </p>
      </motion.div>

      {/* Stats mini cards */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex gap-4 my-8"
      >
        {[
          { label: "Exercise", value: exercise.title },
          { label: "Status", value: "Done ✓" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="flex-1 p-4 rounded-2xl bg-card card-glow text-center"
          >
            <p className="text-muted-foreground text-xs uppercase tracking-widest mb-1">
              {stat.label}
            </p>
            <p className="font-heading font-bold text-lg gradient-fire-text">
              {stat.value}
            </p>
          </div>
        ))}
      </motion.div>

      {/* Action buttons */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="w-full space-y-3"
      >
        <motion.button
          whileTap={{ scale: 0.97 }}
          whileHover={{ scale: 1.02 }}
          onClick={handleNext}
          disabled={isLoadingNext}
          className="w-full h-14 rounded-2xl gradient-fire fire-glow font-heading font-extrabold text-white text-lg flex items-center justify-center gap-2 disabled:opacity-60"
          data-ocid="complete.next.primary_button"
        >
          {isLoadingNext ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              Next Exercise
              <ChevronRight className="w-5 h-5" />
            </>
          )}
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.97 }}
          whileHover={{ scale: 1.02 }}
          onClick={onHome}
          className="w-full h-14 rounded-2xl bg-secondary border border-border font-heading font-bold text-foreground text-base flex items-center justify-center gap-2"
          data-ocid="complete.home.button"
        >
          <Home className="w-5 h-5" />
          Back to Home
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
