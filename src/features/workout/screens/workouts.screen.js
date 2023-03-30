import React, { useContext } from "react";
import { FlatList, TouchableOpacity, View } from "react-native";
import { SafeArea } from "../../../components/utility/safe-area.component";
import { WorkoutsContext } from "../../../services/workouts/workouts.context";
import styled from "styled-components/native";
import { Spacer } from "../../../components/spacer/spacer.component";
import { formatDate, formatTime } from "../../../utils/dateFormat";
export const Container = styled.View`
  flex: 1;
  padding: ${(props) => props.theme.space[6]};
`;

export const CreateWorkoutButton = styled.TouchableOpacity`
  background-color: ${(props) => props.theme.colors.brand.primary};
  padding: ${(props) => props.theme.space[4]};
  border-radius: ${(props) => props.theme.space[2]};
  margin-bottom: ${(props) => props.theme.space[6]};
`;

export const CreateWorkoutButtonText = styled.Text`
  color: ${(props) => props.theme.colors.text.inverse};
  text-align: center;
  font-size: ${(props) => props.theme.fontSizes.button};
`;

export const WorkoutCard = styled.TouchableOpacity`
  background-color: ${(props) => props.theme.colors.bg.primary};
  padding: ${(props) => props.theme.space[6]};
  border-radius: ${(props) => props.theme.space[2]};
  margin-bottom: ${(props) => props.theme.space[3]};
`;

export const WorkoutCardTitle = styled.Text`
  font-size: ${(props) => props.theme.fontSizes.title};
  font-weight: bold;
  color: ${(props) => props.theme.colors.text.primary};
`;

export const WorkoutCardSubtitle = styled.Text`
  font-size: ${(props) => props.theme.fontSizes.body};
  color: ${(props) => props.theme.colors.text.secondary};
`;

export const WorkoutsScreen = ({ navigation }) => {
  const { workouts, createWorkout } = useContext(WorkoutsContext);

  const renderWorkoutCard = ({ item }) => {
    const exercisesSummary = item.exercises
      .map((exercise) => `${exercise.sets.length} x ${exercise.name}`)
      .join("\n");

    return (
      <WorkoutCard
        onPress={() =>
          navigation.navigate("WorkoutDetails", {
            workoutId: item.id,
            workoutIdForHeader: item.id,
          })
        }
      >
        <WorkoutCardTitle>{item.name}</WorkoutCardTitle>
        <Spacer position="top" size="small" />
        <WorkoutCardSubtitle>{formatDate(item.date)}</WorkoutCardSubtitle>
        <Spacer position="top" size="medium" />
        <WorkoutCardSubtitle>{exercisesSummary}</WorkoutCardSubtitle>
      </WorkoutCard>
    );
  };

  const handleCreateWorkout = async () => {
    const newWorkout = await createWorkout();
    console.log("New workout ID:", newWorkout.id);
    console.log("Navigating to WorkoutEdit...");
    navigation.navigate("WorkoutEdit", { workoutId: newWorkout.id });
  };

  return (
    <Container>
      <CreateWorkoutButton onPress={handleCreateWorkout}>
        <CreateWorkoutButtonText>Create New Workout</CreateWorkoutButtonText>
      </CreateWorkoutButton>
      <FlatList
        data={workouts}
        renderItem={renderWorkoutCard}
        keyExtractor={(item) => item.id}
      />
    </Container>
  );
};
