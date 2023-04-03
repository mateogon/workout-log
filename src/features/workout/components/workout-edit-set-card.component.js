import React, { useContext, useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { CheckBox } from "react-native-elements";
import styled from "styled-components/native";
import {
  Swipeable,
  RectButton,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import { Animated } from "react-native";
import { WorkoutsContext } from "../../../services/workouts/workouts.context";

const AddSetButton = styled(TouchableOpacity)`
  background-color: #6200ee;
  border-radius: 4px;
  padding-horizontal: 10px;
  padding-vertical: 5px;
  align-self: center;
  margin-bottom: 16px;
`;

const AddSetText = styled.Text`
  color: white;
  font-size: 16px;
  font-weight: 400;
`;
const ColumnsRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-top: 4px;
`;
const SetRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: ${(props) => props.theme.colors.bg.primary};
`;

const SetInput = styled.TextInput`
  background-color: #c5c5c5;
  border-radius: 4px;
  width: 60px;
  padding-horizontal: 5px;
  text-align: center;
`;
const SetColumn = styled.Text`
  width: 60px;
  text-align: center;
`;
const Container = styled.View`
  padding-top: 8px;
`;

export const WorkoutEditSetCard = ({
  exercise,
  exerciseIndex,
  workout,
  setWorkout,
}) => {
  const { getExerciseHistory } = useContext(WorkoutsContext);
  const [exerciseHistory, setExerciseHistory] = useState([]);
  const [forceUpdate, setForceUpdate] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchExerciseHistory = async () => {
      const history = await getExerciseHistory(exercise.id);
      if (isMounted) {
        setExerciseHistory(history);
        console.log("history", history);
      }
    };

    fetchExerciseHistory();

    return () => {
      isMounted = false;
    };
  }, [exercise.id, forceUpdate]);

  const handleAddSet = () => {
    const newSet = {
      id: exercise.sets.length + 1,
      reps: 0,
      weight: 0,
      completed: false,
    };

    setWorkout({
      ...workout,
      exercises: workout.exercises.map((e, index) =>
        index === exerciseIndex ? { ...e, sets: [...exercise.sets, newSet] } : e
      ),
    });
  };

  const handleSetChange = (setIndex, field, value) => {
    const updatedSets = [...exercise.sets];
    console.log("handleSetChange called with params: ", setIndex, field, value);

    if (field === "completed" && value === true) {
      const lastExerciseSets = getLastExerciseSets(exerciseHistory);
      updatedSets[setIndex]["completed"] = value;
      if (updatedSets[setIndex]["reps"] === 0) {
        const placeholderReps =
          lastExerciseSets.length > 0 && lastExerciseSets[setIndex]?.reps
            ? lastExerciseSets[setIndex].reps
            : 0;
        updatedSets[setIndex]["reps"] = placeholderReps;
      }
      if (updatedSets[setIndex]["weight"] === 0) {
        const placeholderWeight =
          lastExerciseSets.length > 0 && lastExerciseSets[setIndex]?.weight
            ? lastExerciseSets[setIndex].weight
            : 0;
        updatedSets[setIndex]["weight"] = placeholderWeight;
      }
    } else {
      updatedSets[setIndex][field] = value === "" ? 0 : value;
    }

    setWorkout({
      ...workout,
      exercises: workout.exercises.map((e, index) =>
        index === exerciseIndex ? { ...e, sets: updatedSets } : e
      ),
    });
    setForceUpdate((prevState) => !prevState);
  };

  const getLastExerciseSets = (exerciseHistory) => {
    if (exerciseHistory.length === 0) {
      return [];
    }

    const lastWorkout = exerciseHistory[exerciseHistory.length - 1];
    return lastWorkout.sets || [];
  };
  const handleDeleteSet = (setIndex) => {
    const updatedSets = exercise.sets.filter((_, index) => index !== setIndex);

    setWorkout({
      ...workout,
      exercises: workout.exercises.map((e, index) =>
        index === exerciseIndex ? { ...e, sets: updatedSets } : e
      ),
    });
  };
  const getPreviousSetData = (setIndex) => {
    const lastExerciseSets = getLastExerciseSets(exerciseHistory);
    if (lastExerciseSets[setIndex]) {
      const { reps, weight } = lastExerciseSets[setIndex];
      return { weight, reps };
    }
    return { weight: 0, reps: 0 };
  };

  const renderRightActions = (progress, dragX, setIndex) => {
    const trans = dragX.interpolate({
      inputRange: [-50, 0],
      outputRange: [0, 50],
      extrapolate: "clamp",
    });

    return (
      <Animated.View
        style={{
          flexDirection: "row",
          flex: 1,
          transform: [{ translateX: trans }],
        }}
      >
        <RectButton
          onPress={() => handleDeleteSet(setIndex)}
          style={{
            backgroundColor: "red",
            justifyContent: "center",
            alignItems: "flex-end",
            width: "100%",
          }}
        >
          <View />
        </RectButton>
      </Animated.View>
    );
  };

  return (
    <Container>
      <ColumnsRow>
        <SetColumn>Set</SetColumn>
        <SetColumn>Previous</SetColumn>
        <SetColumn>Weight</SetColumn>
        <SetColumn>Reps</SetColumn>
        <View style={{ flexGrow: 0.55 }} />
      </ColumnsRow>
      {exercise.sets.map((set, setIndex) => (
        <GestureHandlerRootView>
          <Swipeable
            key={set.id}
            renderRightActions={(progress, dragX) =>
              renderRightActions(progress, dragX, setIndex)
            }
            onSwipeableRightOpen={() => {
              handleDeleteSet(setIndex);
            }}
            overshootRight={false}
            rightThreshold={50}
          >
            <SetRow>
              <SetColumn>{setIndex + 1}</SetColumn>
              <SetColumn>
                {getPreviousSetData(setIndex).weight === 0 &&
                getPreviousSetData(setIndex).reps === 0
                  ? "-"
                  : `${getPreviousSetData(setIndex).weight} x ${
                      getPreviousSetData(setIndex).reps
                    }`}
              </SetColumn>
              <SetInput
                keyboardType="numeric"
                value={
                  exercise.sets[setIndex].reps === 0
                    ? ""
                    : exercise.sets[setIndex].reps.toString()
                }
                onChangeText={(text) =>
                  handleSetChange(
                    setIndex,
                    "reps",
                    text === "" ? "" : parseInt(text)
                  )
                }
                placeholder={
                  getPreviousSetData(setIndex).reps
                    ? getPreviousSetData(setIndex).reps.toString()
                    : "0"
                }
                placeholderTextColor="grey"
              />
              <SetInput
                keyboardType="numeric"
                value={
                  exercise.sets[setIndex].weight === 0
                    ? ""
                    : exercise.sets[setIndex].weight.toString()
                }
                onChangeText={(text) =>
                  handleSetChange(
                    setIndex,
                    "weight",
                    text === "" ? "" : parseInt(text)
                  )
                }
                placeholder={
                  getPreviousSetData(setIndex).weight
                    ? getPreviousSetData(setIndex).weight.toString()
                    : "0"
                }
                placeholderTextColor="grey"
              />
              <CheckBox
                checked={set.completed}
                uncheckedColor="grey"
                checkedColor="green"
                onPress={() =>
                  handleSetChange(setIndex, "completed", !set.completed)
                }
              />
            </SetRow>
          </Swipeable>
        </GestureHandlerRootView>
      ))}
      <AddSetButton onPress={handleAddSet}>
        <AddSetText>Add Set</AddSetText>
      </AddSetButton>
    </Container>
  );
};
