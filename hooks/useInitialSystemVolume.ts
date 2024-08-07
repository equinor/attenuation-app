import { useEffect, useState } from "react";
import SystemSetting from "react-native-system-setting";

import { SYSTEM_VOLUME } from "../constants/sounds";
import { setSystemVolume } from "../utils/volume/setSystemVolume";

export const useInitialSystemVolume = () => {
  const [initialSystemVolume, setInitialSystemVolume] = useState(SYSTEM_VOLUME);

  useEffect(() => {
    const setInitialDeviceSystemVolume = async () => {
      await SystemSetting.getVolume()
        .then((volume) => setInitialSystemVolume(volume))
        .catch((error) => {
          throw new Error(
            `useInitialSystemVolume: Error getting system volume: ${error}`,
          );
        });
    };
    void setInitialDeviceSystemVolume();

    return () => setSystemVolume(initialSystemVolume);
  }, []);

  return { initialSystemVolume };
};
