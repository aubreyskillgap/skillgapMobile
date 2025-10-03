import React, { ReactNode } from "react";
import { Text } from "react-native";


interface ILabel {
  children: ReactNode;
}
const Label = ({ children }: ILabel) => {

  return (
   <Text
  style={{
    color: '#000000',
    fontWeight: '500', 
  }}
>
  {children}
</Text>
  );
};

export default Label;
