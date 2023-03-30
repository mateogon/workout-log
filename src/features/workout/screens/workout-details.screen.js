import React, { useContext, useEffect, useState } from "react";
import { Text } from "react-native";
import { SafeArea } from "../../../components/utility/safe-area.component";
import { WorkoutsContext } from "../../../services/workouts/workouts.context";
import { formatDate, formatTime } from "../../../utils/dateFormat";
import { View } from "react-native";

import styled from "styled-components/native";

const WorkoutTitle = styled.Text`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 16px;
`;

const WorkoutDate = styled.Text`
  font-size: 18px;
  margin-bottom: 24px;
`;

const ExerciseName = styled.Text`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 8px;
`;

const SetRow = styled.Text`
  font-size: 16px;
`;

const DoAgainButton = styled.TouchableOpacity`
  background-color: #6200ee;
  padding: 10px;
  border-radius: 5px;
  margin-top: 16px;
`;

const DoAgainButtonText = styled.Text`
  color: #ffffff;
  text-align: center;
  font-weight: 400;
  font-size: 16px;
`;

const Container = styled.ScrollView`
  flex: 1;
  padding: 8px;
`;

export const WorkoutDetailsScreen = ({ route }) => {
  const { workoutId } = route.params;
  const { retrieveWorkout } = useContext(WorkoutsContext);
  const [workout, setWorkout] = useState(null);

  useEffect(() => {
    const fetchWorkout = async () => {
      const fetchedWorkout = await retrieveWorkout(workoutId);
      setWorkout(fetchedWorkout);
    };
    fetchWorkout();
  }, []);

  if (!workout) {
    return <Text>Loading...</Text>;
  } else {
    return (
      <Container>
        <WorkoutTitle>{workout.name}</WorkoutTitle>
        <WorkoutDate>{formatDate(workout.date)}</WorkoutDate>
        {workout.exercises.map((exercise) => (
          <View key={exercise.id}>
            <ExerciseName>{exercise.name}</ExerciseName>
            {exercise.sets.map((set, index) => (
              <SetRow key={set.id}>
                {`${index + 1} ${set.weight}kg x ${set.reps}`}
              </SetRow>
            ))}
          </View>
        ))}
        <DoAgainButton onPress={() => {}}>
          <DoAgainButtonText>Do Again</DoAgainButtonText>
        </DoAgainButton>
      </Container>
    );
  }
};
