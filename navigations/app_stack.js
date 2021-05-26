import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { connect } from "react-redux";
import * as SecureStore from "expo-secure-store";

import Login from "../pages/login";
import DrawerMenu from "./menu_drawer";

const Stack = createStackNavigator();

class AppStack extends React.Component {
  async componentDidMount() {
    this.props.dispatch({ type: "delete_all_devices" });
    this.props.dispatch({ type: "delete_all_connected_devices" });
    this.props.dispatch({ type: "delete_all_conversations" });
    const user_token = await SecureStore.getItemAsync("user_token");
    const user_username = await SecureStore.getItemAsync("user_username");

    if (user_token && user_username) {
      this.props.dispatch({ type: "has_account" });
    } else {
      this.props.dispatch({ type: "has_not_account" });
    }
  }

  render() {
    const { has_account } = this.props;
    return (
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {!has_account ? (
          <Stack.Screen name={"login_stack"} component={Login} />
        ) : (
          <Stack.Screen name={"menu_drawer"} component={DrawerMenu} />
        )}
      </Stack.Navigator>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    ...state,
    constants: state.constants,
    has_account: state.has_account.value,
  };
};

export default connect(mapStateToProps)(AppStack);
