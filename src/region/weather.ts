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

export function getRandomWeather(): Weather {
  return pickOne(allWeather)
}

export function getWeatherTransitionMessage(weather: Weather) {
  if (weather === Weather.Clear) {
    return MESSAGE_WEATHER_CLEAR
  } else if (weather === Weather.Blustery) {
    return MESSAGE_WEATHER_BLUSTERY
  } else if (weather === Weather.Overcast) {
    return MESSAGE_WEATHER_OVERCAST
  } else if (weather === Weather.Raining) {
    return MESSAGE_WEATHER_RAINING
  } else if (weather === Weather.Storming) {
    return MESSAGE_WEATHER_STORMING
  }
}
