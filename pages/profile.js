import React from "react";
import { Text, View, TouchableOpacity, StyleSheet, Image } from "react-native";
import { MaterialIcons } from "react-native-vector-icons";
import ParallaxScrollView from "react-native-parallax-scroll-view";
import { connect } from "react-redux";

class Profile extends React.Component {
  render() {
    const { navigation, name, image, status, constants } = this.props;
    const { colors } = constants;

    return (
      <ParallaxScrollView
        backgroundColor={colors.maincolor}
        parallaxHeaderHeight={300}
        renderBackground={() => (
          <View>
            <Image source={image} />
          </View>
        )}
        scrollableViewStyle={{ backgroundColor: "#ece5dd" }}
      >
        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.text}>Mute</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.text}>Custom notifications</Text>
          </View>
          <View style={styles.encrypt}>
            <View>
              <Text style={styles.text}>Encryption</Text>
              <Text style={styles.subText}>
                Messages you send to this chat and calls are secured with end to
                end Encryption. Tap to verify
              </Text>
            </View>
            <MaterialIcons
              name="lock"
              color="#075e54"
              size={23}
              style={{ padding: 5 }}
            />
          </View>
        </View>
        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.green}>Status and Phone</Text>
            <Text style={styles.text}>{status}</Text>
            <Text style={styles.subText}>January 5</Text>
          </View>
          <View style={styles.number}>
            <View style={{ paddingHorizontal: 5 }}>
              <Text style={styles.text}>+00 9874563212</Text>
              <Text style={styles.subText}>Mobile</Text>
            </View>
            <View style={{ flexDirection: "row" }}>
              <MaterialIcons
                name="chat"
                color="#075e54"
                size={23}
                style={{ padding: 5 }}
              />
              <MaterialIcons
                name="call"
                color="#075e54"
                size={23}
                style={{ padding: 5 }}
              />
              <MaterialIcons
                name="videocam"
                color="#075e54"
                size={23}
                style={{ padding: 5 }}
              />
            </View>
          </View>
        </View>
      </ParallaxScrollView>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    ...state,
    constants: state.constants,
  };
};

export default connect(mapStateToProps)(Profile);

const styles = StyleSheet.create({
  header: {
    height: 65,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "600",
    marginTop: 270,
    padding: 20,
  },
  card: {
    marginTop: 10,
  },
  row: {
    height: 50,
    padding: 10,
    justifyContent: "center",
    borderBottomWidth: 1,
    borderColor: "#f5f5f5",
    backgroundColor: "#fff",
  },
  encrypt: {
    height: 50,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#f5f5f5",
    backgroundColor: "#fff",
  },
  number: {
    height: 50,
    paddingHorizontal: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#f5f5f5",
    backgroundColor: "#fff",
  },
  text: {
    color: "#333",
    fontWeight: "400",
  },
  subText: {
    color: "#555",
  },
  green: {
    color: "#075e54",
  },
});
