import React, { createContext, useState } from "react";

export const ExerciseSelectionContext = createContext();

export const ExerciseSelectionProvider = ({ children }) => {
  const [onExerciseSelected, setOnExerciseSelected] = useState(null);

  return (
    <ExerciseSelectionContext.Provider
      value={{
        onExerciseSelected,
        setOnExerciseSelected,
      }}
    >
      {children}
    </ExerciseSelectionContext.Provider>
  );
};
