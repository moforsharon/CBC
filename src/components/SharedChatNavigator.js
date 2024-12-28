// components/SharedChatNavigator.js
import React, { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Linking } from 'react-native';
import SharedChatScreen from '../pages/SharedChatScreen';

const SharedChatNavigator = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const handleSharedLink = async () => {
      const url = await Linking.getInitialURL();
      if (url) {
        const chatId = url.split('/').pop();
        navigation.navigate('SharedChat', { chatId });
      }
    };

    handleSharedLink();
  }, [navigation]);

  return <SharedChatScreen />;
};

export default SharedChatNavigator;