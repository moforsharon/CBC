import React from 'react';
import { ScrollView, StyleSheet, Image } from 'react-native';
import { Box, Text, VStack, HStack, Divider, Button, View } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { useNavigation, useRoute } from '@react-navigation/native';

const VehicleInfoScreen = ({ route }) => {
    const { mostRecentStatus } = route.params;
    const insuranceData = {
        'Numéro d\'immatriculation': mostRecentStatus.numerodimmatriculation,
        'Numéro de châssis': mostRecentStatus.numerodechassis,
        'Date d\'effet': mostRecentStatus.datedeffet,
        'Date d\'expiration': mostRecentStatus.datedexpiration,
        'Durée': mostRecentStatus.dureedassurance,
        'Nom de l\'assuré': mostRecentStatus.nomdelassure,
        'Adresse': mostRecentStatus.adresseassure,
        'Puissance': `${mostRecentStatus.puissance} CV`,
        'Nombre de places dans le véhicule': mostRecentStatus.nombredeplaces,
        'Zone de circulation': mostRecentStatus.zone_circulation,
        'Contrat': mostRecentStatus.statutdassurance,
        'Numéro de police': mostRecentStatus.numero_police,
        'Date d\'émission': mostRecentStatus.datesais,
        'DTA payée?': mostRecentStatus.droit_timbre > 0 ? 'Oui' : 'Non',
        'Validité de DTA': mostRecentStatus.datedexpiration,
      };
    const navigation = useNavigation();
    const capitalizeWords = (str) => {
      return str.toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
    };
  return (
    <View>
    <Box flex={1} bg="#D3D3D3" h={hp('100%')}>
      <Box style={styles.header}>
        <Button onPress={() => navigation.navigate('InputChasisNumber')} style={styles.backButton}>
          <Icon name="arrow-left" style={styles.backButtonText} />
        </Button>
        <Text style={styles.headerText}>Informations du véhicule</Text>
      </Box>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Box style={styles.card}>
          <Box style={styles.sectionHeader} >
            <Image source={require('../../assets/userManual.png')} style={styles.sectionIcon} />
          </Box>
          <Box justifyContent={'center'} alignItems={'center'}>
            <Divider bg="#9F57C0" width={wp('70%')} height={'2px'}/>
          </Box>
          <Text marginLeft={wp('7%')} fontSize={"lg"} py={2} color={"#9F57C0"} fontWeight={'bold'}>Assurance</Text>
            <Text style={{ marginLeft: wp('7%'), fontSize: 'sm', paddingBottom: 4, fontWeight: 'bold' }}>
          <Text style={{ fontSize: 'sm', fontWeight: 'bold' }}>Compagnie:</Text> {capitalizeWords(mostRecentStatus.compagnie)}
      </Text>
          <VStack space={2} p={4} borderColor={"#9F57C0"} borderWidth={0.5}>
            {Object.entries(insuranceData).map(([label, value], index) => (
              <Box key={index}>
                <HStack justifyContent="space-between" alignItems="center" py={1}>
                  <Text style={styles.label}>{label}</Text>
                  <Text style={styles.value}>{value}</Text>
                </HStack>
                {index < Object.entries(insuranceData).length - 1 && <Divider bg="#9F57C0"  height={'0.5px'}/>}
              </Box>
            ))}
          </VStack>
        </Box>
        {/* Add other sections in a similar way */}
      </ScrollView>
    </Box>
    </View>
  );
};

const renderRow = (label, value) => (
  <HStack justifyContent="space-between" alignItems="center">
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value}</Text>
  </HStack>
);

const styles = StyleSheet.create({
  header: {
    width: wp('100%'),
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#fff',
    elevation: 4, // for android shadow
    shadowColor: '#000', // for ios shadow
    shadowOffset: { width: 0, height: 2 }, // for ios shadow
    shadowOpacity: 0.2, // for ios shadow
    shadowRadius: 2, // for ios shadow
    fontFamily: 'MerriweatherSans'
  },
  backButton: {
    backgroundColor: 'transparent',
  },
  backButtonText: {
    fontSize: 20,
    color: 'black',
  },
  headerText: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
    fontFamily: 'MerriweatherSans'
  },
  contentContainer: {
    padding: 16,
  },
  card: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    backgroundColor: '#fff',
    elevation: 1, // for android shadow
    shadowColor: '#000', // for ios shadow
    shadowOffset: { width: 0, height: 1 }, // for ios shadow
    shadowOpacity: 0.1, // for ios shadow
    shadowRadius: 1, // for ios shadow
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    justifyContent: "center",
  },
  sectionIcon: {
    width: 48,
    height: 48
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'MerriweatherSans'
  },
  label: {
    fontSize: 14,
    color: '#555',
    fontFamily: 'MerriweatherSans'
  },
  value: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
    fontFamily: 'MerriweatherSans'
  },
});

export default VehicleInfoScreen;
