import { Terrain } from "../../region/terrain"
import { Race } from "./race"
import { Weather } from "../../region/weather"
import getSight from "./sight"

describe("sight", () => {
  it.each([
    [Race.Human, 14, Terrain.Settlement, Weather.Clear, true],
    [Race.Giant, 0, Terrain.Forest, Weather.Storming, false],
  ])("sanity checks", (race: Race, timeOfDay: number, terrain: Terrain, weather: Weather, isAbleToSee: boolean) => {
    expect(getSight(race).isAbleToSee(timeOfDay, terrain, weather)).toBe(isAbleToSee)
  })
})
