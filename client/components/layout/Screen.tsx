import { ReactNode } from "react";
import { View, ViewProps } from "react-native";

import Colors from "@/constants/colors";

type ScreenProps = ViewProps & {
  children: ReactNode;
  padded?: boolean;
  centered?: boolean;
};

export function Screen({
  children,
  padded = true,
  centered = false,
  className = "",
  style,
  ...props
}: ScreenProps) {
  const layoutClass = centered ? "items-center justify-center" : "";
  const paddingClass = padded ? "px-6" : "";

  return (
    <View
      className={`flex-1 ${paddingClass} ${layoutClass} ${className}`}
      style={[{ backgroundColor: Colors.Onboardingbackground }, style]}
      {...props}
    >
      {children}
    </View>
  );
}
