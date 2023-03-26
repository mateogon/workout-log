import React, { useContext, useEffect, useState } from "react";
import { Text, StyleSheet, ScrollView, Button } from "react-native";
import { SafeArea } from "../../../components/utility/safe-area.component";
import { WorkoutsContext } from "../../../services/workouts/workouts.context";
import { WorkoutEditSetCard } from "../components/workout-edit-set-card.component";
import { View } from "react-native";

export const WorkoutEditScreen = ({ route, navigation }) => {
  console.log("WorkoutEditScreen");
  const { workoutId } = route.params;
  const { workouts, updateWorkout, retrieveWorkout } =
    useContext(WorkoutsContext);
  const [workout, setWorkout] = useState(null);

  useEffect(() => {
    const fetchWorkout = async () => {
      const fetchedWorkout = await retrieveWorkout(workoutId);
      setWorkout(fetchedWorkout);
    };
    fetchWorkout();
  }, []);

  const handleUpdateWorkout = async () => {
    await updateWorkout(workoutId, workout);
    console.log("Workout updated");
    //navigation.goBack();
  };

  const handleExerciseSelected = (exercise) => {
    const newExercise = {
      ...exercise,
      sets: [],
    };
    setWorkout({ ...workout, exercises: [...workout.exercises, newExercise] });
  };

  if (!workout) {
    return <Text>Loading...</Text>;
  }

  return (
    <SafeArea>
      <ScrollView>
        {workout.exercises.map((exercise, exerciseIndex) => (
          <View key={exercise.id}>
            <Text>
              Exercise {exerciseIndex + 1}: {exercise.name}
            </Text>
            <WorkoutEditSetCard
              exercise={exercise}
              exerciseIndex={exerciseIndex}
              workout={workout}
              setWorkout={setWorkout}
            />
          </View>
        ))}
        <Button
          title="Add Exercise"
          onPress={() =>
            navigation.navigate("ExercisePicker", {
              onExerciseSelected: handleExerciseSelected,
            })
          }
        />
        <Button title="Save Changes" onPress={handleUpdateWorkout} />
      </ScrollView>
    </SafeArea>
  );
};
