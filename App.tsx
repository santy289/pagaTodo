import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import List from './src/app/screens/List';
import Login from './src/app/screens/Login';
import {
  API_KEY,
  AUTH_DOMAIN,
  PROJECT_ID,
  STORAGE_BUCKET,
  MENSSAGIN_SENDER_ID,
  APP_ID,
  MEASUREMENT_ID,
} from "@env";


const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={Login}/>
        <Stack.Screen name="List" component={List}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
