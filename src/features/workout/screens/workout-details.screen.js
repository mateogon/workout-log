import React, { useContext, useEffect, useState } from "react";
import { TouchableOpacity, Text, StyleSheet, ScrollView } from "react-native";
import styled from "styled-components/native";

import { SafeArea } from "../../../components/utility/safe-area.component";
import { getFocusedRouteNameFromRoute } from "@react-navigation/core";
import { WorkoutsContext } from "../../../services/workouts/workouts.context";
import { WorkoutDetailsSetCard } from "../components/workout-details-set-card.component";
import { Spacer } from "../../../components/spacer/spacer.component";
import { Ionicons } from "@expo/vector-icons";

const Loading = styled.ActivityIndicator`
  flex: 1;
`;

export const WorkoutDetailsScreen = ({ route, navigation }) => {
  console.log("WorkoutDetailsScreen ");
  const { workouts, ongoingWorkoutId } = useContext(WorkoutsContext);
  const [currentWorkoutData, setCurrentWorkoutData] = useState();
  const workoutId = route.params ? route.params.workoutId : null;

  useEffect(() => {
    console.log(
      "useEffect dependencies:",
      route.params,
      workouts,
      ongoingWorkoutId
    );
    if (route.params && route.params.workoutId) {
      const workoutData = workouts.find((w) => w.id === route.params.workoutId);
      setCurrentWorkoutData(workoutData);
    } else if (ongoingWorkoutId) {
      const workoutData = workouts.find((w) => w.id === ongoingWorkoutId);
      setCurrentWorkoutData(workoutData);
    }
  }, [route.params, workouts, ongoingWorkoutId]);

  React.useLayoutEffect(() => {
    const routeName = getFocusedRouteNameFromRoute(route);
    navigation.setOptions({
      tabBarVisible: routeName !== "WorkoutDetails",
    });
  }, [navigation, route]);

  if (!currentWorkoutData) {
    return <Loading />;
  }

  return (
    <SafeArea>
      <ScrollView>
        <Text style={styles.workoutTitle}>{currentWorkoutData.name}</Text>
        {currentWorkoutData.exercises.map((exercise, index) => (
          <Spacer position="bottom" size="large" key={`exercise-${index}`}>
            <WorkoutDetailsSetCard
              exerciseName={exercise.name}
              sets={exercise.sets}
            />
          </Spacer>
        ))}
      </ScrollView>
    </SafeArea>
  );
};

const styles = StyleSheet.create({
  workoutTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 16,
  },
});
