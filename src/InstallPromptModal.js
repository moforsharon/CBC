import React from 'react';
import { View, Text, StyleSheet, Button, Modal, Image } from 'react-native';
import useIosInstallPrompt from './hooks/useIosInstallPrompt';
import useWebInstallPrompt from './hooks/useWebInstallPrompt';

export const InstallPWA = ({ modalIsOpen, handleInstallClick, closeModal }) => {
  const [iosInstallPrompt, handleIOSInstallDeclined] = useIosInstallPrompt();
  const [webInstallPrompt, handleWebInstallDeclined, handleWebInstallAccepted] = useWebInstallPrompt();

  if (!iosInstallPrompt && !webInstallPrompt) {
    return null;
  }

  return (
    <Modal
      visible={modalIsOpen}
      transparent={true}
      animationType="slide"
      onRequestClose={closeModal}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Image
            style={styles.icon}
            source={{ uri: '../assets/icon.png' }} // Replace with your actual icon path
          />
          <Text style={styles.title}>Install Application</Text>
          <Text style={styles.text}>Install this application on your home screen for quick and easy access when you're on the go.</Text>
          {iosInstallPrompt && (
            <Text style={styles.instructions}>
              Tap <Image style={styles.shareIcon} source={{ uri: '../assets/upload-100.png' }} />  then "Add to Home Screen"
            </Text>
          )}
          {webInstallPrompt && (
            <View style={styles.buttonContainer}>
              <Button backgroundColor={'#27AFDE'} title="Install" onPress={handleWebInstallAccepted} />
              <Button backgroundColor={'#27AFDE'} title="Close" onPress={closeModal} />
            </View>
          )}
          {iosInstallPrompt && (
            <Button backgroundColor={'#27AFDE'} title="Close" onPress={closeModal} />
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    justifyContent: 'center',
    borderRadius: 10,
    alignItems: 'center'
  },
  icon: {
    width: 50,
    height: 50,
    marginBottom: 10
  },
  title: {
    fontSize: 20,
    marginBottom: 10
  },
  text: {
    fontSize: 12,
    marginBottom: 14
  },
  instructions: {
    fontSize: 14,
    marginBottom: 20,
    textAlign: 'center'
  },
  shareIcon: {
    width: 20,
    height: 20,
    marginHorizontal: 5
  },
  bold: {
    fontWeight: 'bold'
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20
  }
});
