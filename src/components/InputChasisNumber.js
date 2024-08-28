// import React, { useState, useEffect } from 'react';
// import { Image, StyleSheet, TextInput, Alert, TouchableOpacity } from 'react-native';
// import { Box, Text, Button, VStack, Center, HStack } from 'native-base';
// import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
// import { useNavigation, useRoute } from '@react-navigation/native';
// import Icon from 'react-native-vector-icons/FontAwesome';
// import { fetchVehicleStatus } from '../utilities/api'; // Import the fetch function

// const InputChasisNumberPage = () => {
//     const navigation = useNavigation();
//     const route = useRoute();
//     const { errorMessage } = route.params || {}; // Retrieve error message from route params
//     const [input, setInput] = useState('');
//     const [inputError, setInputError] = useState('');
//       // State to track error message visibility
//     const [isErrorVisible, setIsErrorVisible] = useState(false);
//     const [isInputErrorVisible, setIsInputErrorVisible] = useState(false);
//     const [errMessage, setErrMessage] = useState(errorMessage);

//     // Effect to handle error message timeout
//     useEffect(() => {
//         if (errorMessage) {
//             console.log(errorMessage);
//             setErrMessage(errorMessage)
//             setIsErrorVisible(true);  
//         const timeoutId = setTimeout(() => {
//             setIsErrorVisible(false);
//             setErrMessage('')
//         }, 5000); // Set timeout for 5 seconds

//         // Cleanup function to clear timeout when component unmounts
//         return () => clearTimeout(timeoutId);
//         }
//     }, [errorMessage]);

//     const handleInputChange = (text) => {
//         setInput(text);
//         setIsInputErrorVisible(false);
//         setInputError('');
//     };

//     const handleSubmit = async () => {
//         if (!input) {
//           // Display error message if input is empty
//           setInputError("Veuillez remplir le champ de saisie.")
//           setIsInputErrorVisible(true);
//           return; // Prevent form submission
//         }
    
//         try {
//             const data = input.length > 7 
//               ? { numeroDeChassis: input, attestation: null, numeroDImmatriculation: null } 
//               : { numeroDeChassis: null, attestation: null, numeroDImmatriculation: input };
//             navigation.navigate('Loading', { data });
//           } catch (error) {
//             Alert.alert('Error', error.message);
//           }
//       };
//   return (
//     <Box flex={1} bg="white">
//       <VStack flex={1} space={4} px={4}>
//         <Box style={styles.header}>
//             <TouchableOpacity onPress={() => navigation.navigate('Landing')} style={styles.backButton}>
//                 <Icon name="arrow-left" style={styles.backButtonText} resizeMode={'contain'} />
//             </TouchableOpacity>
//         </Box>
//         <Center flex={1} px={4}>
//           <Image
//             source={require('../../assets/page2.png')} 
//             alt="Chasis Number"
//             style={styles.chasisImage}
//             resizeMode={'contain'}
//           />
//           <Text  mt={0} mb={8} px={2} textAlign="center" fontWeight={"semibold"} color={"#696969"} fontSize={"14px"}>
//             Veuillez saisir l'informations de votre véhicule
//           </Text>
//           <Box width={wp('90%')} mb={4} h={'20%'} mt={8}>
//             <Text fontWeight={"bold"}  fontSize={"15px"} mb={1}>
//               Numéro d'immatriculation ou numéro de châssis ou attestation
//             </Text>
//             <TextInput
//               style={styles.input}
//               value={input}
//               onChangeText={handleInputChange}
//               keyboardType="default" 
//               textContentType="none" 
//               importantForAccessibility="no" 
//             />
//             {errMessage && <Text style={styles.errorText}>{errMessage}</Text>}
//             {inputError && <Text style={styles.errorText}>{inputError}</Text>}

//           </Box>
//           <Box style={styles.buttonContainer} px={4}>
//           <Button style={styles.button} size="lg" backgroundColor={'#1CA7AE'} _text={{ fontWeight: 'bold' }}  onPress={handleSubmit}>
//             <Text style={styles.buttonText}>Suivant</Text>
//           </Button>
//         </Box>
//         </Center>
//       </VStack>
//     </Box>
//   );
// };

// const styles = StyleSheet.create({
//   header: {
//     width: wp('100%'),
//     alignItems: 'flex-start',
//     height: hp('6%'),
//     padding: 10,
//   },
//   backButton: {
//     backgroundColor: 'transparent',
//   },
//   backButtonText: {
//     fontSize: 20,
//     color: 'black',
//     fontFamily: 'MerriweatherSans'
//   },
//   chasisImage: {
//     width: wp('90%'),
//     height: hp('45%'), // Adjust the height as needed
//   },
//   input: {
//     height: 50,
//     borderColor: 'gray',
//     borderWidth: 1,
//     paddingHorizontal: 10,
//     borderRadius: 5,
//      fontFamily: 'MerriweatherSans'
//   },
//   errorText: {
//     color: 'red',
//     marginTop: 4,
//   },
//   buttonContainer: {
//     width: wp('100%'),
//     height: hp('20%'),
//     justifyContent: 'center',
//     alignItems: 'center',
//     position: "relative",
//   },
//   button: {
//     width: wp('92%'),
//     position: "absolute",
//     bottom: 0,
//   },
//   buttonText: {
//     fontWeight: 'bold',
//     color: 'white',
//     fontFamily: 'MerriweatherSans'
    
//   },
// });

// export default InputChasisNumberPage;


import React, { useState, useEffect } from 'react';
import { Image, StyleSheet, TextInput, Alert, TouchableOpacity, Modal, View } from 'react-native';
import { Box, Text, Button, VStack, Center } from 'native-base';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';

const InputChasisNumberPage = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { errorMessage, insuranceStatus, mostRecentStatus } = route.params || {};
    const [input, setInput] = useState('');
    const [inputError, setInputError] = useState('');
    const [isErrorVisible, setIsErrorVisible] = useState(false);
    const [isInputErrorVisible, setIsInputErrorVisible] = useState(false);
    const [errMessage, setErrMessage] = useState(errorMessage);
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        if (insuranceStatus) {
            setModalVisible(true);
        }
    }, [insuranceStatus]);

    useEffect(() => {
        if (errorMessage) {
            console.log(errorMessage);
            setErrMessage(errorMessage)
            setIsErrorVisible(true);
            const timeoutId = setTimeout(() => {
                setIsErrorVisible(false);
                setErrMessage('')
            }, 5000);

            return () => clearTimeout(timeoutId);
        }
    }, [errorMessage]);

    const handleInputChange = (text) => {
        setInput(text);
        setIsInputErrorVisible(false);
        setInputError('');
    };

    const handleSubmit = async () => {
        if (!input) {
            setInputError("Veuillez remplir le champ de saisie.")
            setIsInputErrorVisible(true);
            return;
        }

        try {
            const data = input.length > 7
                ? { numeroDeChassis: input, attestation: null, numeroDImmatriculation: null }
                : { numeroDeChassis: null, attestation: null, numeroDImmatriculation: input };
            navigation.navigate('Loading', { data });
        } catch (error) {
            Alert.alert('Error', error.message);
        }
    };

    return (
        <Box flex={1} bg="white">
            <VStack flex={1} space={4} px={4}>
                <Box style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.navigate('Landing')} style={styles.backButton}>
                        <Icon name="arrow-left" style={styles.backButtonText} resizeMode={'contain'} />
                    </TouchableOpacity>
                </Box>
                <Center flex={1} px={4}>
                    <Image
                        source={require('../../assets/page2.png')}
                        alt="Chasis Number"
                        style={styles.chasisImage}
                        resizeMode={'contain'}
                    />
                    <Text mt={0} mb={8} px={2} textAlign="center" fontWeight={"semibold"} color={"#696969"} fontSize={"14px"}>
                        Veuillez saisir l'informations de votre véhicule
                    </Text>
                    <Box width={wp('90%')} mb={4} h={'20%'} mt={8}>
                        <Text fontWeight={"bold"} fontSize={"15px"} mb={1}>
                            Numéro d'immatriculation ou numéro de châssis ou attestation
                        </Text>
                        <TextInput
                            style={styles.input}
                            value={input}
                            onChangeText={handleInputChange}
                            keyboardType="default"
                            textContentType="none"
                            importantForAccessibility="no"
                        />
                        {errMessage && <Text style={styles.errorText}>{errMessage}</Text>}
                        {inputError && <Text style={styles.errorText}>{inputError}</Text>}
                    </Box>
                    <Box style={styles.buttonContainer} px={4}>
                        <Button style={styles.button} size="lg" backgroundColor={'#1CA7AE'} _text={{ fontWeight: 'bold' }} onPress={handleSubmit}>
                            <Text style={styles.buttonText}>Suivant</Text>
                        </Button>
                    </Box>
                </Center>
            </VStack>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Status de l'assurance</Text>
                        <Text style={styles.modalText}>{insuranceStatus}</Text>
                        <View style={styles.buttonRow} >
                            <Button onPress={() => {
                                setModalVisible(false);
                                navigation.navigate('VehicleInfo', { mostRecentStatus });
                            }} style={styles.buttonModal}backgroundColor={'#1CA7AE'} marginRight={2}>
                                Voir les détails
                            </Button>
                            {/* <Button onPress={() => setModalVisible(false)} style={styles.buttonModal} backgroundColor={'#1CA7AE'}>Fermer</Button> */}
                        </View>
                    </View>
                </View>
            </Modal>
        </Box>
    );
};

const styles = StyleSheet.create({
    header: {
        width: wp('100%'),
        alignItems: 'flex-start',
        height: hp('6%'),
        padding: 10,
    },
    backButton: {
        backgroundColor: 'transparent',
    },
    backButtonText: {
        fontSize: 20,
        color: 'black',
        fontFamily: 'MerriweatherSans'
    },
    chasisImage: {
        width: wp('90%'),
        height: hp('45%'),
    },
    input: {
        height: 50,
        borderColor: 'gray',
        borderWidth: 1,
        paddingHorizontal: 10,
        borderRadius: 5,
        fontFamily: 'MerriweatherSans'
    },
    errorText: {
        color: 'red',
        marginTop: 4,
    },
    buttonContainer: {
        width: wp('100%'),
        height: hp('20%'),
        justifyContent: 'center',
        alignItems: 'center',
        position: "relative",
    },
    button: {
        width: wp('92%'),
        position: "absolute",
        bottom: 0,
    },
    buttonText: {
        fontWeight: 'bold',
        color: 'white',
        fontFamily: 'MerriweatherSans'
    },
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
        borderRadius: 10,
        alignItems: 'center'
    },
    modalTitle: {
        fontSize: 20,
        marginBottom: 10
    },
    modalText: {
        fontSize: 16,
        marginBottom: 20
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    buttonModal: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        fontSize: 14,
    },
});

export default InputChasisNumberPage;
