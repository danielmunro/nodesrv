import Maybe from "../support/functional/maybe/maybe"
import {pickOne} from "../support/random/helpers"
import {Terrain} from "./enum/terrain"
import {Weather} from "./enum/weather"

export const MESSAGE_WEATHER_CLEAR = "The sky clears up."
export const MESSAGE_WEATHER_BLUSTERY = "The wind picks up."
export const MESSAGE_WEATHER_OVERCAST = "High altitude clouds lay like waves across the sky."
export const MESSAGE_WEATHER_RAINING = "A trickle of rain picks up."
export const MESSAGE_WEATHER_STORMING = "Dark thunderclouds consume the sky as rain pours down."

interface WeatherMessage {
  weather: Weather
  message: string
}

function createMapEntry(weather: Weather, message: string): WeatherMessage {
  return {weather, message}
}

export const weatherMessageMap = [
  createMapEntry(Weather.Clear, MESSAGE_WEATHER_CLEAR),
  createMapEntry(Weather.Blustery, MESSAGE_WEATHER_BLUSTERY),
  createMapEntry(Weather.Overcast, MESSAGE_WEATHER_OVERCAST),
  createMapEntry(Weather.Raining, MESSAGE_WEATHER_RAINING),
  createMapEntry(Weather.Storming, MESSAGE_WEATHER_STORMING),
]
export const allWeather = [
  Weather.Clear,
  Weather.Blustery,
  Weather.Overcast,
  Weather.Raining,
  Weather.Storming,
]

export function getRandomWeather(): Weather {
  return pickOne(allWeather)
}

export function getWeatherTransitionMessage(weather: Weather) {
  return new Maybe<WeatherMessage>(weatherMessageMap.find((w) => w.weather === weather))
    .or(() => weatherMessageMap[0])
    .get().message
}

export const allTerrains = [
  Terrain.Settlement,
  Terrain.Plains,
  Terrain.Forest,
  Terrain.Mountains,
  Terrain.Water,
  Terrain.Other,
]
