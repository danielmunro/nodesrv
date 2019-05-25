import {Weather} from "../enum/weather"
import {Region} from "../model/region"
import WeatherService from "./weatherService"

describe("weather service", () => {
  it("updates weather per region", () => {
    // setup
    const weatherService = new WeatherService()
    const region = new Region()

    // when
    weatherService.updateRegionWeather(region, Weather.Blustery)
    weatherService.updateRegionWeather(region, Weather.Clear)

    // then
    expect(weatherService.getWeatherForRegion(region)).toBe(Weather.Clear)
  })
})
