"use client";

import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Keyboard,
  Dimensions, 
  Image
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";

const { height: screenHeight } = Dimensions.get("window")

const ProfessionalInvite = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [inviteStatus, setInviteStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAcceptInvite = async () => {
    Keyboard.dismiss();

    // Log passwords to the console
    console.log("Password:", password);
    console.log("Confirm Password:", confirmPassword);

    // Ensure passwords match before proceeding
    if (password !== confirmPassword) {
      setInviteStatus("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    const { encryptedInviteId, encryptedUserId, encryptedChildId } = route.params;

    try {
      const response = await fetch(
        `https://api.childbehaviorcheck.com/api/professionals/accept-invite/${encryptedInviteId}/${encryptedUserId}/${encryptedChildId}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        //   body: JSON.stringify({ password }), // Send the password to the server
        }
      );

      if (response.ok) {
        setInviteStatus("Invitation accepted successfully!");
        setTimeout(() => {
          navigation.navigate("Landing", { inviteAccepted: true });
        }, 2000);
      } else {
        setInviteStatus("Failed to accept the invitation. Please try again.");
      }
    } catch (error) {
      console.error("Error accepting invitation:", error);
      setInviteStatus("An error occurred. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>

        <View style={styles.Header}>
            <View style={styles.HeaderLogo}>
            <View style={{width:32, height:32}}></View>
            <Image
                source={require("../../assets/logo40.png")}
                style={{width:35, height:35}}
            />
            <View style={{width:32, height:32}}></View>
            </View>
            <View style={styles.HeaderLbl}>
            <Text style={styles.headerlbltxt}>Accept Invitation</Text>
            </View>
        </View>
        <View style={{ backgroundColor: "#fff", borderRadius: 20, padding: 20, width: "90%" }}>
            <Text style={styles.title}>Create account</Text>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Password*</Text>
                <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Enter Password"
                placeholderTextColor="#a3aed0"
                secureTextEntry={true}
                style={styles.input}
                />
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Confirm Password*</Text>
                <TextInput
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Confirm Password"
                placeholderTextColor="#a3aed0"
                secureTextEntry={true}
                style={styles.input}
                />
            </View>

            {inviteStatus ? (
                <Text style={styles.statusMessage}>{inviteStatus}</Text>
            ) : null}

            <TouchableOpacity
                onPress={handleAcceptInvite}
                style={[
                styles.button,
                isSubmitting && { backgroundColor: "#a3aed0" },
                ]}
                disabled={isSubmitting}
            >
                <Text style={styles.buttonText}>
                {isSubmitting ? "Processing..." : "Accept Invite"}
                </Text>
            </TouchableOpacity>
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0C3948",
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    minHeight: screenHeight,
    fontFamily: "Rubik-Medium",
  },
  Header: {
    width: "100%",
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    position: "fixed",
    top: 0,
    zIndex: 1,
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
    color: "#fff",
  },
  headerlbltxt: {
    fontSize: 20,
    fontFamily: "Rubik-Medium",
    color: "#fff"
  },
  title: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20,
    fontFamily: "Rubik-Medium",
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    marginBottom: 5,
  },
  input: {
    borderColor: "#E0E5f2",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    color: "#000",
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#27AFDE",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    fontSize: 16,
    color: "#fff",
  },
  statusMessage: {
    fontSize: 14,
    color: "#ff726f",
    textAlign: "center",
    marginTop: 10,
  },
});

export default ProfessionalInvite;
