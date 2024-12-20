import React, {useContext, useEffect, useCallback} from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { VStack, HStack } from "native-base";
import { useNavigation } from '@react-navigation/native';
import { AppContext } from "../../App";
import { useFocusEffect } from '@react-navigation/native';

const { height, width } = Dimensions.get('window');

export default function Page() {
  const { data, setData, setMenuOpen, menuOpen, currentChatSummary, setCurrentChatSummary, user, recentChats, setRecentChats } = useContext(AppContext);
  const navigation = useNavigation();


      const fetchChats = async () => {
        try {
          const userId = user;
          console.log(`User id is : ${userId}`)
          if (userId) {
            const response = await fetch(
              "https://api.childbehaviorcheck.com/back/history/get-user-chat-summaries",
              {
                method: "POST",
                headers: {
                  userid: userId,
                },
              }
            );
    
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            const data = await response.json();
            console.log("user chat summaries:", data)
    
            // Transform data into grouped chats by date
            const groupedChats = groupChatsByDate(data);
            setRecentChats(groupedChats);
          }
        } catch (error) {
          console.error("Error fetching chat summaries:", error);
        }
      };

  
    useEffect(() => {
      console.log("Recent chats:", recentChats);
    }, [recentChats]);
  
    const groupChatsByDate = (chats) => {
      const grouped = {};
  
      chats.forEach((chat) => {
        const date = new Date(chat.created_at).toLocaleDateString();
        if (!grouped[date]) {
          grouped[date] = [];
        }
        grouped[date].push({
          id: chat.chat_summary_id,
          title: chat.chat_summary,
        });
      });
  
      return Object.keys(grouped).map((date) => ({
        date,
        chats: grouped[date],
      }));
    };
  
    useFocusEffect(
      useCallback(() => {
          fetchChats();
      }, [user]) // Dependencies: This ensures it re-fetches whenever user changes
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Section */}
      <HStack style={styles.headerRow} alignItems="center">
        <TouchableOpacity onPress={() => setMenuOpen(true)}>
          <Image
            source={require("../../assets/icons/menu.png")}
            style={{ width: 32, height: 32 }}
          />
        </TouchableOpacity>
        <Image
          source={require("../../assets/logo40.png")}
          style={styles.logo}
        />
        <Text style={styles.logoText}>CBC</Text>
        <View style={styles.BetaCon}>
          <Text style={styles.BetaText}>Beta</Text>
        </View>
      </HStack>
      {/* Image and Sample Message Section */}
      <VStack style={styles.imgInfoCon} space={4}>
        <Image
          source={require("../../assets/child.png")}
          style={styles.child}
        />
        <View style={styles.sampleMsgCon}>
          <HStack style={styles.sampleMsgConCon} alignItems="center" space={3}>
            <Image
              source={require("../../assets/women.png")}
              style={styles.sampleMsgImg}
            />
            <Text style={styles.sampleMsgTxt}>
              What are some effective methods of disciplining a child who
              refuses to listen and cries instead of following directions?
            </Text>
          </HStack>
        </View>
      </VStack>

      {/* Details Section */}
      <VStack style={styles.detailsCon} space={2}>
        <Text style={styles.mainDetail}>CBC</Text>
        <Text style={styles.submainDetail}>Child Behavior Check-in</Text>
        <Text style={styles.textDetail}>
          Collaborate with CBC to offer guidance and support for a variety of
          behavioral needs.
        </Text>
      </VStack>

      {/* Bottom Button Section */}
      <View style={styles.BtmBtnCon}>
        <TouchableOpacity onPress={() => {
              setCurrentChatSummary(0);
              navigation.navigate('Chat');
            }} 
            style={styles.BtmBtn}>
          <Text style={styles.buttonText}>Talk to me</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#0C3948",
    flex: 1,
    justifyContent: "space-between",
    paddingBottom: height > 900 ? 95 :height > 740 && height < 899 ? 60 : 10,
    paddingTop: 30
  },
  headerRow: {
    padding: 10,
    justifyContent: "start",
  },
  logo: {
    width: 35,
    height: 35,
    resizeMode: "contain",
    marginLeft: 10
  },
  logoText: {
    fontSize: 24,
    fontFamily: "Rubik-SemiBold",
    color: "#fff",
    marginHorizontal: 6,
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
  imgInfoCon: {
    width: "100%",
    paddingHorizontal: 16,
    marginTop: 30,
    flex: 1,
  },
  child: {
    borderRadius: 24,
    width: "100%",
    height: height > 740? 340: 200,
    resizeMode: "cover",
  },
  sampleMsgCon: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    bottom: 70
  },
  sampleMsgConCon: {
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 24,
    width: "80%",
  },
  sampleMsgImg: {
    width: 51,
    height: 51,
  },
  sampleMsgTxt: {
    fontSize: 13,
    fontFamily: "Rubik-Regular",
    flex: 1,
  },
  detailsCon: {
    paddingHorizontal: 24,
    marginTop: 50,
    position: "relative",
    bottom: 80
  },
  mainDetail: {
    fontSize: 50,
    lineHeight: 50,
    fontFamily: "Rubik-Bold",
    color: "#fff",
  },
  submainDetail: {
    fontSize: 17,
    fontFamily: "Rubik-Medium",
    color: "#fff",
  },
  textDetail: {
    fontSize: 15,
    fontFamily: "Rubik-Regular",
    color: "#fff",
    maxWidth: "70%",
  },
  BtmBtnCon: {
    width: "100%",
    alignItems: "center",
    marginBottom: 23,
    marginTop: height === 914 ? 75 :height > 740 && height < 914 ? 20 : 0,
  },
  BtmBtn: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
  },
  buttonText: {
    color: "#27AFDE",
    fontSize: 16,
    fontFamily: "Rubik-Regular",
  },
});
