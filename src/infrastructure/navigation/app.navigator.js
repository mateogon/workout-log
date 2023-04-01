import React, { useContext, useState, useEffect } from "react";

import { useNavigation } from "@react-navigation/native";
import { NavigationContainer } from "@react-navigation/native";

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
import { ExerciseSelectionProvider } from "../../services/exercises/exercise-selection.context";
import { WorkoutDetailsScreen } from "../../features/workout/screens/workout-details.screen";
import { WorkoutEditScreen } from "../../features/workout/screens/workout-edit.screen";
import { BottomTabBar } from "@react-navigation/bottom-tabs";
import { Spacer } from "../../components/spacer/spacer.component";
import { formatTime } from "../../utils/dateFormat";
const Tab = createBottomTabNavigator();
const TAB_ICONS = {
  History: [Ionicons, "time-sharp", 25],
  Workouts: [Ionicons, "add-sharp", 35],
  Exercises: [Ionicons, "body-sharp", 25],
  Settings: [Ionicons, "settings", 25],
};
const TAB_ICONS_COLORS = {
  Active: "#6200ee",
  Inactive: "gray",
};

const createScreenOptions = ({ route }, currentRouteName) => {
  const [IconComponent, iconName] = TAB_ICONS[route.name];
  return {
    headerShown:
      currentRouteName !== "WorkoutEdit" &&
      currentRouteName !== "WorkoutDetails" &&
      currentRouteName !== "ExercisePicker" &&
      currentRouteName != "ExerciseHistory", //&&
    //currentRouteName !== "Workouts",
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

const CustomTabBar = ({
  tabBarProps,
  ongoingWorkoutId,
  children,
  currentRouteName,
}) => {
  const navigation = useNavigation();

  const renderOngoingWorkoutBar = () => {
    if (
      !ongoingWorkoutId ||
      currentRouteName === "WorkoutEdit" ||
      currentRouteName === "ExercisePicker" ||
      currentRouteName === "ExerciseHistory"
    )
      return null;
    const [formattedTime, setFormattedTime] = useState(
      formatTime(ongoingWorkoutId)
    );

    useEffect(() => {
      const intervalId = setInterval(() => {
        setFormattedTime(formatTime(ongoingWorkoutId));
      }, 1000);
      return () => clearInterval(intervalId);
    }, [ongoingWorkoutId]);

    return (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("WorkoutEdit", { workoutId: ongoingWorkoutId });
        }}
      >
        <View style={styles.minimizedBar}>
          <Spacer position="top" size="medium" />
          <Text style={styles.minimizedBarText}>
            Ongoing Workout: {formattedTime}
          </Text>
          <Ionicons name="chevron-up" size={20} color="black" />
        </View>
      </TouchableOpacity>
    );
  };
  const shouldRenderTabBar =
    currentRouteName !== "WorkoutEdit" &&
    currentRouteName !== "ExercisePicker" &&
    currentRouteName !== "ExerciseHistory";
  return (
    <>
      {renderOngoingWorkoutBar()}
      {shouldRenderTabBar && (
        <BottomTabBar {...tabBarProps}>{children}</BottomTabBar>
      )}
    </>
  );
};

const AppNavigatorContent = ({ currentRouteName }) => {
  const { ongoingWorkoutId, retrieveWorkout } = useContext(WorkoutsContext);
  console.log("AppNavigatorContent currentRouteName", currentRouteName);
  return (
    <>
      <Tab.Navigator
        initialRouteName="Workouts"
        screenOptions={(route) => createScreenOptions(route, currentRouteName)}
        tabBar={(tabBarProps) => (
          <CustomTabBar
            tabBarProps={tabBarProps}
            ongoingWorkoutId={ongoingWorkoutId}
            currentRouteName={currentRouteName}
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
  const [currentRouteName, setCurrentRouteName] = useState(null);

  const getCurrentRouteName = (state) => {
    const route = state.routes[state.index];
    if (route.state) {
      return getCurrentRouteName(route.state);
    }
    return route.name;
  };

  return (
    <ExerciseSelectionProvider>
      <ExerciseContextProvider>
        <WorkoutsContextProvider>
          <NavigationContainer
            onStateChange={(state) =>
              setCurrentRouteName(getCurrentRouteName(state))
            }
            independent={true}
          >
            <AppNavigatorContent currentRouteName={currentRouteName} />
          </NavigationContainer>
        </WorkoutsContextProvider>
      </ExerciseContextProvider>
    </ExerciseSelectionProvider>
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
    borderTopColor: "grey",
    borderTopWidth: 1,
  },
  minimizedBarText: {
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default AppNavigator;
