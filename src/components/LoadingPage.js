// import React, { useEffect, useState } from 'react';
// import { StyleSheet, Text, Image, Alert } from 'react-native';
// import { useNavigation, useRoute } from '@react-navigation/native';
// import { BarIndicator, BallIndicator } from 'react-native-indicators';
// import { Box, VStack, Button } from 'native-base';
// import Icon from 'react-native-vector-icons/FontAwesome';
// import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
// import { fetchVehicleStatus } from '../utilities/api';

// const LoadingScreen = () => {
//     const navigation = useNavigation();
//     const route = useRoute();
//     const { data } = route.params;
//     const [errMessage, setErrMessage] = useState('')
  
//     useEffect(() => {
//         const fetchData = async () => {
//           try {
//             const result = await fetchVehicleStatus(data);
//             if (result[0].StatusEnCirculation === "Le véhicule n'existe pas") {
//                 setErrMessage("Cette voiture n'a pas d'assurance")
//               navigation.navigate('InputChasisNumber', { errorMessage: errMessage });
//             } else {
//               const mostRecentStatus = result[0].StatusEnCirculation.reduce((prev, current) => {
//                 return new Date(prev.datesais) > new Date(current.datesais) ? prev : current;
//               });
//               navigation.navigate('VehicleInfo', { mostRecentStatus });
//             }
//           } catch (error) {
//             console.log(`The error is : ${error.message}`);
//             setErrMessage("Échec de l'envoi de la demande. Veuillez réessayer.")
//             navigation.navigate('InputChasisNumber', { errorMessage: errMessage });
//           }
//         };
  
//         fetchData();
//       }, [data, navigation, errMessage]);

//   return (
//     <Box flex={1} bg="white">
//       <VStack flex={1} space={4} p={4}>
//         <Box style={styles.header}>
//           <Button onPress={() => navigation.goBack()} style={styles.backButton}>
//             <Icon name="arrow-left" style={styles.backButtonText} onPress={() => navigation.goBack()} resizeMode={'contain'}/>
//           </Button>
//         </Box>
//         <Box justifyContent={'center'} alignItems={'center'} style={styles.container}>
//             <Box justifyContent={'center'} alignItems={'center'} style={styles.centeredContainer}>
//                 <Box justifyContent={'center'} alignItems={'center'} >
//                     <Image source={require('../../assets/progressIndicator.gif')} style={styles.indicator} />
//                     <Text style={styles.text}>Merci de patienter.</Text>
//                 </Box>
//             </Box>
//         </Box>
//       </VStack>
//     </Box>
//   );
// };

// const styles = StyleSheet.create({
//     header: {
//         width: wp('100%'),
//         alignItems: 'flex-start',
//         height: hp('6%'),
//         padding: 10,
//       },
//       backButton: {
//         backgroundColor: 'transparent',
//       },
//       backButtonText: {
//         fontSize: 20,
//         color: 'black',
//       },
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     height: hp('90%'),
//     flexDirection: 'column',
//     position: 'relative'
//   },
//   centeredContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     height: hp('80%'),
//     position: 'absolute',
//     top: '40%'
//   },
//   indicator: {
//     width: wp('18%'), 
//     height: hp('18%'), 
//   },
//   text: {
//     marginTop: 0,
//     fontSize: 14,
//     color: '#000',
//     fontWeight: '700'
//   },
// });

// export default LoadingScreen;


import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, Image, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Box, VStack, Button } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { fetchVehicleStatus } from '../utilities/api';

const LoadingScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { data } = route.params;
    const [errMessage, setErrMessage] = useState('');
    const [mostRecentStatus, setMostRecentStatus] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await fetchVehicleStatus(data);
    
                if (result[0].StatusEnCirculation === "Le véhicule n'existe pas") {
                    setErrMessage("Cette voiture n'a pas d'assurance");
                    navigation.navigate('InputChasisNumber', { errorMessage: errMessage });
                    return;
                }
    


                const statuses = result[0].StatusEnCirculation;
                
                // Find the status with "EN COURS"
                const enCoursStatus = statuses.find(status => status.statutdassurance === "EN COURS");

                let selectedStatus;
                if (enCoursStatus) {
                    selectedStatus = enCoursStatus;
                } else {
                    // Find the most recent expired status
                    selectedStatus = statuses.filter(status => status.statutdassurance === "Expire")
                                             .reduce((prev, current) => {
                        return new Date(prev.datedexpiration) > new Date(current.datedexpiration) ? prev : current;
                    });
                }

                setMostRecentStatus(selectedStatus.statutdassurance);
                navigation.navigate('InputChasisNumber', { insuranceStatus: selectedStatus.statutdassurance, mostRecentStatus: selectedStatus });
            } catch (error) {
                console.log(`The error is: ${error.message}`);
                setErrMessage("Échec de l'envoi de la demande. Veuillez réessayer.");
                navigation.navigate('InputChasisNumber', { errorMessage: errMessage });
            }
        };
        fetchData();
    }, [data, navigation, errMessage, mostRecentStatus]);

    return (
        <Box flex={1} bg="white">
            <VStack flex={1} space={4} p={4}>
                <Box style={styles.header}>
                    <Button onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Icon name="arrow-left" style={styles.backButtonText} onPress={() => navigation.goBack()} resizeMode={'contain'}/>
                    </Button>
                </Box>
                <Box justifyContent={'center'} alignItems={'center'} style={styles.container}>
                    <Box justifyContent={'center'} alignItems={'center'} style={styles.centeredContainer}>
                        <Box justifyContent={'center'} alignItems={'center'}>
                            <Image source={require('../../assets/progressIndicator.gif')} style={styles.indicator} />
                            <Text style={styles.text}>Merci de patienter.</Text>
                        </Box>
                    </Box>
                </Box>
            </VStack>
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
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
        height: hp('90%'),
        flexDirection: 'column',
        position: 'relative'
    },
    centeredContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: hp('80%'),
        position: 'absolute',
        top: '40%'
    },
    indicator: {
        width: wp('18%'),
        height: hp('18%'),
    },
    text: {
        marginTop: 0,
        fontSize: 14,
        color: '#000',
        fontWeight: '700'
    },
});

export default LoadingScreen;
