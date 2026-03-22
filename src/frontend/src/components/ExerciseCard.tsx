import { Play } from "lucide-react";
import { motion } from "motion/react";
import type { Exercise } from "../backend.d";

interface Props {
  exercise: Exercise;
  index: number;
  gradientClass: string;
  fallbackImage?: string;
  onClick: () => void;
}

const EMOJI_MAP: Record<string, string> = {
  jump: "🦘",
  pushup: "💪",
  run: "🏃",
  clap: "👏",
  stretch: "🧘",
  squat: "🏋️",
};

export default function ExerciseCard({
  exercise,
  index,
  gradientClass,
  fallbackImage,
  onClick,
}: Props) {
  const imageUrl = exercise.image?.getDirectURL?.() || fallbackImage || "";
  const emoji = EMOJI_MAP[exercise.id] ?? "⚡";

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20, scale: 0.95 },
        visible: { opacity: 1, y: 0, scale: 1 },
      }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      whileTap={{ scale: 0.96 }}
      whileHover={{ scale: 1.03, y: -2 }}
      onClick={onClick}
      className="cursor-pointer group"
      data-ocid={`home.item.${index + 1}`}
    >
      <div className="card-glow rounded-2xl overflow-hidden bg-card transition-shadow duration-200 group-hover:card-glow-active">
        {/* Image area */}
        <div className="relative aspect-[4/3] overflow-hidden">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={exercise.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
          ) : (
            <div
              className={`w-full h-full bg-gradient-to-br ${gradientClass} flex items-center justify-center`}
            >
              <span className="text-5xl">{emoji}</span>
            </div>
          )}

          {/* Number badge */}
          <div className="absolute top-2 left-2 w-6 h-6 rounded-full gradient-fire flex items-center justify-center">
            <span className="text-white text-xs font-bold">{index + 1}</span>
          </div>

          {/* Play overlay */}
          <div className="absolute inset-0 bg-background/0 group-hover:bg-background/30 transition-colors duration-200 flex items-center justify-center">
            <div className="w-10 h-10 rounded-full gradient-fire opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
              <Play className="w-5 h-5 text-white fill-white ml-0.5" />
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="px-3 py-2.5">
          <p className="font-heading font-bold text-sm text-foreground tracking-wide">
            {exercise.title}
          </p>
          <p className="text-muted-foreground text-xs mt-0.5">Tap to start</p>
        </div>
      </div>
    </motion.div>
  );
}
