import { pickOne } from "../random/helpers"

export const MESSAGE_WEATHER_CLEAR = "The sky clears up."
export const MESSAGE_WEATHER_BLUSTERY = "The wind picks up."
export const MESSAGE_WEATHER_OVERCAST = "High altitude clouds lay like waves across the sky."
export const MESSAGE_WEATHER_RAINING = "A trickle of rain picks up."
export const MESSAGE_WEATHER_STORMING = "Dark thunderclouds consume the sky as rain pours down."

export enum Weather {
  Clear,
  Blustery,
  Overcast,
  Raining,
  Storming,
}

const allWeather = [
  Weather.Clear,
  Weather.Blustery,
  Weather.Overcast,
  Weather.Raining,
  Weather.Storming,
]

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
