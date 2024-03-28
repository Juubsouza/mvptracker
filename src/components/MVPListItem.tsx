import React from "react";

import { View, Image, TouchableOpacity } from "react-native";
import { Text, Card, Button, useTheme, Icon } from "@rneui/themed";

import { MVPMonster, Map } from "../types";
import {
  fromISOStringToHHMM,
  ragnarokAPITimeToHours,
  transformMVPName,
} from "../utils/formatter";

interface Props {
  mvp: MVPMonster;
  editRespawnTimePressed: () => void;
  markAsKilledFunction: () => void;
  removePressed: () => void;
}

export function MVPListItem({
  mvp,
  editRespawnTimePressed,
  markAsKilledFunction,
  removePressed,
}: Props) {
  const { theme } = useTheme();

  return (
    <Card
      containerStyle={{
        borderWidth: 2,
        borderColor: theme.colors.primary,
        borderRadius: 10,
        elevation: 10,
        marginBottom: 20,
      }}
    >
      <TouchableOpacity
        style={{
          position: "absolute",
          top: 0,
          left: 10,
          zIndex: 1,
        }}
        onPress={removePressed}
      >
        <Icon type="fontisto" name="trash" color={theme.colors.error} />
      </TouchableOpacity>
      <Card.Title
        style={{
          fontSize: 20,
          fontFamily: "BaiJamjuree-SemiBoldItalic",
          color: theme.mode === "light" ? theme.colors.primary : "#fff",
        }}
      >
        {transformMVPName(mvp.monster_info)}
      </Card.Title>
      <TouchableOpacity
        style={{
          position: "absolute",
          top: 0,
          right: 10,
        }}
        onPress={editRespawnTimePressed}
      >
        <Icon
          type="material-community"
          name="clock-edit"
          color={theme.mode === "light" ? theme.colors.primary : "#fff"}
        />
      </TouchableOpacity>
      <Card.Divider style={{ borderColor: theme.colors.divider }} />
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Image
          style={{ width: 80, height: 80, marginBottom: 10 }}
          resizeMode="contain"
          source={{ uri: mvp.gif }}
        />
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            flex: 1,
          }}
        >
          <View>
            <Text style={{ fontFamily: "BaiJamjuree-Bold" }}>Last kill</Text>
            <Text>
              {mvp.lastKill
                ? fromISOStringToHHMM(mvp.lastKill)
                : "Not yet killed"}
            </Text>
          </View>
          <View>
            <Text style={{ fontFamily: "BaiJamjuree-Bold" }}>Respawn time</Text>
            <Text>{ragnarokAPITimeToHours(mvp.maps[0].frequency)}</Text>
          </View>
        </View>
      </View>
      <Button
        title="Mark as killed"
        color={theme.colors.secondary}
        icon={{
          name: "sword",
          type: "material-community",
          size: 30,
          color: "white",
        }}
        radius={10}
        onPress={markAsKilledFunction}
      ></Button>
    </Card>
  );
}
