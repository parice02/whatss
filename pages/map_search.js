import React from "react";
import { StatusBar, FlatList } from "react-native";
import { Block, Text } from "expo-ui-kit";
import { connect } from "react-redux";
import { Divider } from "react-native-paper";

import Contact from "../components/contact";

class MapPage extends React.Component {
  state = { loading: false };

  render_item = ({ item }) => <Contact device={item} {...this.props} />;

  render_separator = () => <Divider inset />;

  render_footer_header = () => <Block margin />;

  render_empty_list = () => (
    <Text middle center h3>
      Aucun utilisateur à proximité.
    </Text>
  );

  render() {
    const { loading } = this.state;
    const { constants, devices } = this.props;
    const { colors } = constants;
    return (
      <Block safe white>
        <StatusBar
          style="auto"
          backgroundColor={colors.maincolor}
          barStyle={"light-content"}
        />
        <Block flex>
          <Block marginTop={"2x"}>
            <FlatList
              data={devices}
              renderItem={this.render_item}
              keyExtractor={(_, index) => `${index}`}
              ListEmptyComponent={this.render_empty_list}
              ItemSeparatorComponent={this.render_separator}
              ListFooterComponent={this.render_footer_header}
              ListHeaderComponent={this.render_footer_header}
              refreshing={loading}
              progressViewOffset={10}
              //onRefresh={this.get_user_inbox}
              legacyImplementation={true}
            />
          </Block>
        </Block>
      </Block>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    ...state,
    constants: state.constants,
    devices: state.devices.value,
  };
};

export default connect(mapStateToProps)(MapPage);
