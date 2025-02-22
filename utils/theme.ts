import { MD3LightTheme, configureFonts } from "react-native-paper";

const fontConfig = {
  displayLarge: {
    fontFamily: "System",
    fontSize: 57,
    fontWeight: "400",
    letterSpacing: 0,
    lineHeight: 64,
  },
  displayMedium: {
    fontFamily: "System",
    fontSize: 45,
    fontWeight: "400",
    letterSpacing: 0,
    lineHeight: 52,
  },
  displaySmall: {
    fontFamily: "System",
    fontSize: 36,
    fontWeight: "400",
    letterSpacing: 0,
    lineHeight: 44,
  },
  headlineLarge: {
    fontFamily: "System",
    fontSize: 32,
    fontWeight: "400",
    letterSpacing: 0,
    lineHeight: 40,
  },
  headlineMedium: {
    fontFamily: "System",
    fontSize: 28,
    fontWeight: "400",
    letterSpacing: 0,
    lineHeight: 36,
  },
};

export const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: "#6750A4",
    secondary: "#625B71",
    tertiary: "#7D5260",
    background: "#FFFFFF",
  },
  fonts: configureFonts({ config: fontConfig }),
};
