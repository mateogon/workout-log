import React, { createContext, useState, useEffect, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { sampleWorkouts } from "./sampleWorkouts";
export const WorkoutsContext = createContext();
/* Data
Workout
  id (string)
  date (string, ISO format)
  exercises (array of Exercise)

Exercise
  id (string)
  name (string)
  sets (array of Set)

Set
  id (string)
  reps (number)
  weight (number)
  completed (boolean)

*/
export const WorkoutsContextProvider = ({ children }) => {
  const [workouts, setWorkouts] = useState([]);
  const [ongoingWorkoutId, setOngoingWorkoutId] = useState(null);

  useEffect(() => {
    fetchWorkouts();
  }, []);
  const startWorkout = (workoutId) => {
    setOngoingWorkoutId(workoutId);
  };

  const finishWorkout = () => {
    setOngoingWorkoutId(null);
  };

  const saveWorkout = async (workout) => {
    const completedWorkout = {
      ...workout,
      exercises: workout.exercises.map((exercise) => ({
        ...exercise,
        sets: exercise.sets.filter((set) => set.completed),
      })),
    };
    try {
      await AsyncStorage.setItem(
        `workout-${workout.id}`,
        JSON.stringify(completedWorkout)
      );
    } catch (error) {
      console.error("Error storing workout data:", error);
    }
  };

  const retrieveAllWorkoutIds = async () => {
    try {
      const workoutIdsJSON = await AsyncStorage.getItem("allWorkoutIds");
      if (workoutIdsJSON !== null) {
        return JSON.parse(workoutIdsJSON);
      } else {
        console.error("Workout IDs not found.");
        return []; // Return an empty array instead of null
      }
    } catch (error) {
      console.error("Error retrieving all workout IDs:", error);
      return []; // Return an empty array instead of null
    }
  };

  const retrieveWorkout = async (workoutId) => {
    try {
      const workoutJSON = await AsyncStorage.getItem(`workout-${workoutId}`);
      if (workoutJSON !== null) {
        return JSON.parse(workoutJSON);
      } else {
        console.error("Workout not found.");
        return null;
      }
    } catch (error) {
      console.error("Error retrieving workout data:", error);
      return null;
    }
  };

  const deleteWorkout = async (workoutId) => {
    try {
      await AsyncStorage.removeItem(`@workout_${workoutId}`);

      // Update the workouts state by removing the deleted workout
      setWorkouts(workouts.filter((workout) => workout.id !== workoutId));

      // Update the list of workout IDs in AsyncStorage
      const workoutIds =
        JSON.parse(await AsyncStorage.getItem("@workout_ids")) || [];
      const updatedWorkoutIds = workoutIds.filter((id) => id !== workoutId);
      await AsyncStorage.setItem(
        "@workout_ids",
        JSON.stringify(updatedWorkoutIds)
      );
    } catch (error) {
      console.error("Error deleting workout:", error);
    }
  };

  const updateWorkout = async (workoutId, updatedWorkout) => {
    try {
      // Save the updated workout to AsyncStorage
      await AsyncStorage.setItem(
        `@workout_${workoutId}`,
        JSON.stringify(updatedWorkout)
      );

      // Update the workouts state with the updated workout
      setWorkouts(
        workouts.map((workout) =>
          workout.id === workoutId ? updatedWorkout : workout
        )
      );
    } catch (error) {
      console.error("Error updating workout:", error);
    }
  };

  const createWorkout = async () => {
    // Generate a unique ID for the new workout
    if (ongoingWorkoutId) {
      console.warn("A workout is already in progress.");
      return;
    }
    const workoutId = new Date().getTime().toString();

    // Create a new workout object with a default name and an empty exercises array
    const newWorkout = {
      id: workoutId,
      name: "New Workout",
      date: new Date().toISOString(),
      exercises: [],
    };

    // Save the new workout to AsyncStorage
    await saveWorkout(newWorkout);

    // Update the workouts state
    setWorkouts([...workouts, newWorkout]);

    // Update the list of workout IDs in AsyncStorage
    const workoutIds =
      JSON.parse(await AsyncStorage.getItem("allWorkoutIds")) || [];
    await AsyncStorage.setItem(
      "allWorkoutIds",
      JSON.stringify([...workoutIds, workoutId])
    );

    // Return the created workout object
    startWorkout(workoutId);
    return newWorkout;
  };

  const fetchWorkouts = async () => {
    const ids = await retrieveAllWorkoutIds();
    const fetchedWorkouts = await Promise.all(
      ids.map((id) => retrieveWorkout(id))
    );

    if (fetchedWorkouts.length === 0) {
      // Save sampleWorkouts to AsyncStorage and update workout IDs
      await Promise.all(sampleWorkouts.map((workout) => saveWorkout(workout)));
      await AsyncStorage.setItem(
        "allWorkoutIds",
        JSON.stringify(sampleWorkouts.map((workout) => workout.id))
      );
    }

    const updatedFetchedWorkouts = await Promise.all(
      (await retrieveAllWorkoutIds()).map((id) => retrieveWorkout(id))
    );
    setWorkouts(updatedFetchedWorkouts);
  };

  const value = {
    workouts,
    ongoingWorkoutId,
    saveWorkout,
    retrieveAllWorkoutIds,
    retrieveWorkout,
    deleteWorkout,
    updateWorkout,
    createWorkout,
    startWorkout,
    finishWorkout,
  };

  useEffect(() => {
    const fetchWorkouts = async () => {
      const ids = await retrieveAllWorkoutIds();
      const fetchedWorkouts = await Promise.all(
        ids.map((id) => retrieveWorkout(id))
      );
      setWorkouts(fetchedWorkouts);
    };

    fetchWorkouts();
  }, []);
  return (
    <WorkoutsContext.Provider value={value}>
      {children}
    </WorkoutsContext.Provider>
  );
};

export default WorkoutsContextProvider;
