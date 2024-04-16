import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import {
  HomeScreen,
  ListTicketScreen,
  SelectSeatScreen,
  ConfirmOrderScreen,
  VNPAYScreen,
  VerifyPaymentScreen,
  OrderList,
  OrderViewScreen,
  InvoiceListScreen,
  InvoiceViewScreen,
} from "@/pages";
import Icon from "react-native-vector-icons/Entypo";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import DrawerContent from "@/components/elements/DrawerContent";

const StackNav = () => {
  const Stack = createNativeStackNavigator();
  const navigation = useNavigation();
  return (
    <Stack.Navigator
      screenOptions={{
        statusBarColor: "#0163d2",
        headerStyle: {
          backgroundColor: "#0163d2",
        },
        headerTintColor: "#fff",
        headerTitleAlign: "center",
      }}
    >
      <Stack.Screen
        name="Trang chủ"
        component={HomeScreen}
        options={{
          headerLeft: () => {
            return (
              <Icon
                name="menu"
                onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
                size={30}
                color="#fff"
              />
            );
          },
        }}
      />
      <Stack.Screen
        name="Xem đơn hàng"
        component={OrderList}
        options={{
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="Xem vé"
        component={ListTicketScreen}
        options={{
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="Chọn ghế"
        component={SelectSeatScreen}
        options={{
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="Xác nhận"
        component={ConfirmOrderScreen}
        options={{
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="VNPAY"
        component={VNPAYScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="verify"
        component={VerifyPaymentScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Xem chi tiết đơn hàng"
        component={OrderViewScreen}
        options={{
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="Xem hoá đơn"
        component={InvoiceListScreen}
        options={{
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="Xem chi tiết hoá đơn"
        component={InvoiceViewScreen}
        options={{
          headerShown: true,
        }}
      />
    </Stack.Navigator>
  );
};

const MainNavigator = () => {
  const Drawer = createDrawerNavigator();
  return (
    <Drawer.Navigator
      drawerContent={(props) => <DrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Drawer.Screen name="Home" component={StackNav} />
    </Drawer.Navigator>
  );
};

export default MainNavigator;
