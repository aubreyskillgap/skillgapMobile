import Toast from "react-native-toast-message";

export function ToastBox(
  type: string,
  text2: string,
  customProps?: object
) {
  Toast.show({
    type,
    text2,
    position: "bottom",
    visibilityTime: 3000,
    autoHide: true,
    topOffset: 50,
    props: customProps,
  });
}
