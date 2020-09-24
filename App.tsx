/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, {useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar, Alert, Pressable,
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import messaging from "@react-native-firebase/messaging";

import PushNotificationIOS from '@react-native-community/push-notification-ios';

declare const global: {HermesInternal: null | {}};

const PushNotification = require("react-native-push-notification");

const App = () => {

  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
    }
  }

  async function registerAppWithFCM() {
    try {
      await messaging().registerDeviceForRemoteMessages();
    } catch (e) {
      console.log('[ERROR] register Device For Remote Messages', e);
    }
  }

  const onRemoteNotification = (notification) => {

    console.log('onRemoteNotification notification', notification);

    // const isClicked = notification.getData().userInteraction === 1

    // if (isClicked) {
    //   // Navigate user to another screen
    // } else {
    //   // Do something else with push notification
    // }
  };

  useEffect(() => {
    PushNotificationIOS.addEventListener('notification', onRemoteNotification)
  }, []);

  useEffect(() => {
    (async () => {
      await requestUserPermission();
      await registerAppWithFCM();

      const _deviceToken = await messaging().getToken();
      console.log('Device Token:', _deviceToken);

    })();

    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('Firebase messaging onMessage', JSON.stringify(remoteMessage));
      // Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
      // PushNotificationIOS.presentLocalNotification({
      //   alertTitle: remoteMessage.notification.title,
      //   alertBody: remoteMessage.notification.body,
      // });
      PushNotification.localNotification({
        id: remoteMessage.messageId,
        title: remoteMessage.notification.title,
        message: remoteMessage.notification.body,
      });

    });

    return unsubscribe;
  }, []);

  const showLocalPushNotification = () => {
    PushNotification.localNotification({
      message: "Local Push Notification",
    })
  }

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <Pressable onPress={showLocalPushNotification} >
          <Text>LOCAL PUSH NOTIFICATION</Text>
        </Pressable>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
          <Header />
          {global.HermesInternal == null ? null : (
            <View style={styles.engine}>
              <Text style={styles.footer}>Engine: Hermes</Text>
            </View>
          )}
          <View style={styles.body}>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Step One</Text>
              <Text style={styles.sectionDescription}>
                Edit <Text style={styles.highlight}>App.tsx</Text> to change this
                screen and then come back to see your edits.
              </Text>
            </View>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>See Your Changes</Text>
              <Text style={styles.sectionDescription}>
                <ReloadInstructions />
              </Text>
            </View>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Debug</Text>
              <Text style={styles.sectionDescription}>
                <DebugInstructions />
              </Text>
            </View>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Learn More</Text>
              <Text style={styles.sectionDescription}>
                Read the docs to discover what to do next:
              </Text>
            </View>
            <LearnMoreLinks />
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

export default App;
