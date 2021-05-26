import React from "react";
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  NativeEventEmitter,
  NativeModules,
  Alert,
} from "react-native";
import { Block, Text } from "expo-ui-kit";
import NearbyConnections from "../components/nearby_connections";
import * as SecureStore from "expo-secure-store";
import { connect } from "react-redux";

const avatar = require("../assets/applogo/user.png");

class Contact extends React.Component {
  _request_granted = null;
  _request_rejected = null;

  async componentDidMount() {
    const event_emitter = new NativeEventEmitter(
      NativeModules.NearbyConnections
    );

    this._request_granted = event_emitter.addListener(
      "RequestGranted",
      this.navigate_chat
    );
  }

  componentWillUnmount() {
    this._request_granted.remove();
  }

  navigate_chat = () => {
    const { navigation, device } = this.props;
    this.props.dispatch({ type: "add_connected_device", value: device });
    navigation.navigate("chat_stack", {
      device: device,
    });
  };

  on_press_chat = async (endpoint_id) => {
    const username = await SecureStore.getItemAsync("user_username");
    NearbyConnections.requestConnection(username, endpoint_id, (e) =>
      Alert.alert("Erreur", e)
    );
  };

  render() {
    const { device } = this.props;
    return (
      <TouchableOpacity
        onPress={async () => {
          await this.on_press_chat(device.id);
        }}
      >
        <Block space={"between"} row margin padding borderWidth={0.2}>
          <Image source={avatar} style={styles.pic} />
          <Block flex space={"evenly"}>
            <View style={styles.nameContainer}>
              <Text style={styles.nameTxt}>{device.name}</Text>
            </View>
            <View style={styles.msgContainer}>
              <Text style={styles.msgTxt}>En ligne</Text>
            </View>
          </Block>
        </Block>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  row: {
    padding: 5,
  },
  pic: {
    borderRadius: 25,
    width: 70,
    height: 70,
  },
  nameContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  nameTxt: {
    marginLeft: 15,
  },
  mblTxt: {},
  msgContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  msgTxt: {
    color: "#666",

    marginLeft: 15,
  },
});

export default connect()(Contact);
