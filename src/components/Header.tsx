import { Icon, Header as HeaderRNE, useTheme } from "@rneui/themed";
import { TouchableOpacity, StyleSheet } from "react-native";
import { useThemeSwitcher } from "../utils/darkModeSwitcher";

export function Header() {
  const { theme } = useTheme();
  const { toggleTheme } = useThemeSwitcher();

  return (
    <HeaderRNE
      backgroundColor={theme.colors.primary}
      elevated
      rightComponent={
        <TouchableOpacity style={{ marginLeft: 10 }} onPress={toggleTheme}>
          <Icon
            type="material-community"
            name="theme-light-dark"
            color="white"
          />
        </TouchableOpacity>
      }
      centerComponent={{ text: "MVP Tracker", style: styles.heading }}
    />
  );
}

const styles = StyleSheet.create({
  heading: {
    color: "white",
    fontSize: 22,
    fontFamily: "BaiJamjuree-Bold",
  },
});
