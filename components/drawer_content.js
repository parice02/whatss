import React from "react";
import { Block, Text } from "expo-ui-kit";
import { Image, Platform } from "react-native";
import { Ionicons } from "react-native-vector-icons";
import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from "@react-navigation/drawer";
import Color from "color";
import { connect } from "react-redux";
import * as SecureStore from "expo-secure-store";

const os = Platform.OS === "android" ? "md" : "ios";

class DrawerMenu extends React.Component {
  on_disconnect = async () => {
    await SecureStore.deleteItemAsync("user_username");
    await SecureStore.deleteItemAsync("user_id");
    await SecureStore.deleteItemAsync("user_token");
    this.props.dispatch({ type: "has_not_account" });
  };

  render() {
    const { constants } = this.props;
    const { colors } = constants;
    return (
      <DrawerContentScrollView
        {...this.props}
        contentContainerStyle={{ flex: 1 }}
      >
        <Block>
          <Block scroll>
            <Block flex={0.4} margin={5} bottom>
              <Image
                source={require("../assets/favicon.png")}
                resizeMode={"center"}
                width={"50%"}
                height={"50%"}
              />
              <Text title marginTop={"2x"}>
                Issouf Sawadogo
              </Text>
              <Text size={10} marginTop>
                issouf.sawadogo@whatss.com
              </Text>
            </Block>
            <Block>
              <DrawerItemList {...this.props} />
            </Block>
            <Block noflex top>
              <DrawerItem
                label="Se déconnecter"
                labelStyle={{ marginLeft: -16 }}
                inactiveTintColor={Color(colors.danger).darken(0.4).hex()}
                onPress={this.on_disconnect}
                icon={({ focused, size, color }) => (
                  <Ionicons
                    name={focused ? `${os}-exit` : `${os}-exit-outline`}
                    color={color}
                    size={size}
                  />
                )}
              />
            </Block>
          </Block>
        </Block>
      </DrawerContentScrollView>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    ...state,
    constants: state.constants,
  };
};

export default connect(mapStateToProps)(DrawerMenu);
