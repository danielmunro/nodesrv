import { Terrain } from "../../region/enum/terrain"
import { Weather } from "../../region/enum/weather"
import {Eyesight} from "./enum/eyesight"

function getVisibilityForTimeOfDay(timeOfDay: number) {
 if (timeOfDay < 4) {
   return 0
 }

 if (timeOfDay < 7) {
   return 0.4
 }

 if (timeOfDay < 18) {
   return 1
 }

 if (timeOfDay < 21) {
   return 0.4
 }

 return 0
}

function getVisibilityForTerrain(terrain: Terrain) {
  if (terrain === Terrain.Forest || terrain === Terrain.Water || terrain === Terrain.Other) {
    return 0
  }

  if (terrain === Terrain.Mountains || terrain === Terrain.Settlement) {
    return 0.1
  }

  return 0.2
}

function getVisibilityForWeather(weather: Weather) {
  if (weather === Weather.Storming) {
    return 0
  }

  if (weather === Weather.Raining || weather === Weather.Overcast) {
    return 0.05
  }

  return 0.1
}

export function isAbleToSee(eyesight: Eyesight, timeOfDay: number, terrain: Terrain, weather: Weather): boolean {
  return eyesight +
    getVisibilityForTimeOfDay(timeOfDay) +
    getVisibilityForTerrain(terrain) +
    getVisibilityForWeather(weather) >= 1
}
