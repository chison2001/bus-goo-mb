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
import {
  Button,
  FlatList,
  TouchableOpacity,
  View,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { appColors } from "@/constants/appColors";
import defaultAPI from "@/services/defaultApi";
import { globalStyles } from "@/theme/globalStyles";
import { SegmentedButtons } from "react-native-paper";
interface SeatOrder {
  id: number;
  seatName: string;
  seatType: string;
  timeTableId: number;
  orderDetailId: number;
  isAvailable: boolean;
}
interface Ticket {
  timeTableId: number;
  timeStated: string;
  priceDetailId: number;
  priceValue: number;
  countEmptySeat: number;
  routeId: number;
  typeBusName: string;
  transferTime: string;
  fromName: string;
  toName: string;
  expanded: boolean;
  endTime: string;
  seatOrder: SeatOrder[];
}
type SeatProps = {
  seatName: string;
  isAvailable: boolean;
  onPress: () => void;
  backgroundColor: string;
};
const Seat: React.FC<SeatProps> = ({
  seatName,
  isAvailable,
  onPress,
  backgroundColor,
}) => {
  return (
    <TouchableOpacity
      style={[styles.seat, { backgroundColor }]}
      onPress={onPress}
      disabled={!isAvailable}
    >
      <TextComponent text={seatName} color={appColors.white2} />
    </TouchableOpacity>
  );
};
const SelectSeatScreen = ({ route, navigation }: any) => {
  const { timeTableId, from, to } = route.params;
  const [ticket, setTicket] = useState<Ticket>();
  const [selectedDeck, setSelectedDeck] = useState("lower");
  const [selectedSeats, setSelectedSeats] = useState([] as string[]);
  const [seatsLowerDeck, setSeatsLowerDeck] = useState([] as SeatOrder[]);
  const [seatsUpperDeck, setSeatsUpperDeck] = useState([] as SeatOrder[]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await defaultAPI.HandleAPI(
          "/api/bustrip/get-bus-trip",
          {},
          "get",
          {
            timeTableId: timeTableId,
          }
        );
        const fetchedTicket = res.data.valueReponse.data;
        setTicket(fetchedTicket);
        setSeatsLowerDeck(
          fetchedTicket.seatOrder.filter(
            (seat: SeatOrder) => seat.seatType === "D"
          )
        );
        setSeatsUpperDeck(
          fetchedTicket.seatOrder.filter(
            (seat: SeatOrder) => seat.seatType === "T"
          )
        );
        setLoading(false);
      } catch (error) {
        console.error("Error fetching ticket:", error);
      }
    };

    fetchData();
  }, [timeTableId]);
  const handleSelectSeat = (name: string) => {
    setSelectedSeats((prevSelectedSeats) => {
      if (prevSelectedSeats.includes(name)) {
        return prevSelectedSeats.filter((seatName) => seatName !== name);
      } else {
        return [...prevSelectedSeats, name];
      }
    });
  };

  const renderSeat = ({ item }: { item: SeatOrder }) => {
    const isSelected = selectedSeats.includes(item.seatName);
    const backgroundColor = isSelected
      ? appColors.orange
      : item.isAvailable
      ? appColors.primary
      : appColors.gray3;

    return (
      <Seat
        seatName={item.seatName}
        isAvailable={item.isAvailable}
        onPress={() => handleSelectSeat(item.seatName)}
        backgroundColor={backgroundColor}
      />
    );
  };
  const handleNavigate = () => {
    const listSeatOrder: number[] = [];

    selectedSeats.forEach((seat) => {
      ticket?.seatOrder.forEach((seatOrder) => {
        if (seat === seatOrder.seatName) listSeatOrder.push(seatOrder.id);
      });
    });
    navigation.navigate("Xác nhận", {
      from: from,
      to: to,
      routeName: ticket?.fromName + " - " + ticket?.toName,
      time: ticket?.timeStated,
      price: ticket?.priceValue,
      selectedSeats: selectedSeats,
      listSeatOrder: listSeatOrder,
    });
  };

  const seatsToDisplay =
    selectedDeck === "lower" ? seatsLowerDeck : seatsUpperDeck;
  return (
    <View style={globalStyles.container}>
      {loading && (
        <View
          style={{ justifyContent: "center", flex: 1, alignItems: "center" }}
        >
          <ActivityIndicator size="large" />
        </View>
      )}
      {!loading && (
        <View style={{ flex: 1 }}>
          <SegmentedButtons
            value={selectedDeck}
            onValueChange={setSelectedDeck}
            buttons={[
              {
                value: "lower",
                label: "Tầng dưới",
              },
              {
                value: "upper",
                label: "Tầng trên",
              },
            ]}
            style={styles.segment}
          />

          <FlatList
            data={seatsToDisplay}
            renderItem={renderSeat}
            keyExtractor={(item) => item.seatName}
            numColumns={3}
            contentContainerStyle={styles.list}
          />
          <View style={styles.buttomSubmit}>
            <ButtonComponent
              text="Đặt vé"
              type="primary"
              onPress={handleNavigate}
            />
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  segment: {
    marginHorizontal: 40,
    alignItems: "center",
    flex: 0.15,
  },
  seat: {
    height: 60,
    width: 60,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 35,
    borderRadius: 10,
  },
  list: {
    justifyContent: "space-between",
    flex: 0.9,
  },
  buttomSubmit: {
    flex: 0.2,
  },
});

export default SelectSeatScreen;
