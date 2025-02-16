import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import MovieList from './screens/MovieList';
import MovieDetail from './screens/MovieDetail';
import SearchMovie from './screens/SearchMovie';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import ReviewScreen from './screens/ReviewScreen';
import MypageScreen from './screens/Mypage';
import Ionicons from "@expo/vector-icons/Ionicons";
import { TouchableOpacity } from 'react-native';
import React from 'react';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

// ✅ 最初にスタックナビゲーションでログイン管理
function AuthStack() {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Main" component={MainDrawer} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

// ✅ メイン画面を Drawer で管理
function MainDrawer() {
  return (
    <Drawer.Navigator initialRouteName="映画">
      <Drawer.Screen
        name="映画"
        component={MovieStack}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="film-outline" size={size} color={color} />
          )
        }}
      />
      <Drawer.Screen
        name="マイページ"
        component={MypageScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          )
        }}
      />
    </Drawer.Navigator>
  );
}

// ✅ 映画系の画面を管理するスタックナビゲーション
function MovieStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MovieList"
        component={MovieList}
        options={({ navigation }) => ({
          title: "映画一覧",
          headerStyle: { backgroundColor: '#202328' },
          headerTintColor: '#fff',
          headerRight: () => (
            <TouchableOpacity onPress={() => navigation.navigate('SearchMovie')}>
              <Ionicons name="search" size={30} color="#ccc" />
            </TouchableOpacity>
          )
        })}
      />
      <Stack.Screen
        name="MovieDetail"
        component={MovieDetail}
        options={{
          title: "映画詳細",
          headerStyle: { backgroundColor: '#202328' },
          headerTintColor: '#fff'
        }}
      />
      <Stack.Screen
        name="SearchMovie"
        component={SearchMovie}
        options={{
          title: "映画検索",
          headerStyle: { backgroundColor: '#202328' },
          headerTintColor: '#fff'
        }}
      />
      <Stack.Screen
        name="ReviewScreen"
        component={ReviewScreen}
        options={{
          title: "レビューを書く",
          headerStyle: { backgroundColor: '#202328' },
          headerTintColor: '#fff'
        }}
      />
    </Stack.Navigator>
  );
}

// ✅ `NavigationContainer` のルートで `AuthStack` を管理
export default function App() {
  return (
    <NavigationContainer>
      <AuthStack />
    </NavigationContainer>
  );
}
