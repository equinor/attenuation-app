import {
  DecibelDifferenceResult,
  ValidEarVolumeResults,
} from "../contexts/_internal/types";
import { getDecibelDifferenceResult } from "../contexts/_internal/getDecibelDifferenceResult";
import { createValue, createError } from "../utils/valueOrError";

describe("getDecibelDifferenceResult", () => {
  it("Should return a DecibelDifferenceResult object, if given an object of type ValidEarVolumeResultsObject", () => {
    const validEarVolumeResults1: ValidEarVolumeResults = {
      left: {
        withoutPlugs: 1,
        withPlugs: 0.1,
      },
      right: {
        withoutPlugs: 0.1,
        withPlugs: 1,
      },
    };

    const expectedValue1: DecibelDifferenceResult = {
      left: createError("VOLUME_HIGHER_WITHOUT_PLUGS"),
      right: createValue(-20),
    };
    expect(getDecibelDifferenceResult(validEarVolumeResults1)).toEqual(
      expectedValue1,
    );

    const validEarVolumeResults2: ValidEarVolumeResults = {
      left: {
        withoutPlugs: 100,
        withPlugs: 0.1,
      },
      right: {
        withoutPlugs: 0.1,
        withPlugs: 1000,
      },
    };

    const expectedValue2: DecibelDifferenceResult = {
      left: createError("VOLUME_HIGHER_WITHOUT_PLUGS"),
      right: createValue(-80),
    };
    expect(getDecibelDifferenceResult(validEarVolumeResults2)).toEqual(
      expectedValue2,
    );
  });
});
