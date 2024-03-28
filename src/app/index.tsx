import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import { ThemeProvider, createTheme, Text } from "@rneui/themed";
import { Provider } from "react-redux";
import { store } from "./store";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { MVPTracking } from "../features/MVPTracking";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useCallback } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    "BaiJamjuree-Bold": require("../../assets/fonts/BaiJamjuree-Bold.ttf"),
    "BaiJamjuree-BoldItalic": require("../../assets/fonts/BaiJamjuree-BoldItalic.ttf"),
    "BaiJamjuree-ExtraLight": require("../../assets/fonts/BaiJamjuree-ExtraLight.ttf"),
    "BaiJamjuree-ExtraLightItalic": require("../../assets/fonts/BaiJamjuree-ExtraLightItalic.ttf"),
    "BaiJamjuree-Light": require("../../assets/fonts/BaiJamjuree-Light.ttf"),
    "BaiJamjuree-LightItalic": require("../../assets/fonts/BaiJamjuree-LightItalic.ttf"),
    "BaiJamjuree-Medium": require("../../assets/fonts/BaiJamjuree-Medium.ttf"),
    "BaiJamjuree-MediumItalic": require("../../assets/fonts/BaiJamjuree-MediumItalic.ttf"),
    "BaiJamjuree-Regular": require("../../assets/fonts/BaiJamjuree-Regular.ttf"),
    "BaiJamjuree-SemiBold": require("../../assets/fonts/BaiJamjuree-SemiBold.ttf"),
    "BaiJamjuree-SemiBoldItalic": require("../../assets/fonts/BaiJamjuree-SemiBoldItalic.ttf"),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <StatusBar style="auto" />
          <SafeAreaProvider>
            <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
              <MVPTracking />
            </View>
          </SafeAreaProvider>
        </ThemeProvider>
      </Provider>
    </GestureHandlerRootView>
  );
}

const theme = createTheme({
  lightColors: {
    primary: "#18645e",
    secondary: "#ff7767",
    background: "#D3D3D3",
    divider: "#18645e",
  },
  darkColors: {
    primary: "#000",
    secondary: "#18645e",
    background: "#808080",
    divider: "#fff",
  },
  mode: "light",
  components: {
    Text: {
      style: {
        fontFamily: "BaiJamjuree-Regular",
      },
    },
    Input: {
      style: {
        fontFamily: "BaiJamjuree-Regular",
      },
    },
    Button: {
      titleStyle: {
        fontFamily: "BaiJamjuree-Regular",
      },
    },
  },
});
