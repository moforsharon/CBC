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
    { id: 9, title: "Follow Directions.mp4", link: "https://cbc-proxy-server.vercel.app/api/proxy/video?id=1hSuxVRdLm4sm0TVm8Jj6AsK138bgUyWL" },
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

const spanishPdfData = [
    { "id": 1, "title": "¿Qué es un apoyo.pdf", "link": "https://cbc-proxy-server.vercel.app/api/proxy/pdf?id=1cpCPioL5bLo8Q1rJO38Bo4uDbXY3DPGc" },
    { "id": 2, "title": "Advertencias de Transición.pdf", "link": "https://cbc-proxy-server.vercel.app/api/proxy/pdf?id=1iit-MAYSJWKXKa9QX8pywnj0BxWbQVku" },
    { "id": 3, "title": "Aplicando el ABC.pdf", "link": "https://cbc-proxy-server.vercel.app/api/proxy/pdf?id=1r33OkO35AEi-Vf9XB2uf5GrhMP19hK98" },
    { "id": 4, "title": "Comentarios Descriptivos Positivos.pdf", "link": "https://cbc-proxy-server.vercel.app/api/proxy/pdf?id=1JSAjxBaOSc09EYpvqf8lfgE6Bz55cgSp" },
    { "id": 5, "title": "Continúe de inmediato.pdf", "link": "https://cbc-proxy-server.vercel.app/api/proxy/pdf?id=1k7uJgTsepyVJb2FgdjNdmc6VLS_y_s8P" },
    { "id": 6, "title": "Cuídese a Sí Mismo.pdf", "link": "https://cbc-proxy-server.vercel.app/api/proxy/pdf?id=1FoGtmT5S4M34S_y_4ussXmi6jvrY1jxS" },
    { "id": 7, "title": "Dar opciones.pdf", "link": "https://cbc-proxy-server.vercel.app/api/proxy/pdf?id=18OpoRrxMlGLx12FjmvKNFDZGMYyifeTp" },
    { "id": 8, "title": "El ABC de conducta.pdf", "link": "https://cbc-proxy-server.vercel.app/api/proxy/pdf?id=1LlTmO6m-kJroV4a0uCPCwMm-yFt50h-X" },
    { "id": 9, "title": "Establecer Expectativas de Comportamiento Claras.pdf", "link": "https://cbc-proxy-server.vercel.app/api/proxy/pdf?id=1zmQDQPKBAopx5ScJo0HgNTOC-H8jaAqD" },
    { "id": 10, "title": "Evite Prestar Atención al Comportamiento.pdf", "link": "https://cbc-proxy-server.vercel.app/api/proxy/pdf?id=11bfOdYct_J3DK6dZ-EGnfcoyF4Xht-_k" },
    { "id": 11, "title": "Haciendo un Visual.pdf", "link": "https://cbc-proxy-server.vercel.app/api/proxy/pdf?id=15M2bdc4s363ENsdYQgCHBu9OffdwinrA" },
    { "id": 12, "title": "Jugando solo.pdf", "link": "https://cbc-proxy-server.vercel.app/api/proxy/pdf?id=1yxlFlOLsNn8uMmLldITbkQFLNwl7f_so" },
    { "id": 13, "title": "La Importancia Del Lenguaje.pdf", "link": "https://cbc-proxy-server.vercel.app/api/proxy/pdf?id=167td90VL09CetIhnRPgPypV1CrCjX_5l" },
    { "id": 14, "title": "Modelando y etiquetando sentimientos.pdf", "link": "https://cbc-proxy-server.vercel.app/api/proxy/pdf?id=1NN9ewX2Ilh3f_nBaY1VciuVR_uBON54H" },
    { "id": 15, "title": "Pedir Algo.pdf", "link": "https://cbc-proxy-server.vercel.app/api/proxy/pdf?id=1tauxaPwyRlp9qMbBZkHRgRmXTzur78em" },
    { "id": 16, "title": "Pedir Tiempo con Usted.pdf", "link": "https://cbc-proxy-server.vercel.app/api/proxy/pdf?id=1q7mxQPwI620rWLu7exUZm5t9aF5e2kpS" },
    { "id": 17, "title": "Permitir opciones al pedir.pdf", "link": "https://cbc-proxy-server.vercel.app/api/proxy/pdf?id=1nHc142LEHuwSi4b4Szfc8Ztxa6hZa08N" },
    { "id": 18, "title": "Primero – Luego.pdf", "link": "https://cbc-proxy-server.vercel.app/api/proxy/pdf?id=1W-_Ydj01CfjbPYWM7l8GssR3_JjHHVZI" },
    { "id": 19, "title": "Proporcione un recordatorio verbal.pdf", "link": "https://cbc-proxy-server.vercel.app/api/proxy/pdf?id=14GaTZ4MhyThyVJ7xs7ru8JGUtePexrPV" },
    { "id": 20, "title": "Proveer atención positiva frecuente.pdf", "link": "https://cbc-proxy-server.vercel.app/api/proxy/pdf?id=1E33--rRkiFxYmWkaAD8AHXJGjeesoBKP" },
    { "id": 21, "title": "Reconociendo sus alertas.pdf", "link": "https://cbc-proxy-server.vercel.app/api/proxy/pdf?id=1JfR7YiW9pw-rh4Jjqah2p0RjeVCcnNEp" },
    { "id": 22, "title": "Redirigir.pdf", "link": "https://cbc-proxy-server.vercel.app/api/proxy/pdf?id=12hAzlnEsY76d1D9CkrFV-P3TAJ8RAXkq" },
    { "id": 23, "title": "Retrasar al acceso un objeto.pdf", "link": "https://cbc-proxy-server.vercel.app/api/proxy/pdf?id=1WkFoDQpbzLq_1Xe9lISfCmui28mCGU6p" },
    { "id": 24, "title": "Seguir instrucciones.pdf", "link": "https://cbc-proxy-server.vercel.app/api/proxy/pdf?id=1FAhJz6TrwrFWSFpTlQKg9jP4rm-Lnq1p" },
    { "id": 25, "title": "Siguiendo el ejemplo de su hijo.pdf", "link": "https://cbc-proxy-server.vercel.app/api/proxy/pdf?id=1j2k7oJRYklAWxSJzZ83Xohy5N8upZAon" },
    { "id": 26, "title": "Tiempo de calidad.pdf", "link": "https://cbc-proxy-server.vercel.app/api/proxy/pdf?id=1biS7lPN2V5-bNEquxbzhQegmJNySgKpn" },
    { "id": 27, "title": "Tomar decisiones.pdf", "link": "https://cbc-proxy-server.vercel.app/api/proxy/pdf?id=19Ia0yXlpAuHRS7Gv1fHHef8p3tCXFP8H" },
    { "id": 28, "title": "Tomar turnos.pdf", "link": "https://cbc-proxy-server.vercel.app/api/proxy/pdf?id=1XqBq4RW7vskYve6PtRovDTtl4rjDStgC" },
    { "id": 29, "title": "Validando sentimientos.pdf", "link": "https://cbc-proxy-server.vercel.app/api/proxy/pdf?id=1mjzGr8PFEv_uUeZpzI9rnTQbwl8wi6LN" }
  ];

  const spanishVideoData = [
    { "id": 1, "title": "Tomar Decisiones.mp4", "link": "https://cbc-proxy-server.vercel.app/api/proxy/video?id=1E_-DRklgswXXiebj0Ojo_95tf_VikYkG" }

  ]

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

    const [language, setLanguage] = useState('English');
    const [showDropdown, setShowDropdown] = useState(false);

    const handleLanguageChange = (lang) => {
    setLanguage(lang);
    setShowDropdown(false);
    };

    const handleDropdownToggle = () => {
    setShowDropdown(!showDropdown);
    };
  
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
                        <View style={styles.languageSelector}>
                            <TouchableOpacity style={styles.languageSelector} onPress={() => handleDropdownToggle()}>
                                {language == "English" ?  (                                <Image
                                    source={require("../../assets/english.png")}
                                    style={{ width: 18, height: 16, marginRight: 10 }}
                                />) :  (                                <Image
                                    source={require("../../assets/spanish.png")}
                                    style={{ width: 18, height: 16, marginRight: 10 }}
                                />) }
                                <Text style={styles.languageText}>{language}</Text>
                                <Image
                                    source={require("../../assets/dropdown.png")}
                                    style={{ width: 16, height: 16 }}
                                />
                            </TouchableOpacity>
                            {showDropdown && (
                                <View style={styles.dropdownMenu}>
                                <TouchableOpacity onPress={() => handleLanguageChange('English')}>
                                    <Text style={styles.dropdownItem}>English</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => handleLanguageChange('Spanish')}>
                                    <Text style={styles.dropdownItem}>Spanish</Text>
                                </TouchableOpacity>
                                </View>
                            )}
                            </View>
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
                        {language == "English" ? (<Text style={styles.headingTabOne}>Watch videos</Text>) : (<Text style={styles.headingTabOne}>Ver videos</Text>)}
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
                        {language == "English" ? (<Text style={styles.headingTabTwo}>See illustrations</Text>) : (
                            <Text style={styles.headingTabTwo}>Ver ilustraciones</Text>
                        )}
                    </TouchableOpacity>
                </HStack>
                {/* Videos section */}
                {isWatchVideos &&  language === 'English' && (
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
                        {/* <ScrollView style={styles.scrollContainer}>
                            {videoData.map((video) => (
                                <TouchableOpacity key={video.id} style={styles.card} onPress={() => openVideo(video.link, video.title)}>
                                    <Image source={require('../../assets/icons/video-player.png')}  style={styles.cardImage} resizeMode="contain"/>
                                    <Text style={styles.cardTitle}>{video.title}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView> */}
                        <ScrollView style={styles.scrollContainer}>
                            <Text style={styles.videoCategoryTitle}>Universal Strategies</Text>
                            {videoData.filter(video => ["Frequent Positive Attention.mp4"].includes(video.title)).map((video) => (
                                <TouchableOpacity key={video.id} style={styles.card} onPress={() => openVideo(video.link, video.title)}>
                                    <Image source={require('../../assets/icons/video-player.png')}  style={styles.cardImage} resizeMode="contain"/>
                                    <Text style={styles.cardTitle}>{video.title}</Text>
                                </TouchableOpacity>
                            ))}
                            
                            <Text style={styles.videoCategoryTitle}>Prevent Strategies</Text>
                            {videoData.filter(video => ["Avoid Attending.mp4", "Delay Access.mp4", "Give Choices.mp4", "Transition Warnings.mp4"].includes(video.title)).map((video) => (
                                <TouchableOpacity key={video.id} style={styles.card} onPress={() => openVideo(video.link, video.title)}>
                                    <Image source={require('../../assets/icons/video-player.png')}  style={styles.cardImage} resizeMode="contain"/>
                                    <Text style={styles.cardTitle}>{video.title}</Text>
                                </TouchableOpacity>
                            ))}
                            
                            <Text style={styles.videoCategoryTitle}>Teach Strategies</Text>
                            {videoData.filter(video => ["ABCs of Behavior.mp4", "Ask for Something.mp4", "Ask for Time with You.mp4", "Ask to be Done.mp4", "Behavior Support Plan.mp4", "Choices of Demands.mp4", "Follow Directions.mp4", "Follow Your Child's Lead.mp4", "Make choices.mp4", "Play Alone.mp4", "Prompt Follow Through.mp4", "Take turns.mp4", "Verbal Reminders.mp4"].includes(video.title)).map((video) => (
                                <TouchableOpacity key={video.id} style={styles.card} onPress={() => openVideo(video.link, video.title)}>
                                    <Image source={require('../../assets/icons/video-player.png')}  style={styles.cardImage} resizeMode="contain"/>
                                    <Text style={styles.cardTitle}>{video.title}</Text>
                                </TouchableOpacity>
                            ))}
                            
                            <Text style={styles.videoCategoryTitle}>Response Strategies</Text>
                            {videoData.filter(video => ["Help When Calm.mp4"].includes(video.title)).map((video) => (
                                <TouchableOpacity key={video.id} style={styles.card} onPress={() => openVideo(video.link, video.title)}>
                                    <Image source={require('../../assets/icons/video-player.png')}  style={styles.cardImage} resizeMode="contain"/>
                                    <Text style={styles.cardTitle}>{video.title}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                )}
                {/* spanish videos */}
                {isWatchVideos && language === 'Spanish' && (
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
                            {spanishVideoData.map((video) => (
                                <TouchableOpacity key={video.id} style={styles.card} onPress={() => openVideo(video.link, video.title)}>
                                    <Image source={require('../../assets/icons/video-player.png')}  style={styles.cardImage} resizeMode="contain"/>
                                    <Text style={styles.cardTitle}>{video.title}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                    )}
                {/* Pdfs section */}
                {isSeeIllustrations && language === 'English' && (
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
                            <Text style={styles.pdfCategoryTitle}>Universal Strategies</Text>
                            {pdfData.filter(pdf => ["Importance of Language.pdf", "Keeping it Positive.pdf", "Taking Care of Yourself.pdf"].includes(pdf.title)).map((pdf) => (
                                <TouchableOpacity key={pdf.id} style={styles.card} onPress={() => openPdf(pdf.link, pdf.title)}>
                                    <Image source={require('../../assets/icons/pdf.png')}  style={styles.cardImage} resizeMode="contain"/>
                                    <Text style={styles.cardTitle}>{pdf.title}</Text>
                                </TouchableOpacity>
                            ))}
                            
                            <Text style={styles.pdfCategoryTitle}>Prevent Strategies</Text>
                            {pdfData.filter(pdf => ["Avoid Attending.pdf", "Delay Access.pdf", "Give Choices.pdf", "Give Transition Warnings.pdf", "Quality Time.pdf", "Redirections.pdf"].includes(pdf.title)).map((pdf) => (
                                <TouchableOpacity key={pdf.id} style={styles.card} onPress={() => openPdf(pdf.link, pdf.title)}>
                                    <Image source={require('../../assets/icons/pdf.png')}  style={styles.cardImage} resizeMode="contain"/>
                                    <Text style={styles.cardTitle}>{pdf.title}</Text>
                                </TouchableOpacity>
                            ))}
                            
                            <Text style={styles.pdfCategoryTitle}>Teach Strategies</Text>
                            {pdfData.filter(pdf => ["ABCs of Behavior.pdf", "Ask for Something.pdf", "Ask for Time with You.pdf", "Ask to be Done.pdf", "Behavior Expectations.pdf", "Choices of Demand.pdf", "First-Then.pdf", "Follow Directions.pdf", "Following Child's Lead.pdf", "Make Choices.pdf", "Modeling and Labeling Feelings.pdf", "Play Alone.pdf", "Playing with Your Child.pdf", "Positive Attention.pdf", "Positive Descriptive Feedback.pdf", "Prompts.pdf", "Take Turns.pdf", "Validating Feelings.pdf", "Verbal Reminder.pdf", "Visual Daily Schedule.pdf"].includes(pdf.title)).map((pdf) => (
                                <TouchableOpacity key={pdf.id} style={styles.card} onPress={() => openPdf(pdf.link, pdf.title)}>
                                    <Image source={require('../../assets/icons/pdf.png')}  style={styles.cardImage} resizeMode="contain"/>
                                    <Text style={styles.cardTitle}>{pdf.title}</Text>
                                </TouchableOpacity>
                            ))}
                            
                            <Text style={styles.pdfCategoryTitle}>Response Strategies</Text>
                            {pdfData.filter(pdf => ["Help Once Calm.pdf", "Hot Buttons.pdf", "Stay Calm, Protect, Reconnect.pdf"].includes(pdf.title)).map((pdf) => (
                                <TouchableOpacity key={pdf.id} style={styles.card} onPress={() => openPdf(pdf.link, pdf.title)}>
                                    <Image source={require('../../assets/icons/pdf.png')}  style={styles.cardImage} resizeMode="contain"/>
                                    <Text style={styles.cardTitle}>{pdf.title}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                )}
                {/* Spanish pdfs */}
                {isSeeIllustrations && language === 'Spanish' && (
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
                            <Text style={styles.pdfCategoryTitle}>Estrategias Universales</Text>
                            {spanishPdfData.filter(pdf => ["La Importancia Del Lenguaje.pdf", "¿Qué es un apoyo.pdf", "Cuídese a Sí Mismo.pdf"].includes(pdf.title)).map((pdf) => (
                                <TouchableOpacity key={pdf.id} style={styles.card} onPress={() => openPdf(pdf.link, pdf.title)}>
                                <Image source={require('../../assets/icons/pdf.png')}  style={styles.cardImage} resizeMode="contain"/>
                                <Text style={styles.cardTitle}>{pdf.title}</Text>
                                </TouchableOpacity>
                            ))}
                            
                            <Text style={styles.pdfCategoryTitle}>Estrategias de Prevención</Text>
                            {spanishPdfData.filter(pdf => ["Evite Prestar Atención al Comportamiento.pdf", "Retrasar al acceso un objeto.pdf", "Dar opciones.pdf", "Advertencias de Transición.pdf", "Tiempo de calidad.pdf", "Redirigir.pdf"].includes(pdf.title)).map((pdf) => (
                                <TouchableOpacity key={pdf.id} style={styles.card} onPress={() => openPdf(pdf.link, pdf.title)}>
                                <Image source={require('../../assets/icons/pdf.png')}  style={styles.cardImage} resizeMode="contain"/>
                                <Text style={styles.cardTitle}>{pdf.title}</Text>
                                </TouchableOpacity>
                            ))}
                            
                            <Text style={styles.pdfCategoryTitle}>Estrategias de Enseñanza</Text>
                            {spanishPdfData.filter(pdf => ["El ABC de conducta.pdf", "Pedir Algo.pdf", "Pedir Tiempo con Usted.pdf", "Establecer Expectativas de Comportamiento Claras.pdf", "Permitir opciones al pedir.pdf", "Primero – Luego.pdf", "Seguir instrucciones.pdf", "Siguiendo el ejemplo de su hijo.pdf", "Hacer un Visual.pdf", "Jugando solo.pdf", "Modelando y etiquetando sentimientos.pdf", "Proporcione un recordatorio verbal.pdf", "Proveer atención positiva frecuente.pdf", "Tomar decisiones.pdf", "Tomar turnos.pdf"].includes(pdf.title)).map((pdf) => (
                                <TouchableOpacity key={pdf.id} style={styles.card} onPress={() => openPdf(pdf.link, pdf.title)}>
                                <Image source={require('../../assets/icons/pdf.png')}  style={styles.cardImage} resizeMode="contain"/>
                                <Text style={styles.cardTitle}>{pdf.title}</Text>
                                </TouchableOpacity>
                            ))}
                            
                            <Text style={styles.pdfCategoryTitle}>Estrategias de Respuesta</Text>
                            {spanishPdfData.filter(pdf => ["Reconociendo sus alertas.pdf", "Continúe de inmediato.pdf", "Validando sentimientos.pdf"].includes(pdf.title)).map((pdf) => (
                                <TouchableOpacity key={pdf.id} style={styles.card} onPress={() => openPdf(pdf.link, pdf.title)}>
                                <Image source={require('../../assets/icons/pdf.png')}  style={styles.cardImage} resizeMode="contain"/>
                                <Text style={styles.cardTitle}>{pdf.title}</Text>
                                </TouchableOpacity>
                            ))}
                            </ScrollView>
                    </View>
                    )}
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
      languageSelector: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        width: 100,
        height: 32,
        backgroundColor: '#f0f0f0',
        borderRadius: 4,
        padding: 8,
      },
      languageText: {
        fontSize: 14,
        fontWeight: "bold"
      },
      dropdownMenu: {
        position: 'absolute',
        top: 32,
        backgroundColor: '#f0f0f0',
        borderRadius: 4,
        padding: 8,
        zIndex: 1,
      },
      dropdownItem: {
        fontSize: 14,
        paddingVertical: 4,
        fontWeight: "bold"
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
    videoCategoryTitle: {
        fontSize: 18,
        fontWeight: 'semi-bold',
        marginBottom: 14,
        color: '#E0AB65'
    },
    pdfCategoryTitle: {
        fontSize: 18,
        fontWeight: 'semi-bold',
        marginBottom: 14,
        color: '#6A91E0'
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