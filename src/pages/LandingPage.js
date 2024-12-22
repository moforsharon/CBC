import React, {useContext, useEffect, useCallback, useState} from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions, Modal, FlatList, ScrollView} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { VStack, HStack } from "native-base";
import { useNavigation } from '@react-navigation/native';
import { AppContext } from "../../App";
import { useFocusEffect } from '@react-navigation/native';
import { ArchiveBoxArrowDownIcon, ArchiveBoxIcon, LightBulbIcon } from "react-native-heroicons/outline";

// Dummy data for archived chats
// const archivedChats = [
//   { id: '1', title: 'John Doe' },
//   { id: '2', title: 'Jane Smith' },
//   { id: '3', title: 'Bob Johnson' },
//   { id: '4', title: 'Alice Brown' },
//   { id: '5', title: 'Charlie Wilson' },
//   { id: '6', title: 'Diana Taylor' },
//   { id: '7', title: 'Edward Moore' },
//   { id: '8', title: 'Fiona Clark' },
//   { id: '9', title: 'George Adams' },
//   { id: '10', title: 'Hannah Lewis' },
// ];

const { height, width } = Dimensions.get('window');

export default function Page() {
  const { data, setData, setMenuOpen, menuOpen, currentChatSummary, setCurrentChatSummary, user, recentChats, setRecentChats, modalVisible, setModalVisible, archivedChats, setArchivedChats } = useContext(AppContext);
  const navigation = useNavigation();
  const [archivedChatsVersion, setArchivedChatsVersion] = useState(0);

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    fetchChats()
  };
      const fetchChats = async () => {
        try {
          const userId = user;
          console.log(`User id is : ${userId}`)
          if (userId) {
            const response = await fetch(
              "https://api.childbehaviorcheck.com/back/history/active_chats",
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
      const today = new Date();
      const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
    
      chats.forEach((chat) => {
        const chatDate = new Date(chat.created_at);
        let date;
    
        if (isSameDay(chatDate, today)) {
          date = "Today";
        } else if (isSameDay(chatDate, yesterday)) {
          date = "Yesterday";
        } else {
          date = formatChatDate(chatDate);
        }
    
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
    
    const isSameDay = (date1, date2) => {
      return (
        date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate()
      );
    };
    
    const formatChatDate = (date) => {
      const day = date.toLocaleString("en-US", { weekday: "short" });
      const month = date.toLocaleString("en-US", { month: "short" });
      const dayOfMonth = date.getDate();
      const year = date.getFullYear();
    
      return `${day}. ${month} ${dayOfMonth}, ${year}`;
    }
  
    useFocusEffect(
      useCallback(() => {
          fetchChats();
      }, [user]) // Dependencies: This ensures it re-fetches whenever user changes
  );

  // useEffect(() => {
  //   fetchChats();
  // }, [recentChats, archivedChats]);



  const unarchiveChat = async (chatSummaryId) => {
    try {
      setArchivedChats((prevChats) => prevChats.filter((chat) => chat.id !== chatId));
      const userId = user; // assuming 'user' is the current user ID
      const response = await fetch('https://api.childbehaviorcheck.com/back/history/unarchive_chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          userid: userId,
          chatsummaryid: chatSummaryId,
        },
      });
  
      if (response.ok) {
        // Remove unarchived chat from list
        // setArchivedChats(archivedChats.filter((chat) => chat.id !== chatSummaryId));
        // setArchivedChats((prevChats) => {
        //   const updatedChats = prevChats.filter((chat) => chat.id !== chatSummaryId);
        //   return updatedChats;
        // });  

        setArchivedChatsVersion((prevVersion) => prevVersion + 1); // Increment version

      } else {
        console.error('Error unarchiving chat:', await response.text());
      }
    } catch (error) {
      console.error('Error unarchiving chat:', error);
    }
  };
  // useEffect(() => {
  //   fetchArchivedChats();
  // }, [archivedChatsVersion, recentChats]);

  const renderItem = ({ item }) => (
    <View style={styles.listItem}>
      <Text style={styles.listItemTitle}>{item.title}</Text>
      <TouchableOpacity onPress={() => unarchiveChat(item.id)}>
        <ArchiveBoxIcon style={styles.unarchiveIcon} />
      </TouchableOpacity>
    </View>
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


        <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Archived chats</Text>
            <View style={styles.subtextContainer}>
              <LightBulbIcon style={styles.lightBulbIcon} />
              <Text style={styles.subtext}>
                To be able to view an archived chat content, first unarchive the chat
              </Text>
            </View>
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
              <FlatList
                data={archivedChats}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
              />
            </ScrollView>
            <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    width: '90%',
    maxHeight: '50%',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  lightBulbIcon: {
    width: 20,
    height: 20,
    marginRight: 5,
    color: 'black',
  },
  subtext: {
    fontSize: 14,
    color: 'gray',
  },
  scrollView: {
    maxHeight: '70%',
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
  },
  listItemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  unarchiveIcon: {
    width: 24,
    height: 24,
    color: 'black',
  },
  separator: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 5,
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#27AFDE',
    borderRadius: 10,
    padding: 10,
    elevation: 2,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
