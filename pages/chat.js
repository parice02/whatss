import React from "react";
import {
  View,
  FlatList,
  Image,
  ImageBackground,
  Platform,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  StatusBar,
  Keyboard,
} from "react-native";
import { Block, Button } from "expo-ui-kit";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { connect } from "react-redux";
import moment from "moment";
import * as SecureStore from "expo-secure-store";

import NearbyConnections from "../components/nearby_connections";
import EachConversation from "../components/conversation";
import ContextMenu from "../components/context_menu";
import ChatInput from "../components/chat_input";

const { width, height } = Dimensions.get("window");
const os = Platform.OS === "android" ? "md" : "ios";
const icon_size = 20;
const icon_color = "white";

const avatar = require("../assets/applogo/user.png");

class Chat extends React.Component {
  _flat_list = null;
  _keyboard = null;

  ref_flat = (ref) => (this._flat_list = ref);

  scroll_end = () => {
    this._flat_list.scrollToEnd({ animated: true });
  };

  send = async (msg) => {
    if (msg.length > 0) {
      const { route, dispatch } = this.props;
      const { device } = route.params;
      const username = await SecureStore.getItemAsync("user_username");
      const message = {
        receiver: { name: device.name, id: device.id },
        sender: { name: username },
        is_sent: true,
        is_read: false,
        sent_date: moment().unix(),
        message: msg,
      };
      const message_string = JSON.stringify(message);
      NearbyConnections.sendByteMessage(message_string, message.receiver.id);
      dispatch({ type: "add_conversation", value: message });
    }
  };

  render_item = ({ item }) => <EachConversation item={item} {...this.props} />;

  componentDidMount() {
    const { navigation, route } = this.props;
    const { device } = route.params;

    navigation.setOptions({
      headerTitle: device.name,
      headerTitleAlign: "center",
      headerLeft: () => (
        <Block row space={"between"}>
          <Button padding transparent onPress={navigation.goBack}>
            <Ionicons
              name={`${os}-arrow-back`}
              size={icon_size}
              color={icon_color}
            />
          </Button>
          <Button padding transparent onPress={() => {}}>
            <Image source={avatar} style={styles.chatImage} />
          </Button>
        </Block>
      ),
      headerRight: () => (
        <Block row space={"between"}>
          <>
            <Button padding margin transparent onPress={() => {}}>
              <MaterialIcons name="call" color={icon_color} size={icon_size} />
            </Button>
          </>
          <>
            <ContextMenu page={route.name} />
          </>
        </Block>
      ),
    });
  }

  componentWillUnmount() {}

  render() {
    const { constants, conversations, route } = this.props;
    const { colors } = constants;
    const { device } = route.params;
    const conv = conversations.filter((item) => item.receiver.id === device.id);

    return (
      <View style={{ flex: 1 }}>
        <StatusBar
          style="auto"
          backgroundColor={colors.maincolor}
          barStyle={"light-content"}
        />
        <KeyboardAvoidingView
          style={[{ flex: 1 }]}
          behavior={Platform.OS === "ios" ? "height" : "height"}
          onLayout={this.scroll_end}
        >
          <ImageBackground
            source={require("../assets/background.jpeg")}
            style={styles.backgroundimage}
          >
            <FlatList
              ref={this.ref_flat}
              data={conv}
              style={{ flex: 1, flexGrow: 1, marginBottom: 60 }}
              inverted={true}
              //contentContainerStyle={{ flex: 1 }}
              keyExtractor={(_, index) => `${index}`}
              renderItem={this.render_item}
              //onEndReachedThreshold={10}
              //onEndReached={this.scroll_end}
              //onLayout={this.scroll_end}
              onContentSizeChange={this.scroll_end}
            />
            <ChatInput send={this.send} style={styles.textinput} />
          </ImageBackground>
        </KeyboardAvoidingView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  textinput: {
    position: "absolute",
    bottom: 0,
  },

  backgroundimage: {
    width,
    height,
    flex: 1,
  },
  chatImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    margin: 5,
  },
});

const mapStateToProps = (state) => {
  return {
    ...state,
    constants: state.constants,
    conversations: state.conversations.value,
    connected_devices: state.connected_devices.value,
  };
};

export default connect(mapStateToProps)(Chat);
