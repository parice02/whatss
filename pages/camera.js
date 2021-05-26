import React from "react";
import { Block, Text } from "expo-ui-kit";
import { View, StyleSheet, StatusBar } from "react-native";
import { connect } from "react-redux";

class MapPage extends React.Component {
  render() {
    const { constants } = this.props;
    const { colors } = constants;
    return (
      <Block safe white>
        <StatusBar
          style="auto"
          backgroundColor={colors.maincolor}
          barStyle={"light-content"}
        />
        <Block flex>
          <Block flex={4}>
            <Block marginTop={"2x"} center middle>
              <Text>work in progress</Text>
            </Block>
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
  };
};

export default connect(mapStateToProps)(MapPage);
