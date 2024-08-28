import React from 'react';
import { Image, ImageBackground, StyleSheet } from 'react-native';
import { Box, Text, Button, VStack, Center, HStack } from 'native-base';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';

const WelcomePage = ({ navigation }) => {
  return (
    <Box flex={1} bg="white">
      {/* <VStack flex={1}>
        <Center flex={1} p={4}>
          <VStack space={4} alignItems="center">
            <Image
              source={require('../../assets/bg1.png')}
              alt="Background"
              style={styles.backgroundImage}
            />
            <Image
              source={require('../../assets/african-american-woman-violet-dress-cap-posed-yellow-car.jpg')}
              alt="Car"
              style={styles.carImage}
            />
            <ImageBackground
              source={require('../../assets/Isolation_Mode.png')}
              style={styles.textBackground}
              resizeMode="contain"
              imageStyle={styles.imageBackground}
            >
              <Text style={styles.text}>
                Vérifier la validité de l’assurance TPV du véhicule en moins d’une minute.
              </Text>
            </ImageBackground>
          </VStack>
        </Center>
        <Box style={styles.buttonContainer} p={4} bg="white">
          <Button style={styles.button} size="lg" backgroundColor={'#1CA7AE'} _text={{ fontWeight: 'bold' }}  onPress={() => navigation.navigate('InputChasisNumber')}>
            <HStack alignItems="center" w={"full"} justifyContent={"space-between"}>
              <Box flex={8} alignItems="flex-start">
                <Image
                  source={require('../../assets/ID Verified.png')}
                  style={styles.buttonIcon}
                  alt="ID Verified"
                />
              </Box>
              <Box  alignItems="center" ml={"46%"} w={"full"}>
                <Text style={styles.buttonText}>Vérifier mon assurance</Text>
              </Box>
            </HStack>
          </Button>
        </Box>
      </VStack> */}
    </Box>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    width: wp('90%'),
    height: hp('4%'),  // 5% of screen height
    borderRadius: 18,
  },
  carImage: {
    width: wp('90%'),
    height: hp('50%'),  // 50% of screen height
    borderRadius: 15,
  },
  textBackground: {
    width: wp('90%'),
    height: hp('30%'), // Adjust the height as needed
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  imageBackground: {
    height: hp('14%'),
    marginTop: "37%",
    marginLeft: "110px"
  },
  text: {
    fontSize: 20,
    fontWeight: 800,
    textAlign: 'center',
    color: 'black', 
    fontFamily: 'MerriweatherSans',
  },
  buttonContainer: {
    width: wp('100%'),
    height: hp('5%'),
    justifyContent: 'center',
    alignItems: 'center',
    position: "relative",
  },
  button: {
    width: wp('90%'),
    position: "absolute",
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'flex-start', // Align items to start
    alignItems: 'center',
  },
  buttonIcon: {
    width: 24,
    height: 24,
    marginRight: "45%",
  },
  buttonText: {
    fontWeight: 'bold',
    color: 'white',
    fontFamily: 'MerriweatherSans'
    
  },
});

export default WelcomePage;
