import React from "react";
import { View, TouchableOpacity, Platform } from "react-native";
import Animated from "react-native-reanimated";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { Badge } from "react-native-paper";
import { Block, Button, Text } from "expo-ui-kit";
import { connect } from "react-redux";
import Color from "color";

import Conversations from "./home_stack";
import MapSearch from "./map_stack";
import CameraSreen from "../pages/camera";
import ContextMenu from "../components/context_menu";

const os = Platform.OS === "android" ? "md" : "ios";
const icon_size = 20;
const icon_color = "white";

class MyTabBar extends React.Component {
  get_menu = (page) => {
    let menu;
    const { navigation } = this.props;
    switch (page) {
      case "home_stack":
        menu = [];
        return menu.filter((item) => item !== null);
      default:
        return [];
    }
  };

  render_tab = (route, index) => {
    const { state, descriptors, navigation, position, colors } = this.props;

    const { options } = descriptors[route.key];
    console.log();
    const label =
      options.tabBarLabel !== undefined
        ? options.tabBarLabel
        : options.title !== undefined
        ? options.title
        : route.name;

    const isFocused = state.index === index;
    const color = isFocused ? colors.light : colors.dark;

    const onPress = () => {
      const event = navigation.emit({
        type: "tabPress",
        target: route.key,
        canPreventDefault: true,
      });

      if (!isFocused && !event.defaultPrevented) {
        navigation.navigate(route.name);
      }
    };

    const onLongPress = () => {
      navigation.emit({
        type: "tabLongPress",
        target: route.key,
      });
    };

    const inputRange = state.routes.map((_, i) => i);
    const opacity = Animated.interpolate(position, {
      inputRange,
      outputRange: inputRange.map((i) => (i === index ? 1 : 0)),
    });

    return (
      <TouchableOpacity
        key={index}
        accessibilityRole="button"
        accessibilityState={isFocused ? { selected: true } : {}}
        accessibilityLabel={options.tabBarAccessibilityLabel}
        testID={options.tabBarTestID}
        onPress={onPress}
        onLongPress={onLongPress}
        style={{ flex: 1, padding: 5 }}
      >
        <Animated.Text style={{ opacity, alignSelf: "center", color: color }}>
          {typeof label === "function" ? label(isFocused, color) : label}
        </Animated.Text>
      </TouchableOpacity>
    );
  };

  render() {
    const { state, colors } = this.props;

    return (
      <View style={{ padding: 5, backgroundColor: colors.maincolor }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Block row>
            <Button
              padding
              margin
              transparent
              onPress={
                () => {}
                /* route.name === "home_stack"
                  ? navigation.toggleDrawer()
                  : navigation.goBack() */
              }
            >
              <Ionicons
                // name={route.name === "home_stack" ? "md-menu" : "md-arrow-back"}
                name={"md-menu"}
                size={icon_size}
                color={icon_color}
              />
            </Button>

            <Text>Whatss</Text>
          </Block>
          <Block row space={"between"}>
            <Button padding margin transparent onPress={() => {}}>
              <Ionicons
                name={`${os}-search`}
                size={icon_size}
                color={icon_color}
              />
            </Button>
            <>
              <ContextMenu {...this.props} />
            </>
          </Block>
        </View>
        <View style={{ flexDirection: "row" }}>
          {state.routes.map(this.render_tab)}
        </View>
      </View>
    );
  }
}

const Tab = createMaterialTopTabNavigator();

class MyTab extends React.Component {
  /* render_tab_bar = (props) => (
    <MyTabBar {...props} colors={this.props.constants.colors} />
  ); */

  render() {
    const { constants } = this.props;
    const { colors } = constants;

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
            tabBarIcon: ({ focused, color }) => <Badge size={20}>3</Badge>,
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
