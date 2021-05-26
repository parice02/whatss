import React from "react";
import { Platform, View } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { connect } from "react-redux";

import MapSearch from "../pages/map_search";

const Stack = createStackNavigator();

class MyStack extends React.Component {
  render() {
    const { constants } = this.props;
    const { colors } = constants;
    return (
      <Stack.Navigator
        mode={"modal"}
        headerMode={"float"}
        initialRouteName={"map_stack"}
        screenOptions={({ route, navigation }) => ({
          headerShown: false,
        })}
      >
        <Stack.Screen
          name="map_stack"
          component={MapSearch}
          options={{ title: "Rechercher des amis" }}
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
