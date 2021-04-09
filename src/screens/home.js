import React from 'react'
import { StyleSheet, Button, Text, View, Alert, SafeAreaView, StatusBar } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import Detail from '../screens/detail'

const HomeStack = createStackNavigator();

function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Home screen</Text>
      <Button
        title="Go to Details"
        onPress={() => navigation.navigate('Details')}
      />
    </View>
  );
}

const home = ({ navigation }) => {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen
        name="home"
        component={HomeScreen}
        options={{
          title: '我的客户',
          headerTitleStyle: {color: '#ffffff', textAlign: 'center'},
          headerStyle: {backgroundColor: '#3794ef'},
          headerLeft: () => <Text style={{ marginLeft: 16, color: '#ffffff' }}>hello</Text>,
          headerRight: () => (
            <FontAwesome
              name="sign-out"
              size={20}
              color="#ffffff"
              onPress={() => {
                Alert.alert('提示', '确定要退出吗？', [
                  {
                    text: '取消',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                  },
                  { text: '确定', style: 'destructive', onPress: () => navigation.replace('Login') },
                ]);
              }}
              style={{ marginRight: 16 }}
            />
          ),
        }}
      />
      <HomeStack.Screen name="Detail" component={Detail} />
    </HomeStack.Navigator>

  );
}

export default home

const styles = StyleSheet.create({})
