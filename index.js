import { registerRootComponent } from 'expo';
import App from './App';
import { Platform, Dimensions, StyleSheet } from 'react-native';
import './global.css';
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';
import { InstallPWA } from './src/InstallPromptModal';
import { Box, NativeBaseProvider, Text, Button, VStack, Center, HStack } from 'native-base';

// Insert the clearAllSiteData function here
// window.addEventListener('load', () => {
//   clearAllSiteData();
// });

const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1, // Ensures the App's root view takes full height
    height: height,
  },
});
if (Platform.OS === 'web') {
  let deferredPrompt;

  const InstallPromptModalWrapper = () => {
  const [modalIsOpen, setIsOpen] = useState(false);

  //   useEffect(() => {
  //     const beforeInstallPromptHandler = (event) => {
  //       event.preventDefault();
  //       console.log("beforeinstallprompt event fired");
  //       setInstallPromptEvent(event);
  //     };
  //     // Check the current route
  //     const currentPath = window.location.pathname;
  //     window.addEventListener('beforeinstallprompt', beforeInstallPromptHandler);

  //     console.log('\n\n\nCurrent Path:', currentPath);

  //     // Ensure the modal opens every time the user visits
  //     // if (!currentPath.startsWith('/shared')) { // Avoid showing on `SharedChat` routes
  //       setIsOpen(true);
  //     // }

  //     return () => {
  //       window.removeEventListener('beforeinstallprompt', promptHandler);
  //     };
  //   }, []);

  useEffect(() => {
    const beforeInstallPromptHandler = (event) => {
      event.preventDefault();
      console.log("beforeinstallprompt event fired");
  
      // Check the current route
      const currentPath = window.location.pathname;
      console.log('\n\n\nCurrent Path:', currentPath);
  
      // If the current path starts with '/invite', do not show the install prompt
      // if (!currentPath.startsWith('/invite')) {
        // setInstallPromptEvent(event);
        setIsOpen(true); // Open the modal for eligible routes
      // }
    };
  
    // Add event listener
    window.addEventListener('beforeinstallprompt', beforeInstallPromptHandler);
  
    return () => {
      window.removeEventListener('beforeinstallprompt', beforeInstallPromptHandler);
    };
  }, []);
  

    const handleInstallClick = () => {
      setIsOpen(false);
      if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
          if (choiceResult.outcome === 'accepted') {
            console.log('User accepted the A2HS prompt');
          } else {
            console.log('User dismissed the A2HS prompt');
          }
          deferredPrompt = null;
        });
      }
    };

    const closeModal = () => {
      setIsOpen(false);
    };

    return (
      <InstallPWA modalIsOpen={modalIsOpen} handleInstallClick={handleInstallClick} closeModal={closeModal} />
    );
  };

  Modal.setAppElement('#root');

  ReactDOM.render(
    <NativeBaseProvider>
    <Box style={styles.container}>
      <App />
      <InstallPromptModalWrapper />
    </Box>
    </NativeBaseProvider>,
    document.getElementById('root')
  );

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js')
        .then(registration => {
          console.log('SW registered: ', registration);
        })
        .catch(registrationError => {
          console.log('SW registration failed: ', registrationError);
        });
    });
  }
}

registerRootComponent(App);

// Function to clear cookies
function clearCookies() {
  const cookies = document.cookie.split(";");
  for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i];
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
  }
}

// Function to clear Local Storage
function clearLocalStorage() {
  localStorage.clear();
}

// Function to clear Session Storage
function clearSessionStorage() {
  sessionStorage.clear();
}

// Function to clear IndexedDB
function clearIndexedDB() {
  if ('indexedDB' in window) {
      indexedDB.databases().then((databases) => {
          for (let db of databases) {
              indexedDB.deleteDatabase(db.name);
          }
      });
  }
}

// Function to clear Cache Storage
function clearCacheStorage() {
  if ('caches' in window) {
      caches.keys().then((names) => {
          for (let name of names) {
              caches.delete(name);
          }
      });
  }
}

// Function to unregister Service Workers
function unregisterServiceWorkers() {
  if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
          for (let registration of registrations) {
              registration.unregister();
          }
      });
  }
}

// Function to clear everything
function clearAllSiteData() {
  clearCookies();
  clearLocalStorage();
  clearSessionStorage();
  clearIndexedDB();
  clearCacheStorage();
  unregisterServiceWorkers();
}

// // Execute the clearAllSiteData function on page load
// window.addEventListener('load', () => {
//   clearAllSiteData();
//   console.log('All site data cleared.');
// });
