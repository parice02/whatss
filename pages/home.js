import React from "react";
import { Block, Text } from "expo-ui-kit";
import { StatusBar, FlatList } from "react-native";
import { connect } from "react-redux";
import { Divider } from "react-native-paper";
import moment from "moment";
import * as SecureStore from "expo-secure-store";

import Message from "../components/message";

class Home extends React.Component {
  state = { loading: false };

  render_item = ({ item }) => <Message item={item} {...this.props} />;

  render_separator = () => <Divider inset />;

  render_footer_header = () => <Block margin />;

  render_empty_list = () => (
    <Text middle center h3>
      Vous n'avez pas encore de conversation
    </Text>
  );

  most_recent_date = (threads_list) => {
    let most_recent = { date: "" };
    for (let index = 0; index < threads_list.length; index++) {
      if (
        moment(most_recent.date).isValid() &&
        moment(most_recent).isBefore(threads_list[index])
      ) {
        most_recent = threads_list[index];
      } else if (!moment(most_recent.date).isValid()) {
        most_recent = threads_list[index];
      }
    }
    return most_recent;
  };

  get_last_msg = () => {
    const { conversations } = this.props;
    const unreads = conversations;
    const received_msg = new Object();
    const recent_msg = [];
    for (const thread of unreads) {
      if (received_msg.hasOwnProperty(thread.sender.name)) {
        received_msg[thread.sender.name].unshift(thread);
      } else {
        received_msg[thread.sender.name] = [thread];
      }
    }
    for (const key in received_msg) {
      recent_msg.unshift(this.most_recent_date(received_msg[key]));
    }
    return recent_msg;
  };

  render() {
    const { constants } = this.props;
    const { colors } = constants;
    const { loading } = this.state;
    const messages = this.get_last_msg();

    return (
      <Block safe white>
        <StatusBar
          style="auto"
          backgroundColor={colors.maincolor}
          barStyle={"light-content"}
        />
        <Block>
          <FlatList
            data={messages}
            renderItem={this.render_item}
            keyExtractor={(item, index) => `${index}`}
            ListEmptyComponent={this.render_empty_list}
            ItemSeparatorComponent={this.render_separator}
            ListFooterComponent={this.render_footer_header}
            ListHeaderComponent={this.render_footer_header}
            refreshing={loading}
            progressViewOffset={10}
            onRefresh={this.get_user_inbox}
            legacyImplementation={true}
          />
        </Block>
      </Block>
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

export default connect(mapStateToProps)(Home);
