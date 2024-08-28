import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const SCREEN_WIDTH = width;
export const SCREEN_HEIGHT = height;

export const isSmallDevice = () => SCREEN_WIDTH < 360;
export const isMediumDevice = () => SCREEN_WIDTH >= 360 && SCREEN_WIDTH < 768;
export const isLargeDevice = () => SCREEN_WIDTH >= 768;
