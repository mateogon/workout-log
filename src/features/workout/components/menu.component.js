import React, { useContext, useState } from "react";
import { IconButton, Menu } from "react-native-paper";
import { WorkoutsContext } from "../../../services/workouts/workouts.context";

const MenuComponent = ({ workoutId, navigation }) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const { deleteWorkout } = useContext(WorkoutsContext);

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const handleDeleteWorkout = () => {
    // Delete the workout
    deleteWorkout(workoutId);
    console.log("Delete workout: ", workoutId);
    setMenuVisible(false);

    // Navigate back using the stack navigator
    navigation.goBack();
  };

  return (
    <Menu
      visible={menuVisible}
      onDismiss={toggleMenu}
      anchor={
        <IconButton icon="dots-vertical" size={24} onPress={toggleMenu} />
      }
    >
      <Menu.Item onPress={handleDeleteWorkout} title="Delete Workout" />
    </Menu>
  );
};

export default MenuComponent;
