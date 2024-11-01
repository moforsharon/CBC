import React, {useContext, useEffect, useState} from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions, ScrollView, Modal, Platform, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { VStack, HStack } from "native-base";
import { useNavigation } from '@react-navigation/native';
import { AppContext } from "../../App";
import { Viewer, Worker, SpecialZoomLevel } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import "@react-pdf-viewer/zoom/lib/styles/index.css";
import { zoomPlugin, Zoom } from '@react-pdf-viewer/zoom';
import { WebView } from 'react-native-webview';

const { height, width } = Dimensions.get('window');

const pdfData = [
    { id: 1, title: "ABCs of Behavior.pdf", link: "https://cbc-proxy-server.vercel.app/api/proxy/pdf?id=1osa0YZNm4IrozVbOyasQzM3Fhss9soBC" },
    { id: 2, title: "Ask for Something.pdf", link: "https://cbc-proxy-server.vercel.app/api/proxy/pdf?id=10jdDkjE5tQRoNZmavaANstKfC5_m3YQ7" },
    { id: 3, title: "Ask for Time with You.pdf", link: "https://cbc-proxy-server.vercel.app/api/proxy/pdf?id=1MHHhuTVsWrUsoLt1cxogtOFHoWesZQ88" },
    { id: 4, title: "Ask to be Done.pdf", link: "https://cbc-proxy-server.vercel.app/api/proxy/pdf?id=1EFs2c4s3Q2D1r2kdWET0hJjZVotZcYVT" },
    { id: 5, title: "Avoid Attending.pdf", link: "https://cbc-proxy-server.vercel.app/api/proxy/pdf?id=1MIe92xeqZUwAsNQzhpLa1NCjUQutTyXy" },
    { id: 6, title: "Behavior Expectations.pdf", link: "https://cbc-proxy-server.vercel.app/api/proxy/pdf?id=1YirIrsRmA8u5hpJ4wrqZ-OlG4JVS5695" },
    { id: 7, title: "Choices of Demand.pdf", link: "https://cbc-proxy-server.vercel.app/api/proxy/pdf?id=1Qv3C9JmgvRbtk0YFskh9nBNcw3HP71TN" },
    { id: 8, title: "Delay Access.pdf", link: "https://cbc-proxy-server.vercel.app/api/proxy/pdf?id=1QExZhRjtBBoSdzFMFyPIAXSUoUmYx1FL" },
    { id: 9, title: "First-Then.pdf", link: "https://cbc-proxy-server.vercel.app/api/proxy/pdf?id=14bfjvye1SytYuFpkBNnV-DXxo_POMcCz" },
    { id: 10, title: "Follow Directions.pdf", link: "https://cbc-proxy-server.vercel.app/api/proxy/pdf?id=1_mhBfT60dXNY9b75jide5_zhsvF4jcNg" },
    { id: 11, title: "Following Child's Lead.pdf", link: "https://cbc-proxy-server.vercel.app/api/proxy/pdf?id=1guc2CYxaPP0pdfiyMIeRFoVcZJFkTESR" },
    { id: 12, title: "Give Choices.pdf", link: "https://cbc-proxy-server.vercel.app/api/proxy/pdf?id=1SMBPFEuro__6vNJ8a6RvESacGoDQ1X9T" },
    { id: 13, title: "Give Transition Warnings.pdf", link: "https://cbc-proxy-server.vercel.app/api/proxy/pdf?id=10fkyNj36nM7xeZlXJpAOPJIPLf3dMMwZ" },
    { id: 14, title: "Help Once Calm.pdf", link: "https://cbc-proxy-server.vercel.app/api/proxy/pdf?id=13oOjdlie9r0eoYauLMvXlRoN-KFZp4xL" },
    { id: 15, title: "Hot Buttons.pdf", link: "https://cbc-proxy-server.vercel.app/api/proxy/pdf?id=1PWpqY_KjsD17K1qraBtcz3CgkR2EmnHn" },
    { id: 16, title: "Importance of Language.pdf", link: "https://cbc-proxy-server.vercel.app/api/proxy/pdf?id=1HiVKK3SG4iXRsfV0UoLWNjau033R0Lye" },
    { id: 17, title: "Keeping it Positive.pdf", link: "https://cbc-proxy-server.vercel.app/api/proxy/pdf?id=1EBk3tRA-NcT3Lp7ciArN54NrdqNOKwcL" },
    { id: 18, title: "Make Choices.pdf", link: "https://cbc-proxy-server.vercel.app/api/proxy/pdf?id=1Qm3IuRWzRvJiQ0Gk1cytl6Ryubi6pujW" },
    { id: 19, title: "Modeling and Labeling Feelings.pdf", link: "https://cbc-proxy-server.vercel.app/api/proxy/pdf?id=1TRZ7EuEQvUDDy2fO4qXZVXly5WWMH2M2" },
    { id: 20, title: "Play Alone.pdf", link: "https://cbc-proxy-server.vercel.app/api/proxy/pdf?id=1BfRn4GvqoYin0umAMxq0-6i_etT5VvfK" },
    { id: 21, title: "Playing with Your Child.pdf", link: "https://cbc-proxy-server.vercel.app/api/proxy/pdf?id=1eb7O-d56_UvFICxXjBcuwTqCDAVMaupN" },
    { id: 22, title: "Positive Attention.pdf", link: "https://cbc-proxy-server.vercel.app/api/proxy/pdf?id=1HHofnaBA55irvIzC5UTsOQLrVQptIY2c" },
    { id: 23, title: "Positive Descriptive Feedback.pdf", link: "https://cbc-proxy-server.vercel.app/api/proxy/pdf?id=1E61yu58tdvLSGWgaBpH-jXUWrI6uPGEX" },
    { id: 24, title: "Prompt Follow Through.pdf", link: "https://cbc-proxy-server.vercel.app/api/proxy/pdf?id=1WBd5sptXoKUnnOei96Rr1Iz4t2ZU0jL2" },
    { id: 25, title: "Prompts.pdf", link: "https://cbc-proxy-server.vercel.app/api/proxy/pdf?id=1-AoJW2QsF77ArCmqhldb-GjlHvZL6LvZ" },
    { id: 26, title: "Quality Time.pdf", link: "https://cbc-proxy-server.vercel.app/api/proxy/pdf?id=1bfGIYxaCJFTIQ9Ew1BW4jscuWsDS3sBU" },
    { id: 27, title: "Redirections.pdf", link: "https://cbc-proxy-server.vercel.app/api/proxy/pdf?id=1jsfaOggQtAjE0vxGdsq9ZEKfSyYyYQX9" },
    { id: 28, title: "Stay Calm, Protect, Reconnect.pdf", link: "https://cbc-proxy-server.vercel.app/api/proxy/pdf?id=1HAn_iu6ZeoPzFKLI0FYHw3c0ypcoyEtu" },
    { id: 29, title: "Take Turns.pdf", link: "https://cbc-proxy-server.vercel.app/api/proxy/pdf?id=1OeE-8jFkksiH8gEbQ8Mp4M9IKO4cG86t" },
    { id: 30, title: "Taking Care of Yourself.pdf", link: "https://cbc-proxy-server.vercel.app/api/proxy/pdf?id=1OE1biXrzwfZ_J6ka6hUpViE4TY48ym-s" },
    { id: 31, title: "Validating Feelings.pdf", link: "https://cbc-proxy-server.vercel.app/api/proxy/pdf?id=15n73qH-7lXqGoUsJ7ZPozFBpP6VPmGqX" },
    { id: 32, title: "Verbal Reminder.pdf", link: "https://cbc-proxy-server.vercel.app/api/proxy/pdf?id=1u5VhR2heZ2HgRkJHiWNDTiz4ihWpTVg4" },
    { id: 33, title: "Visual Daily Schedule.pdf", link: "https://cbc-proxy-server.vercel.app/api/proxy/pdf?id=1hiEEStknMkIN7xIMLJmL0dvS-aS4bel4" }
];

const videoData = [
    { id: 1, title: "ABCs of Behavior.mp4", link: "https://cbc-proxy-server.vercel.app/api/proxy/video?id=16C62vJAoUHc-FULdO7c-u-ycECLTt9YY" },
    { id: 2, title: "Ask for Something.mp4", link: "https://cbc-proxy-server.vercel.app/api/proxy/video?id=1uXyfIwcVtC3FLf7--jliCWucphPoJijU" },
    { id: 3, title: "Ask for Time with You.mp4", link: "https://cbc-proxy-server.vercel.app/api/proxy/video?id=1twV9UjwoGoXQBsZW8JI5IiuDULi7ejA9" },
    { id: 4, title: "Ask to be Done.mp4", link: "https://cbc-proxy-server.vercel.app/api/proxy/video?id=1JJKzu5IMxxL0CffKP7fF6-utyB1rBoY4" },
    { id: 5, title: "Avoid Attending.mp4", link: "https://cbc-proxy-server.vercel.app/api/proxy/video?id=16O0Jhzcwh0jBXl6tUtBp9ZUYQWWC11_j" },
    { id: 6, title: "Behavior Support Plan.mp4", link: "https://cbc-proxy-server.vercel.app/api/proxy/video?id=1NOmzzqdHd_b30Kfszqk-di0zsn25Ja3d" },
    { id: 7, title: "Choices of Demands.mp4", link: "https://cbc-proxy-server.vercel.app/api/proxy/video?id=1o2gWLTM7nBwPeW4mfRGW5Yj9AhjBmQ2O" },
    { id: 8, title: "Delay Access.mp4", link: "https://cbc-proxy-server.vercel.app/api/proxy/video?id=1o2gWLTM7nBwPeW4mfRGW5Yj9AhjBmQ2O" },
    { id: 9, title: "Follow Directions.mp4", link: "https://cbc-proxy-server.vercel.app/api/proxy/video?id=1JiTdiA6jMruRLsvFEtPUtf6_QfjmerqW" },
    { id: 10, title: "Follow Your Child's Lead.mp4", link: "https://cbc-proxy-server.vercel.app/api/proxy/video?id=1uP1mEoVu7mnL5FU7j1FKENrbQWAe3rMK" },
    { id: 11, title: "Frequent Positive Attention.mp4", link: "https://cbc-proxy-server.vercel.app/api/proxy/video?id=1EJy5oZq9VL402jsQI3JWZl-E4zHUk76P" },
    { id: 12, title: "Give Choices.mp4", link: "https://cbc-proxy-server.vercel.app/api/proxy/video?id=1PUVN_wDVK_5wHAjyPEJrnp4gik8_2njy" },
    { id: 13, title: "Help When Calm.mp4", link: "https://cbc-proxy-server.vercel.app/api/proxy/video?id=1zmEI6e-Y9acATaAns4V8MbDSdqbFGpvf" },
    { id: 14, title: "Make choices.mp4", link: "https://cbc-proxy-server.vercel.app/api/proxy/video?id=1YOB8xBVQh_wZQ6jme8DOdUj3IbPJrtzQ" },
    { id: 15, title: "Play Alone.mp4", link: "https://cbc-proxy-server.vercel.app/api/proxy/video?id=1brZHcjjeEKtQfTj8bY4axVMmqcGq9Jam" },
    { id: 16, title: "Prompt Follow Through.mp4", link: "https://cbc-proxy-server.vercel.app/api/proxy/video?id=1eab5T5PImF0p2ARKRLpcORCAiIfbXPEJ" },
    { id: 17, title: "Take turns.mp4", link: "https://cbc-proxy-server.vercel.app/api/proxy/video?id=1y3QLYYowwE-lrxrrdBQQg3N_-14y0s9D" },
    { id: 18, title: "Transition Warnings.mp4", link: "https://cbc-proxy-server.vercel.app/api/proxy/video?id=1bkmKTOl4qb4S1QNnVfNZDgwt_vfX6g5l" },
    { id: 19, title: "Verbal Reminders.mp4", link: "https://cbc-proxy-server.vercel.app/api/proxy/video?id=110BztfZTRhPD3DnFkPn3EZTgr7tbMhv_" }
];

export default function Library() {

    const { data, setData, setMenuOpen, menuOpen } = useContext(AppContext);
    const navigation = useNavigation();

    const [isWatchVideos, setIsWatchVideos] = useState(true);
    const [isSeeIllustrations, setIsSeeIllustrations] = useState(false);

    const [isModalVisible, setModalVisible] = useState(false);
    const [selectedPdf, setSelectedPdf] = useState(null);
    const [selectedPdfTitle, setSelectedPdfTitle] = useState(null);
    const [selectedVideoTitle, setSelectedVideoTitle] = useState(null);
    const [isVideoModalVisible, setVideoModalVisible] = useState(false);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [loading, setLoading] = useState(true); // Loading state for video

    const [scale, setScale] = useState(SpecialZoomLevel.PageWidth); // Initial zoom level
  
    // Initialize zoomPlugin
    const zoomPluginInstance = zoomPlugin();
    const { ZoomIn, ZoomOut, ZoomPopover } = zoomPluginInstance;

    const openPdf = (pdfLink, pdfTitle) => {
      setSelectedPdf(pdfLink);
      setSelectedPdfTitle(pdfTitle)
      setModalVisible(true);
    };

    const openVideo = (videoLink, videoTitle) => {
        setSelectedVideo(videoLink);
        setSelectedVideoTitle(videoTitle)
        setLoading(true);
        setVideoModalVisible(true);
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
                        <Text style={styles.headerlbltxt}>Library</Text>
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
                            marginHorizontal:'3%',
                            height: '80%',
                            paddingVertical:10
                        }}
                    >
                        <ScrollView style={styles.scrollContainer}>
                            {videoData.map((video) => (
                                <TouchableOpacity key={video.id} style={styles.card} onPress={() => openVideo(video.link, video.title)}>
                                    <Image source={require('../../assets/icons/video-player.png')}  style={styles.cardImage} resizeMode="contain"/>
                                    <Text style={styles.cardTitle}>{video.title}</Text>
                                </TouchableOpacity>
                            ))}
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
                            marginHorizontal:'3%',
                            height: '80%',
                            paddingVertical:5
                        }}
                    >
                        <ScrollView style={styles.scrollContainer}>
                            {pdfData.map((pdf) => (
                                <TouchableOpacity key={pdf.id} style={styles.card} onPress={() => openPdf(pdf.link, pdf.title)}>
                                    <Image source={require('../../assets/icons/pdf.png')}  style={styles.cardImage} resizeMode="contain"/>
                                    <Text style={styles.cardTitle}>{pdf.title}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                }
                {/* Modal */}
                <Modal visible={isModalVisible} animationType="slide" onRequestClose={() => setModalVisible(false)}>
                    <VStack style={styles.modalContainer}>
                        {/* Header */}
                        <View style={styles.modalHeader}>
                            <View style={styles.modalHeaderContent}>
                                <TouchableOpacity onPress={() => setModalVisible(false)}>
                                    <Image
                                        source={require("../../assets/icons/back.png")}
                                        style={styles.backButton}
                                    />
                                </TouchableOpacity>
                                <Text style={styles.headerTitle}>{selectedPdfTitle}</Text>
                            </View>
                        </View>

                        {/* PDF Viewer */}
                        {selectedPdf && (
                            <View style={styles.pdfContainer}>
                                <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                                    <Viewer
                                        fileUrl={selectedPdf}
                                        plugins={[zoomPluginInstance]}
                                    />
                                </Worker>
                                {/* Zoom Controls */}
                                <View style={styles.zoomControlsContainer}>
                                    <View style={styles.zoomControls}>
                                        <ZoomOut />
                                        <ZoomPopover />
                                        <ZoomIn />
                                    </View>
                                </View>
                            </View>
                        )}
                    </VStack>
                </Modal>


                {/* Video Modal */}
                <Modal visible={isVideoModalVisible} animationType="slide" onRequestClose={() => setVideoModalVisible(false)}>
                    <VStack style={styles.modalContainer}>
                        {/* Video Player Header */}
                        <View style={styles.modalHeader}>
                            <View style={styles.modalHeaderContent}>
                                <TouchableOpacity onPress={() => setVideoModalVisible(false)}>
                                    <Image source={require("../../assets/icons/back.png")} style={styles.backButton} />
                                </TouchableOpacity>
                                <Text style={styles.headerTitle}>{selectedVideoTitle}</Text>
                            </View>
                        </View>
                        {loading && (
                            <ActivityIndicator size="small" color="gray" style={styles.spinner} />
                        )}
                        {/* Video Player */}
                        {Platform.OS === 'web' ? (
                            <iframe
                                src={selectedVideo}
                                style={styles.videoPlayer}
                                frameBorder="0"
                                allow="fullscreen"
                                onLoad={() => setLoading(false)} // Hide spinner once iframe loads
                            />
                        ) : (
                            <WebView
                                source={{ uri: selectedVideo }}
                                style={styles.videoPlayer}
                                allowsFullscreenVideo
                                onLoadEnd={() => setLoading(false)}
                            />
                        )}
                    </VStack>
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
        width: 32,
        height: 32,
        marginRight: 10,
      },
      cardTitle: {
        fontSize: 16,
      },
    //   modalContainer: {
    //     flex: 1,
    //     backgroundColor: "white",
    //     padding: 0,
    //     justifyContent: "center",
    //     alignItems: "center",
    //     textAlign: 'center'
    // },
    // closeButton: {
    //     position: "absolute",
    //     top: 20,
    //     right: 20,
    //     backgroundColor: "rgba(0,0,0,0.5)",
    //     paddingTop: 10,
    //     paddingBottom: 10,
    //     borderRadius: 30,
    //     paddingRight: 15,
    //     paddingLeft: 15,
    //     zIndex: 1,
    // },
    //   closeButtonText: {
    //     color: "#fff",
    //     fontSize: 18,
    //   },
    //   pdf: {
    //     width: "100%",
    //     flex: 1,
    //   },
    //   zoomControls: {
    //     flexDirection: 'row',
    //     justifyContent: 'center',
    // },
    modalContainer: {
        flex: 1,
        backgroundColor: "white",
        padding: 0,
    },
    modalHeader: {
        width: "100%",
        height: 90,
        backgroundColor: "#F2F6F8",
        justifyContent: "center",
        alignItems: "center",
        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
    },
    modalHeaderContent: {
        height: 40,
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 24,
        marginBottom: 16,
        marginTop: 5,
    },
    backButton: {
        width: 32,
        height: 32,
        marginRight: 20,
    },
    headerTitle: {
        fontSize: 16,
        fontFamily: "Rubik-Medium",
    },
    pdfContainer: {
        marginTop: 4,
        flex: 1, // Take up the remaining space below the header
        width: "100%",
    },
    zoomControlsContainer: {
        position: "absolute",
        bottom: "10%", // Adjust as needed
        right: "15%", // Adjust as needed
        backgroundColor: "white",
        padding: 10,
        borderRadius: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    zoomControls: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    videoPlayer: { flex: 1, width: "100%", height: "100%" },
    spinner: { position: "absolute", top: "50%", left: "50%", transform: [{ translateX: -20 }, { translateY: -20 }] }
});