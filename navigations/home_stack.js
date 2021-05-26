import React from "react";
import { Platform, View } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Block, Button } from "expo-ui-kit";
import { connect } from "react-redux";

import Home from "../pages/home";

const os = Platform.OS === "android" ? "md" : "ios";
const icon_size = 20;
const icon_color = "white";

const Stack = createStackNavigator();

class MyStack extends React.Component {
  render() {
    const { constants } = this.props;
    const { colors } = constants;
    return (
      <Stack.Navigator
        mode={"modal"}
        headerMode={"float"}
        initialRouteName={"home_stack"}
        screenOptions={({ route, navigation }) => ({
          headerShown: false,
        })}
      >
        <Stack.Screen
          name="home_stack"
          component={Home}
          options={{ title: "Conversations" }}
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
