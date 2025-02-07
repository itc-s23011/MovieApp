import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MovieList from './screens/MovieList';
import MovieDetail from './screens/MovieDetail';
import Ionicons from "@expo/vector-icons/Ionicons";
import { TouchableOpacity } from 'react-native';
import SearchMovie from './screens/SearchMovie';

import React from 'react';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen'; // 新規登録画面をインポート

import { createDrawerNavigator } from '@react-navigation/drawer';


const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();


export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        {/* ログイン画面 */}
        <Stack.Screen name="Login" component={LoginScreen} options={{ title: "ログイン" }} />

        {/* 新規登録画面 - ナビゲーションバー非表示 */}
        <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />

        {/* 映画一覧画面 */}
        <Stack.Screen
          name="MovieList"
          component={MovieList}
          options={({ navigation }) => ({
            title: "映画一覧",
            headerStyle: {
              backgroundColor: '#202328',
            },
            headerTintColor: '#fff',
            headerRight: () => (
              <TouchableOpacity onPress={() => navigation.navigate('SearchMovie')}>
                <Ionicons name="search" size={30} color="#ccc" />
              </TouchableOpacity>
            )
          })}
        />

        {/* 映画詳細画面 */}
        <Stack.Screen
          name="MovieDetail"
          component={MovieDetail}
          options={{
            title: "映画詳細",
            headerStyle: {
              backgroundColor: '#202328',
            },
            headerTintColor: '#fff'
          }}
        />

        {/* 映画検索画面 */}
        <Stack.Screen
          name="SearchMovie"
          component={SearchMovie}
          options={{
            title: "映画検索",
            headerStyle: {
              backgroundColor: '#202328',
            },
            headerTintColor: '#fff'
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function Movie() {
  return(
    <Stack.Navigator>
        <Stack.Screen name="MovieList" component={MovieList} options={({navigation}) => ({
          title: "映画一覧",
          headerStyle: {
            backgroundColor: '#202328',
          },
          headerTintColor: '#fff',
          headerRight: () => (
            <TouchableOpacity onPress={() => navigation.navigate('SearchMovie')}>
              <Ionicons name="search" size={30} color="#ccc" />
            </TouchableOpacity>
          )
        })}/>
        <Stack.Screen name="MovieDetail" component={MovieDetail} options={{
          title: "映画詳細",
          headerStyle: {
            backgroundColor: '#202328',
          },
          headerTintColor: '#fff'
        }}/>
        <Stack.Screen name="SearchMovie" component={SearchMovie} options={{
          title: "映画検索",
          headerStyle: {
            backgroundColor: '#202328',
          },
          headerTintColor: '#fff'
        }}/>
      </Stack.Navigator>
  )
}
export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="映画">
        <Drawer.Screen name="映画" component={Movie} />
        {/*<Drawer.Screen name="Notifications" component={NotificationsScreen} /> */}
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
