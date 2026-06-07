import { Text, TouchableOpacity, TouchableOpacityProps } from "react-native";

import Colors from "@/constants/colors";

type AppButtonProps = TouchableOpacityProps & {
  title: string;
  variant?: "primary" | "secondary";
};

export function AppButton({
  title,
  variant = "primary",
  className = "",
  disabled,
  ...props
}: AppButtonProps) {
  const backgroundColor =
    variant === "primary" ? Colors.button.primary : Colors.button.secondary;

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      className={`w-full items-center justify-center rounded-lg py-4 ${className}`}
      disabled={disabled}
      style={{ backgroundColor, opacity: disabled ? 0.6 : 1 }}
      {...props}
    >
      <Text className="font-bold text-white">{title}</Text>
    </TouchableOpacity>
  );
}
