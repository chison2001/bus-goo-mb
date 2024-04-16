import React, { useEffect, useState } from "react";
import { RowComponent, TextComponent } from "@/components";
import defaultAPI from "@/services/defaultApi";
import { appColors } from "@/constants/appColors";
import { globalStyles } from "@/theme/globalStyles";
import { ActivityIndicator, View, StyleSheet } from "react-native";

interface OrderDetail {
  orderDetailId: null | number;
  code: string;
  seatId: number;
  seatName: string;
  price: number;
  orderId: number;
}
type order = {
  orderId: number;
  code: string;
  isPay: number;
  total: number;
  orderCreateDate: string;
  totalTiketPrice: number;
  totalDiscount: number;
  orderDetails: OrderDetail[];
};

const OrderViewScreen = ({ route, navigation }: any) => {
  const { id } = route.params;
  const [order, setOrder] = useState<order>();
  const [listSeat, setListSeat] = useState<string[]>();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await defaultAPI.HandleAPI("/api/order/get", {}, "get", {
          orderId: id,
        });
        const fetchedOrder = res.data.valueReponse.data;
        setOrder(fetchedOrder);
        setListSeat(
          fetchedOrder.orderDetails.map(
            (detail: { seatName: string }) => detail.seatName
          )
        );
        console.log(order);
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
  return (
    <View style={[globalStyles.container, { padding: 20 }]}>
      {loading && (
        <View
          style={{ justifyContent: "center", flex: 1, alignItems: "center" }}
        >
          <ActivityIndicator size="large" />
        </View>
      )}
      {order !== undefined && listSeat !== undefined && (
        <View>
          <TextComponent text="Thông tin cơ bản" title />
          <RowComponent styles={styles.row}>
            <TextComponent text="Đơn hàng:" />
            <TextComponent text={order.code} />
          </RowComponent>
          <RowComponent styles={styles.row}>
            <TextComponent text="Tình trạng thanh toán" />
            {order.isPay == 0 && (
              <TextComponent text="chưa thanh toán" color={appColors.danger} />
            )}
            {order.isPay == 1 && (
              <TextComponent text="đã thanh toán" color={appColors.green} />
            )}
          </RowComponent>
          <RowComponent styles={styles.row}>
            <TextComponent text="Ngày đặt: " />
            <TextComponent text={order.orderCreateDate} />
          </RowComponent>
          <RowComponent styles={styles.row}>
            <TextComponent text="Các ghế đã đặt: " />
            <TextComponent text={listSeat?.join(", ")} />
          </RowComponent>
          <RowComponent styles={styles.row}>
            <TextComponent text="Tổng phụ: " />
            <TextComponent text={formatPrice(order.totalTiketPrice)} />
          </RowComponent>
          <RowComponent styles={styles.row}>
            <TextComponent text="Khuyến mãi: " />
            <TextComponent text={formatPrice(order.totalDiscount)} />
          </RowComponent>
          <RowComponent styles={styles.row}>
            <TextComponent text="Thành tiền: " />
            <TextComponent text={formatPrice(order.total)} />
          </RowComponent>
        </View>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  row: {
    marginTop: 20,
    justifyContent: "space-between",
  },
  buttomSubmit: {
    marginTop: 30,
  },
});
export default OrderViewScreen;
