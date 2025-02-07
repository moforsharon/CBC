// import React, { useState, useEffect, useContext } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   ScrollView,
//   Image,
//   Dimensions,
//   StatusBar,
// } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { RadioButton } from "react-native-paper";
// import DropDownPicker from "react-native-dropdown-picker";
// import { useNavigation } from "@react-navigation/native";
// import { AppContext } from '../../../App';


// const { height: screenHeight } = Dimensions.get("window");

// export default function BasicInfoPage() {
//   const {childName, setChildName} = useContext(AppContext);
//   const navigation = useNavigation();
//   const [childRace, setChildRace] = useState("");
//   const [childGender, setChildGender] = useState("");
//   const [diagnosis, setDiagnosis] = useState(null);
//   const [educationPlan, setEducationPlan] = useState(null);
//   const [statusBarHeight, setStatusBarHeight] = useState(0);
//   const [height, setHeight] = useState(100);
//   const [raceOpen, setRaceOpen] = useState(false);
//   const [genderOpen, setGenderOpen] = useState(false);
//   const [isButtonDisabled, setIsButtonDisabled] = useState(true);

//   const raceOptions = [
//     { label: "Asian", value: "asian" },
//     { label: "Black", value: "black" },
//     { label: "Hispanic", value: "hispanic" },
//     { label: "White", value: "white" },
//     { label: "Other", value: "other" },
//   ];
//   const genderOptions = [
//     { label: "Male", value: "male" },
//     { label: "Female", value: "female" },
//     { label: "Non-binary", value: "non_binary" },
//     { label: "Other", value: "other" },
//   ];

//   const handleNext = () => {
//     console.log("Child's Name:", childName);
//     console.log("Child's Race:", childRace);
//     console.log("Child's Gender:", childGender);
//     console.log("Diagnosis:", diagnosis);
//     console.log("Education Plan:", educationPlan);

//     navigation.reset({
//       index: 0,
//       routes: [{ name: "MethodsOfCommunication" }],
//     });
//   };

//     useEffect(() => {
     
//       // Subtract 20% from the screen height
//       StatusBar.currentHeight && setStatusBarHeight(StatusBar.currentHeight);
      
//         setHeight(screenHeight);
        
//         }, []);

//         useEffect(() => {
//           setIsButtonDisabled(
//             !childName || !childRace || !childGender || !diagnosis || !educationPlan
//           );
//         }, [childName, childRace, childGender, diagnosis, educationPlan]);
//   return (
//     <SafeAreaView style={[
//       styles.container, 
//       {
//         marginTop: statusBarHeight,
//         height: height,
//       }
//     ]}>
//         <View style={styles.Header}>
//           <View style={styles.HeaderLogo}>
//             <View style={{width:32, height:32}}></View>
//             <Image
//               source={require("../../../assets/logo40.png")}
//               style={{width:35, height:35}}
//             />
//             <View style={{width:32, height:32}}></View>
//           </View>
//           <View style={styles.HeaderLbl}>
//             <Text style={styles.headerlbltxt}>Tell us about your family</Text>
//           </View>
//         </View>
//       <ScrollView contentContainerStyle={styles.scrollContainer}>

//         <Text style={styles.label}>Child's name</Text>
//         <TextInput
//           style={styles.input}
//           placeholder="Enter the name"
//           placeholderTextColor="#A9A9A9"
//           value={childName}
//           onChangeText={setChildName}
//         />

//         <Text style={styles.label}>What is your child's race or ethnicity?</Text>
//         <DropDownPicker
//           open={raceOpen}
//           setOpen={setRaceOpen}
//           value={childRace}
//           setValue={setChildRace}
//           items={raceOptions}
//           containerStyle={[styles.dropdownContainer, raceOpen && styles.expandedDropdown]}
//           style={styles.dropdown}
//           placeholder="Select race or ethnicity"
//           placeholderStyle={styles.placeholderStyle}
//           arrowStyle={styles.arrowStyle}
//           zIndex={3000}
//           zIndexInverse={1000}
//         />

//         <Text style={styles.label}>What is your child's gender?</Text>
//         <DropDownPicker
//           open={genderOpen}
//           setOpen={setGenderOpen}
//           value={childGender}
//           setValue={setChildGender}
//           items={genderOptions}
//           containerStyle={[styles.dropdownContainer, genderOpen && styles.expandedDropdown]}
//           style={styles.dropdown}
//           placeholder="Select gender"
//           placeholderStyle={styles.placeholderStyle}
//           arrowStyle={styles.arrowStyle}
//           zIndex={2000}
//           zIndexInverse={900}
//         />

//         <Text style={styles.label}>Does your child have a diagnosis?</Text>
//         <View style={styles.radioGroup}>
//           <RadioButton.Group onValueChange={setDiagnosis} value={diagnosis}>
//             <View style={styles.radioOptionContainer}>
//               <View style={styles.radioOption}>
//                 <RadioButton value="yes" color="#5EB0E0" uncheckedColor="#5EB0E0" />
//                 <Text>Yes</Text>
//               </View>
//               <View style={styles.radioOption}>
//                 <RadioButton value="no" color="#5EB0E0" uncheckedColor="#5EB0E0"/>
//                 <Text>No</Text>
//               </View>
//               <View style={styles.radioOption}>
//                 <RadioButton value="dont_know" color="#5EB0E0" uncheckedColor="#5EB0E0"/>
//                 <Text>I don’t know</Text>
//               </View>
//             </View>
//           </RadioButton.Group>
//         </View>

//         <Text style={styles.label}>
//           Does your child have an Individual Education Plan (IFSP/IEP)?
//         </Text>
//         <View style={styles.radioGroup}>
//           <RadioButton.Group onValueChange={setEducationPlan} value={educationPlan}>
//             <View style={styles.radioOptionContainer}>
//               <View style={styles.radioOption}>
//                 <RadioButton value="yes" color="#5EB0E0" uncheckedColor="#5EB0E0"/>
//                 <Text>Yes</Text>
//               </View>
//               <View style={styles.radioOption}>
//                 <RadioButton value="no" color="#5EB0E0" uncheckedColor="#5EB0E0"/>
//                 <Text>No</Text>
//               </View>
//               <View style={styles.radioOption}>
//                 <RadioButton value="dont_know" color="#5EB0E0" uncheckedColor="#5EB0E0"/>
//                 <Text>I don’t know</Text>
//               </View>
//             </View>
//           </RadioButton.Group>
//         </View>

//         <View style={styles.buttonContainer}>
//           <TouchableOpacity onPress={handleNext} style={[styles.button, isButtonDisabled && styles.buttonDisabled]} disabled={isButtonDisabled}>
//             <Text style={styles.buttonText}>Next</Text>
//           </TouchableOpacity>
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#E1F4F9",
//     padding: 16,
//   },
//   scrollContainer: {
//     flexGrow: 1,
//     minHeight: screenHeight - 90,
//     justifyContent: "center",
//     marginTop: "15%"
//   },
//   Header: {
//     width: "100%",
//     height: 90,
//     justifyContent: "center",
//     alignItems: "center",
//     position: "fixed",
//     top: 10,
//     zIndex: 1,
//     backgroundColor: "#E1F4F9",
//   },
//   HeaderLogo: {
//     height: 50,
//     width: "100%",
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     paddingHorizontal: 24,
//     marginBottom: 16,
//     marginTop: 5
//   },
//   HeaderLbl: {
//     justifyContent: "center",
//   },
//   headerlbltxt: {
//     fontSize: 20,
//     fontFamily: "Rubik-Medium",
//   },
//   title: {
//     fontSize: 18,
//     fontWeight: "bold",
//     textAlign: "center",
//     marginBottom: 20,
//   },
//   label: {
//     fontSize: 16,
//     marginBottom: 6,
//     marginTop: 10,
//     fontWeight: "semi-bold"
//   },
//   input: {
//     backgroundColor: "#fff",
//     padding: 14,
//     borderRadius: 8,
//     marginBottom: 15,
//   },
//   dropdownContainer: {
//     height: 50,
//     marginBottom: 15,
//   },
//   expandedDropdown: {
//     zIndex: 3000,
//   },
//   dropdown: {
//     backgroundColor: "#fff",
//     borderRadius: 8,
//     borderWidth: 0,
//   },
//   placeholderStyle: {
//     color: "#A9A9A9",
//   },
//   arrowStyle: {
//     tintColor: "#A9A9A9",
//   },
//   radioGroup: {
//     marginBottom: 15,
//   },
//   radioOptionContainer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     width: "50%"
//   },
//   radioOption: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginRight: 15,
//   },
//   buttonContainer: {
//     justifyContent: "center",
//     alignItems: "center",
//     width: "100%"
//   },
//   button: {
//     backgroundColor: "#5EB0E0",
//     padding: 14,
//     borderRadius: 8,
//     alignItems: "center",
//     marginTop: 20,
//     width: "60%"
//   },
//   buttonDisabled: {
//     backgroundColor: "#D0EAF5",
//   },
//   buttonText: {
//     color: "white",
//     fontSize: 16,
//   },
// });

import { useState, useEffect, useContext } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
  StatusBar,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { RadioButton } from "react-native-paper"
import DropDownPicker from "react-native-dropdown-picker"
import { useNavigation } from "@react-navigation/native"
import { AppContext } from "../../../App"

const { height: screenHeight } = Dimensions.get("window")

export default function BasicInfoPage() {
  const { childName, setChildName, childRace, setChildRace, childGender, setChildGender, diagnosis, setDiagnosis, educationPlan, setEducationPlan, diagnosisDetails, setDiagnosisDetails, otherServices, setOtherServices, serviceDetails, setServiceDetails } = useContext(AppContext)
  const navigation = useNavigation()
  const [statusBarHeight, setStatusBarHeight] = useState(0)
  const [height, setHeight] = useState(100)
  const [raceOpen, setRaceOpen] = useState(false)
  const [genderOpen, setGenderOpen] = useState(false)
  const [isButtonDisabled, setIsButtonDisabled] = useState(true)

  const raceOptions = [
    { label: "Asian", value: "asian" },
    { label: "Black", value: "black" },
    { label: "Hispanic", value: "hispanic" },
    { label: "White", value: "white" },
    { label: "Other", value: "other" },
  ]
  const genderOptions = [
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
    { label: "Non-binary", value: "non_binary" },
    { label: "Other", value: "other" },
  ]

  const handleNext = () => {
    console.log("Child's Name:", childName)
    console.log("Child's Race:", childRace)
    console.log("Child's Gender:", childGender)
    console.log("Diagnosis:", diagnosis)
    console.log("Diagnosis Details:", diagnosisDetails)
    console.log("Education Plan:", educationPlan)
    console.log("Other Services:", otherServices)
    console.log("Service Details:", serviceDetails)

    navigation.reset({
      index: 0,
      routes: [{ name: "MethodsOfCommunication" }],
    })
  }

  useEffect(() => {
    // Subtract 20% from the screen height
    StatusBar.currentHeight && setStatusBarHeight(StatusBar.currentHeight)

    setHeight(screenHeight)
  }, [])

  useEffect(() => {
    setIsButtonDisabled(
      !childName ||
        !childRace ||
        !childGender ||
        !diagnosis ||
        !educationPlan ||
        (diagnosis === "yes" && !diagnosisDetails) ||
        (educationPlan === "yes" && otherServices === "yes" && !serviceDetails),
    )
  }, [childName, childRace, childGender, diagnosis, diagnosisDetails, educationPlan, otherServices, serviceDetails])
  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          marginTop: statusBarHeight,
          height: height,
        },
      ]}
    >
      <View style={styles.Header}>
        <View style={styles.HeaderLogo}>
          <View style={{ width: 32, height: 32 }}></View>
          <Image source={require("../../../assets/logo40.png")} style={{ width: 35, height: 35 }} />
          <View style={{ width: 32, height: 32 }}></View>
        </View>
        <View style={styles.HeaderLbl}>
          <Text style={styles.headerlbltxt}>Tell us about your family</Text>
        </View>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.label}>Child's name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter the name"
          placeholderTextColor="#A9A9A9"
          value={childName}
          onChangeText={setChildName}
        />

        <Text style={styles.label}>What is your child's race or ethnicity?</Text>
        <DropDownPicker
          open={raceOpen}
          setOpen={setRaceOpen}
          value={childRace}
          setValue={setChildRace}
          items={raceOptions}
          containerStyle={[styles.dropdownContainer, raceOpen && styles.expandedDropdown]}
          style={styles.dropdown}
          placeholder="Select race or ethnicity"
          placeholderStyle={styles.placeholderStyle}
          arrowStyle={styles.arrowStyle}
          zIndex={3000}
          zIndexInverse={1000}
        />

        <Text style={styles.label}>What is your child's gender?</Text>
        <DropDownPicker
          open={genderOpen}
          setOpen={setGenderOpen}
          value={childGender}
          setValue={setChildGender}
          items={genderOptions}
          containerStyle={[styles.dropdownContainer, genderOpen && styles.expandedDropdown]}
          style={styles.dropdown}
          placeholder="Select gender"
          placeholderStyle={styles.placeholderStyle}
          arrowStyle={styles.arrowStyle}
          zIndex={2000}
          zIndexInverse={900}
        />

        <Text style={styles.label}>Does your child have a diagnosis?</Text>
        <View style={styles.radioGroup}>
          <RadioButton.Group onValueChange={setDiagnosis} value={diagnosis}>
            <View style={styles.radioOptionContainer}>
              <View style={styles.radioOption}>
                <RadioButton value="yes" color="#5EB0E0" uncheckedColor="#5EB0E0" />
                <Text>Yes</Text>
              </View>
              <View style={styles.radioOption}>
                <RadioButton value="no" color="#5EB0E0" uncheckedColor="#5EB0E0" />
                <Text>No</Text>
              </View>
              <View style={styles.radioOption}>
                <RadioButton value="dont_know" color="#5EB0E0" uncheckedColor="#5EB0E0" />
                <Text>I don't know</Text>
              </View>
            </View>
          </RadioButton.Group>
        </View>

        {diagnosis === "yes" && (
          <>
            <Text style={styles.label}>What is/are your child's diagnosis/es?</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter diagnosis/es"
              placeholderTextColor="#A9A9A9"
              value={diagnosisDetails}
              onChangeText={setDiagnosisDetails}
            />
          </>
        )}

        <Text style={styles.label}>Does your child have an Individual Education Plan (IFSP/IEP)?</Text>
        <View style={styles.radioGroup}>
          <RadioButton.Group onValueChange={setEducationPlan} value={educationPlan}>
            <View style={styles.radioOptionContainer}>
              <View style={styles.radioOption}>
                <RadioButton value="yes" color="#5EB0E0" uncheckedColor="#5EB0E0" />
                <Text>Yes</Text>
              </View>
              <View style={styles.radioOption}>
                <RadioButton value="no" color="#5EB0E0" uncheckedColor="#5EB0E0" />
                <Text>No</Text>
              </View>
              <View style={styles.radioOption}>
                <RadioButton value="dont_know" color="#5EB0E0" uncheckedColor="#5EB0E0" />
                <Text>I don't know</Text>
              </View>
            </View>
          </RadioButton.Group>
        </View>

        {educationPlan === "yes" && (
          <>
            <Text style={styles.label}>Does your child receive any other service?</Text>
            <View style={styles.radioGroup}>
              <RadioButton.Group onValueChange={setOtherServices} value={otherServices}>
                <View style={styles.radioOptionContainer}>
                  <View style={styles.radioOption}>
                    <RadioButton value="yes" color="#5EB0E0" uncheckedColor="#5EB0E0" />
                    <Text>Yes</Text>
                  </View>
                  <View style={styles.radioOption}>
                    <RadioButton value="no" color="#5EB0E0" uncheckedColor="#5EB0E0" />
                    <Text>No</Text>
                  </View>
                  <View style={styles.radioOption}>
                    <RadioButton value="dont_know" color="#5EB0E0" uncheckedColor="#5EB0E0" />
                    <Text>I don't know</Text>
                  </View>
                </View>
              </RadioButton.Group>
            </View>

            {otherServices === "yes" && (
              <>
                <Text style={styles.label}>What services does your child receive?</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter services"
                  placeholderTextColor="#A9A9A9"
                  value={serviceDetails}
                  onChangeText={setServiceDetails}
                />
              </>
            )}
          </>
        )}

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={handleNext}
            style={[styles.button, isButtonDisabled && styles.buttonDisabled]}
            disabled={isButtonDisabled}
          >
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E1F4F9",
    padding: 16,
  },
  scrollContainer: {
    flexGrow: 1,
    minHeight: screenHeight - 90,
    justifyContent: "center",
    marginTop: "15%",
  },
  Header: {
    width: "100%",
    height: 90,
    justifyContent: "center",
    alignItems: "center",
    position: "fixed",
    top: 10,
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
    marginTop: 5,
  },
  HeaderLbl: {
    justifyContent: "center",
  },
  headerlbltxt: {
    fontSize: 20,
    fontFamily: "Rubik-Medium",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 6,
    marginTop: 10,
    fontWeight: "semi-bold",
  },
  input: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 8,
    marginBottom: 15,
  },
  dropdownContainer: {
    height: 50,
    marginBottom: 15,
  },
  expandedDropdown: {
    zIndex: 3000,
  },
  dropdown: {
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 0,
  },
  placeholderStyle: {
    color: "#A9A9A9",
  },
  arrowStyle: {
    tintColor: "#A9A9A9",
  },
  radioGroup: {
    marginBottom: 15,
  },
  radioOptionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "50%",
  },
  radioOption: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
  },
  buttonContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  button: {
    backgroundColor: "#5EB0E0",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
    width: "60%",
  },
  buttonDisabled: {
    backgroundColor: "#D0EAF5",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
})

