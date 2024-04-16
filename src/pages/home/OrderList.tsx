import React, { useEffect, useState } from "react";
import { RowComponent, TextComponent } from "@/components";
import { useSelector } from "react-redux";
import { authSelector } from "@/redux/reducers/authReducer";
import defaultAPI from "@/services/defaultApi";
import { appColors } from "@/constants/appColors";
import { globalStyles } from "@/theme/globalStyles";
import {
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  View,
} from "react-native";

type order = {
  id: number;
  code: string;
  isPay: number;
  status: number;
  userCode: string;
  userName: string;
  total: number;
  createDate: string;
};
const OrderList = ({ navigation }: any) => {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([] as order[]);
  const auth = useSelector(authSelector);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await defaultAPI.HandleAPI(
          "/api/order/mobile/find",
          {},
          "get",
          {
            userId: auth.id,
          }
        );
        setOrders(res.data.valueReponse.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchData();
  }, []);
  function formatPrice(value: number) {
    return `${value.toLocaleString("vi-VN")} VNĐ`;
  }
  const renderItem = ({ item }: { item: order }) => (
    <TouchableOpacity
      style={{ backgroundColor: appColors.white, margin: 5, padding: 10 }}
      onPress={() => {
        navigation.navigate("Xem chi tiết đơn hàng", { id: item.id });
      }}
    >
      <View style={{ alignItems: "flex-start" }}>
        <RowComponent>
          <TextComponent text="Đơn hàng #" title />
          <TextComponent text={item.code} title />
        </RowComponent>
        <RowComponent>
          <TextComponent text="Trạng thái thanh toán: " />
          {item.isPay == 0 && (
            <TextComponent text="chưa thanh toán" color={appColors.danger} />
          )}
          {item.isPay == 1 && (
            <TextComponent text="đã thanh toán" color={appColors.green} />
          )}
        </RowComponent>
        <RowComponent>
          <TextComponent text="Ngày đặt: " />
          <TextComponent text={item.createDate} />
        </RowComponent>
        <RowComponent>
          <TextComponent text="Tổng tiền: " />
          <TextComponent
            text={formatPrice(item.total)}
            color={appColors.danger}
          />
        </RowComponent>
      </View>
    </TouchableOpacity>
  );
  return (
    <View style={[globalStyles.container_list]}>
      {loading && (
        <View
          style={{ justifyContent: "center", flex: 1, alignItems: "center" }}
        >
          <ActivityIndicator size="large" />
        </View>
      )}
      <FlatList
        data={orders}
        renderItem={renderItem}
        keyExtractor={(item: order) => item.id.toString()}
      />
    </View>
  );
};

export default OrderList;
