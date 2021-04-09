import React, { useState, useEffect, useRef } from 'react';
import {
  Text,
  View,
  Button,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import ActionSheet from 'react-native-actionsheet';
import Toast from 'react-native-root-toast';
import { baseApiUrl } from '../config';

import storage from '../storage'

export default function login({ navigation }) {
  const [isLoading, setLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [actionSheetOptions, setActionSheetOptions] = useState([]);
  const [comparr, setComparr] = useState([]);
  const refActionSheet = useRef();

  const formData = new FormData();

  useEffect(() => {
    formData.append('username', username);
    formData.append('password', password);
  }, [username, password]);

  const setUserInfo = (data) => {
    storage.save({
      key: 'userInfo', // 注意:请不要在key中使用_下划线符号!
      data: {
        userName: data.info.username,
        userId: data.info.userid,
        compId: data.compid,
      },
    });
  }

  const handleLogin = () => {
    console.log('username: ', username);
    console.log('password: ', password);
    console.log('!username.trim(): ', !username.trim());
    if (!username.trim()) {
      Toast.show('请输入手机号', { position: Toast.positions.CENTER });
      return;
    }
    if (!password.trim()) {
      Toast.show('请输入密码', { position: Toast.positions.CENTER });
      return;
    }
    console.log('baseApiUrl', baseApiUrl + 'api_login');
    setLoading(true)
    fetch(baseApiUrl + 'api_login', {
      method: 'POST',
      // mode: 'cors',
      body: formData,
    })
      .then(response => response.json())
      .then(data => {
        console.log('data: ', data);
        if (data.code !== 1) {
          Toast.show(data.msg, { position: Toast.positions.CENTER });
          return;
        }
        // navigation.replace('Home');
        // 判断是否为多公司
        // if (!data.comparr) {
        //   if (data.code === 1) {
        //     let userInfo = data.info;
        //     userInfo.compid = data.compid;

        //     // 调用 Vuex
        //     this.$store.dispatch('login', userInfo).then(() => {
        //       this.$toast.success({
        //         message: data.msg || '登录成功！',
        //         forbidClick: true,
        //         onClose: () => {
        //           this.$router.push('/');
        //         },
        //       });
        //     });
        //   } else {
        //     this.$toast.fail(data.msg);
        //   }
        // } else {
        // 判断是否为多公司
        if (data.comparr) {
          const options = data.comparr.map(v => v.compName);
          setComparr(
            data.comparr.map(v => {
              return {
                name: v.compName,
                id: v.compId,
              };
            }),
          );
          setActionSheetOptions(options);

          if (refActionSheet.current) {
            refActionSheet.current.show();
          }
        } else {
          navigation.replace('Home');
          setUserInfo(data)
        }
        //   }
      });
  };

  const selectCompany = index => {
    console.log('index: ', index);
    console.log('comparr: ', comparr);
    console.log(comparr[index].id);
    formData.append('compid', comparr[index].id);
    fetch(baseApiUrl + 'api_company', {
      method: 'POST',
      // mode: 'cors',
      body: formData,
    })
      .then(response => response.json())
      .then(data => {
        console.log('data: ', data);
        setUserInfo(data)
        navigation.replace('Home');
      });
    // this.$http.loginCompany(formData).then(res => {
    //   this.actionsShow = false
    //   console.log('res: ', res)
    //   let userInfo = res.info
    //   userInfo.compid = action.id
    //   this.$store.dispatch('login', userInfo).then(() => {
    //     this.$toast.success({
    //       message: res.msg,
    //       forbidClick: true,
    //       onClose: () => {
    //         this.$router.push('/')
    //       },
    //     })
    //   })
    // })
  };

  const renderLoading = () => {
    if (isLoading) {
      return (
        <ActivityIndicator
          size="large"
          color="black"
          style={{ marginLeft: 10 }}
        />
      );
    } else {
      return null;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>JINTAN</Text>
      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          keyboardType="number-pad"
          maxLength={11}
          placeholder="手机号"
          placeholderTextColor="#003f5c"
          onChangeText={username => setUsername(username)}
        />
      </View>
      <View style={styles.inputView}>
        <TextInput
          secureTextEntry
          style={styles.inputText}
          placeholder="密码"
          placeholderTextColor="#003f5c"
          onChangeText={password => setPassword(password)}
        />
      </View>
      {/* <TouchableOpacity>
        <Text style={styles.forgot}>Forgot Password?</Text>
      </TouchableOpacity> */}
      <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
        {renderLoading}
        <Text style={styles.loginText}> 登&nbsp;录</Text>
      </TouchableOpacity>
      {/* <TouchableOpacity>
        <Text style={styles.loginText}>Signup</Text>
      </TouchableOpacity> */}

      <ActionSheet
        ref={refActionSheet}
        title={'请选择公司'}
        options={actionSheetOptions}
        // cancelButtonIndex={2}
        // destructiveButtonIndex={1}
        onPress={selectCompany}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#003f5c',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    fontWeight: 'bold',
    fontSize: 50,
    color: '#fb5b5a',
    marginBottom: 40,
  },
  inputView: {
    width: '80%',
    backgroundColor: '#465881',
    borderRadius: 25,
    height: 50,
    marginBottom: 20,
    justifyContent: 'center',
    padding: 20,
  },
  inputText: {
    height: 50,
    color: 'white',
  },
  forgot: {
    color: 'white',
    fontSize: 11,
  },
  loginBtn: {
    width: '80%',
    backgroundColor: '#fb5b5a',
    borderRadius: 25,
    height: 50,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    marginBottom: 10,
  },
  loginText: {
    color: 'white',
  },
});
