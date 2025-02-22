import { useEffect } from "react";
import { Drawer } from "expo-router/drawer";
import { PaperProvider } from "react-native-paper";
import { theme } from "../utils/theme";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useInitializeLists } from "../hooks/useInitializeLists";
import { useListStore } from "../store/listStore";
import { MaterialCommunityIcons } from "@expo/vector-icons";

if (typeof global.setImmediate === "undefined") {
  global.setImmediate = setTimeout as any;
}

export default function RootLayout() {
  useInitializeLists();
  const { lists } = useListStore();
  const customLists = lists.filter((list) => list.type === "custom");

  useEffect(() => {
    // Ensure reanimated is properly initialized
    require("react-native-reanimated");
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PaperProvider theme={theme}>
        <Drawer
          screenOptions={{
            headerStyle: {
              backgroundColor: theme.colors.primary,
            },
            headerTintColor: "#fff",
            drawerActiveTintColor: theme.colors.primary,
          }}
        >
          <Drawer.Screen
            name="index"
            options={{
              title: "Home",
              drawerLabel: "Home",
            }}
          />
          <Drawer.Screen
            name="daily"
            options={{
              title: "Daily Tasks",
              drawerIcon: ({ size, color }) => (
                <MaterialCommunityIcons
                  name="calendar-today"
                  size={size}
                  color={color}
                />
              ),
            }}
          />
          <Drawer.Screen
            name="weekly"
            options={{
              title: "Weekly Tasks",
              drawerIcon: ({ size, color }) => (
                <MaterialCommunityIcons
                  name="calendar-week"
                  size={size}
                  color={color}
                />
              ),
            }}
          />
          <Drawer.Screen
            name="monthly"
            options={{
              title: "Monthly Tasks",
              drawerIcon: ({ size, color }) => (
                <MaterialCommunityIcons
                  name="calendar-month"
                  size={size}
                  color={color}
                />
              ),
            }}
          />
          {customLists.map((list) => (
            <Drawer.Screen
              key={list.id}
              name={`custom/${list.id}`}
              options={{
                title: list.name,
                drawerIcon: ({ size, color }) => (
                  <MaterialCommunityIcons
                    name="folder"
                    size={size}
                    color={color}
                  />
                ),
              }}
            />
          ))}
        </Drawer>
      </PaperProvider>
    </GestureHandlerRootView>
  );
}
