import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MovieList from './screens/MovieList';
import MovieDetail from './screens/MovieDetail';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="MovieList" component={MovieList} options={{
          title: "映画一覧",
          headerStyle: {
            backgroundColor: '#202328',
          },
          headerTintColor: '#fff'
        }}/>
        <Stack.Screen name="MovieDetail" component={MovieDetail} options={{
          title: "映画詳細",
          headerStyle: {
            backgroundColor: '#202328',
          },
          headerTintColor: '#fff'
        }}/>
      </Stack.Navigator>
    </NavigationContainer>
  )
};