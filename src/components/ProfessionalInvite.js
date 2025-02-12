"use client"

// import { useEffect, useState } from "react"
import { View, Text, StyleSheet } from "react-native"
// import { useNavigation, useRoute } from "@react-navigation/native"
import React, { useEffect, useRef, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";

const ProfessionalInvite = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [inviteStatus, setInviteStatus] = useState("Processing invitation...");
  const renderCount = useRef(0); // Tracks the render count

  useEffect(() => {
    renderCount.current += 1; // Increment the render count

    // Only run on the second render
    if (renderCount.current === 1) {
        console.log("\n\n\n\n\n\n second render")
      const acceptInvite = async () => {
        const { encryptedInviteId, encryptedUserId, encryptedChildId } = route.params;

        try {
          const response = await fetch(
            `https://api.childbehaviorcheck.com/api/professionals/accept-invite/${encryptedInviteId}/${encryptedUserId}/${encryptedChildId}`,
            { method: "GET" }
          );

          if (response.ok) {
            setInviteStatus("Invitation accepted successfully!");
            setTimeout(() => {
              navigation.navigate("Landing", { inviteAccepted: true });
            }, 2000);
          } else {
            setInviteStatus("Failed to accept invitation. Please try again.");
          }
        } catch (error) {
          console.error("Error accepting invitation:", error);
          setInviteStatus("An error occurred. Please try again later.");
        }
      };

      acceptInvite();
    }
  }, [route.params, navigation]); // Dependencies to listen for changes


  return (
    <View style={styles.container}>
      <Text style={styles.statusText}>{inviteStatus}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0C3948",
  },
  statusText: {
    fontSize: 18,
    color: "#fff",
    textAlign: "center",
  },
})

export default ProfessionalInvite