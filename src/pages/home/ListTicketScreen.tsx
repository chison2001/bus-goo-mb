import React, { useEffect, useState } from "react";
import {
  ButtonComponent,
  ContainerComponent,
  InputComponent,
  RowComponent,
  SectionComponent,
  SpaceComponent,
  TextComponent,
} from "@/components";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from "react-redux";
import { authSelector, removeAuth } from "@/redux/reducers/authReducer";
import defaultAPI from "@/services/defaultApi";
import {
  FlatList,
  ScrollView,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { globalStyles } from "@/theme/globalStyles";
import { Divider } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { appColors } from "@/constants/appColors";

type TimeTableItem = {
  timeTableId: number;
  timeStated: string;
  priceDetailId: number;
  priceValue: number;
  countEmptySeat: number;
  routeId: number;
  transferTime: string;
  fromName: string;
  toName: string;
  typeBusName: string;
  expanded: boolean;
  endTime: string;
};
const ListTicketScreen = ({ route, navigation }: any) => {
  const [tickets, setTickets] = useState([] as TimeTableItem[]);
  const { from, to, date } = route.params;
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await defaultAPI.HandleAPI("/api/bustrip/get", {}, "get", {
          fromId: Number(from),
          toId: to,
          timeStarted: date,
        });
        setTickets(res.data.valueReponse.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching cities:", error);
      }
    };

    fetchData();
  }, []);
  function formatTime(timeString: any) {
    const [hours, minutes] = timeString.split(":");

    return `${hours}:${minutes}`;
  }
  function formatToTime(dateTimeString: any) {
    const dateformat = new Date(dateTimeString);

    return dateformat.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  }
  function formatPrice(value: number) {
    return `${value.toLocaleString("vi-VN")} VNĐ`;
  }
  const renderItem = ({ item }: { item: TimeTableItem }) => (
    <TouchableOpacity
      style={[globalStyles.list]}
      onPress={() => {
        navigation.navigate("Chọn ghế", {
          timeTableId: item.timeTableId,
          from: from,
          to: to,
        });
      }}
    >
      <RowComponent>
        <TextComponent text={formatToTime(item.timeStated)} size={24} />
        <Icon name="record-circle" color={appColors.orange} size={20} />
        <Divider horizontalInset style={{ height: 2, width: 50 }} />
        <View style={{ alignItems: "center" }}>
          <TextComponent text={formatTime(item.transferTime)} size={22} />
          <TextComponent text="(dự kiến)" />
        </View>
        <Divider horizontalInset style={{ height: 2, width: 50 }} />
        <Icon name="map-marker" color={appColors.orange} size={20} />
        <TextComponent text={formatToTime(item.endTime)} size={24} />
      </RowComponent>
      <RowComponent styles={{ justifyContent: "space-between" }}>
        <TextComponent text={item.fromName} title size={14} />
        <TextComponent text={item.toName} title size={14} />
      </RowComponent>
      <Divider style={{ height: 1, width: "100%", marginVertical: 10 }} />
      <RowComponent styles={{ justifyContent: "space-between" }}>
        <RowComponent>
          <Icon name="circle" color={appColors.gray3} size={10} />
          <TextComponent
            text={item.typeBusName}
            styles={{ paddingHorizontal: 5 }}
          />
          <Icon name="circle" color={appColors.gray3} size={10} />
          <RowComponent styles={{ paddingHorizontal: 5 }}>
            <TextComponent
              text={String(item.countEmptySeat)}
              color={appColors.green}
            />
            <TextComponent text=" chỗ trống" color={appColors.green} />
          </RowComponent>
        </RowComponent>
        <TextComponent
          text={formatPrice(item.priceValue)}
          color={appColors.danger}
        />
      </RowComponent>
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
      {!loading && tickets === undefined && (
        <View style={[globalStyles.card]}>
          <TextComponent text="Không tìm thấy vé" />
        </View>
      )}
      <FlatList
        data={tickets}
        renderItem={renderItem}
        keyExtractor={(item: TimeTableItem) => item.timeTableId.toString()}
      />
    </View>
  );
};

export default ListTicketScreen;
