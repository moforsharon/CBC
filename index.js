// import { registerRootComponent } from 'expo';
// import App from './App';
// import { Platform } from 'react-native';
// import './global.css';
// import React, { useState, useEffect } from 'react';
// import ReactDOM from 'react-dom';
// import Modal from 'react-modal';
// import { InstallPWA } from './src/InstallPromptModal';

// if (Platform.OS === 'web') {
//   let deferredPrompt;

//   const InstallPromptModal = () => {
//     const [modalIsOpen, setIsOpen] = useState(false);

//     useEffect(() => {
//       const promptHandler = (e) => {
//         e.preventDefault();
//         deferredPrompt = e;
//         setIsOpen(true);
//       };

//       window.addEventListener('beforeinstallprompt', promptHandler);

//       return () => {
//         window.removeEventListener('beforeinstallprompt', promptHandler);
//       };
//     }, []);

//     const handleInstallClick = () => {
//       setIsOpen(false);
//       if (deferredPrompt) {
//         deferredPrompt.prompt();
//         deferredPrompt.userChoice.then((choiceResult) => {
//           if (choiceResult.outcome === 'accepted') {
//             console.log('User accepted the A2HS prompt');
//           } else {
//             console.log('User dismissed the A2HS prompt');
//           }
//           deferredPrompt = null;
//         });
//       }
//     };

//     const closeModal = () => {
//       setIsOpen(false);
//     };

//     return (
//       <InstallPWA modalIsOpen={modalIsOpen} setIsOpen={setIsOpen} />
//     );
//   };

//   Modal.setAppElement('#root');

//   ReactDOM.render(
//     <>
//       <App />
//       <InstallPromptModal />
//     </>,
//     document.getElementById('root')
//   );

//   if ('serviceWorker' in navigator) {
//     window.addEventListener('load', () => {
//       navigator.serviceWorker.register('/service-worker.js')
//         .then(registration => {
//           console.log('SW registered: ', registration);
//         })
//         .catch(registrationError => {
//           console.log('SW registration failed: ', registrationError);
//         });
//     });
//   }
// }

// registerRootComponent(App);


import { registerRootComponent } from 'expo';
import App from './App';
import { Platform } from 'react-native';
import './global.css';
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';
import { InstallPWA } from './src/InstallPromptModal';

if (Platform.OS === 'web') {
  let deferredPrompt;

  const InstallPromptModalWrapper = () => {
    const [modalIsOpen, setIsOpen] = useState(false);

    useEffect(() => {
      const promptHandler = (e) => {
        console.log("beforeinstallprompt event fired");
        e.preventDefault();
        deferredPrompt = e;
        setIsOpen(true);
      };

      window.addEventListener('beforeinstallprompt', promptHandler);

      return () => {
        window.removeEventListener('beforeinstallprompt', promptHandler);
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
    <>
      <App />
      <InstallPromptModalWrapper />
    </>,
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
