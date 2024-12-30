import React, { useRef, useContext } from 'react';
import { View, Text, TouchableOpacity, Clipboard, Linking, StyleSheet } from 'react-native';
import { Modalize } from 'react-native-modalize';
import { AppContext } from "../../App";

const ShareBottomSheet = ({ visible, onClose, chatTitle, chatId, user }) => {
  // const modalizeRef = useRef(null);
  const { modalizeRef, currentChatSummary, currentChatSummaryTitle } = useContext(AppContext);
  const [copied, setCopied] = React.useState(false);

  // const handleOpen = () => {
  //   modalizeRef.current?.open();
  // };

  const handleClose = () => {
    modalizeRef.current?.close();
    if (onClose) onClose();
  };

  const handleCopyLink = () => {
    const link = `https://childbehaviorcheck.com/shared/${user}/${currentChatSummary}`;
    Clipboard.setString(link); // Copies the link to clipboard
    setCopied(true);
  };

  return (
    <>
      {/* Button to trigger the bottom sheet */}
      {/* <TouchableOpacity onPress={handleOpen} style={styles.triggerButton}>
        <Text style={styles.triggerButtonText}>Open Share Bottom Sheet</Text>
      </TouchableOpacity> */}

      {/* Modalize Bottom Sheet */}
      <Modalize
        ref={modalizeRef}
        onClose={handleClose}
        modalHeight={250}
        handleStyle={styles.handle}
        modalStyle={styles.modal}
      >
        <View style={styles.content}>
          <Text style={styles.subTitle}>Share chat</Text>
          <Text style={styles.title}>{currentChatSummaryTitle}</Text>
          <TouchableOpacity
            onPress={handleCopyLink}
            style={styles.copyButton}
          >
            <Text style={styles.copyText}>Copy link</Text>
            {copied ? (
              <Text style={styles.copiedText}>Link copied!</Text>
            ) : (
              <Text style={styles.copyHint}>Copy</Text>
            )}
          </TouchableOpacity>
        </View>
      </Modalize>
    </>
  );
};

const styles = StyleSheet.create({
  triggerButton: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    margin: 20,
  },
  triggerButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  handle: {
    backgroundColor: '#ccc',
    width: 40,
    height: 5,
    borderRadius: 2.5,
    alignSelf: 'center',
    marginTop: 10,
  },
  modal: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subTitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  copyButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  copyText: {
    fontSize: 16,
    color: '#007BFF',
  },
  copiedText: {
    fontSize: 16,
    color: 'green',
  },
  copyHint: {
    fontSize: 16,
    color: '#666',
  },
});

export default ShareBottomSheet;
