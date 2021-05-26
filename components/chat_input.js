import React from "react";
import { Platform, StyleSheet, TextInput } from "react-native";
import { Block } from "expo-ui-kit";
import { IconButton } from "react-native-paper";
import { connect } from "react-redux";

class MyTextInput extends React.Component {
  state = { text: "" };

  on_input_change = (text) => this.setState({ text });

  on_press = () => {
    this.props.send(this.state.text);
    this.setState({ text: "" });
  };

  render() {
    const { constants, style = {} } = this.props;
    const { colors } = constants;
    const { text } = this.state;
    return (
      <Block row white space={"evenly"} width={"100%"} style={style}>
        <IconButton
          icon={"emoticon-outline"}
          onPress={() => {}}
          color={colors.maincolor}
          animated={true}
        />
        <TextInput
          value={text}
          onChangeText={this.on_input_change}
          autoFocus={true}
          placeholder={"Votre message"}
          multiline={true}
          keyboardType={"default"}
          enablesReturnKeyAutomatically={true}
          style={[
            styles.text_input,
            {
              width: text.length === 0 ? "60%" : "75%",
            },
          ]}
        />
        {text.length === 0 && (
          <Block row>
            <IconButton
              icon={"camera-outline"}
              onPress={() => {}}
              color={colors.maincolor}
              animated={true}
            />
            <IconButton
              icon={"plus"}
              onPress={() => {}}
              color={colors.maincolor}
              animated={true}
            />
          </Block>
        )}
        <IconButton
          icon={text.length !== 0 ? "send" : "microphone-outline"}
          onPress={text.length !== 0 ? this.on_press : () => {}}
          color={colors.maincolor}
          animated={true}
        />
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

export default connect(mapStateToProps)(MyTextInput);

const styles = StyleSheet.create({
  text_input: {
    borderRadius: 20,
    padding: 10,
    fontSize: 20,
  },
});
