// components/SharedChatScreen.js
import React from 'react';
import { View, Text } from 'react-native';

const SharedChatScreen = ({ route }) => {
  const chatId = route.params.chatId;

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Hi, the chat ID is {chatId}</Text>
    </View>
  );
};

export default SharedChatScreen;