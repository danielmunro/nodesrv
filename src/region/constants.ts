import { Terrain } from "./terrain"
import { Weather } from "./weather"

export const allTerrains = [
  Terrain.Settlement,
  Terrain.Plains,
  Terrain.Forest,
  Terrain.Mountains,
  Terrain.Water,
  Terrain.Other,
]

export const MESSAGE_WEATHER_CLEAR = "The sky clears up."
export const MESSAGE_WEATHER_BLUSTERY = "The wind picks up."
export const MESSAGE_WEATHER_OVERCAST = "High altitude clouds lay like waves across the sky."
export const MESSAGE_WEATHER_RAINING = "A trickle of rain picks up."
export const MESSAGE_WEATHER_STORMING = "Dark thunderclouds consume the sky as rain pours down."

export const allWeather = [
  Weather.Clear,
  Weather.Blustery,
  Weather.Overcast,
  Weather.Raining,
  Weather.Storming,
]
