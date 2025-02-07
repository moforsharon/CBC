import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  Keyboard,
  Dimensions
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Checkbox from "expo-checkbox";
import { v4 as uuidv4 } from "uuid";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native"; // Use react-navigation
import Toast from "react-native-root-toast";
import "expo-dev-client";
import * as Google from "expo-auth-session/providers/google";
import { AppContext } from '../../App';

const { height, width } = Dimensions.get('window');

export default function Page() { // Rename the function to match the file name
  const {
    data,
    setData,
    setMenuOpen,
    menuOpen,
    isConnected,
    setUser,
    setMachineId,
  } = useContext(AppContext);
  const navigation = useNavigation();

  const [email, setEmail] = useState("");
  const [Pwd, setPwd] = useState("");
  const [ShowPwd, setShowPwd] = useState(false);
  const [Wrong, setWrong] = useState(false);
  const [EmailAlreadyInUsed, setEmailAlreadyInUsed] = useState(false);

  const [loading, setLoading] = useState(false);

  const [isChecked, setChecked] = useState(false);
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId:
      "1061604714884-a1p0glnlf8rr3pk35uccdk13n41sjef2.apps.googleusercontent.com",
    iosClientId:
      "1061604714884-7ic645ch76khbm50pkgr3macqa5j7scs.apps.googleusercontent.com",
    webClientId: "1014694494024-u8i6j4vufr6ukjk34g682pq95sri2qfa.apps.googleusercontent.com",
    //   "1061604714884-rjcmojkon1aiqnhgt196a1463ct0srr3.apps.googleusercontent.com",
    expoClientId:
      "1061604714884-vo16ndh5n8h69hr49bpjegssm1fqp7da.apps.googleusercontent.com",
    scopes: ["profile", "email"],
  });

  useEffect(() => {
    handleRes();
  }, [response]);

  const handleRes = async () => {
    if (response) await getUserInfo(response.authentication.accessToken);
  };

  const getUserInfo = async (token) => {
    if (!token) {
      return;
    }
    try {
      const resp = await fetch("https://www.googleapis.com/userinfo/v2/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const user = await resp.json();
      console.log(user.email);
      await handleLoginGoogle(user.email);

      navigation.reset({
        index: 0,
        routes: [{ name: "Chat" }],
      });
    } catch (e) {
      console.log(e);
      Toast.show("Failed to Login", {
        duration: Toast.durations.SHORT,
      });
    }
  };

  const handleLoginGoogle = async (emailG) => {
    Keyboard.dismiss();
    setWrong(false);
    let machine_id = await getStoredMachineID();
    try {
      const response = await fetch(
        "https://api.childbehaviorcheck.com/back/users/google",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email_id: emailG,
            plan_name: "free",
            machine_id: machine_id,
          }),
        }
      );

      if (!response.ok) {
        Toast.show("Google Signin Error! Try Again", {
          duration: Toast.durations.SHORT,
        });
      }
      const data = await response.json();
      if (data.success != null) {
        await getStoredUserID(data.success.user_data.user_id);
        setUser(data.success.user_data.user_id);
        await AsyncStorage.setItem("login_type", "google");
      } else {
        Toast.show("Google Signin Error! Try Again", {
          duration: Toast.durations.SHORT,
        });
      }
    } catch (error) {
      Toast.show("Google Signin Error! Try Again", {
        duration: Toast.durations.SHORT,
      });
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    if (Wrong) {
      setWrong(false);
    }
    if (EmailAlreadyInUsed) {
      setEmailAlreadyInUsed(false);
    }
  }, [email, Pwd]);

  const isValidEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z0-9]{2,}$/;
    return emailRegex.test(email);
  };

  //handle navigation to add child screen
  const handleNavigationToAddChildScreen = async () => {
    navigation.reset({
      index: 0,
      routes: [{ name: "BasicInfo" }],
    });
  }

  const handleSignup = async () => {
    Keyboard.dismiss();
    if (!isConnected) {
      Toast.show("No Internet Connection! Try Again", {
        duration: Toast.durations.SHORT,
      });
      return;
    }
    setLoading(true);
    if (isValidEmail(email) && Pwd != null && Pwd.length >= 3) {
      setWrong(false);
      setEmailAlreadyInUsed(false);

      try {
        const response = await fetch(
          "https://api.childbehaviorcheck.com/back/users",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email_id: email,
              password: Pwd,
              plan_name: "free",
            }),
          }
        );

        if (!response.ok) {
          // Handle errors here if necessary
        }
        const data = await response.json();
        if (data.success != null) {
          setLoading(false);
          let tempLogin = await handleLogin();
          if (tempLogin) {
            // navigation.reset({
            //   index: 0,
            //   routes: [{ name: "Chat" }],
            // });
            navigation.reset({
              index: 0,
              routes: [{ name: "BasicInfo" }],
            });
          } else {
            navigation.reset({
              index: 0,
              routes: [{ name: "Signin" }], // Corrected to match your screen name
            });
          }
        } else if (
          data.message.content == "User with this email already exists"
        ) {
          setEmailAlreadyInUsed(true);
          setLoading(false);
        } else {
          setWrong(true);
          setLoading(false);
        }
      } catch (error) {
        setWrong(true);
        setLoading(false);
        console.error("Error:", error);
      }
    } else {
      setWrong(true);
      setLoading(false);
    }
  };

  const getStoredMachineID = async () => {
    try {
      const value = await AsyncStorage.getItem("machine_id");
      if (value !== null) {
        return value;
      } else {
        let new_id = uuidv4();
        await AsyncStorage.setItem("machine_id", new_id);
        setMachineId(new_id);
        return new_id;
      }
    } catch (e) {
      let new_id = uuidv4();
      await AsyncStorage.setItem("machine_id", new_id);
      setMachineId(new_id);
      console.error("Error:", e);
      return new_id;
    }
  };

  const getStoredUserID = async (user_id) => {
    try {
      await AsyncStorage.setItem("user_id", user_id);
      return true;
    } catch (e) {
      console.error("Error:", e);
      return false;
    }
  };

  const handleLogin = async () => {
    let machine_id = await getStoredMachineID();
    try {
      const response = await fetch(
        "https://api.childbehaviorcheck.com/back/users/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email_id: email,
            password: Pwd,
            machine_id: machine_id,
          }),
        }
      );

      if (!response.ok) {
        Toast.show("Fail to Login", {
          duration: Toast.durations.SHORT,
        });
        return false;
      }
      const data = await response.json();
      if (data.success != null) {
        await getStoredUserID(data.success.user_data.user_id);
        setUser(data.success.user_data.user_id);
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.menuBar}>
          <TouchableOpacity onPress={() => setMenuOpen(true)}>
            <Image source={require("../../assets/icons/menu.png")} style={{width:32, height:32}} />
          </TouchableOpacity>
        </View>
        <View>
          <Image
            source={require("../../assets/logo40.png")}
            style={styles.logo}
          />
        </View>
        <Text style={styles.logoText}>CBC</Text>
        <View style={styles.BetaCon}>
          <Text style={styles.BetaText}>Beta</Text>
        </View>
      </View>
      <View style={{marginTop: height > 900 && height < 920 ? 180 :height > 740 && height < 899 ? 130 : 130}}></View>
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", 
        paddingTop: height > 900 && height < 920 ? 130 : height > 740 && height < 899 ? 140 : 130, 
        paddingBottom: height > 900 && height < 920 ? 300 :height > 740 && height < 899 ? 360 : 300, }}>
        <View style={{ backgroundColor: "#fff", borderRadius: 20, padding: 20, width: "90%" }}>
          <Text style={{ fontSize: 28, fontFamily: "Rubik-Medium", textAlign: "center", color: "#1B254B" }}>
            Sign Up
          </Text>

          <TouchableOpacity
            onPress={() => promptAsync()}
            style={{ backgroundColor: "#f7f7f7", width: "100%", flexDirection: "row", alignItems: "center", justifyContent: "center", padding: 10, borderRadius: 10, marginVertical: 10 }}
          >
            <Image source={require("../../assets/icons/google.png")} style={{ width: 22, height: 22 }} />
            <Text style={{ fontSize: 14, fontFamily: "Rubik-Regular", marginLeft: 10 }}>
              Sign up with Google
            </Text>
          </TouchableOpacity>

          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginVertical: 10 }}>
            <View style={{ width: "43%", height: 1, backgroundColor: "rgba(135, 140, 189, 0.3)" }}></View>
            <Text style={{ fontSize: 13, fontFamily: "Rubik-Regular", textAlign: "center", color: "#A0AEC0" }}>
              or
            </Text>
            <View style={{ width: "43%", height: 1, backgroundColor: "rgba(135, 140, 189, 0.3)" }}></View>
          </View>

          <View>
            <View>
              <Text style={{ fontSize: 14, fontFamily: "Rubik-Regular", color: "#1B254B" }}>
                Email*
              </Text>
              <View style={{ borderColor: Wrong || EmailAlreadyInUsed ? "red" : "#E0E5f2", borderWidth: 1, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 5 }}>
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Enter Email..."
                  placeholderTextColor="#a3aed0"
                  style={{ fontSize: 14, fontFamily: "Rubik-Regular", color: "#000" }}
                />
              </View>
              {EmailAlreadyInUsed && (
                <Text style={{ fontSize: 13, fontFamily: "Rubik-Regular", color: "red", marginTop: 4 }}>
                  User with this email already exists.
                </Text>
              )}
            </View>
            <View style={{ marginTop: 10 }}>
              <Text style={{ fontSize: 14, fontFamily: "Rubik-Regular", color: "#1B254B" }}>
                Password*
              </Text>
              <View style={{ borderColor: Wrong ? "red" : "#E0E5f2", borderWidth: 1, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 5, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                <TextInput
                  value={Pwd}
                  onChangeText={setPwd}
                  placeholder="Enter Password..."
                  placeholderTextColor="#a3aed0"
                  secureTextEntry={!ShowPwd}
                  style={{ fontSize: 14, fontFamily: "Rubik-Regular", color: "#000" }}
                />
                {ShowPwd ? (
                  <TouchableOpacity onPress={() => setShowPwd(false)}>
                    <Image source={require("../../assets/icons/hideEye.png")} style={{ width: 22, height: 22 }} />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity onPress={() => setShowPwd(true)}>
                    <Image source={require("../../assets/icons/showEye.png")} style={{ width: 22, height: 22 }} />
                  </TouchableOpacity>
                )}
              </View>
            </View>
            {Wrong && (
              <Text style={{ fontSize: 13, fontFamily: "Rubik-Regular", color: "red", marginTop: 8 }}>
                Invalid credentials.
              </Text>
            )}
            <View style={{ flexDirection: "row", alignItems: "center", marginTop: 10 }}>
              <Checkbox
                value={isChecked}
                onValueChange={setChecked}
                color={isChecked ? "#4630EB" : undefined}
                style={{ height: 16, width: 16 }}
              />
              <Text style={{ fontSize: 12, fontFamily: "Rubik-Regular", color: "#1B254B", marginLeft: 7 }}>
                By creating an account, you agree to our Privacy Policy.
              </Text>
            </View>
            <TouchableOpacity
              // onPress={handleSignup}
              onPress={handleSignup}
              style={{
                borderRadius: 10,
                padding: 10,
                marginVertical: 15,
                backgroundColor: isChecked ? "#27AFDE" : "#A9A9A9",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
              disabled={!isChecked || loading}
            >
              {loading ? (
                <Image source={require("../../assets/icons/loading.gif")} style={{ width: 24, height: 24 }} />
              ) : (
                <Text style={{ fontSize: 14, fontFamily: "Rubik-Regular", color: "#fff", textAlign: "center" }}>
                  Create my account
                </Text>
              )}
            </TouchableOpacity>

            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
              <Text style={{ fontSize: 14, fontFamily: "Rubik-Regular", color: "#000", textAlign: "center" }}>
                Already a member?
              </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('Signin')}  // Corrected navigation for sign in
                style={{ alignItems: "center", justifyContent: "center", marginLeft: 5 }}
              >
                <Text style={{ fontSize: 14, fontFamily: "Rubik-Regular", color: "#7b3aec", textAlign: "center" }}>
                  Sign in
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
      <View style={{marginTop: height > 900 && height < 920 ? 180 :height > 740 && height < 899 ? 130 : 130}}></View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#0C3948",
        height: height,
        paddingVertical: 14,
        flex: 1,
        position: "relative",
        paddingTop: 30,
        },
        headerRow: {
        flexDirection: "row",
        alignItems: "center",
        paddingTop: 10,
        },
        menuBar: { marginHorizontal: 24 },
        logoText: {
        fontSize: 24,
        fontFamily: "Rubik-SemiBold",
        color: "#fff",
        marginHorizontal: 6,
        },
        logo: {
        width: 35,
        height: 35,
        resizeMode: "contain",
        marginLeft: 10
        },
  BetaCon: {
    borderWidth: 1,
    borderColor: "#27AFDE",
    borderRadius: 4,
    backgroundColor: "#fff",
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  BetaText: {
    fontSize: 12,
    fontFamily: "Rubik-Regular",
    color: "#27AFDE",
  },
});

