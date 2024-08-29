// import React, { useEffect } from 'react';
// import * as ScreenOrientation from 'expo-screen-orientation';
// import { StatusBar } from 'expo-status-bar';
// import { StyleSheet, Text, View } from 'react-native';
// import MyComponent from './src/components/LandingPage';
// import InputChasisNumberPage from './src/components/InputChasisNumber';
// import { NativeBaseProvider } from 'native-base';
// import DeviceDetection from './src/components/DeviceDetection';
// import { Platform } from 'react-native';

// export default function App() {

//   useEffect(() => {
//     const lockOrientation = async () => {
//       await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
//     };

//     lockOrientation();
//   }, []);

//   return (
//     <NativeBaseProvider>
//       <DeviceDetection>
//         <MyComponent/>
//         <StatusBar style="auto" />
//       </DeviceDetection>
//     </NativeBaseProvider>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });

// if (Platform.OS === 'web') {

//   if ('serviceWorker' in navigator) {
//     window.addEventListener('load', () => {
//       navigator.serviceWorker.register('/service-worker.js').then(registration => {
//         console.log('SW registered: ', registration);
//       }).catch(registrationError => {
//         console.log('SW registration failed: ', registrationError);
//       });
//     });
//   }
// }

import React, { useEffect } from 'react';
import * as ScreenOrientation from 'expo-screen-orientation';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet,View, Platform, Dimensions } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { NativeBaseProvider } from 'native-base';

import MyComponent from './src/components/LandingPage';
import InputChasisNumberPage from './src/components/InputChasisNumber';
import DeviceDetection from './src/components/DeviceDetection';
import LoadingScreen from './src/components/LoadingPage';
import VehicleInfoScreen from './src/components/VehicleInfoScreen';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

const Stack = createStackNavigator();
const { height, width } = Dimensions.get('window');


export default function App() {

  useEffect(() => {
    const lockOrientation = async () => {
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
    };

    lockOrientation();
  }, []);

  return (
    <NativeBaseProvider>
      <View style={styles.container}> {/* Ensures full height */}
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Landing" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Loading" component={LoadingScreen} />
            <Stack.Screen name="Landing" component={MyComponent} />
            <Stack.Screen name="InputChasisNumber" component={InputChasisNumberPage} />
            <Stack.Screen name="VehicleInfo" component={VehicleInfoScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </View>
      <StatusBar style="auto" />
    </NativeBaseProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // Ensures the App's root view takes full height
    height: height
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
