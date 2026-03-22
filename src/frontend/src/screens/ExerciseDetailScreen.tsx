import { Button } from "@/components/ui/button";
import { ArrowLeft, Dumbbell, Play } from "lucide-react";
import { motion } from "motion/react";
import type { Exercise } from "../backend.d";

interface Props {
  exercise: Exercise;
  onBack: () => void;
  onStart: () => void;
}

const FALLBACK_IMAGES: Record<string, string> = {
  jump: "/assets/generated/exercise-jump.dim_400x300.jpg",
  pushup: "/assets/generated/exercise-pushup.dim_400x300.jpg",
  run: "/assets/generated/exercise-run.dim_400x300.jpg",
  clap: "/assets/generated/exercise-clap.dim_400x300.jpg",
  stretch: "/assets/generated/exercise-stretch.dim_400x300.jpg",
  squat: "/assets/generated/exercise-squat.dim_400x300.jpg",
};

const EXERCISE_TIPS: Record<string, string[]> = {
  jump: [
    "Keep knees soft on landing",
    "Swing arms for momentum",
    "Land on balls of feet",
  ],
  pushup: [
    "Keep core tight throughout",
    "Elbows at 45° angle",
    "Full range of motion",
  ],
  run: ["Maintain upright posture", "Land midfoot", "Pump arms rhythmically"],
  clap: ["Full arm extension", "Keep rhythm steady", "Engage shoulders"],
  stretch: ["Breathe deeply", "Hold each position", "No bouncing"],
  squat: [
    "Feet shoulder-width apart",
    "Knees track over toes",
    "Weight in heels",
  ],
};

export default function ExerciseDetailScreen({
  exercise,
  onBack,
  onStart,
}: Props) {
  const videoUrl = exercise.video?.getDirectURL?.() || "";
  const imageUrl =
    exercise.image?.getDirectURL?.() || FALLBACK_IMAGES[exercise.id] || "";
  const tips = EXERCISE_TIPS[exercise.id] ?? [
    "Focus on form",
    "Stay consistent",
    "Push your limits",
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col h-screen bg-background overflow-hidden"
    >
      {/* Header */}
      <header className="flex items-center gap-3 px-4 pt-5 pb-4 shrink-0">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="rounded-xl hover:bg-secondary"
          data-ocid="detail.back.button"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="font-heading text-xl font-extrabold flex-1">
          {exercise.title}
        </h1>
        <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center">
          <Dumbbell className="w-4 h-4 text-muted-foreground" />
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 pb-6">
        {/* Video / Thumbnail area */}
        <div
          className="relative w-full rounded-2xl overflow-hidden bg-card card-glow mb-5"
          style={{ aspectRatio: "16/9" }}
        >
          {videoUrl ? (
            // biome-ignore lint/a11y/useMediaCaption: exercise preview, no captions needed
            <video
              src={videoUrl}
              className="w-full h-full object-cover"
              poster={imageUrl}
              preload="metadata"
            />
          ) : imageUrl ? (
            <img
              src={imageUrl}
              alt={exercise.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full gradient-fire opacity-50" />
          )}

          {/* Play button overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-background/40">
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={onStart}
              className="rounded-full gradient-fire fire-glow flex items-center justify-center cursor-pointer"
              style={{ width: 72, height: 72 }}
              data-ocid="detail.play.button"
            >
              <Play className="w-8 h-8 text-white fill-white ml-1" />
            </motion.div>
          </div>

          {/* Duration badge */}
          <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-background/70 backdrop-blur-sm">
            <span className="text-xs font-semibold text-foreground">
              ~30 sec
            </span>
          </div>
        </div>

        {/* Exercise info */}
        <div className="mb-5">
          <h2 className="font-heading text-2xl font-extrabold mb-1">
            <span className="gradient-fire-text">{exercise.title}</span>{" "}
            Exercise
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Full-body warm-up movement to activate muscles and prepare your body
            for intense training.
          </p>
        </div>

        {/* Tips */}
        <div className="mb-6">
          <h3 className="font-heading font-bold text-sm uppercase tracking-widest text-muted-foreground mb-3">
            Pro Tips
          </h3>
          <div className="space-y-2">
            {tips.map((tip) => (
              <div
                key={tip}
                className="flex items-start gap-3 p-3 rounded-xl bg-card card-glow"
              >
                <div className="w-5 h-5 rounded-full gradient-fire flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">✓</span>
                </div>
                <p className="text-sm text-foreground/80">{tip}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Start button */}
      <div className="px-4 pb-8 pt-4 shrink-0 border-t border-border/50">
        <motion.button
          type="button"
          whileTap={{ scale: 0.97 }}
          whileHover={{ scale: 1.02 }}
          onClick={onStart}
          className="w-full h-14 rounded-2xl gradient-fire fire-glow font-heading font-extrabold text-white text-lg tracking-wide flex items-center justify-center gap-2 transition-shadow"
          data-ocid="detail.start.primary_button"
        >
          <Play className="w-5 h-5 fill-white" />
          Start Exercise
        </motion.button>
      </div>
    </motion.div>
  );
}
