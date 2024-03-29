import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import { LoginScreen, SignUpScreen } from '@/pages';

const AuthNavigator = () => {
  const Stack = createNativeStackNavigator();
  // const [isExistingUser, setIsExistingUser] = useState(false);

  // useEffect(() => {
  //   checkUserExisting();
  // }, []);

  // const checkUserExisting = async () => {
  //   const res = await AsyncStorage.getItem('auth');

  //   res && setIsExistingUser(true);
  // };

  // console.log(isExistingUser);

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
