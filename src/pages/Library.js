import React, {useContext, useEffect, useState} from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions, ScrollView, Modal } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { VStack, HStack } from "native-base";
import { useNavigation } from '@react-navigation/native';
import { AppContext } from "../../App";
import { Viewer, Worker, SpecialZoomLevel } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import "@react-pdf-viewer/zoom/lib/styles/index.css";
import { WebView } from 'react-native-webview';


const { height, width } = Dimensions.get('window');

// const zoomPluginInstance = zoomPlugin();

const pdfData = [
    { id: 1, title: "ABCs of Behavior.pdf", image: require("../../assets/icons/menu.png"), link: "https://cbc-proxy-server.vercel.app/api/proxy/pdf?id=1osa0YZNm4IrozVbOyasQzM3Fhss9soBC" },
    { id: 2, title: "Ask for Something.pdf", image: require("../../assets/icons/menu.png"), link: "https://cbc-proxy-server.vercel.app/api/proxy/pdf?id=10jdDkjE5tQRoNZmavaANstKfC5_m3YQ7" },
];


export default function Library() {

    const { data, setData, setMenuOpen, menuOpen } = useContext(AppContext);
    const navigation = useNavigation();

    const [isWatchVideos, setIsWatchVideos] = useState(true);
    const [isSeeIllustrations, setIsSeeIllustrations] = useState(false);

    const [isModalVisible, setModalVisible] = useState(false);
    const [selectedPdf, setSelectedPdf] = useState(null);

    const [scale, setScale] = useState(SpecialZoomLevel.PageWidth); // Initial zoom level
  
    const openPdf = (pdfLink) => {
      setSelectedPdf(pdfLink);
      setModalVisible(true);
    };

    return (
        <SafeAreaView style={styles.container}>
            <VStack height={height} width={width}>
                {/*Header*/}
                <View style={styles.Header}>
                    <View style={styles.HeaderLogo}>
                        <TouchableOpacity onPress={() => navigation.navigate('Landing')}>
                        <Image
                            source={require("../../assets/icons/back.png")}
                            style={{width:32, height:32}}
                            
                        />
                        </TouchableOpacity>
                        <Text style={styles.headerlbltxt}>Behavior Support Plan</Text>
                        <View style={{width:32, height:32}}></View>
                    </View>
                </View>
                {/*Heading tabs*/}
                <HStack style={styles.headingTabs}>
                    <TouchableOpacity
                        style={{
                            borderLeftWidth: isWatchVideos? 2 : 0,
                            borderRightWidth: isWatchVideos? 2 : 0,
                            borderBottomWidth: isWatchVideos? 0 : 2,
                            borderTopWidth: isWatchVideos? 2 : 0,
                            borderBottomColor: isSeeIllustrations? '#6A91E0' : '#E0AB65',
                            borderRightColor: "#E0AB65",
                            borderLeftColor: "#E0AB65",
                            borderTopColor: "#E0AB65",
                            borderTopEndRadius: 10,
                            borderTopLeftRadius: 10,
                            width: "50%", justifyContent: 'center', alignItems: 'center', paddingVertical:'10px'}} 
                        onPress={() => [
                            setIsSeeIllustrations(false),
                            setIsWatchVideos(true)
                        ]}
                    >
                        <Text style={styles.headingTabOne}>Watch videos</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={{
                            borderLeftWidth: isSeeIllustrations? 2 : 0,
                            borderRightWidth: isSeeIllustrations? 2 : 0,
                            borderBottomWidth: isSeeIllustrations? 0 : 2,
                            borderTopWidth: isSeeIllustrations? 2 : 0,
                            borderBottomColor: isWatchVideos? '#E0AB65' : '#6A91E0',
                            borderRightColor: "#6A91E0",
                            borderLeftColor: "#6A91E0",
                            borderTopColor: "#6A91E0", 
                            borderTopEndRadius: 10,
                            borderTopLeftRadius: 10,
                            width: "50%", justifyContent: 'center', alignItems: 'center', paddingVertical:'10px'}} 
                        onPress={() => [
                            setIsWatchVideos(false),
                            setIsSeeIllustrations(true),
                        ]}
                    >
                        <Text style={styles.headingTabTwo}>See illustrations</Text>
                    </TouchableOpacity>
                </HStack>
                {/* Videos section */}
                {isWatchVideos && 
                    // <Text>h</Text>
                    <View
                        style={{
                            borderLeftWidth: 2,
                            borderRightWidth: 2,
                            borderBottomWidth: 2,
                            borderColor: "#E0AB65",
                            borderBottomRightRadius: 10,
                            borderBottomLeftRadius: 10,
                            marginHorizontal:'3%'
                        }}
                    >
                        <ScrollView style={styles.scrollContainer}>
                            <Text>Hi</Text>
                        </ScrollView>
                    </View>
                }
                {/* Pdfs section */}
                {isSeeIllustrations &&
                    <View
                        style={{
                            borderLeftWidth: 2,
                            borderRightWidth: 2,
                            borderBottomWidth: 2,
                            borderColor: "#6A91E0",
                            borderBottomRightRadius: 10,
                            borderBottomLeftRadius: 10,
                            marginHorizontal:'3%'
                        }}
                    >
                        <ScrollView style={styles.scrollContainer}>
                            {pdfData.map((pdf) => (
                                <TouchableOpacity key={pdf.id} style={styles.card} onPress={() => openPdf(pdf.link)}>
                                    <Image source={pdf.image} style={styles.cardImage} />
                                    <Text style={styles.cardTitle}>{pdf.title}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                }
                {/* Modal */}
                <Modal visible={isModalVisible} animationType="slide" onRequestClose={() => setModalVisible(false)}>
                    <View style={styles.modalContainer}>
                    <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                        <Text style={styles.closeButtonText}>X</Text>
                    </TouchableOpacity>
                        {/* {selectedPdf && (
                            <div style={styles.pdf}>
                                <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                                    <Viewer fileUrl={selectedPdf}/>
                                </Worker>
                            </div>
                        )} */}
                        {selectedPdf && (
                            <WebView
                                source={{ uri: selectedPdf }}
                                style={styles.pdf}
                                javaScriptEnabled={true}
                                scalesPageToFit={true}
                                bounces={false}
                                scrollEnabled={true}
                            />
                        )}
                    </View>
                </Modal>
            </VStack>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#F0F4F7",
        flex: 1,
        justifyContent: "space-between",
        position: "relative"
    },
    Header: {
        width: "100%",
        height: 90,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F2F6F8",
        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
        
      },
      HeaderLogo: {
        height: 40,
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

      headingTabs: {
        width: "100%",
        height: 40,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: '3%',
        marginTop: '5%'
      },
      headingTabOne:{
        fontSize: 18,
        fontFamily: "Rubik-Regular",
        color: '#E0AB65'
      },
      headingTabTwo:{
        fontSize: 18,
        fontFamily: "Rubik-Regular",
        color: '#6A91E0'
      },
      scrollContainer: {
        flexGrow: 1,
        paddingHorizontal: 16,
        marginTop: 10,
      },
      card: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        padding: 10,
        marginBottom: 10,
        borderRadius: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
      },
      cardImage: {
        width: 50,
        height: 50,
        marginRight: 10,
      },
      cardTitle: {
        fontSize: 16,
      },
      modalContainer: {
        flex: 1,
        flexDirection: 'column',

        backgroundColor: "#fff",
        padding: 20,
        justifyContent: "center",
        alignItems: "center",
        textAlign: 'center'
    },
    closeButton: {
        position: "absolute",
        top: 20,
        right: 20,
        backgroundColor: "rgba(0,0,0,0.5)",
        paddingTop: 10,
        paddingBottom: 10,
        borderRadius: 30,
        paddingRight: 15,
        paddingLeft: 15,
        zIndex: 1,
    },
      closeButtonText: {
        color: "#fff",
        fontSize: 18,
      },
      pdf: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
      },
});