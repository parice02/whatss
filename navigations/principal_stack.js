import React from "react";
import { Platform, View } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { connect } from "react-redux";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Block, Button } from "expo-ui-kit";

import HomeTab from "./nav_tab";
import ContextMenu from "../components/context_menu";
import ChatScreen from "../pages/chat";

const os = Platform.OS === "android" ? "md" : "ios";
const icon_size = 20;
const icon_color = "white";

const Stack = createStackNavigator();

class MyStack extends React.Component {
  get_menu = (page) => {
    let menu = [];
    //const { navigation } = this.props;
    switch (page) {
      case "home_stack":
        return menu.filter((item) => item !== null);
      default:
        return menu;
    }
  };

  render() {
    const { constants } = this.props;
    const { colors } = constants;

    return (
      <Stack.Navigator
        screenOptions={({ route, navigation }) => ({
          headerShown: true,
          headerTintColor: "white",
          headerStyle: {
            elevation: 0,
            shadowColor: "#fff",
            backgroundColor: colors.maincolor,
          },
          headerLeft: () => (
            <Button
              padding
              margin
              transparent
              onPress={() =>
                route.name === "home_stack"
                  ? navigation.toggleDrawer()
                  : navigation.goBack()
              }
            >
              <Ionicons
                name={route.name === "home_stack" ? "md-menu" : "md-arrow-back"}
                size={icon_size}
                color={icon_color}
              />
            </Button>
          ),
          headerRight: () => (
            <Block row space={"between"}>
              <>
                <Button padding margin transparent onPress={() => {}}>
                  <Ionicons
                    name={`${os}-search`}
                    size={icon_size}
                    color={icon_color}
                  />
                </Button>
              </>
              <>
                <ContextMenu menu={this.get_menu(route.name)} {...this.props} />
              </>
            </Block>
          ),
        })}
      >
        <Stack.Screen
          name="home_stack"
          component={HomeTab}
          options={{ title: "Whatss" }}
        />
        <Stack.Screen
          name="chat_stack"
          component={ChatScreen}
          options={{ title: "" }}
        />
      </Stack.Navigator>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    ...state,
    constants: state.constants,
  };
};

export default connect(mapStateToProps)(MyStack);
