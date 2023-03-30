import React, { useContext } from "react";
import { FlatList } from "react-native";
import { ExerciseContext } from "../../../services/exercises/exercises.context";
import { SafeArea } from "../../../components/utility/safe-area.component";
import styled from "styled-components/native";

const ExerciseCard = styled.TouchableOpacity`
  background-color: ${(props) => props.theme.colors.bg.primary};
  padding: ${(props) => props.theme.space[4]};
  border-radius: ${(props) => props.theme.space[2]};
  margin-bottom: ${(props) => props.theme.space[3]};
  elevation: 3;
`;

const Container = styled.View`
  background-color: ${(props) => props.theme.colors.ui.tertiary};
  flex: 1;
  padding: ${(props) => props.theme.space[6]};
  padding-top: ${(props) => props.theme.space[0]};
`;

const ExerciseName = styled.Text`
  font-size: ${(props) => props.theme.fontSizes.title};
  font-weight: bold;
  color: ${(props) => props.theme.colors.text.primary};
  margin-bottom: ${(props) => props.theme.space[3]};
`;

const ExerciseCategory = styled.Text`
  font-size: ${(props) => props.theme.fontSizes.body};
  color: ${(props) => props.theme.colors.text.secondary};
  font-weight: ${(props) => props.theme.fontWeights.regular};
  margin-bottom: ${(props) => props.theme.space[3]};
`;

export const ExercisePickerScreen = ({ route, navigation }) => {
  const { exercises, addExercise, removeExercise } =
    useContext(ExerciseContext);

  const renderItem = ({ item }) => {
    return (
      <ExerciseCard
        onPress={() => {
          if (
            route.params &&
            typeof route.params.onExerciseSelected === "function"
          ) {
            route.params.onExerciseSelected(item);
          }
          navigation.goBack();
        }}
      >
        <ExerciseName>{item.name}</ExerciseName>
        <ExerciseCategory>{item.category}</ExerciseCategory>
      </ExerciseCard>
    );
  };

  return (
    <SafeArea>
      <Container>
        <FlatList
          data={exercises}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      </Container>
    </SafeArea>
  );
};
