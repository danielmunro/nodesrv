import { pickOne } from "../random/helpers"
import {
  allWeather,
  MESSAGE_WEATHER_BLUSTERY,
  MESSAGE_WEATHER_CLEAR,
  MESSAGE_WEATHER_OVERCAST,
  MESSAGE_WEATHER_RAINING,
  MESSAGE_WEATHER_STORMING,
} from "./constants"

export enum Weather {
  Clear,
  Blustery,
  Overcast,
  Raining,
  Storming,
}

function createMapEntry(weather: Weather, message: string) {
  return { weather, message }
}

const weatherMessageMap = [
  createMapEntry(Weather.Clear, MESSAGE_WEATHER_CLEAR),
  createMapEntry(Weather.Blustery, MESSAGE_WEATHER_BLUSTERY),
  createMapEntry(Weather.Overcast, MESSAGE_WEATHER_OVERCAST),
  createMapEntry(Weather.Raining, MESSAGE_WEATHER_RAINING),
  createMapEntry(Weather.Storming, MESSAGE_WEATHER_STORMING),
]

export function getRandomWeather(): Weather {
  return pickOne(allWeather)
}

export function getWeatherTransitionMessage(weather: Weather) {
  return weatherMessageMap.find((w) => w.weather === weather).message
}
