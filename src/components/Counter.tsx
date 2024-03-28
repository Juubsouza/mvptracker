import { useTheme } from "@rneui/themed";
import React, { useState } from "react";
import { TouchableOpacity, View, StyleSheet, Text } from "react-native";

interface CounterProps {
  count: number;
  setCount: React.Dispatch<React.SetStateAction<number>>;
}

export function Counter({ count, setCount }: CounterProps) {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    row: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      flexWrap: "wrap",
    },
    value: {
      fontSize: 18,
      paddingHorizontal: 16,
      marginTop: 2,
      color: "#fff",
    },
    button: {
      backgroundColor: theme.colors.secondary,
      borderRadius: 2,
      paddingLeft: 12,
      paddingRight: 12,
      paddingBottom: 4,
      margin: 2,
    },
    buttonText: {
      color: "#fff",
      fontSize: 18,
      textAlign: "center",
    },
    textbox: {
      fontSize: 18,
      padding: 2,
      width: 64,
      textAlign: "center",
      marginRight: 8,
      borderWidth: 1,
      justifyContent: "center",
      color: "rgb(112, 76, 182)",
    },
  });

  return (
    <View>
      <View style={styles.row}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            if (count <= 1) return;

            setCount(count - 1);
          }}
        >
          <Text style={styles.buttonText}>-</Text>
        </TouchableOpacity>
        <Text style={styles.value}>{`${count} ${
          count === 1 ? "hour" : "hours"
        }`}</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setCount(count + 1)}
        >
          <Text style={styles.buttonText}>+</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.row}></View>
    </View>
  );
}
