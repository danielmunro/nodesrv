import { Terrain } from "../../region/terrain"
import { Weather } from "../../region/weather"
import { RaceType } from "./enum/raceType"
import createRaceFromRaceType from "./factory"
import {isAbleToSee} from "./sight"

describe("sight", () => {
  it.each([
    [RaceType.Human, 14, Terrain.Settlement, Weather.Clear, true],
    [RaceType.Human, 0, Terrain.Settlement, Weather.Clear, false],
    [RaceType.Faerie, 0, Terrain.Forest, Weather.Storming, false],
    [RaceType.Faerie, 0, Terrain.Plains, Weather.Clear, false],
    [RaceType.Giant, 0, Terrain.Forest, Weather.Storming, false],
    [RaceType.Giant, 6, Terrain.Settlement, Weather.Clear, false],
    [RaceType.Giant, 6, Terrain.Forest, Weather.Raining, false],
    [RaceType.Giant, 7, Terrain.Settlement, Weather.Clear, true],
    [RaceType.Kender, 20, Terrain.Forest, Weather.Storming, true],
    [RaceType.Kender, 21, Terrain.Forest, Weather.Storming, false],
  ])("sanity createDefaultCheckFor %s (time: %i, terrain: %s, weather: %s). Should be able to see: %s",
    (race: RaceType, timeOfDay: number, terrain: Terrain, weather: Weather, expectedToSee: boolean) => {
    expect(isAbleToSee(
      createRaceFromRaceType(race).sight, timeOfDay, terrain, weather)).toBe(expectedToSee)
  })
})
