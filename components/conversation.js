import React from "react";
import { View, Image, StyleSheet } from "react-native";
import { Block, Text } from "expo-ui-kit";
import moment from "moment";

const avatar = require("../assets/applogo/user.png");

class EachConversation extends React.Component {
  render() {
    const { item } = this.props;

    return (
      <Block>
        {!item.is_sent ? (
          <View style={styles.eachMsg}>
            <Image source={avatar} style={styles.userPic} />
            <View style={styles.msgBlock}>
              <Text marginBottom={"2x"}>{item.message}</Text>
              <Text color={"grey"} style={styles.hour}>
                {moment.unix(item.received_date).format("LT")}
              </Text>
            </View>
          </View>
        ) : (
          <View style={[styles.eachMsg, { alignSelf: "flex-end" }]}>
            <View style={[styles.msgBlock, { backgroundColor: "#97c163" }]}>
              <Text marginBottom={"2x"}>{item.message}</Text>
              <Text color={"grey"} style={styles.hour}>
                {moment.unix(item.sent_date).format("LT")}
              </Text>
            </View>
            <Image source={avatar} style={styles.userPic} />
          </View>
        )}
      </Block>
    );
  }
}

export default EachConversation;

const styles = StyleSheet.create({
  eachMsg: {
    flexDirection: "row",
    alignItems: "flex-end",
    margin: 1,
  },
  userPic: {
    height: 50,
    width: 50,
    margin: 5,
    borderRadius: 20,
    backgroundColor: "#f8f8f8",
  },
  msgBlock: {
    maxWidth: "60%",
    minWidth: "25%",
    borderRadius: 3,
    backgroundColor: "#ffffff",
    padding: 2,
    shadowColor: "#3d3d3d",
    shadowRadius: 2,
    shadowOpacity: 0.5,
    shadowOffset: {
      height: 1,
    },
    elevation: 5,
  },
  hour: { position: "absolute", right: 3, bottom: 0 },
});
