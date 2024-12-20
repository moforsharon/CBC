import React, { useState, useEffect, useRef, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Keyboard,
  Animated,
  StatusBar,
  Dimensions,
} from "react-native";
// import { useRouter } from "expo-router";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { Link } from "expo-router";
import { AppContext } from "../../App";
import AsyncStorage from "@react-native-async-storage/async-storage";
// import { useNavigation } from "expo-router";
import { useNavigation } from "@react-navigation/native"; 
import { PlusIcon, ShareIcon, ArchiveBoxArrowDownIcon } from "react-native-heroicons/solid";
import axios from "axios";


const { height: screenHeight } = Dimensions.get("window");
export default function SideMenu() {
  // const router = useRouter();
  const navigation = useNavigation();

  const { menuOpen, setMenuOpen, user, setUser , recentChats} = useContext(AppContext);
  const position = useRef(new Animated.ValueXY({ x: -360, y: 0 })).current;
  const [statusBarHeight, setStatusBarHeight] = useState(0);
  const [height, setHeight] = useState(100);

  useEffect(() => {
   
    // Subtract 20% from the screen height
    StatusBar.currentHeight && setStatusBarHeight(StatusBar.currentHeight);
    
      setHeight(screenHeight);
      // Fetch chats from API
      
      }, []);

    useEffect(() => {
      console.log("Recent chats from side bar is:", recentChats);
    }, [1]);

    useEffect(() => {
      console.log("Recent chats from side bar is:", recentChats);
    }, [1]);

  const SignMeOut = async () => {
    try {
      await AsyncStorage.removeItem("user_id", null);
      setUser(null);
      setMenuOpen(false);
      navigation.reset({
        index: 0,
        routes: [{ name: "Landing" }], // your stack screen name
      });

      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  };
  useEffect(() => {
    if (menuOpen) {
      moveRight();
    }
    if (!menuOpen) {
      // Animated.timing(position, {
      //   toValue: { x: -360, y: 0 },
      //   duration: 1000,
      //   useNativeDriver: false,
      // }).start();
    }
  }, [menuOpen]);
  const moveRight = () => {
    Animated.timing(position, {
      toValue: { x: 0, y: 0 },
      duration: 500,
      useNativeDriver: false,
    }).start();
  };

  const moveLeft = (to) => {
    Animated.timing(position, {
      toValue: { x: -360, y: 0 },
      duration: 500,
      useNativeDriver: false,
    }).start(() => {
      setMenuOpen(false);
    });
  };
  return (
    <View
      style={[
        styles.mainbox,
        {
          marginTop: statusBarHeight,
          height: height,
          display: menuOpen ? "flex" : "none",
        },
      ]}
    >
      <TouchableOpacity
        style={{ flex: 1 }}
        activeOpacity={1}
        onPress={() => {
          moveLeft();
        }}
      />
      <Animated.View
        style={[
          styles.box,
          {
            transform: position.getTranslateTransform(),
          },
        ]}
      >
        <TouchableOpacity
          onPress={() => moveLeft()}
          style={{
            width: 32,
            height: 32,
            position: "absolute",
            top: 15,
            right: 15,
          }}
        >
          <Image source={require("../../assets/icons/close.png")} />
        </TouchableOpacity>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: 25,
            marginLeft: 24,
          }}
        >
          <Image
            source={require("../../assets/logo40.png")}
            style={{ width: 50, height: 50 }}
          />

          <Text
            style={{
              fontSize: 30,
              fontFamily: "Rubik-Medium",
              color: "#000",
              marginLeft: 10,
            }}
          >
            CBC
          </Text>
        </View>
        <View
          style={[
            styles.container,
            { marginRight:  112 }, // pr-28 in tailwind translates to 112px
          ]}
        >
          <TouchableOpacity
            onPress={() => {
              // setSelectedItem(0);
              // dispatch(closeSidebar());
              moveLeft();
              navigation.navigate('Chat')
            }}
            style={[
              styles.button,
              styles.expandedButton,
            ]}
          >
            <PlusIcon style={[styles.icon, { marginLeft: 8 }]} />
            <Text style={styles.text}>New Chat</Text>
          </TouchableOpacity>
        </View>

        <View
          style={{
            marginTop: 40,
            marginHorizontal: 20,
          }}
        >
          <Text style={styles.chatDate}>Recent Chats</Text>
        </View>

        <ScrollView
          style={styles.chatSection}
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
        >
          {recentChats.map((group, index) => (
            <View key={index} style={styles.chatGroup}>
              <Text style={styles.chatDate}>{group.date}</Text>
              {group.chats.map((chat) => (
                <TouchableOpacity
                  key={chat.id}
                  style={styles.chatItem}
                  onPress={() => {
                    moveLeft();
                    navigation.navigate("Chat", { chatId: chat.id });
                  }}
                >
                  <View style={styles.chatRow}>
                    <View style={styles.chatTitleContainer}>
                      <Text style={styles.chatTitle}  numberOfLines={1} >{chat.title}</Text>
                    </View>
                    <View style={styles.iconsContainer}>
                      {/* <TouchableOpacity onPress={() => console.log("Share pressed")}>
                        <ShareIcon style={[styles.icon, { marginLeft: 8 }]} />
                      </TouchableOpacity> */}
                      <TouchableOpacity onPress={() => console.log("Archive pressed")}>
                        <ArchiveBoxArrowDownIcon  style={[styles.icon, { marginLeft: 8, color: "black" }]}/>
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </ScrollView>

        {user == null ? (
          <View
            style={{ position: "relative", bottom: 8, left: 24, width: "80%" }}
          >
            {/* <TouchableOpacity
              onPress={() => {
                moveLeft();
                navigation.navigate('Chat');
              }}
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 20,
                width: "100%",
              }}
            >
              <Image
                source={require("../../assets/icons/chat.png")}
                style={{ width: 24, height: 24 }}
              />

              <Text
                style={{
                  fontSize: 20,
                  fontFamily: "Rubik-Regular",
                  color: "#000",
                  marginLeft: 10,
                }}
              >
                Chat
              </Text>
            </TouchableOpacity> */}
            <TouchableOpacity
              onPress={() => {
                moveLeft();
                navigation.navigate('Library')
              }}
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 20,
                width: "100%",
              }}
            >
              <Image
                source={require("../../assets/books.png")}
                style={{ width: 24, height: 24 }}
              />

              <Text
                style={{
                  fontSize: 20,
                  fontFamily: "Rubik-Regular",
                  color: "#000",
                  marginLeft: 10,
                }}
              >
                Library
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                moveLeft();
                navigation.navigate('Signin');
              }}
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 20,
                width: "100%",
              }}
            >
              <Image
                source={require("../../assets/icons/signin.png")}
                style={{ width: 24, height: 24 }}
              />

              <Text
                style={{
                  fontSize: 20,
                  fontFamily: "Rubik-Regular",
                  color: "#000",
                  marginLeft: 10,
                  width: "100%",
                }}
              >
                Sign In
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                moveLeft();
                navigation.navigate('Signup');
              }}
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <Image
                source={require("../../assets/icons/signin.png")}
                style={{ width: 24, height: 24 }}
              />

              <Text
                style={{
                  fontSize: 20,
                  fontFamily: "Rubik-Regular",
                  color: "#000",
                  marginLeft: 10,
                }}
              >
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View
            style={{ position: "relative", bottom: 8, left: 24, width: "80%" }}
          >
            {/* <TouchableOpacity
              onPress={() => {
                moveLeft();
                navigation.navigate('Chat')
              }}
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 20,
                width: "100%",
              }}
            >
              <Image
                source={require("../../assets/icons/chat.png")}
                style={{ width: 24, height: 24 }}
              />

              <Text
                style={{
                  fontSize: 20,
                  fontFamily: "Rubik-Regular",
                  color: "#000",
                  marginLeft: 10,
                }}
              >
                Chat
              </Text>
            </TouchableOpacity> */}
            <TouchableOpacity
              onPress={() => {
                moveLeft();
                navigation.navigate('Library')
              }}
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 20,
                width: "100%",
              }}
            >
              <Image
                source={require("../../assets/books.png")}
                style={{ width: 24, height: 24 }}
              />

              <Text
                style={{
                  fontSize: 20,
                  fontFamily: "Rubik-Regular",
                  color: "#000",
                  marginLeft: 10,
                }}
              >
                Library
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => SignMeOut()}
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 20,
                width: "100%",
              }}
            >
              <Image
                source={require("../../assets/icons/signin.png")}
                style={{ width: 24, height: 24 }}
              />

              <Text
                style={{
                  fontSize: 20,
                  fontFamily: "Rubik-Regular",
                  color: "#000",
                  marginLeft: 10,
                }}
              >
                Sign Out
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainbox: {
    width: "100%",

    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    position: "absolute",
    top: 0,
    zIndex: 10000000,
  },
  box: {
    width: "80%",
    maxWidth: 340,
    flex: 1,
    // height: "106%",
    height: "100%",

    backgroundColor: "#e1f4f9",
    borderTopRightRadius: 15,
    position: "absolute",
    top: 0,
    // position: "absolute",
    // top: 0,
    // zIndex: 10000000,
  },
  text: {
    color: "white",
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    marginTop: 20,
  },
  button: {
    backgroundColor: "lightgray",
    padding: 10,
    marginHorizontal: 10,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 16,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuBar: { marginHorizontal: 24 },
  logoText: {
    fontSize: 24,
    fontFamily: "Rubik-SemiBold",
    color: "#fff",
    marginHorizontal: 6,
  },
  chatSection: {
    marginTop: 8,
    marginBottom: 30,
    marginHorizontal: 20,
    flex: 1, // Allows it to grow within its parent
    overflow: "hidden", // Prevents content from visually spilling over
    height: 40
  },
  
  chatGroup: {
    marginBottom: 20,
  },
  chatDate: {
    fontSize: 16,
    fontFamily: "Rubik-Bold",
    color: "#000",
    marginBottom: 10,
  },
  chatItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  chatRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chatTitleContainer: {
    flex: 1,
  },
  iconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: 60, // adjust width as needed
  },
  chatTitle: {
    fontSize: 16,
    fontFamily: "Rubik-Regular",
    color: "#333",
  },
  chatTimestamp: {
    fontSize: 14,
    fontFamily: "Rubik-Light",
    color: "#888",
  },
  container: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 40, // mt-4 in tailwind
    marginHorizontal: 15
  },
  button: {
    borderRadius: 10, // rounded-full in tailwind
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0C3948", // Adjust for your "bg-secondary bg-opacity-40" color
  },
  collapsedButton: {
    justifyContent: "center",
    padding: 12, // p-3 in tailwind
  },
  expandedButton: {
    paddingVertical: 12, // py-3 in tailwind
    paddingHorizontal: 8, // px-2 in tailwind
    width: "95%", // w-[95%] in tailwind
    gap: 4, // gap-4 in tailwind
  },
  icon: {
    width: 16, // w-4 in tailwind
    height: 16, // h-4 in tailwind
    color: "white"
  },
  text: {
    color: "white",
    fontSize: 14, // Adjust variant="small" to a size you need
    marginBottom: 0, // Equivalent to mb-[0px!important]
  },
});
