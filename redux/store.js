import { createStore } from "redux";
import { persistCombineReducers } from "redux-persist";
import AsyncStorage from "@react-native-community/async-storage";

import constants from "./reducers/constants";
import has_account from "./reducers/has_account";
import devices from "./reducers/devices";
import connected_devices from "./reducers/connected_devices";
import conversations from "./reducers/conversations";

const persist_config = {
  key: "root",
  storage: AsyncStorage,
};

export default createStore(
  persistCombineReducers(persist_config, {
    constants,
    has_account,
    connected_devices,
    devices,
    conversations,
  })
);
