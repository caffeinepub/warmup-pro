import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import type { Exercise } from "./backend.d";
import ExerciseDetailScreen from "./screens/ExerciseDetailScreen";
import HomeScreen from "./screens/HomeScreen";
import PostVideoScreen from "./screens/PostVideoScreen";
import SplashScreen from "./screens/SplashScreen";
import VideoPlayerScreen from "./screens/VideoPlayerScreen";

const queryClient = new QueryClient();

export type AppScreen = "splash" | "home" | "detail" | "playing" | "complete";

export interface AppState {
  screen: AppScreen;
  selectedExercise: Exercise | null;
  exercises: Exercise[];
}

export default function App() {
  const [appState, setAppState] = useState<AppState>({
    screen: "splash",
    selectedExercise: null,
    exercises: [],
  });

  const navigate = useCallback((screen: AppScreen, exercise?: Exercise) => {
    setAppState((prev) => ({
      ...prev,
      screen,
      selectedExercise: exercise ?? prev.selectedExercise,
    }));
  }, []);

  const setExercises = useCallback((exercises: Exercise[]) => {
    setAppState((prev) => ({ ...prev, exercises }));
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="relative w-full h-screen overflow-hidden bg-background">
        {appState.screen === "splash" && (
          <SplashScreen onComplete={() => navigate("home")} />
        )}
        {appState.screen === "home" && (
          <HomeScreen
            onSelectExercise={(ex) => navigate("detail", ex)}
            onExercisesLoaded={setExercises}
          />
        )}
        {appState.screen === "detail" && appState.selectedExercise && (
          <ExerciseDetailScreen
            exercise={appState.selectedExercise}
            onBack={() => navigate("home")}
            onStart={() => navigate("playing")}
          />
        )}
        {appState.screen === "playing" && appState.selectedExercise && (
          <VideoPlayerScreen
            exercise={appState.selectedExercise}
            onComplete={() => navigate("complete")}
          />
        )}
        {appState.screen === "complete" && appState.selectedExercise && (
          <PostVideoScreen
            exercise={appState.selectedExercise}
            exercises={appState.exercises}
            onNext={(ex) => navigate("detail", ex)}
            onHome={() => navigate("home")}
          />
        )}
      </div>
    </QueryClientProvider>
  );
}
