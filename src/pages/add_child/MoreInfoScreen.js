import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  Image,
  StatusBar
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { AppContext } from '../../../App';
import Toast from "react-native-toast-message"

const { height: screenHeight } = Dimensions.get("window");

export default function MoreInfoScreen() {
    const navigation = useNavigation();
    const {childName, childRace, childGender, diagnosis, educationPlan, diagnosisDetails, otherServices, serviceDetails, simplifiedRequesting, simplifiedRefusal, user} = useContext(AppContext);
    const [favoriteThings, setFavoriteThings] = useState("");
    const [statusBarHeight, setStatusBarHeight] = useState(0);
    const [height, setHeight] = useState(100);
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);

    const handleNext = async () => {
      if (!favoriteThings.trim()) {
        Toast.show({
          type: "error",
          text1: "Please enter your child's favorite things",
        })
        return
      }
  
      try {
        const response = await fetch("https://api.childbehaviorcheck.com/api/child", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: user,
            child_name: childName,
            child_race_or_ethnicity: childRace,
            child_gender: childGender.toUpperCase(),
            diagnosis: diagnosis,
            individual_education_plan: educationPlan,
            preferred_communication_method_for_request: simplifiedRequesting,
            preferred_communication_method_for_refusal: simplifiedRefusal,
            favorite_things: favoriteThings,
            additional_caregiver_response: "No", 
            child_diagnosis: diagnosisDetails,
            other_services_response : otherServices,
            other_services_received : serviceDetails,
          }),
        })
  
        const data = await response.json()
  
        if (data.success) {
          console.log("Child data saved successfully:", data.child_id)
          navigation.reset({
            index: 0,
            routes: [{ name: "AdditionalCaregiver" }],
          })
        } else {
          Toast.show({
            type: "error",
            text1: "Failed to save child data",
            text2: data.message || "Please try again",
          })
        }
      } catch (error) {
        console.error("Error saving child data:", error)
        Toast.show({
          type: "error",
          text1: "An error occurred",
          text2: "Please check your internet connection and try again",
        })
      }
    }
  

  useEffect(() => {
    setIsButtonDisabled(!favoriteThings.trim());
  }, [favoriteThings]);

  useEffect(() => {
     
    // Subtract 20% from the screen height
    StatusBar.currentHeight && setStatusBarHeight(StatusBar.currentHeight);
    
      setHeight(screenHeight);
      
      }, []);

  return (
    <SafeAreaView style={styles.container}>
        <View style={styles.Header}>
            <View style={styles.HeaderLogo}>
            <View style={{width:32, height:32}}></View>
            <Image
                source={require("../../../assets/logo40.png")}
                style={{width:35, height:35}}
            />
            <View style={{width:32, height:32}}></View>
            </View>
            <View style={styles.HeaderLbl}>
            <Text style={styles.headerlbltxt}>Tell us about {childName}</Text>
            </View>
        </View>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* <View style={styles.headerContainer}>
          <Image source={require("../../../assets/logo40.png")} style={styles.headerIcon} />
          <Text style={styles.headerTitle}>Tell us about Stan</Text>
        </View> */}

        <Text style={styles.descriptionTitle}>What are some of {childName}'s favorite things?</Text>
        <Text style={styles.descriptionText}>
          In the app, we sometimes might refer to these as "reinforcers" or "preferred items." 
          Think of special items or toys you give to them when they're frustrated, activities 
          they get excited about, or people they ask for when they're sad. You can list special 
          things (like going to the beach or visiting grandma) and everyday things (like a stuffed 
          animal or favorite snack).
        </Text>

        <Text style={styles.descriptionText}>
          You can use your child's favorite things to help encourage positive behavior throughout 
          the day! We'll talk more about this later. For now, just list a few of them here!
        </Text>

        <TextInput
          style={styles.input}
          placeholder={`List ${childName}’s favorite things...`}
          placeholderTextColor="#A9A9A9"
          value={favoriteThings}
          onChangeText={setFavoriteThings}
        />

        <View style={styles.buttonContainer}>
        <TouchableOpacity 
            style={[styles.button, isButtonDisabled && styles.buttonDisabled]} 
            onPress={handleNext} 
            disabled={isButtonDisabled}
          >
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E1F4F9",
  },
  Header: {
    width: "100%",
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    position: "fixed",
    top: 0,
    zIndex: 1,
    backgroundColor: "#E1F4F9",
  },
  HeaderLogo: {
    height: 50,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    marginBottom: 16,
    marginTop: 5
  },
  HeaderLbl: {
    justifyContent: "center",
  },
  headerlbltxt: {
    fontSize: 20,
    fontFamily: "Rubik-Medium",
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 16,
    minHeight: screenHeight - 90,
    justifyContent: "top",
    marginTop: "30%"
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  headerIcon: {
    width: 40,
    height: 40,
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
  },
  descriptionTitle: {
    fontSize: 16,
    fontWeight: "medium",
    marginBottom: 10,
  },
  descriptionText: {
    fontSize: 16,
    marginBottom: 16,
    lineHeight: 24,
  },
  input: {
    backgroundColor: "#fff",
    padding: 26,
    borderRadius: 16,
    marginBottom: 20,
    fontSize: 16,
  },
  buttonContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  button: {
    backgroundColor: "#5EB0E0",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    width: "60%",
  },
  buttonDisabled: {
    backgroundColor: "#D0EAF5",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
});
