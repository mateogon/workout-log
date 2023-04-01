import React, { useContext, useState, useEffect } from "react";
import { WorkoutsContext } from "../../../services/workouts/workouts.context";
import { ExerciseSetDetails } from "../components/workout-details-set-card.component";
import styled from "styled-components/native";
const Container = styled.ScrollView`
  flex: 1;
  padding: 8px;
`;

export const ExerciseHistoryScreen = ({ route }) => {
  const { exerciseId } = route.params;
  const { workouts, retrieveWorkout } = useContext(WorkoutsContext);
  const [exerciseHistory, setExerciseHistory] = useState([]);

  useEffect(() => {
    const fetchExerciseHistory = async () => {
      const filteredWorkouts = workouts
        .map((workout) => ({
          ...workout,
          exercises: workout.exercises.filter(
            (exercise) => exercise.id === exerciseId
          ),
        }))
        .filter((workout) => workout.exercises.length > 0);

      setExerciseHistory(filteredWorkouts);
    };

    fetchExerciseHistory();
  }, [workouts]);

  return (
    <Container>
      {exerciseHistory.map((workout) => (
        <ExerciseSetDetails
          id={workout.id}
          key={workout.id}
          exerciseName={workout.name}
          date={workout.date}
          sets={workout.exercises[0].sets}
          touchable={false}
        />
      ))}
    </Container>
  );
};
