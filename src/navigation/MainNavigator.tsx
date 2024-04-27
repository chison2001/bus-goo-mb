import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useEffect, useRef } from "react";
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
  ProfileScreen,
} from "@/pages";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { TouchableOpacity, StyleSheet, Text } from "react-native";
import { Colors } from "react-native/Libraries/NewAppScreen";
import * as Animatable from "react-native-animatable";
import { RowComponent, TextComponent } from "@/components";
import { appColors } from "@/constants/appColors";

const HomeStack = () => {
  const Stack = createNativeStackNavigator();
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
          headerShown: true,
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

const OrderStack = () => {
  const Stack = createNativeStackNavigator();
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
        name="Xem đơn hàng"
        component={OrderList}
        options={{
          headerShown: true,
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
const InvoiceStack = () => {
  const Stack = createNativeStackNavigator();
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

const SettingStack = () => {
  const Stack = createNativeStackNavigator();
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
        name="Hồ sơ"
        component={ProfileScreen}
        options={{
          headerShown: true,
        }}
      />
    </Stack.Navigator>
  );
};

const TabButton = (props) => {
  const { item, onPress, accessibilityState, label } = props;
  const focused = accessibilityState.selected;
  const viewRef = useRef(null);

  useEffect(() => {
    if (focused) {
      viewRef.current.animate({
        0: { scale: 0.5 },
        1: { scale: 1.3 },
      });
    } else {
      viewRef.current.animate({
        0: { scale: 1.3 },
        1: { scale: 1 },
      });
    }
  }, [focused]);

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={1}
      style={[styles.container, { top: 0 }]}
    >
      <Animatable.View ref={viewRef} duration={1000}>
        <RowComponent styles={{ alignItems: "center" }}>
          <Icon
            size={20}
            name={focused ? item.activeIcon : item.inActiveIcon}
            color={focused ? appColors.primary : appColors.gray4}
          />
        </RowComponent>
        <TextComponent
          styles={{ fontSize: 14 }}
          color={focused ? appColors.primary : appColors.gray4}
          text={item.label}
        />
      </Animatable.View>
    </TouchableOpacity>
  );
};

const TabArr = [
  {
    route: "Home",
    label: "Trang chủ",
    activeIcon: "home",
    inActiveIcon: "home-outline",
    component: HomeStack,
  },
  {
    route: "Order",
    label: "Đơn hàng",
    activeIcon: "cart",
    inActiveIcon: "cart-outline",
    component: OrderStack,
  },
  {
    route: "Invoice",
    label: "Hoá đơn",
    activeIcon: "file-check",
    inActiveIcon: "file-check-outline",
    component: InvoiceStack,
  },
  {
    route: "Profile",
    label: "Hồ sơ",
    activeIcon: "account-circle",
    inActiveIcon: "account-circle-outline",
    component: SettingStack,
  },
];

const MainNavigator = () => {
  const Tab = createBottomTabNavigator();
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          flex: 0.1,
          height: 60,
          position: "absolute",
          justifyContent: "center",
          alignItems: "center",
        },
      }}
    >
      {TabArr.map((item, index) => {
        return (
          <Tab.Screen
            key={index}
            name={item.route}
            component={item.component}
            options={{
              tabBarShowLabel: false,
              tabBarButton: (props) => <TabButton {...props} item={item} />,
            }}
          />
        );
      })}
    </Tab.Navigator>
  );
};
export default MainNavigator;

const styles = StyleSheet.create({
  container: {
    flex: 0.8,
    justifyContent: "center",
    alignItems: "center",
    height: 60,
  },
});
