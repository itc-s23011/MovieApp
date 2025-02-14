import React, { useState, useEffect, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import MovieList from './screens/MovieList';
import MovieDetail from './screens/MovieDetail';
import SearchMovie from './screens/SearchMovie';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import MypageScreen from './screens/MypageScreen';
import Ionicons from "@expo/vector-icons/Ionicons";
import { TouchableOpacity } from 'react-native';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

export default function App() {
  const navigationRef = useRef(); // NavigationContainerのリファレンスを作成

  return (
    <NavigationContainer ref={navigationRef}>
      <AuthNavigator navigationRef={navigationRef} />
    </NavigationContainer>
  );
}

// 認証状態を監視するナビゲーション
function AuthNavigator({ navigationRef }) {
  const [user, setUser] = useState(null);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // ログイン後に MovieList 画面へ移動
        navigationRef.current?.navigate("MovieList");
      }
    });
    return () => unsubscribe();
  }, []);

  return user ? <MainDrawer /> : <AuthStack />;
}

// ログイン/登録のスタックナビゲーション
function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

// メインのDrawerナビゲーション
function MainDrawer() {
  return (
    <Drawer.Navigator initialRouteName="映画">
      <Drawer.Screen name="映画" component={MovieStack} />
      <Drawer.Screen name="マイページ" component={MypageScreen} />
    </Drawer.Navigator>
  );
}

// 映画関連のスタックナビゲーション
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
          ),
        })}
      />
      <Stack.Screen
        name="MovieDetail"
        component={MovieDetail}
        options={{
          title: "映画詳細",
          headerStyle: { backgroundColor: '#202328' },
          headerTintColor: '#fff',
        }}
      />
      <Stack.Screen
        name="SearchMovie"
        component={SearchMovie}
        options={{
          title: "映画検索",
          headerStyle: { backgroundColor: '#202328' },
          headerTintColor: '#fff',
        }}
      />
    </Stack.Navigator>
  );
}
