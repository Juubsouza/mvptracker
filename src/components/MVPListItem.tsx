import React from "react";

import { View, Image, TouchableOpacity } from "react-native";
import { Text, Card, Button, useTheme, Icon } from "@rneui/themed";

import { MVPMonster, Map } from "../types";
import {
  fromISOStringToHHMM,
  ragnarokAPITimeToHourNumber,
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

  function getRemainingRespawnTime(mvp: MVPMonster) {
    if (!mvp.lastKill) {
      return -1;
    }

    const lastKillDate = new Date(mvp.lastKill);
    const respawnTimeInHour = ragnarokAPITimeToHourNumber(
      mvp.maps[0].frequency
    );

    const nextRespawnDate = new Date(
      lastKillDate.getTime() + respawnTimeInHour * 60 * 60 * 1000
    );
    const now = new Date();

    const remainingTime = nextRespawnDate.getTime() - now.getTime();

    if (remainingTime < 0) {
      return -1;
    }

    return remainingTime;
  }

  function monsterIsAboutToRespawn() {
    if (!mvp.lastKill) {
      return false;
    }

    const remainingTime = getRemainingRespawnTime(mvp);

    if (typeof remainingTime === "number") {
      return remainingTime <= 5 * 60 * 1000;
    }

    return false;
  }

  function getNextRespawnTime() {
    if (!mvp.lastKill) {
      return "Not yet killed";
    }

    const lastKillDate = new Date(mvp.lastKill);
    const respawnTimeInHour = ragnarokAPITimeToHourNumber(
      mvp.maps[0].frequency
    );

    const nextRespawnDate = new Date(
      lastKillDate.getTime() + respawnTimeInHour * 60 * 60 * 1000
    );

    return fromISOStringToHHMM(nextRespawnDate.toISOString());
  }

  function getNextRespawnTextColor() {
    const isDarkMode = theme.mode === "dark";

    if (monsterIsAboutToRespawn()) {
      return "#18645e";
    }

    return isDarkMode ? "#fff" : "#000";
  }

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
      <Text
        style={{
          alignSelf: "center",
          fontSize: 20,
          fontFamily: "BaiJamjuree-Bold",
          color: theme.mode === "light" ? theme.colors.primary : "#fff",
        }}
      >
        {transformMVPName(mvp.monster_info)}
      </Text>
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
            <Text
              style={{
                fontFamily: "BaiJamjuree-Bold",
                color: getNextRespawnTextColor(),
              }}
            >
              Next respawn
            </Text>
            <Text style={{ color: getNextRespawnTextColor() }}>
              {getNextRespawnTime()}
            </Text>
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
