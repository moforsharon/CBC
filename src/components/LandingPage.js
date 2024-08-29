import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { VStack, HStack } from "native-base";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { makeResponsiveStyle } from 'react-native-media-query';

const { height, width } = Dimensions.get('window');

export default function Page() {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header Section */}
      <HStack style={styles.headerRow} alignItems="center">
        <TouchableOpacity>
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
        <TouchableOpacity style={styles.BtmBtn}>
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
