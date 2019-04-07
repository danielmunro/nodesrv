import {pickOne} from "../support/random/helpers"
import {Terrain} from "./enum/terrain"
import {Weather} from "./enum/weather"

export const MESSAGE_WEATHER_CLEAR = "The sky clears up."
export const MESSAGE_WEATHER_BLUSTERY = "The wind picks up."
export const MESSAGE_WEATHER_OVERCAST = "High altitude clouds lay like waves across the sky."
export const MESSAGE_WEATHER_RAINING = "A trickle of rain picks up."
export const MESSAGE_WEATHER_STORMING = "Dark thunderclouds consume the sky as rain pours down."

function createMapEntry(weather: Weather, message: string) {
  return {weather, message}
}

const weatherMessageMap = [
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
  return weatherMessageMap.find((w) => w.weather === weather).message
}

export const allTerrains = [
  Terrain.Settlement,
  Terrain.Plains,
  Terrain.Forest,
  Terrain.Mountains,
  Terrain.Water,
  Terrain.Other,
]
