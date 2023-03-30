import React, { useContext, useState } from "react";
import { Button } from "react-native";
import { IconButton, Menu } from "react-native-paper";
import { useNavigation, useRoute } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { WorkoutsScreen } from "../../features/workout/screens/workouts.screen";
import { WorkoutDetailsScreen } from "../../features/workout/screens/workout-details.screen";
import { WorkoutEditScreen } from "../../features/workout/screens/workout-edit.screen";
import { ExercisePickerScreen } from "../../features/workout/screens/exercise-picker.screen";
import { WorkoutsContext } from "../../services/workouts/workouts.context";
import { SafeArea } from "../../components/utility/safe-area.component";
import MenuComponent from "../../features/workout/components/menu.component";
const WorkoutStack = createStackNavigator();

export const WorkoutStackNavigator = ({ route }) => {
  const navigation = useNavigation();
  const { finishWorkout, deleteWorkout } = useContext(WorkoutsContext);
  const [menuVisible, setMenuVisible] = useState(false);

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const handleDeleteWorkout = (navigation) => {
    // Delete the workout
    deleteWorkout(route.params.workoutId);
    console.log("Delete workout: ", route.params.workoutId);
    setMenuVisible(false);

    // Navigate back using the stack navigator
    navigation.goBack();
  };
  return (
    <SafeArea>
      <WorkoutStack.Navigator
        initialRouteName="Workouts"
        screenOptions={{
          headerTitle: "",
          headerStyle: {
            height: 60, // You can adjust this value to set the height of the header
            backgroundColor: "#FFFFFF",
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
          },
        }}
      >
        <WorkoutStack.Screen
          name="Workouts"
          component={WorkoutsScreen}
          options={{ headerShown: false }}
        />
        <WorkoutStack.Screen
          name="WorkoutEdit"
          component={WorkoutEditScreen}
          options={{
            headerTitle: "",
          }}
        />
        <WorkoutStack.Screen
          name="WorkoutDetails"
          component={WorkoutDetailsScreen}
          options={({ navigation, route }) => ({
            headerTitle: "",
            headerRight: () => (
              <MenuComponent
                workoutId={route.params.workoutId}
                navigation={navigation}
              />
            ),
          })}
        />

        <WorkoutStack.Screen
          name="ExercisePicker"
          component={ExercisePickerScreen}
          options={{
            headerTitle: "",
          }}
        />
      </WorkoutStack.Navigator>
    </SafeArea>
  );
};
