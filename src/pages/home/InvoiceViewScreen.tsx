import React, { useEffect, useState } from "react";
import { RowComponent, TextComponent } from "@/components";
import defaultAPI from "@/services/defaultApi";
import { appColors } from "@/constants/appColors";
import { globalStyles } from "@/theme/globalStyles";
import { ActivityIndicator, View, StyleSheet } from "react-native";

interface invoiceDetail {
  orderDetailId: null | number;
  code: string;
  seatId: number;
  seatName: string;
  price: number;
  invoiceId: number;
}
type invoice = {
  invoiceId: number;
  code: string;
  isPay: number;
  total: number;
  timeBooking: string;
  totalTiketPrice: number;
  totalDiscount: number;
  busTrip: string;
  dateStarted: string;
  startedTime: string;
  list: invoiceDetail[];
};

const InvoiceViewScreen = ({ route, navigation }: any) => {
  const { id } = route.params;
  const [invoice, setInvoice] = useState<invoice>();
  const [listSeat, setListSeat] = useState<string[]>();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await defaultAPI.HandleAPI("/api/invoice/get", {}, "get", {
          invoiceId: id,
        });
        const fetchedInvoice = res.data.valueReponse.data;
        setInvoice(fetchedInvoice);
        setListSeat(
          fetchedInvoice.list.map(
            (detail: { seatName: string }) => detail.seatName
          )
        );
        console.log(invoice);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching invoices:", error);
      }
    };

    fetchData();
  }, []);
  function formatPrice(value: number) {
    return `${value.toLocaleString("vi-VN")} VNĐ`;
  }
  function formatTime(timeString: any) {
    const [hours, minutes] = timeString.split(":");

    return `${hours}:${minutes}`;
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
      {invoice !== undefined && listSeat !== undefined && (
        <View>
          <TextComponent text="Thông tin cơ bản" title />
          <RowComponent styles={styles.row}>
            <TextComponent text="Đơn hàng:" />
            <TextComponent text={invoice.code} />
          </RowComponent>
          <RowComponent styles={styles.row}>
            <TextComponent text="Tuyến đường: " />
            <TextComponent text={invoice.busTrip} />
          </RowComponent>
          <RowComponent styles={styles.row}>
            <TextComponent text="Thời gian khởi hành: " />
            <TextComponent
              text={`${formatTime(invoice.startedTime)} ${invoice.dateStarted}`}
            />
          </RowComponent>
          <RowComponent styles={styles.row}>
            <TextComponent text="Ngày đặt: " />
            <TextComponent text={invoice.timeBooking} />
          </RowComponent>
          <RowComponent styles={styles.row}>
            <TextComponent text="Các ghế đã đặt: " />
            <TextComponent text={listSeat?.join(", ")} />
          </RowComponent>
          <RowComponent styles={styles.row}>
            <TextComponent text="Tổng phụ: " />
            <TextComponent text={formatPrice(invoice.totalTiketPrice)} />
          </RowComponent>
          <RowComponent styles={styles.row}>
            <TextComponent text="Khuyến mãi: " />
            <TextComponent text={formatPrice(invoice.totalDiscount)} />
          </RowComponent>
          <RowComponent styles={styles.row}>
            <TextComponent text="Thành tiền: " />
            <TextComponent text={formatPrice(invoice.total)} />
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
export default InvoiceViewScreen;
