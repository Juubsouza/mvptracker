import { Button, Input, Text } from "@rneui/themed";
import { FlatList, View, Keyboard } from "react-native";

import {
  selectIsLoading,
  setLoadingTrue,
  setLoadingFalse,
  addMVP,
  removeMVP,
  selectAddedMVPs,
} from "../MVPTracking/mvpTrackingSlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { Header } from "../../components/Header";
import { MVPMonster } from "../../types";
import { MVPListItem } from "../../components/MVPListItem";
import useMVPTrackingService from "./services/index";
import { useTheme } from "@rneui/themed";
import { useCallback, useMemo, useRef, useState } from "react";
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import { Counter } from "../../components/Counter";
import { ragnarokAPITimeToHourNumber } from "../../utils/formatter";
import DropdownAlert, {
  DropdownAlertData,
  DropdownAlertType,
} from "react-native-dropdownalert";

export function MVPTracking() {
  const { theme } = useTheme();
  const { getMVP } = useMVPTrackingService();

  const dispatch = useAppDispatch();
  const mvpTrackingIsLoading = useAppSelector(selectIsLoading);
  const addedMVPs = useAppSelector(selectAddedMVPs);

  const [mvpIDInput, setMvpIDInput] = useState<string>("");
  const [editableRespawnTime, setEditableRespawnTime] = useState<number>(0);
  const [lastIndexPressed, setLastIndexPressed] = useState<number>(-1);

  let alert = (_data: DropdownAlertData) =>
    new Promise<DropdownAlertData>((res) => res);

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const snapPoints = useMemo(() => ["25%", "25%"], []);

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  async function handleAddToList() {
    Keyboard.dismiss();

    dispatch(setLoadingTrue());

    try {
      const response = await getMVP(Number(mvpIDInput));
      const mvp = response.data;

      if (!mvp.skills.mode.some((mode) => mode.toLowerCase().includes("mvp"))) {
        alert({
          type: DropdownAlertType.Warn,
          title: "Error",
          message: "The monster provided is not an MVP. Try a different ID.",
        });
        return;
      }

      if (mvp.maps.length === 0) {
        alert({
          type: DropdownAlertType.Error,
          title: "Error",
          message:
            "This MVP has no maps registered in the database. Try a different ID",
        });
        return;
      }

      dispatch(addMVP(mvp));
    } catch (error) {
      console.log(error);
    } finally {
      setMvpIDInput("");
      dispatch(setLoadingFalse());
    }
  }

  function handleEditRespawnTimePressed(mvp: MVPMonster, index: number) {
    setLastIndexPressed(index);
    setEditableRespawnTime(ragnarokAPITimeToHourNumber(mvp.maps[0].frequency));
    handlePresentModalPress();
  }

  function handleMVPMarkAsKilled(mvpIndex: number) {
    return () => {
      const mvp = addedMVPs[mvpIndex];
      let updatedMVP = { ...mvp, lastKill: new Date().toISOString() };

      dispatch(addMVP(updatedMVP));
    };
  }

  function handleSaveRespawnTime() {
    const mvp = addedMVPs[lastIndexPressed];
    let updatedMVP = {
      ...mvp,
      maps: [
        { ...mvp.maps[0], frequency: `after_${editableRespawnTime}_hours` },
      ],
    };

    dispatch(addMVP(updatedMVP));
    bottomSheetModalRef.current?.dismiss();
  }

  function handleRemoveMVP(mvp: MVPMonster) {
    console.log("Remove MVP pressed!");
    dispatch(removeMVP(mvp));
  }

  return (
    <>
      <DropdownAlert alert={(func) => (alert = func)} />
      <Header />

      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: theme.colors.background,
        }}
      >
        <FlatList
          style={{ width: "95%" }}
          data={addedMVPs}
          contentContainerStyle={{ paddingBottom: 130 }}
          renderItem={({ item, index }) => (
            <MVPListItem
              mvp={item}
              editRespawnTimePressed={() =>
                handleEditRespawnTimePressed(item, index)
              }
              markAsKilledFunction={handleMVPMarkAsKilled(index)}
              removePressed={() => handleRemoveMVP(item)}
            />
          )}
          keyExtractor={(item) => item.monster_id.toString()}
          ListEmptyComponent={
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: theme.colors.primary,
                  fontSize: 30,
                  marginTop: 30,
                }}
              >
                No MVPs added yet
              </Text>
            </View>
          }
        ></FlatList>
        <View
          style={{
            alignItems: "center",
            backgroundColor: theme.colors.primary,
            width: "100%",
            padding: 10,
            position: "absolute",
            bottom: 0,
            alignSelf: "center",
          }}
        >
          <Input
            containerStyle={{ flex: 1 }}
            inputStyle={{ textAlign: "center", color: "white" }}
            placeholder="Enter MVP's ID"
            placeholderTextColor={"white"}
            keyboardType="numeric"
            value={mvpIDInput}
            onChangeText={(text) => setMvpIDInput(text)}
            onSubmitEditing={handleAddToList}
          />
          <Button
            title="Add to the list"
            color={theme.colors.secondary}
            containerStyle={{ width: "100%" }}
            icon={{
              name: "add-to-list",
              type: "entypo",
              size: 20,
              color: "white",
            }}
            radius={10}
            loading={mvpTrackingIsLoading}
            onPress={() => {
              handleAddToList();
            }}
          ></Button>
        </View>
      </View>

      <BottomSheetModalProvider>
        <BottomSheetModal
          ref={bottomSheetModalRef}
          index={1}
          snapPoints={snapPoints}
          backgroundStyle={{ backgroundColor: theme.colors.primary }}
        >
          <BottomSheetView
            style={{
              padding: 16,
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 20, marginBottom: 10, color: "white" }}>
              Edit Respawn Time
            </Text>

            <Counter
              count={editableRespawnTime}
              setCount={setEditableRespawnTime}
            />

            <Button
              title="Save"
              color={theme.colors.secondary}
              containerStyle={{ width: "100%", marginTop: 10 }}
              icon={{
                name: "save",
                type: "antdesign",
                size: 20,
                color: "white",
              }}
              onPress={handleSaveRespawnTime}
              radius={10}
            ></Button>
          </BottomSheetView>
        </BottomSheetModal>
      </BottomSheetModalProvider>
    </>
  );
}
