import {Weather} from "../enum/weather"
import {createRegion} from "../factory/regionFactory"
import WeatherService from "./weatherService"

describe("weather service", () => {
  it("updates weather per region", () => {
    // setup
    const weatherService = new WeatherService()
    const region = createRegion()

    // when
    weatherService.updateRegionWeather(region, Weather.Blustery)
    weatherService.updateRegionWeather(region, Weather.Clear)

    // then
    expect(weatherService.getWeatherForRegion(region).get()).toBe(Weather.Clear)
  })
})
