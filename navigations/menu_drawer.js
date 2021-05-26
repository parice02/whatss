import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { connect } from "react-redux";
import {
  Dimensions,
  Alert,
  NativeEventEmitter,
  NativeModules,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";
import Color from "color";
import moment from "moment";

import HomeApp from "./principal_stack";
import DrawerContent from "../components/drawer_content";
import NearbyConnections from "../components/nearby_connections";

const Drawer = createDrawerNavigator();
const { width } = Dimensions.get("window");

class MyDrawer extends React.Component {
  _add_device = null;
  _remove_device = null;
  _endpoit_disconnect = null;
  _receive_msg = null;

  advertising_successed = (e) => {
    console.log(e);
  };

  advertising_failed = (e) => {
    Alert.alert("Alerte", e, [{ text: "ok", style: "destructive" }]);
  };

  on_receive_msg = (e) => {
    const { connected_devices, dispatch } = this.props;
    const message = JSON.parse(e.message);
    message.is_sent = false;
    const device = connected_devices.filter(
      (item) => item.name === message.sender.name
    );
    message.sender = device[0];
    message.received_date = moment().unix();
    dispatch({ type: "add_conversation", value: message });
    console.log("on_receive");
  };

  async componentDidMount() {
    const username = await SecureStore.getItemAsync("user_username");
    const event_emitter = new NativeEventEmitter(
      NativeModules.NearbyConnections
    );
    NearbyConnections.startAdvertising(username, this.advertising_failed);
    NearbyConnections.startDiscovery(this.advertising_failed);
    this._add_device = event_emitter.addListener(
      "onEndpointFound",
      this.add_device_list
    );
    this._remove_device = event_emitter.addListener(
      "onEndpointLost",
      this.remove_device_list
    );
    this._endpoit_disconnect = event_emitter.addListener(
      "onEndpointDisconnected",
      this.remove_connected_device_list
    );
    this._receive_msg = event_emitter.addListener(
      "onPayloadReceived",
      this.on_receive_msg
    );
  }

  add_device_list = (m) => {
    this.props.dispatch({ type: "add_device", value: m });
  };

  remove_device_list = (m) => {
    this.props.dispatch({ type: "remove_device", value: m });
  };

  remove_connected_device_list = (m) => {
    this.props.dispatch({ type: "remove_connected_device", value: m });
  };

  async componentWillUnmount() {
    NearbyConnections.disconnect();
    this._add_device.remove();
    this._remove_device.remove();
    this._endpoit_disconnect.remove();
    this._receive_msg.remove();
  }

  render() {
    const { constants } = this.props;
    const { colors } = constants;
    return (
      <Drawer.Navigator
        drawerType={"front"}
        initialRouteName="home_drawer"
        drawerStyle={{
          width: (3 * width) / 5,
        }}
        drawerContentOptions={{
          activeTintColor: Color(colors.light).lighten(0.09).hex(),
          inactiveTintColor: Color(colors.dark).lighten(0.09).hex(),
          activeBackgroundColor: Color(colors.maincolor).lighten(0.09).hex(),
          inactiveBackgroundColor: "transparent",
        }}
        drawerContent={(props) => {
          return <DrawerContent {...props} />;
        }}
      >
        <Drawer.Screen
          name="home_drawer"
          options={{
            drawerLabel: "Accueil",
            drawerIcon: ({ focused, size, color }) => (
              <Ionicons
                name={focused ? "home" : "home-outline"}
                size={size}
                color={color}
              />
            ),
          }}
        >
          {(props) => <HomeApp {...props} />}
        </Drawer.Screen>
      </Drawer.Navigator>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    ...state,
    constants: state.constants,
    connected_devices: state.connected_devices.value,
  };
};

export default connect(mapStateToProps)(MyDrawer);
