import { Terrain } from "../../region/terrain"
import { Weather } from "../../region/weather"
import { Race } from "./race"
import getSight from "./sight"

describe("sight", () => {
  it.each([
    [Race.Human, 14, Terrain.Settlement, Weather.Clear, true],
    [Race.Human, 0, Terrain.Settlement, Weather.Clear, false],
    [Race.Faerie, 0, Terrain.Forest, Weather.Storming, false],
    [Race.Faerie, 0, Terrain.Plains, Weather.Clear, false],
    [Race.Giant, 0, Terrain.Forest, Weather.Storming, false],
    [Race.Giant, 6, Terrain.Settlement, Weather.Clear, false],
    [Race.Giant, 7, Terrain.Settlement, Weather.Clear, true],
    [Race.Kender, 20, Terrain.Forest, Weather.Storming, true],
    [Race.Kender, 21, Terrain.Forest, Weather.Storming, false],
  ])("sanity check %s (time: %i, terrain: %s, weather: %s). Should be able to see: %s",
    (race: Race, timeOfDay: number, terrain: Terrain, weather: Weather, isAbleToSee: boolean) => {
    expect(getSight(race).isAbleToSee(timeOfDay, terrain, weather)).toBe(isAbleToSee)
  })
})
