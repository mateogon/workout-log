import React, { useContext, useState } from "react";

import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Collapsible from "react-native-collapsible";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";

import { SettingsNavigator } from "./settings.navigator";
import { WorkoutStackNavigator } from "./workout.navigator";
import { HistoryScreen } from "../../features/workout/screens/history.screen";
import { ExercisesScreen } from "../../features/workout/screens/exercises.screen";
import { WorkoutsContext } from "../../services/workouts/workouts.context";
import { WorkoutsContextProvider } from "../../services/workouts/workouts.context";
import { ExerciseContextProvider } from "../../services/exercises/exercises.context";
import { WorkoutDetailsScreen } from "../../features/workout/screens/workout-details.screen";
import { WorkoutEditScreen } from "../../features/workout/screens/workout-edit.screen";
import { BottomTabBar } from "@react-navigation/bottom-tabs";

const Tab = createBottomTabNavigator();
const TAB_ICONS = {
  History: [Ionicons, "time-sharp", 25],
  Workouts: [Ionicons, "add-sharp", 35],
  Exercises: [Ionicons, "body-sharp", 25],
  Settings: [Ionicons, "settings", 25],
};
const TAB_ICONS_COLORS = {
  Active: "tomato",
  Inactive: "gray",
};

const createScreenOptions = ({ route }) => {
  const [IconComponent, iconName] = TAB_ICONS[route.name];
  return {
    headerShown: false,
    tabBarIcon: ({ focused, size }) => {
      const Color = focused
        ? TAB_ICONS_COLORS["Active"]
        : TAB_ICONS_COLORS["Inactive"];
      return (
        <IconComponent
          name={iconName}
          size={TAB_ICONS[route.name][2]}
          color={Color}
        />
      );
    },
    tabBarActiveTintColor: TAB_ICONS_COLORS["Active"],
    tabBarInactiveTintColor: TAB_ICONS_COLORS["Inactive"],
  };
};

const CustomTabBar = ({ tabBarProps, ongoingWorkoutId, children }) => {
  const navigation = useNavigation();
  const route = useRoute();

  const renderOngoingWorkoutBar = () => {
    if (!ongoingWorkoutId || route.name === "WorkoutEdit") return null;

    return (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("WorkoutEdit", { workoutId: ongoingWorkoutId });
        }}
      >
        <View style={styles.minimizedBar}>
          <Text style={styles.minimizedBarText}>
            Ongoing Workout: {ongoingWorkoutId}
          </Text>
          <Ionicons name="chevron-up" size={20} color="black" />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <>
      {renderOngoingWorkoutBar()}
      <BottomTabBar {...tabBarProps}>{children}</BottomTabBar>
    </>
  );
};

const AppNavigatorContent = () => {
  const { ongoingWorkoutId, retrieveWorkout } = useContext(WorkoutsContext);

  return (
    <>
      <Tab.Navigator
        initialRouteName="Workouts"
        screenOptions={createScreenOptions}
        tabBar={(tabBarProps) => (
          <CustomTabBar
            tabBarProps={tabBarProps}
            ongoingWorkoutId={ongoingWorkoutId}
          />
        )}
      >
        <Tab.Screen name="History" component={HistoryScreen} />
        <Tab.Screen name="Workouts" component={WorkoutStackNavigator} />
        <Tab.Screen name="Exercises" component={ExercisesScreen} />
        <Tab.Screen name="Settings" component={SettingsNavigator} />
      </Tab.Navigator>
    </>
  );
};

export const AppNavigator = () => {
  return (
    <ExerciseContextProvider>
      <WorkoutsContextProvider>
        <AppNavigatorContent />
      </WorkoutsContextProvider>
    </ExerciseContextProvider>
  );
};

const styles = StyleSheet.create({
  minimizedBar: {
    backgroundColor: "white",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "grey",
  },
  minimizedBarText: {
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default AppNavigator;
