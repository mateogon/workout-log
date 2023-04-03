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
  useEffect(() => {
    console.log("Workouts context updated:", workouts);
  }, [workouts]);
  const startWorkout = (workoutId) => {
    setOngoingWorkoutId(workoutId);
  };

  const finishWorkout = async () => {
    if (ongoingWorkoutId) {
      // Retrieve the ongoing workout
      const ongoingWorkout = await retrieveWorkout(ongoingWorkoutId);

      // Check if the ongoing workout is empty (i.e., no exercises)
      const isEmptyWorkout = ongoingWorkout.exercises.length === 0;

      // If the workout is not empty, save the workout and update exercise history
      if (!isEmptyWorkout) {
        const completedWorkout = {
          ...ongoingWorkout,
          exercises: ongoingWorkout.exercises.map((exercise) => ({
            ...exercise,
            sets: exercise.sets.filter((set) => set.completed),
          })),
        };
        await saveWorkout(completedWorkout);
        await updateExerciseHistory(completedWorkout);
      } else {
        // If the workout is empty, delete it
        await deleteWorkout(ongoingWorkoutId);
      }
    }

    // Reset the ongoingWorkoutId to null
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
      // Retrieve the workout to be deleted
      const workoutToBeDeleted = await retrieveWorkout(workoutId);

      // Remove the exercise history entries of the workout
      workoutToBeDeleted.exercises.forEach(async (exercise) => {
        const exerciseHistory = await getExerciseHistory(exercise.id);

        // Filter out the history entries belonging to the workout being deleted
        const updatedExerciseHistory = exerciseHistory.filter(
          (entry) => entry.date !== workoutToBeDeleted.date
        );

        // Save the updated exercise history to AsyncStorage
        await AsyncStorage.setItem(
          `exerciseHistory-${exercise.id}`,
          JSON.stringify(updatedExerciseHistory)
        );
      });

      // Remove the workout from AsyncStorage
      await AsyncStorage.removeItem(`workout-${workoutId}`);

      // Update the workouts state by removing the deleted workout
      setWorkouts(workouts.filter((workout) => workout.id !== workoutId));

      // Update the list of workout IDs in AsyncStorage
      const workoutIds =
        JSON.parse(await AsyncStorage.getItem("allWorkoutIds")) || [];
      const updatedWorkoutIds = workoutIds.filter((id) => id !== workoutId);
      await AsyncStorage.setItem(
        "allWorkoutIds",
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
        `workout-${workoutId}`,
        JSON.stringify(updatedWorkout)
      );

      // Update the workouts state with the updated workout
      /*
      setWorkouts(
        workouts.map((workout) =>
          workout.id === workoutId ? updatedWorkout : workout
        )
      );
      */
      setWorkouts((prevWorkouts) =>
        prevWorkouts.map((workout) =>
          workout.id === workoutId ? { ...workout, ...updatedWorkout } : workout
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

    // Retrieve all workout IDs, sort them in descending order, and fetch workouts
    const updatedFetchedWorkouts = await Promise.all(
      (
        await retrieveAllWorkoutIds()
      )
        .sort((a, b) => Number(b) - Number(a)) // sort the IDs in descending order
        .map((id) => retrieveWorkout(id))
    );

    // Update the workouts state with the sorted workouts
    setWorkouts(updatedFetchedWorkouts);
  };

  const updateExerciseHistory = async (workout) => {
    workout.exercises.forEach(async (exercise) => {
      const exerciseHistory = await getExerciseHistory(exercise.id);
      const today = workout.date.split("T")[0];
      let todayEntry = exerciseHistory.find((entry) => entry.date === today);

      if (!todayEntry) {
        todayEntry = {
          date: today,
          sets: [],
        };
        exerciseHistory.push(todayEntry);
      }

      exercise.sets.forEach((set) => {
        todayEntry.sets.push({
          reps: set.reps,
          weight: set.weight,
        });
      });

      await AsyncStorage.setItem(
        `exerciseHistory-${exercise.id}`,
        JSON.stringify(exerciseHistory)
      );
    });
  };

  const getExerciseHistory = async (exerciseId) => {
    console.log("exerciseId", exerciseId); // To check if correct exerciseId is being passed
    try {
      const historyJSON = await AsyncStorage.getItem(
        `exerciseHistory-${exerciseId}`
      );
      console.log("historyJSON", historyJSON);
      if (historyJSON !== null) {
        const parsedHistory = JSON.parse(historyJSON);
        console.log("parsedHistory", parsedHistory);
        parsedHistory.forEach((entry) => (entry.date = new Date(entry.date)));
        return parsedHistory;
      } else {
        console.log("No exercise history found");
        return [];
      }
    } catch (error) {
      console.error("Error retrieving exercise history:", error);
      return [];
    }
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
    getExerciseHistory,
    updateExerciseHistory,
  };

  return (
    <WorkoutsContext.Provider value={value}>
      {children}
    </WorkoutsContext.Provider>
  );
};

export default WorkoutsContextProvider;
