import { StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-paper";
import { useListStore } from "../store/listStore";

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  const clearError = useListStore((state) => state.clearError);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{message}</Text>
      <View style={styles.buttons}>
        <Button onPress={clearError}>Dismiss</Button>
        {onRetry && <Button onPress={onRetry}>Retry</Button>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#ffebee",
    borderRadius: 8,
    margin: 16,
  },
  text: {
    color: "#c62828",
    marginBottom: 8,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
  },
});
