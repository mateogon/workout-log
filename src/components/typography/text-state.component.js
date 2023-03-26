import React, { useState, useEffect } from "react";
import { View, Image } from "react-native";
import { TextInput } from "react-native-gesture-handler";

export const TextInputState = ({
  placeHolderValue = "",
  index,
  onChange,
  ...props
}) => {
  const [inputUpdateState, setInputUpdateState] = useState(false);
  const [inputValue, setInputValue] = useState(placeHolderValue);

  useEffect(() => {
    //onChange(index, inputValue);
    console.log("inputValue:", inputValue);
  }, []);
  return (
    <TextInput
      {...props}
      placeholder={placeHolderValue}
      //value={inputValue}
      //placeholder={!inputUpdateState ? placeHolderValue : undefined}
      //value={inputUpdateState ? inputValue : undefined}
      /*
      onChangeText={(text) => {
        setInputValue(text);
      }}*/

      onBlur={(e) => {
        setInputValue(e.nativeEvent.text);
      }}

      //onChangeText={(text) => {
      //setInputValue(text);
      //onChange(index, text);
      //if (!inputUpdateState) {
      //  setInputUpdateState(true);
      //}
    />
  );
};
