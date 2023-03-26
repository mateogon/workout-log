import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { WorkoutsScreen } from "../../features/workout/screens/workouts.screen";
import { WorkoutDetailsScreen } from "../../features/workout/screens/workout-details.screen";
import { WorkoutEditScreen } from "../../features/workout/screens/workout-edit.screen";
import { ExercisePickerScreen } from "../../features/workout/screens/exercise-picker.screen";
const WorkoutStack = createStackNavigator();

export const WorkoutStackNavigator = () => {
  return (
    <WorkoutStack.Navigator
      initialRouteName="Workouts"
      screenOptions={{
        headerShown: true,
      }}
    >
      <WorkoutStack.Screen name="Workouts" component={WorkoutsScreen} />
      <WorkoutStack.Screen name="WorkoutEdit" component={WorkoutEditScreen} />
      <WorkoutStack.Screen
        name="WorkoutDetails"
        component={WorkoutDetailsScreen}
      />

      <WorkoutStack.Screen
        name="ExercisePicker"
        component={ExercisePickerScreen}
      />
    </WorkoutStack.Navigator>
  );
};
