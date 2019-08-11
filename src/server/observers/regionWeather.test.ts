import {getRandomWeather} from "../../region/constants"
import WeatherService from "../../region/service/weatherService"
import { getTestRegion } from "../../support/test/region"
import { RegionWeather } from "./regionWeather"

describe("region weather server observer", () => {
  it("should update some regions", async () => {
    // setup
    const regions = [
      getTestRegion(),
      getTestRegion(),
      getTestRegion(),
      getTestRegion(),
      getTestRegion(),
      getTestRegion(),
      getTestRegion(),
      getTestRegion(),
      getTestRegion(),
      getTestRegion(),
    ]
    const weatherService = new WeatherService()
    regions.forEach(region => weatherService.updateRegionWeather(region, getRandomWeather()))

    // given
    const weather = regions.map(region => weatherService.getWeatherForRegion(region).get())

    // when
    const regionWeather = new RegionWeather(null as any, weatherService, regions)
    await regionWeather.notify([])

    // then
    const newWeatherPatterns = regions.map(region => weatherService.getWeatherForRegion(region).get())
    expect(weather).not.toBe(newWeatherPatterns)
  })
})
