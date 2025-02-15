import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import MovieList from './screens/MovieList';
import MovieDetail from './screens/MovieDetail';
import SearchMovie from './screens/SearchMovie';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import ReviewScreen from './screens/ReviewScreen'; // ✅ 修正：綴りミス修正 & 追加
import Ionicons from "@expo/vector-icons/Ionicons";
import { TouchableOpacity } from 'react-native';
import React from 'react';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

// ✅ 修正：Drawer ナビゲーターを最上位にする
export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="映画">
        <Drawer.Screen name="映画" component={MovieStack} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

// ✅ 修正：スタックナビゲーターを別関数にまとめる
function MovieStack() {
  return (
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
          headerStyle: { backgroundColor: '#202328' },
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
          headerStyle: { backgroundColor: '#202328' },
          headerTintColor: '#fff'
        }}
      />

      {/* 映画検索画面 */}
      <Stack.Screen
        name="SearchMovie"
        component={SearchMovie}
        options={{
          title: "映画検索",
          headerStyle: { backgroundColor: '#202328' },
          headerTintColor: '#fff'
        }}
      />

      {/* ✅ 追加：レビュー投稿画面 */}
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
