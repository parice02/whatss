import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Badge } from "react-native-paper";
import { connect } from "react-redux";
import Color from "color";

import Conversations from "./home_stack";
import MapSearch from "./map_stack";
import CameraSreen from "../pages/camera";

const icon_size = 20;
const Tab = createMaterialTopTabNavigator();

class MyTab extends React.Component {
  render() {
    const { constants, conversations } = this.props;
    const { colors } = constants;
    const unread = conversations.filter(
      (item) => !item.is_read && !item.is_sent
    );
    const nbre = unread.length;
    const f_nbre = () => {
      if (nbre !== 0) return <Badge>{nbre}</Badge>;
      else return <></>;
    };

    return (
      <Tab.Navigator
        initialRouteName={"searchmap_btab"}
        tabBarOptions={{
          tabStyle: {
            backgroundColor: colors.maincolor,
            flexDirection: "row-reverse",
          },
          activeTintColor: Color(colors.light).hex(),
          inactiveTintColor: Color(colors.dark).hex(),
          showIcon: true,
        }}
      >
        <Tab.Screen
          name="camera_btab"
          component={CameraSreen}
          options={{
            tabBarLabel: ({ _, color }) => (
              <MaterialCommunityIcons
                name={"camera"}
                size={icon_size}
                color={color}
              />
            ),
          }}
        />
        <Tab.Screen
          name="searchmap_btab"
          component={MapSearch}
          options={{
            tabBarLabel: "Map",
          }}
        />
        <Tab.Screen
          name="conv_btab"
          component={Conversations}
          options={{
            tabBarLabel: "Messages",
            tabBarIcon: f_nbre,
          }}
        />
      </Tab.Navigator>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    ...state,
    constants: state.constants,
    conversations: state.conversations.value,
  };
};

export default connect(mapStateToProps)(MyTab);
