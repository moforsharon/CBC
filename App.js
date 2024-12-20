import React, { useCallback, createContext, useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import * as ScreenOrientation from "expo-screen-orientation";
// import * as SplashScreen from "expo-splash-screen";
import { StyleSheet, View, Dimensions, Platform } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { NativeBaseProvider } from "native-base";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from '@react-native-community/netinfo';
import { useFonts } from 'expo-font';
// import { RootSiblingParent } from "react-native-root-siblings";
import SideMenu from './src/components/SideMenu'

// Import your components/screens
// import SideMenu from "./src/components/SideMenu";
import MyComponent from "./src/pages/LandingPage";
import ChatPage from "./src/pages/Chat";
import SignInPage from "./src/pages/Signin";
import SignUpPage from "./src/pages/SignUp";
import Library from "./src/pages/Library";
import DeviceDetection from "./src/components/DeviceDetection";
import LoadingScreen from "./src/components/LoadingPage";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { useFocusEffect } from '@react-navigation/native';




// Context creation
export const AppContext = createContext();

const Stack = createStackNavigator();
const { height } = Dimensions.get('window');

// SplashScreen.preventAutoHideAsync();

export default function App() {
  const [data, setData] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [machineId, setMachineId] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [recentChats, setRecentChats] = useState([]);
  const [currentChatSummary, setCurrentChatSummary] = useState(0)

  const getStoredUserID = async () => {
    try {
      const value = await AsyncStorage.getItem("user_id");
      const valueM = await AsyncStorage.getItem("machine_id");
      console.log("Stored user:" + value);

      if (value !== null && valueM !== null) {
        setUser(value);
        setMachineId(valueM);
        return true;
      } else {
        return null;
      }
    } catch (e) {
      console.log(e);
      return null;
    }
  };

  useEffect(() => {
    getStoredUserID();
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const lockOrientation = async () => {
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
    };

    lockOrientation();
  }, []);

  useEffect(() => {
    console.log("Starting to fetch chats")
    // Fetch chats from API
    const fetchChats = async () => {
      try {
        const userId = user;
        console.log(`User id is : ${userId}`)
        if (userId) {
          const response = await fetch(
            "https://api.childbehaviorcheck.com/back/history/get-user-chat-summaries",
            {
              method: "POST",
              headers: {
                userid: userId,
              },
            }
          );
  
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
  
          const data = await response.json();
          console.log("user chat summaries:", data)
  
          // Transform data into grouped chats by date
          const groupedChats = groupChatsByDate(data);
          setRecentChats(groupedChats);
        }
      } catch (error) {
        console.error("Error fetching chat summaries:", error);
      }
    };
  
    fetchChats();
  }, [user]);

  useEffect(() => {
    console.log("Recent chats:", recentChats);
  }, [recentChats]);

  const groupChatsByDate = (chats) => {
    const grouped = {};

    chats.forEach((chat) => {
      const date = new Date(chat.created_at).toLocaleDateString();
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push({
        id: chat.chat_summary_id,
        title: chat.chat_summary,
      });
    });

    return Object.keys(grouped).map((date) => ({
      date,
      chats: grouped[date],
    }));
  };



  const [fontsLoaded, fontError] = useFonts({
    "Rubik-Regular": require("./assets/fonts/Rubik-Regular.ttf"),
    "Rubik-Medium": require("./assets/fonts/Rubik-Medium.ttf"),
    "Rubik-SemiBold": require("./assets/fonts/Rubik-SemiBold.ttf"),
    "Rubik-Bold": require("./assets/fonts/Rubik-Bold.ttf"),
  });

  // const onLayoutRootView = useCallback(async () => {
  //   if (fontsLoaded || fontError) {
  //     await SplashScreen.hideAsync();
  //   }
  // }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
      <NativeBaseProvider>
        <AppContext.Provider
          value={{ data, setData, menuOpen, setMenuOpen, user, setUser, isConnected, machineId, setMachineId, recentChats, currentChatSummary, setCurrentChatSummary, setRecentChats }}
        >
          <View style={styles.container}> {/* Ensures full height */}
            <NavigationContainer>
            <SideMenu />
              <Stack.Navigator initialRouteName="Landing" screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Loading" component={LoadingScreen} />
                <Stack.Screen name="Landing" component={MyComponent} />
                <Stack.Screen name="Chat" component={ChatPage} />
                <Stack.Screen name="Signin" component={SignInPage} />
                <Stack.Screen name="Signup" component={SignUpPage} />
                <Stack.Screen name="Library" component={Library} />
              </Stack.Navigator>
            </NavigationContainer>
          </View>
          <StatusBar style="auto" />
        </AppContext.Provider>
      </NativeBaseProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // Ensures the App's root view takes full height
    height: height,
  },
});

if (Platform.OS === 'web') {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js').then(registration => {
        console.log('SW registered: ', registration);
      }).catch(registrationError => {
        console.log('SW registration failed: ', registrationError);
      });
    });
  }
}

