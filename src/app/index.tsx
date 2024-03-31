import { StatusBar } from "expo-status-bar";
import { Platform, View } from "react-native";
import { ThemeProvider, createTheme, Text } from "@rneui/themed";
import { Provider } from "react-redux";
import { store } from "./store";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { MVPTracking } from "../features/MVPTracking";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useCallback, useEffect, useRef, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { ExpoPushToken, Subscription } from "expo-notifications";
import Constants from "expo-constants";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

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

  const [expoPushToken, setExpoPushToken] = useState<ExpoPushToken>();
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef<Subscription | null>(null);
  const responseListener = useRef<Subscription | null>(null);

  async function registerForPushNotificationsAsync() {
    let token;

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        alert("Failed to get push token for push notification!");
        return;
      }
      token = await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig?.extra?.eas.projectId,
      });
    } else {
      alert("Must use physical device for Push Notifications");
    }

    return token;
  }

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => {
      if (token) setExpoPushToken(token);
    });

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification != null);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );

        if (responseListener.current)
          Notifications.removeNotificationSubscription(
            responseListener.current
          );
      }
    };
  }, []);

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
