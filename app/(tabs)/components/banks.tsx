import { useTheme } from "@/hooks/useThemeContext";
import { IBank, Transaction } from "@/services/transaction";
import { useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { ChevronLeftIcon } from "react-native-heroicons/outline";

interface IBanks {
  close: () => void;
  onSelected: (bank: IBank) => void;
}

const Banks = ({ close, onSelected }: IBanks) => {
  const { theme } = useTheme();
  const [banks, setBanks] = useState<IBank[]>([]);

  useEffect(() => {
    Transaction.getBanks().then((data) => {
      setBanks(data ?? []);
    });
  }, []);

  const handleBankSelected = (bank: IBank) => {
    onSelected(bank);
  };

  return (
    <View
      style={{
        position: "absolute",
        width: "100%",
        bottom: 0,
        backgroundColor: !theme ? "#ffffff" : "#141414",
        height: "70%",
      }}
    >
      <View
        style={{
          height: 60,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          justifyContent: "center",
          backgroundColor: !theme ? "#F8F8F8" : "#1D1F20",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            width: "60%",
            justifyContent: "space-between",
          }}
        >
          <View className="">
            <TouchableOpacity
              onPress={close}
              className={` w-[0px] rounded-full`}
              style={{
                paddingLeft: 10,
              }}
            >
              <ChevronLeftIcon
                size={25}
                color={!theme ? "#292D32" : "#ffffff"}
              />
            </TouchableOpacity>
          </View>

          <Text
            style={{
              fontSize: 16,
              fontWeight: 600,
              color: `${!theme ? "#000000" : "#ffffff"}`,
            }}
          >
            Banks
          </Text>
        </View>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 0, paddingTop: 10 }}
        scrollsToTop
      >
        {banks.map((item, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => {
              handleBankSelected(item);
            }}
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              borderRadius: 12,
              padding: 12,
              marginBottom: 5,
            }}
          >
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 16, // text-base
                  fontWeight: "600", // font-semibold
                  color: !theme ? "#000000" : "#ffffff",
                }}
              >
                {item.name}
              </Text>
              <Text
                style={{
                  width: 185,
                  height: 30,
                  fontSize: 10,
                  color: "#8F8F8F",
                  textTransform: "capitalize",
                }}
              >
                {item.slug}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default Banks;
