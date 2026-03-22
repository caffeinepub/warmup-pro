import { useQuery } from "@tanstack/react-query";
import type { Exercise } from "../backend.d";
import { useActor } from "./useActor";

export function useGetAllExercises() {
  const { actor, isFetching } = useActor();
  return useQuery<Exercise[]>({
    queryKey: ["exercises"],
    queryFn: async () => {
      if (!actor) return [];
      const result = await actor.getAllExercises();
      return [...result].sort((a, b) => Number(a.order) - Number(b.order));
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetNextExercise(id: string | null) {
  const { actor, isFetching } = useActor();
  return useQuery<Exercise | null>({
    queryKey: ["nextExercise", id],
    queryFn: async () => {
      if (!actor || !id) return null;
      return actor.getNextExercise(id);
    },
    enabled: !!actor && !isFetching && !!id,
  });
}
