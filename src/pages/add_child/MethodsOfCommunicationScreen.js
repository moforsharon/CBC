import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  Image,
  StatusBar
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Checkbox } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { AppContext } from '../../../App';

const screenHeight = Dimensions.get("window").height;

export default function CommunicationForm() {
    const {childName, requestingAttention, setRequestingAttention, refusingActions, setRefusingActions, setSimplifiedRequesting, setSimplifiedRefusal, simplifiedRequesting, simplifiedRefusal} = useContext(AppContext);
    const navigation = useNavigation();
    const [statusBarHeight, setStatusBarHeight] = useState(0);
    const [height, setHeight] = useState(100);
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);

    const requestingOptions = [
      "Talking (at least one-word phrases)",
      "Sign language",
      "Augmentative and alternative communication (communication device, such as GoTalk, tablet with language software)",
      "Body motion or gestures (pointing at an object, moving towards a person)",
      "Crying, whining, screaming, or other behaviors",
      "Other",
    ];
    
    const refusalOptions = [
      "Talking (at least one-word phrases)",
      "Sign language",
      "Augmentative and alternative communication (communication device, such as GoTalk, tablet with language software)",
      "Body motion or gestures (pointing at an object, moving towards a person)",
      "Crying, hitting, ignoring, refusing, or other behaviors",
      "Other",
    ];


    const mapRequestingOption = (option) => {
      const mapping = {
        "Talking (at least one-word phrases)": "Talking",
        "Sign language": "Sign language",
        "Augmentative and alternative communication (communication device, such as GoTalk, tablet with language software)": "Augmentative communication",
        "Body motion or gestures (pointing at an object, moving towards a person)": "Body motion",
        "Crying, whining, screaming, or other behaviors": "Crying/whining",
        "Other": "Other",
      };
      return mapping[option];
    };
    
    const mapRefusalOption = (option) => {
      const mapping = {
        "Talking (at least one-word phrases)": "Talking",
        "Sign language": "Sign language",
        "Augmentative and alternative communication (communication device, such as GoTalk, tablet with language software)": "Augmentative communication",
        "Body motion or gestures (pointing at an object, moving towards a person)": "Body motion",
        "Crying, hitting, ignoring, refusing, or other behaviors": "Crying/hitting/ignoring",
        "Other": "Other",
      };
      return mapping[option];
    };

  const handleRequestingSelection = (option, setList) => {
    setList(prevList => 
      prevList.includes(option) 
        ? prevList.filter(item => item !== option) 
        : [...prevList, option]
    );
  };

  const handleRefusalSelection = (option, setList) => {
    setList(prevList => 
      prevList.includes(option) 
        ? prevList.filter(item => item !== option) 
        : [...prevList, option]
    );
  };

  useEffect(() => {
    if (requestingAttention && requestingAttention.length > 0) {
      const simplifiedRequesting = requestingAttention.map(mapRequestingOption).filter(Boolean);
      setSimplifiedRequesting(simplifiedRequesting);
    } else {
      setSimplifiedRequesting([]);
    }
  }, [requestingAttention]);
  
  useEffect(() => {
    if (refusingActions && refusingActions.length > 0) {
      const simplifiedRefusal = refusingActions.map(mapRefusalOption).filter(Boolean);
      setSimplifiedRefusal(simplifiedRefusal);
    } else {
      setSimplifiedRefusal([]);
    }
  }, [refusingActions]);

  const handleNext = () => {
    // const simplifiedRequesting = requestingAttention.map(mapRequestingOption);
    // const simplifiedRefusal = refusingActions.map(mapRefusalOption);
    // setSimplifiedRequesting(requestingAttention.map(mapRequestingOption))
    // setSimplifiedRefusal(refusingActions.map(mapRefusalOption))
    console.log("Preferred method for requesting attention:", simplifiedRequesting);
    console.log("Preferred method for refusing actions:", simplifiedRefusal);
    navigation.reset({
        index: 0,
        routes: [{ name: "MoreInfo" }],
      });
  };

  useEffect(() => {
    setIsButtonDisabled(!(requestingAttention.length > 0 && refusingActions.length > 0));
}, [requestingAttention, refusingActions]);

    useEffect(() => {
    
    // Subtract 20% from the screen height
    StatusBar.currentHeight && setStatusBarHeight(StatusBar.currentHeight);
    
        setHeight(screenHeight);
        
        }, []);

  return (
    <SafeAreaView style={[
        styles.container, 
        {
          marginTop: statusBarHeight,
          height: height,
        }
      ]}>
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

        <View style={styles.sectionContainer}>
            <LinearGradient colors={["#8BCBE0", "#5EB0E0"]} style={styles.questionContainer} >
                <Text style={styles.sectionTitle}>
                    Preferred method of communication for requesting attention
                </Text>
            </LinearGradient>
          {requestingOptions.map((option, index) => (
            <View key={index} style={styles.checkboxContainer}>
              <Checkbox
                status={requestingAttention.includes(option) ? "checked" : "unchecked"}
                onPress={() => {
                  handleRequestingSelection(option, setRequestingAttention)
                
                }}
                color="#5EB0E0"
              />
              <Text style={styles.checkboxText}>{option}</Text>
            </View>
          ))}
        </View>

        <View style={styles.sectionContainer}>
            <LinearGradient colors={["#8BCBE0", "#5EB0E0"]} style={styles.questionContainer} >
                <Text style={styles.sectionTitle}>
                    Preferred method of communication for refusing actions
                </Text>
            </LinearGradient>
          {refusalOptions.map((option, index) => (
            <View key={index} style={styles.checkboxContainer}>
              <Checkbox
                status={refusingActions.includes(option) ? "checked" : "unchecked"}
                onPress={() => handleRefusalSelection(option, setRefusingActions)}
                color="#5EB0E0"
              />
              <Text style={styles.checkboxText}>{option}</Text>
            </View>
          ))}
        </View>

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
    // minHeight: screenHeight - 90,
    minHeight: "80%",
    justifyContent: "center",
    marginTop: "25%"
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
  sectionContainer: {
    marginBottom: 10,
  },
  questionContainer: {
    padding: 8,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    borderBottomRightRadius: 10,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "medium",
    color: "#fff",
    marginBottom: 10,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },
  checkboxText: {
    fontSize: 14,
    marginLeft: 8,
  },
  buttonContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 10,
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
