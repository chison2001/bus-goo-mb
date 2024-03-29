import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {HomeScreen} from '@/pages';

const MainNavigator = () => {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Main" component={HomeScreen} />
    </Stack.Navigator>
  );
};

export default MainNavigator;
