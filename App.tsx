import "react-native-gesture-handler";
import { Stack } from "expo-router";
import { PaperProvider } from "react-native-paper";
import { theme } from "./utils/theme";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PaperProvider theme={theme}>
        <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor: theme.colors.primary,
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontWeight: "bold",
            },
          }}
        >
          <Stack.Screen
            name="index"
            options={{
              title: "Task App",
              headerShown: true,
            }}
          />
        </Stack>
      </PaperProvider>
    </GestureHandlerRootView>
  );
}
