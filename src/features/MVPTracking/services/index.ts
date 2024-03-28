import axios from "axios";
import { MVPMonster } from "../../../types";

export default function useMVPTrackingService() {
  const api = axios.create({
    baseURL: "https://ragnapi.com/api/v1/old-times/",
  });

  const getMVP = (mvpID: number) => {
    return api.get<MVPMonster>(`monsters/${mvpID}`);
  };

  return {
    getMVP,
  };
}
