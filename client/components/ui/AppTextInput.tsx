import { TextInput, TextInputProps } from "react-native";

import Colors from "@/constants/colors";

type AppTextInputProps = TextInputProps & {
  hasError?: boolean;
};
// 
export function AppTextInput({
  className = "",
  hasError = false,
  placeholderTextColor = Colors.text.secondary,
  style,
  ...props
}: AppTextInputProps) {
  return (
    <TextInput
      className={`w-full rounded-lg border border-gray-500 bg-white px-4 py-3 text-base ${className}`}
      placeholderTextColor={placeholderTextColor}
      style={[
        {
          borderColor: hasError ? Colors.error : Colors.border.primary,
          color: Colors.text.primary,
        },
        style,
      ]}
      {...props}
    />
  );
}
