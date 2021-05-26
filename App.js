import React from "react";
import { BackHandler } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import * as SplashScreen from "expo-splash-screen";
import { Provider as PaperProvider } from "react-native-paper";
import { Provider as ReduxProvider } from "react-redux";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/es/integration/react";

import * as Location from "expo-location";

import { g_api_key } from "@env";
import AppContainer from "./navigations/app_stack";
import Store from "./redux/store";

export default class App extends React.Component {
  state = { loading: true };

  async componentDidMount() {
    try {
      await SplashScreen.preventAutoHideAsync();
      const perm = await Location.requestPermissionsAsync();
      if (!perm) {
        BackHandler.exitApp();
      }
    } catch (e) {
      console.warn(e);
    }
    this.setState({ loading: false }, async () => {
      await SplashScreen.hideAsync();
    });
  }

  async componentWillUnmount() {}

  render() {
    if (this.state.loading) {
      return <></>;
    }

    const persistor = persistStore(Store);
    //persistor.purge();

    return (
      <ReduxProvider store={Store}>
        <PersistGate persistor={persistor}>
          <PaperProvider>
            <NavigationContainer>
              <AppContainer />
            </NavigationContainer>
          </PaperProvider>
        </PersistGate>
      </ReduxProvider>
    );
  }
}
