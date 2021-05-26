import React from "react";
import { View, Image, Text, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialIcons } from "react-native-vector-icons";
import { moderateScale } from "react-native-size-matters";

const avatar = require("../assets/applogo/user.png");

class Message extends React.Component {
  render() {
    const { item, navigation } = this.props;
    return (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("chat_stack", {
            device: item.receiver,
          });
        }}
      >
        <View style={styles.row}>
          <Image source={avatar} style={styles.pic} />
          <View style={{ flex: 1 }}>
            <View style={styles.nameContainer}>
              <Text style={styles.nameTxt}>{item.receiver.name}</Text>
              <Text style={styles.time}>
                {item.received_date | item.sent_date}
              </Text>
            </View>
            <View style={styles.msgContainer}>
              <MaterialIcons
                name={"done"}
                size={15}
                color="#b3b3b3"
                style={{ marginLeft: 15, marginRight: 5 }}
              />
              <Text numberOfLines={1} style={styles.msgTxt}>
                {item.message}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

export default Message;

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    padding: moderateScale(10),
  },
  pic: {
    borderRadius: 30,
    width: moderateScale(50),
    height: moderateScale(50),
    resizeMode: "contain",
  },
  nameContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  nameTxt: {
    marginLeft: 15,
  },
  time: {
    color: "#777",
  },
  msgContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  msgTxt: {
    color: "#666",
  },
});
