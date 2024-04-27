import React, { useEffect, useState } from "react";
import { RowComponent, TextComponent } from "@/components";
import { useSelector } from "react-redux";
import { authSelector } from "@/redux/reducers/authReducer";
import defaultAPI from "@/services/defaultApi";
import { appColors } from "@/constants/appColors";
import { globalStyles } from "@/theme/globalStyles";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import {
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  View,
} from "react-native";
import { Divider } from "react-native-paper";

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
  function formatDate(dateFormat: string) {
    const date = new Date(dateFormat);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${day.toString().padStart(2, "0")}-${month
      .toString()
      .padStart(2, "0")}-${year}`;
  }

  const renderItem = ({ item }: { item: order }) => (
    <TouchableOpacity
      style={{
        backgroundColor: appColors.white,
        marginHorizontal: 15,
        marginTop: 15,
        borderRadius: 10,
        flexDirection: "row",
      }}
      onPress={() => {
        navigation.navigate("Xem chi tiết đơn hàng", { id: item.id });
      }}
    >
      <View
        style={{
          flex: 4,
          justifyContent: "center",
          alignItems: "center",
          padding: 10,
        }}
      >
        <TextComponent text="Ngày đặt" />
        <TextComponent text={formatDate(item.createDate)} size={18} />
        {item.isPay == 0 && (
          <TextComponent text="chưa thanh toán" color={appColors.danger} />
        )}
        {item.isPay == 1 && (
          <TextComponent text="đã thanh toán" color={appColors.green} />
        )}
      </View>
      <Divider style={{ height: "100%", width: 1, marginHorizontal: 10 }} />
      <View
        style={{
          flex: 6,
          justifyContent: "center",
          alignItems: "flex-start",
          padding: 10,
        }}
      >
        <RowComponent styles={{ paddingBottom: 5 }}>
          <TextComponent text="Code: " />
          <TextComponent text={item.code} />
        </RowComponent>
        <RowComponent>
          <TextComponent text="Tổng tiền: " />
          <TextComponent
            text={formatPrice(item.total)}
            color={appColors.danger}
            size={20}
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
