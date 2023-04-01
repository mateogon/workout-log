import React, { useContext, useEffect, useState, useLayoutEffect } from "react";
import { Text, ScrollView } from "react-native";
import { SafeArea } from "../../../components/utility/safe-area.component";
import { TouchableOpacity } from "react-native-gesture-handler";
import { WorkoutsContext } from "../../../services/workouts/workouts.context";
import { WorkoutEditSetCard } from "../components/workout-edit-set-card.component";
import { useNavigation } from "@react-navigation/native";
import { View } from "react-native";
import styled from "styled-components/native";

const FinishButton = styled.TouchableOpacity`
  background-color: #ffffff;
  border-radius: 4px;
  padding-horizontal: 10px;
  padding-vertical: 5px;

  margin-right: 16px;
`;

const FinishButtonText = styled.Text`
  color: #6200ee;
  font-size: 17px;
  font-weight: 500;
`;

const WorkoutTitle = styled.Text`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 16px;
`;

const ExerciseName = styled.Text`
  font-size: 18px;
  font-weight: bold;
`;

const AddExerciseButton = styled.TouchableOpacity`
  background-color: #6200ee;
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 16px;
`;

const AddExerciseButtonText = styled.Text`
  color: #ffffff;
  text-align: center;
  font-weight: 400;
  font-size: 16px;
`;

const Container = styled.ScrollView`
  flex: 1;
  padding: 15px;
`;

export const WorkoutEditScreen = ({ route, navigation }) => {
  console.log("WorkoutEditScreen");

  const { workoutId } = route.params;
  const { workouts, updateWorkout, retrieveWorkout, finishWorkout } =
    useContext(WorkoutsContext);
  const [workout, setWorkout] = useState(null);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <FinishButton
          onPress={() => {
            console.log("FINISH");
            finishWorkout();
            navigation.navigate("Workouts");
          }}
        >
          <FinishButtonText>FINISH WORKOUT</FinishButtonText>
        </FinishButton>
      ),
    });
  }, [navigation, finishWorkout]);

  const handleExerciseSelected = (exercise) => {
    if (!exercise) {
      console.warn("Received null exercise. Skipping.");
      return;
    }

    console.log("Selected exercise:", exercise);

    const newSet = {
      id: new Date().getTime().toString(),
      reps: 0,
      weight: 0,
      completed: false,
    };

    const newExercise = {
      ...exercise,
      sets: [newSet],
    };
    setWorkout((prevState) => ({
      ...prevState,
      exercises: [...prevState.exercises, newExercise],
    }));
  };

  useEffect(() => {
    if (workout) {
      handleUpdateWorkout();
    }
  }, [workout]);

  useEffect(() => {
    console.log("useEffect workoutId: ", workoutId, retrieveWorkout);
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

  if (!workout) {
    return <Text>Loading...</Text>;
  } else {
    return (
      <Container>
        <WorkoutTitle>{workout.name}</WorkoutTitle>
        {workout.exercises.map((exercise, exerciseIndex) => (
          <View key={exercise.id}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("ExerciseHistory", {
                  exerciseId: exercise.id,
                })
              }
            >
              <ExerciseName>{exercise.name}</ExerciseName>
            </TouchableOpacity>

            <WorkoutEditSetCard
              exercise={exercise}
              exerciseIndex={exerciseIndex}
              workout={workout}
              setWorkout={setWorkout}
            />
          </View>
        ))}
        <AddExerciseButton
          onPress={() => {
            navigation.navigate("ExercisePicker", {
              onExerciseSelected: handleExerciseSelected,
            });
          }}
        >
          <AddExerciseButtonText>Add Exercise</AddExerciseButtonText>
        </AddExerciseButton>
      </Container>
    );
  }
};
