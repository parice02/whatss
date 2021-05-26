import React from "react";
import { View } from "react-native";
import Menu, { MenuItem, MenuDivider } from "react-native-material-menu";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { Button, Text, Block } from "expo-ui-kit";

const icon_size = 20;
const icon_color = "white";
const os = Platform.OS === "android" ? "md" : "ios";

const standard_menu = [
  { icon: "settings", name: "Settings", link: "", data: "" },
  { icon: "help", name: "Help", link: "", data: "" },
  { icon: "information", name: "About", link: "", data: "" },
];

export default class ContextMenu extends React.PureComponent {
  _menu = null;

  setMenuRef = (ref) => {
    this._menu = ref;
  };

  hideMenu = () => {
    this._menu.hide();
  };

  showMenu = () => {
    this._menu.show();
  };

  menu_item = (index, { icon, name, link, data }) => (
    <MenuItem key={index} icon={"wrench"} onPress={() => {}}>
      <Block margin padding row space={"between"} center>
        <Ionicons name={`${os}-${icon}`} size={icon_size} />
        <Text margin>{name}</Text>
      </Block>
    </MenuItem>
  );

  render() {
    const { page } = this.props;

    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Menu
          ref={this.setMenuRef}
          button={
            <Button padding margin transparent onPress={this.showMenu}>
              <MaterialCommunityIcons
                name={"dots-vertical"}
                size={icon_size}
                color={icon_color}
              />
            </Button>
          }
        >
          {page === "home_stack" && <></>}
          <>
            <MenuDivider />
            {standard_menu.map((value, index) => this.menu_item(index, value))}
          </>
        </Menu>
      </View>
    );
  }
}
