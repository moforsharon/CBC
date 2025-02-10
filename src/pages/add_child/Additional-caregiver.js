"use client"

import { useState, useEffect, useContext } from "react"
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Modal, Dimensions, Image, StatusBar } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { ChevronDownIcon } from "react-native-heroicons/outline"
import DropDownPicker from "react-native-dropdown-picker"
import { AppContext } from '../../../App';

const { width } = Dimensions.get("window")
const { height: screenHeight } = Dimensions.get("window")

// const childrenData = [
//     { label: "Stan", value: 1 },
//     { label: "Emma", value: 2 },
//     { label: "John", value: 3 },
//     ]

export default function AdditionalCaregiver() {
  const {user} = useContext(AppContext);
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState(null)
  const [professionals, setProfessionals] = useState([{ name: "", email: "" }])
  const [filteredProfessionals, setFilteredProfessionals] = useState([{ name: "", email: "" }])
  const [modalVisible, setModalVisible] = useState(false)
  const [statusBarHeight, setStatusBarHeight] = useState(0)
  const [height, setHeight] = useState(100)
  const [childrenData, setChildrenData] = useState([])
  const [selectedChild, setSelectedChild] = useState(null)

  useEffect(() => {
    console.log("Starting to fetch user children")
    // Fetch children from API
    const fetchUserChildren = async () => {
      try {
        const userId = user;
        console.log(`User id is : ${userId}`)
        if (userId) {
          const response = await fetch(
            `https://api.childbehaviorcheck.com/api/children/user/${userId}`,
            {
              method: "GET",
              // headers: {
              //   userid: userId,
              // },
            }
          );
  
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
  
          const data = await response.json();
          console.log("user children", data)
  
          // Transform data into childrenData

          const transformedChildrenData = data.children_data.map((child) => ({
            label: child.child_name,
            value: child.child_id,
          }));

          setChildrenData(transformedChildrenData);
          // setSelectedChild(0);
        

        }
      } catch (error) {
        console.error("Error fetching user children", error);
      }
    };
  
    fetchUserChildren();
  }, [user]);

  useEffect(() => {
    // Subtract 20% from the screen height
    StatusBar.currentHeight && setStatusBarHeight(StatusBar.currentHeight)

    setHeight(screenHeight)
  }, [])

  const addNewInputPair = () => {
    setProfessionals([...professionals, { name: "", email: "" }])
  }

  useEffect(() => {
    setSelectedChild(value)
  }, [value])

  const updateProfessional = (index, field, value) => {
    const updatedProfessionals = [...professionals]
    updatedProfessionals[index][field] = value
    setProfessionals(updatedProfessionals)
  }

  const handleInviteAll = async () => {
    console.log("Selected child:", selectedChild)
    console.log("Inviting professionals:", professionals)
  
    // Validate professionals array
    const validProfessionals = professionals.filter((professional) => professional.name !== "" && professional.email !== "");
  
    if (validProfessionals.length === 0) {
      console.error("No valid professionals to invite");
      return;
    }
  
    setFilteredProfessionals(validProfessionals)
    // Make API call to invite professionals
    try {
      const response = await fetch("https://api.childbehaviorcheck.com/api/professionals/send-invites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "userid": user,
        },
        body: JSON.stringify({
          professionals: validProfessionals,
          childId: selectedChild,
        }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log("Invitation response:", data);
  
      // Show modal
      setModalVisible(true);
    } catch (error) {
      console.error("Error inviting professionals:", error);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* <Text style={styles.title}>Additional Caregiver Stan</Text> */}
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
            <Text style={styles.headerlbltxt}>Additional Caregiver Stan</Text>
            </View>
        </View>

      <Text style={styles.descriptionFirst}>
        Therapists, teachers, child care providers. These professionals will be able to see your child's info, data, and
        behavior support plan. They'll also be able to put in their own data that you'll be able to see.
      </Text>

      <Text style={styles.description}>
        They can't make any changes to anything in your account, and you can revoke...
      </Text>

      <Text style={styles.description}>
        When you're done adding professionals, click on the invite button to proceed to the next page.
      </Text>

      <Text style={styles.description}>
        You can also come back to this page any time by tapping the menu button in the top left corner.
      </Text>

      <View style={styles.dropdownContainer}>
        <DropDownPicker
          open={open}
          value={value}
          items={childrenData}
          setOpen={setOpen}
          setValue={setValue}
          style={styles.dropdown}
          dropDownContainerStyle={styles.dropdownList}
          placeholder="Select child"
        />
      </View>

      <ScrollView style={styles.scrollView}>
        {professionals.map((professional, index) => (
          <View key={index} style={styles.inputContainer}>
            <TextInput
              style={styles.nameInput}
              placeholder="Name"
              value={professional.name}
              onChangeText={(text) => updateProfessional(index, "name", text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={professional.email}
              onChangeText={(text) => updateProfessional(index, "email", text)}
              keyboardType="email-address"
            />
            {index === professionals.length - 1 && (
              <TouchableOpacity style={styles.addButton} onPress={addNewInputPair}>
                <Text style={styles.addButtonText}>Add</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.inviteButton} onPress={handleInviteAll}>
        <Text style={styles.inviteButtonText}>Invite all professionals</Text>
      </TouchableOpacity>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Invitation Sent!</Text>
            <Text style={styles.modalText}>
              The invitation has been successfully sent to {filteredProfessionals.map((professional) => `${professional.name} (${professional.email})`).join(", ")}. You will be notified once they accept your request.
            </Text>
            <TouchableOpacity style={styles.okayButton} onPress={() => {
                setModalVisible(false);
                navigation.reset({
                  index: 0,
                  routes: [{ name: "Chat" }],
                })
                }
              }>
              <Text style={styles.okayButtonText}>Okay!</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E1F4F9",
    padding: 16,
    minHeight: screenHeight,
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
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 20,
  },
  descriptionFirst: {
    marginTop: 140,
    fontSize: 16,
    color: "#000",
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: "#333",
    marginBottom: 12,
  },
  dropdownContainer: {
    zIndex: 1000,
    marginBottom: 20,
    marginTop: 12
  },
  dropdown: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 8,
  },
  dropdownList: {
    backgroundColor: "#fff",
    borderColor: "#ccc",
  },
  scrollView: {
    flex: 1,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 8,
    width: "100%",
    padding: 8,
    maxHeight: (screenHeight * 0.3)
  },
  inputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  nameInput: {
    paddingHorizontal: 12,
    paddingVertical: 0,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 8,
    flex: 1,
    marginRight: 6,
    width: "20%"
  },
  input: {
    padding: 12,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 8,
    flex: 1,
    marginRight: 6,
    width: "70%"
  },
  addButton: {
    justifyContent: "center",
    alignItems: "center",
    width: "20%"
  },
  addButtonText: {
    color: "#27AFDE",
    fontSize: 16,
    fontWeight: "500",
  },
  inviteButton: {
    backgroundColor: "#27AFDE",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  inviteButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    width: width * 0.8,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalText: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 20,
    color: "#666",
  },
  okayButton: {
    backgroundColor: "#27AFDE",
    paddingHorizontal: 40,
    paddingVertical: 12,
    borderRadius: 8,
  },
  okayButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
})

