// import React, { useState, useRef, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Keyboard,
  Platform,
  Dimensions
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { VStack, HStack } from "native-base";
import { LinearGradient } from "expo-linear-gradient";
import { AppContext } from "../../App";
// import HistroyLoading from "../components/HistroyLoading.js";
// import LoginRequiredModal from "../components/LoginRequiredModal.js";
import VideoIcon from "../../assets/icons/video-camera-alt.png";
import { useFonts } from "expo-font";
import { useNavigation } from "@react-navigation/native";
import React, { useState, useRef, useContext, useEffect } from "react";

const { height, width } = Dimensions.get('window');

export default function Page() {
    const { data, setMenuOpen, menuOpen, user, machineId, isConnected } =
      useContext(AppContext);
    const navigation = useNavigation();
    const [text, setText] = useState("");
    const [loading, setLoading] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showHistroyLoadingModal, setShowHistroyLoadingModal] = useState(false);
  
    const [chatHistory, setChatHistory] = useState([
      {
        role: "assistant",
        content: "What challenge can I help you with ?",
      },
    ]);
    useEffect(() => {
      if (user != null) {
        handleGetHistory();
      }
    }, []);
    const scrollViewRef = useRef();
    const handleChangeText = (value) => {
      setText(value);
    };
    const scrollToBottom = () => {
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollToEnd({ animated: true });
      }
    };
  
    const handleSubmit = async () => {
      console.log("Send button clicked!"); 
      Keyboard.dismiss();
      if (!isConnected) {
        let toast = Toast.show("No Internet Connection! Try Again", {
          duration: Toast.durations.SHORT,
        });
  
        return;
      }
      
      let toQuestion = text;
      setText("");
      if (user == null && chatHistory.length >= 20) {
        setShowLoginModal(true);
        return;
      }
      setLoading(true);
      try {
        const response = await fetch(
          "https://childbehaviorcheckin.com/generic/assistant",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              question: toQuestion,
              history: chatHistory,
            }),
          }
        );
  
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
  
        const data = await response.json();
        console.log(data.success.message);
        setChatHistory([
          ...chatHistory,
          {
            role: "user",
            content: toQuestion,
          },
          {
            role: "assistant",
            content: data.success.message,
          },
        ]);
        if (user != null)
          await handleSaveHistory(toQuestion, data.success.message);
      } catch (error) {
        setChatHistory([
          ...chatHistory,
          {
            role: "user",
            content: toQuestion,
          },
          {
            role: "assistant",
            content: "",
          },
        ]);
        console.error("Error:", error);
      }
      scrollToBottom();
  
      setLoading(false);
    };
    const handleSaveHistory = async (msg, responce) => {
      try {
        const response = await fetch(
          "https://childbehaviorcheckin.com/back/history",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Userid: user,
            },
            body: JSON.stringify({
              _id: "6593bc7a65e63b8aec728732",
              question: msg,
              status: "complete",
              response: responce,
              machine_id: machineId,
              chat_id: uuidv4(),
            }),
          }
        );
  
        if (!response.ok) {
          // setWrong(true);
          let toast = Toast.show("Failed to Save history!", {
            duration: Toast.durations.SHORT,
          });
        }
  
        // user_data.user_id
      } catch (error) {
        console.error("Error:", error);
      }
    };
    const handleDeleteHistory = async () => {
      if (!isConnected) {
        let toast = Toast.show("No Internet Connection! Try Again", {
          duration: Toast.durations.SHORT,
        });
  
        return;
      }
      if (user == null) {
        setChatHistory([
          {
            role: "assistant",
            content: "What challenge can I help you with ?",
          },
        ]);
        return;
      }
      try {
        setShowHistroyLoadingModal(true);
  
        const response = await fetch(
          "https://childbehaviorcheckin.com/back/history/delete",
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Userid: user,
            },
            body: JSON.stringify({}),
          }
        );
  
        if (!response.ok) {
          // setWrong(true);
          setShowHistroyLoadingModal(false);
  
          let toast = Toast.show("Failed to Clear history!", {
            duration: Toast.durations.SHORT,
          });
        } else {
          setChatHistory([
            {
              role: "assistant",
              content: "What challenge can I help you with ?",
            },
          ]);
          setShowHistroyLoadingModal(false);
  
          let toast0 = Toast.show("History Cleared..", {
            duration: Toast.durations.SHORT,
          });
        }
  
        // user_data.user_id
      } catch (error) {
        setShowHistroyLoadingModal(false);
  
        console.error("Error:", error);
      }
    };
    const handleGetHistory = async () => {
      if (!isConnected) {
        let toast = Toast.show("No Internet Connection! Try Again", {
          duration: Toast.durations.SHORT,
        });
  
        return;
      }
  
      try {
        setShowHistroyLoadingModal(true);
        const response = await fetch(
          "https://childbehaviorcheckin.com/back/history/get",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              userId: user,
            },
            body: JSON.stringify({
              _id: "6593bc7a65e63b8aec728732",
            }),
          }
        );
        const data = await response.json();
        if (!response.ok) {
          // setWrong(true);
          setShowHistroyLoadingModal(false);
  
          let toast = Toast.show("Failed to Fetch history!", {
            duration: Toast.durations.SHORT,
          });
        } else if (data.success != null) {
          let temp = [];
  
          for (let i = 0; i < data.success.length; i++) {
            if (data.success[i].type == "apiMessage") {
              temp.push({
                role: "assistant",
                content: data.success[i].message,
              });
            } else if (data.success[i].type == "userMessage") {
              temp.push({
                role: "user",
                content: data.success[i].message,
              });
            }
          }
          setChatHistory(temp);
          setShowHistroyLoadingModal(false);
  
          let toast0 = Toast.show("History Fetched..", {
            duration: Toast.durations.SHORT,
          });
        } else {
          setShowHistroyLoadingModal(false);
        }
  
        // user_data.user_id
      } catch (error) {
        setShowHistroyLoadingModal(false);
  
        console.error("Error:", error);
      }
    };
    const formatMsg = (msg) => {
      let temp = msg.replace(/\n\[.*?\]/g, "");
  
      return temp.replace(/\[.*?\]/g, "");
    };
    return (
      <SafeAreaView style={[styles.container, { height: height }]}>
        {/* <SideMenu /> */}
        {/* <LoginRequiredModal
          showModal={showLoginModal}
          onClose={() => setShowLoginModal(false)}
        />
        <HistroyLoading
          showModal={showHistroyLoadingModal}
          onClose={() => setShowHistroyLoadingModal(false)}
        /> */}
        <View style={styles.Header}>
          <View style={styles.HeaderLogo}>
            {/* <TouchableOpacity onPress={() => setMenuOpen(true)}>
              <Image
                source={require("../../assets/icons/menuBlack.png")}
                style={{width:32, height:32}}
                
              />
            </TouchableOpacity> */}
            <Image
              source={require("../../assets/logo40.png")}
              style={{width:32, height:32}}
            />
            {/* <TouchableOpacity onPress={() => handleDeleteHistory()}>
              <Image
                source={require("../../assets/icons/reset.png")}
                style={{width:32, height:32}}
              />
            </TouchableOpacity> */}
          </View>
          <View style={styles.HeaderLbl}>
            <Text style={styles.headerlbltxt}>Child Behavior Check-in</Text>
          </View>
        </View>
        <View style={styles.chatContainer}>
          <View style={styles.Chatbox}>
            <ScrollView ref={scrollViewRef} style={styles.scrollContainer}>
              {chatHistory.length == 1 && (
                <>
                  <View style={{ alignItems: "center", marginBottom: 16,  }}>
                    <Text
                      style={{
                        fontSize: 14,
                        fontFamily: "Rubik-Regular",
                        marginBottom: 8,
                      }}
                    >
                      Throwing / damaging objects or property behavior
                    </Text>
                    <View
                      style={[
                        styles.bot_msg,
                        {
                          borderBottomRightRadius: 8,
                          borderBottomLeftRadius: 8,
                          borderTopLeftRadius: 8,
                          borderTopRightRadius: 8,
                        },
                      ]}
                    >
                      <Text
                        style={{
                          fontSize: 16,
                          fontFamily: "Rubik-Regular",
                        }}
                      >
                        How do you kindly tell your toddler to stop throwing
                        everything?
                      </Text>
                    </View>
                  </View>
                  <View style={{ alignItems: "center", marginBottom: 16 }}>
                    <Text
                      style={{
                        fontSize: 14,
                        fontFamily: "Rubik-Regular",
                        marginBottom: 8,
                      }}
                    >
                      Refusing to follow directions behavior
                    </Text>
                    <View
                      style={[
                        styles.bot_msg,
                        {
                          borderBottomRightRadius: 8,
                          borderBottomLeftRadius: 8,
                          borderTopLeftRadius: 8,
                          borderTopRightRadius: 8,
                        },
                      ]}
                    >
                      <Text
                        style={{
                          fontSize: 16,
                          fontFamily: "Rubik-Regular",
                        }}
                      >
                        What are some effective methods of disciplining a child
                        who refuses to listen and cries instead of following
                        directions?
                      </Text>
                    </View>
                  </View>
                  <View style={{ alignItems: "center", marginBottom: 16 }}>
                    <Text
                      style={{
                        fontSize: 14,
                        fontFamily: "Rubik-Regular",
                        marginBottom: 8,
                      }}
                    >
                      Tantrums behavior
                    </Text>
                    <View
                      style={[
                        styles.bot_msg,
                        {
                          borderBottomRightRadius: 8,
                          borderBottomLeftRadius: 8,
                          borderTopLeftRadius: 8,
                          borderTopRightRadius: 8,
                        },
                      ]}
                    >
                      <Text
                        style={{
                          fontSize: 16,
                          fontFamily: "Rubik-Regular",
                        }}
                      >
                        How do I stop a child from throwing a tantrum in public?
                      </Text>
                    </View>
                  </View>
                </>
              )}
  
              {/* <View style={styles.bot_msg}>
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: "Rubik-Regular",
                  }}
                >
                  What challenge can I help you with ?
                </Text>
              </View> */}
            <View style={{height: chatHistory.length == 1? height-500 : height-200, paddingBottom: 80}} >
                {chatHistory.map((item, index) =>
                    item.role === "user" ? (
                    <LinearGradient
                        colors={["#81C6DE", "#27AFDE"]}
                        style={styles.user_msg}
                        start={{ x: 0, y: 0 }} // Start from the top left corner
                        end={{ x: 1, y: 1 }} // End at the bottom right corner
                        locations={[0, 1]} // Optional: specify color stops
                        angle={91}
                        key={index}
                    >
                        <Text
                        style={{
                            color: "#fff",
                            fontSize: 16,
                            fontFamily: "Rubik-Regular",
                        }}
                        >
                        {item.content}
                        </Text>
                    </LinearGradient>
                    ): (
                    <View style={styles.bot_msg} key={index}>
                        <Text
                        style={{
                            fontSize: 16,
                            fontFamily: "Rubik-Regular",
                        }}
                        >
                        {formatMsg(item.content)}
                        </Text>
                    </View>
                    )
                )}
            </View>
            </ScrollView>
            {loading && (
              <View style={styles.answeringCon}>
                <View style={styles.answering}>
                  <View
                    style={{
                      width: 20,
                      height: 20,
                      backgroundColor: "#5EB0E0",
                      borderRadius: 4,
                      marginRight: 16,
                    }}
                  ></View>
                  <Text
                    style={{
                      fontSize: 13,
                      fontFamily: "Rubik-Medium",
                    }}
                  >
                    Stop answering ...
                  </Text>
                </View>
              </View>
            )}
          </View>
  
          <View style={styles.inputField}>
            <View style={styles.inputCon}>
              <TextInput
                style={styles.input}
                value={text}
                onChangeText={handleChangeText}
                placeholder="What are you struggling with ..."
                autoFocus={false}
                multiline={true}
              />
              {text === "" && (
                <Image
                  style={{ width: 24, height: 16, marginHorizontal: 14 }}
                  source={VideoIcon}
                />
              )}
              {text === "" && (
                <Image
                  style={{}}
                  resizeMode="contain"
                  source={require("../../assets/icons/Microphone.png")}
                />
              )}
              {!(text === "") && (
                <TouchableOpacity onPress={handleSubmit}>
                  <Image
                    style={{ width: 28, height: 28, marginLeft: 14 }}
                    resizeMode="contain"
                    source={require("../../assets/icons/send.png")}
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }

const styles = StyleSheet.create({
  container: {
    paddingTop: 14,
    backgroundColor: "#E1F4F9",
    flex: 1,
  },
  Header: {
    width: "100%",
    height: 90,
    justifyContent: "center",
    alignItems: "center",
  },
  HeaderLogo: {
    height: 40,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  HeaderLbl: {
    justifyContent: "center",
  },
  headerlbltxt: {
    fontSize: 24,
    fontFamily: "Rubik-Medium",
  },
  chatContainer: {
    flex: 1,
    marginTop: 34,
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  inputField: {
    height: height > 900 ? 200 :height > 740 && height < 899 ? 200 : 88,
    width: "100%",
    backgroundColor: "#DAECF7",
    paddingVertical: 12,
    paddingHorizontal: 16,
    bottom: 0,
    position:"fixed"
  },
  inputCon: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    height: 64,
    borderRadius: 40,
    paddingHorizontal: 24,
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    fontSize: 16,
    fontFamily: "Rubik-Regular",
    flex: 1,
  },
  bot_msg: {
    borderRadius: 16,
    backgroundColor: "#fff",
    padding: 16,
    width: "100%",
  },
  user_msg: {
    borderRadius: 16,
    padding: 16,
    width: "100%",
    marginVertical: 16,
  },
  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
  },
  answeringCon: {
    position: "relative",
    bottom: 250,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  answering: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    zIndex: 999,
    borderRadius: 8,
    paddingHorizontal: 53,
    paddingVertical: 19,
  },
  Chatbox: {
    flex: 1,
    position: "relative",
    paddingBottom: 7,
  },
});