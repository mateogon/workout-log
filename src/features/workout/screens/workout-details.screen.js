import React, { useContext, useEffect, useState } from "react";
import { Text } from "react-native";
import { SafeArea } from "../../../components/utility/safe-area.component";
import { WorkoutsContext } from "../../../services/workouts/workouts.context";
import { formatDate, formatTime } from "../../../utils/dateFormat";
import { ExerciseSetDetails } from "../components/workout-details-set-card.component";
import { View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import styled from "styled-components/native";
import { Spacer } from "../../../components/spacer/spacer.component";

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
const ExerciseContainer = styled.View`
  padding: 8px;
  margin-bottom: 10px;
`;

export const WorkoutDetailsScreen = ({ route, navigation }) => {
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
          <ExerciseContainer key={exercise.id}>
            <ExerciseSetDetails
              key={exercise.id}
              id={exercise.id}
              exerciseName={exercise.name}
              date={workout.date}
              sets={exercise.sets}
              touchable={true}
            />
          </ExerciseContainer>
        ))}
        <DoAgainButton onPress={() => {}}>
          <DoAgainButtonText>Do Again</DoAgainButtonText>
        </DoAgainButton>
      </Container>
    );
  }
};
