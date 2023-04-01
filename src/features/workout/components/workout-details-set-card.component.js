import React from "react";
import { useNavigation } from "@react-navigation/native";
import { Text, View } from "react-native";
import styled from "styled-components/native";
import { formatDate } from "../../../utils/dateFormat";
import { TouchableOpacity } from "react-native-gesture-handler";
const Container = styled.View`
  border-width: 1px;
  border-color: #e0e0e0;
  border-radius: 8px;
  padding: 10px;
  background-color: white;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.25;
  shadow-radius: 3.84px;
  elevation: 5;
`;

const ExerciseName = styled.Text`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 8px;
`;

const SetRow = styled.Text`
  font-size: 16px;
`;
const ExerciseDate = styled.Text`
  font-size: 15px;
  font-color: #cecece;
  margin-bottom: 18px;
`;

export const ExerciseSetDetails = ({
  id,
  exerciseName,
  date,
  sets,
  touchable,
}) => {
  const navigation = useNavigation();
  return (
    <Container>
      {touchable ? (
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("ExerciseHistory", {
              exerciseId: id,
            })
          }
        >
          <ExerciseName>{exerciseName}</ExerciseName>
        </TouchableOpacity>
      ) : (
        <ExerciseName>{exerciseName}</ExerciseName>
      )}

      <ExerciseDate>{formatDate(date)}</ExerciseDate>
      {sets.map((set, index) => (
        <SetRow key={set.id}>
          {`${index + 1} ${set.weight}kg x ${set.reps}`}
        </SetRow>
      ))}
    </Container>
  );
};
