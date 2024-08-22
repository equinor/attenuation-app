import Sound from "react-native-sound";
import testSound from "../assets/audio/500Hz_Dobbelpip.wav";
import { Ear } from "../types";
import {
  VOLUME_DB_INCREMENT_BIG,
  VOLUME_DB_INCREMENT_SMALL,
} from "../constants/sounds";

type UpOrDown = "up" | "down";

export class Sounds {
  public sound: Sound;
  private intervalId: NodeJS.Timeout | null;
  private onSoundCreateAndLoad: () => void;
  private onSoundStopAndRelease: () => void;
  private isFineTuneMode: boolean;
  private firstVolumeAdjustmentUpOrDown: UpOrDown | null;

  constructor(
    onSoundCreateAndLoad: () => void,
    onSoundStopAndRelease: () => void,
  ) {
    this.sound = new Sound(testSound, this.onSoundsLoaded);
    this.intervalId = null;
    this.onSoundCreateAndLoad = onSoundCreateAndLoad;
    this.onSoundStopAndRelease = onSoundStopAndRelease;
    this.isFineTuneMode = false;
    this.firstVolumeAdjustmentUpOrDown = null;
  }

  private onSoundsLoaded = (error: unknown) => {
    if (error) {
      console.error("failed to load the sound", error);
      return;
    }

    const isSoundsLoaded = this.getIsSoundsLoaded(this.getSounds());
    if (isSoundsLoaded) {
      this.initializeSoundPlayback();
      this.onSoundCreateAndLoad();
    }
  };

  private getSounds = () => {
    return [this.sound];
  };

  private getIsSoundsLoaded = (sounds: Sound[]) => {
    let isSoundsLoaded = true;
    sounds.forEach((sound) => {
      if (!sound.isLoaded()) {
        isSoundsLoaded = false;
      }
    });
    return isSoundsLoaded;
  };

  public playInLoop = (ear: Ear) => {
    this.sound.setPan(ear === "left" ? -1 : 1);
    this.intervalId = setInterval(() => {
      this.sound.play();
    }, 1500);
  };

  private calculateNewVolume = (upOrDown: UpOrDown) => {
    let dbIncrement = 0;
    const dbIncrementSize = this.isFineTuneMode
      ? VOLUME_DB_INCREMENT_SMALL
      : VOLUME_DB_INCREMENT_BIG;

    if (upOrDown === "up") {
      dbIncrement += dbIncrementSize;
    } else {
      dbIncrement -= dbIncrementSize;
    }
    return this.sound.getVolume() * Math.pow(10, dbIncrement / 20);
  };

  public adjustVolume = (upOrDown: UpOrDown) => {
    if (this.firstVolumeAdjustmentUpOrDown === null) {
      this.firstVolumeAdjustmentUpOrDown = upOrDown;
    }
    if (
      !this.isFineTuneMode &&
      this.firstVolumeAdjustmentUpOrDown !== null &&
      upOrDown !== this.firstVolumeAdjustmentUpOrDown
    ) {
      this.isFineTuneMode = true;
    }

    let newVolume = this.calculateNewVolume(upOrDown);
    if (newVolume > 1) {
      newVolume = 1;
    }
    if (newVolume < 0) {
      newVolume = 0;
    }
    this.sound.setVolume(newVolume);
  };

  public resetSoundPlayback = () => {
    this.sound.setVolume(1);
    this.isFineTuneMode = false;
    this.firstVolumeAdjustmentUpOrDown = null;
  };

  public stop = () => {
    this.getSounds().forEach((sound) => {
      sound.stop(() => {
        if (this.intervalId) {
          clearInterval(this.intervalId);
          this.intervalId = null;
        }
      });
    });
  };

  private releaseSounds = () => {
    this.getSounds().forEach((sound) => {
      sound.release();
    });
    Sound.setActive(false);
  };

  public stopAndRelease = () => {
    this.stop();
    this.releaseSounds();
    this.onSoundStopAndRelease();
  };

  private initializeSoundPlayback = () => {
    Sound.setCategory("Playback");
    Sound.setMode("Measurement");
    Sound.setActive(true);
  };
}
