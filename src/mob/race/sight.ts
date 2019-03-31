import { Terrain } from "../../region/terrain"
import { Weather } from "../../region/weather"
import { RaceType } from "./raceType"

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

class Sight {
  constructor(public readonly race: RaceType, public readonly eyesight: number) {}

  public isAbleToSee(timeOfDay: number, terrain: Terrain, weather: Weather): boolean {
    return this.eyesight +
      getVisibilityForTimeOfDay(timeOfDay) +
      getVisibilityForTerrain(terrain) +
      getVisibilityForWeather(weather) >= 1
  }
}

const sightTable = [
  new Sight(RaceType.Faerie, 0.7),
  new Sight(RaceType.Drow, 0.7),
  new Sight(RaceType.Elf, 0.65),
  new Sight(RaceType.Kender, 0.6),
  new Sight(RaceType.Halfling, 0.55),
  new Sight(RaceType.Human, 0.5),
  new Sight(RaceType.Dwarf, 0.45),
  new Sight(RaceType.Gnome, 0.4),
  new Sight(RaceType.HalfOrc, 0.35),
  new Sight(RaceType.Giant, 0.3),
]

export default function getSight(race: RaceType): Sight {
  return sightTable.find((sight) => sight.race === race)
}
