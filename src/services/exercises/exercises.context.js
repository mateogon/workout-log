// src/services/exercises/exercise.context.js
import React, { useState, createContext, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { exerciseData } from "./exerciseData";

export const ExerciseContext = createContext();

export const ExerciseContextProvider = ({ children }) => {
  const [exercises, setExercises] = useState([]);

  const storeExercises = async (exercises) => {
    try {
      const jsonExercises = JSON.stringify(exercises);
      await AsyncStorage.setItem("@exercises", jsonExercises);
    } catch (e) {
      console.error("Error storing exercises", e);
    }
  };

  const loadExercises = async () => {
    try {
      const jsonExercises = await AsyncStorage.getItem("@exercises");
      if (jsonExercises !== null) {
        setExercises(JSON.parse(jsonExercises));
      } else {
        // If AsyncStorage is empty, store the exercise data from exerciseData
        setExercises(exerciseData);
        storeExercises(exerciseData);
      }
    } catch (e) {
      console.error("Error loading exercises", e);
    }
  };

  const addExercise = (newExercise) => {
    setExercises((prevExercises) => [...prevExercises, newExercise]);
  };

  const removeExercise = (id) => {
    setExercises((prevExercises) =>
      prevExercises.filter((exercise) => exercise.id !== id)
    );
  };

  useEffect(() => {
    loadExercises();
  }, []);

  useEffect(() => {
    storeExercises(exercises);
  }, [exercises]);

  return (
    <ExerciseContext.Provider
      value={{ exercises, setExercises, addExercise, removeExercise }}
    >
      {children}
    </ExerciseContext.Provider>
  );
};

export const useExercises = () => {
  const context = useContext(ExerciseContext);
  if (context === undefined) {
    throw new Error("useExercises must be used within an ExerciseProvider");
  }
  return context;
};
