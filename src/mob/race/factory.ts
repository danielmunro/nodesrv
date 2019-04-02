import {RaceType} from "./enum/raceType"
import critterRace from "./impl/critterRace"
import drowRace from "./impl/drowRace"
import dwarfRace from "./impl/dwarfRace"
import elfRace from "./impl/elfRace"
import faerieRace from "./impl/faerieRace"
import giantRace from "./impl/giantRace"
import gnomeRace from "./impl/gnomeRace"
import goblinRace from "./impl/goblinRace"
import halflingRace from "./impl/halflingRace"
import halfOrcRace from "./impl/halfOrcRace"
import humanRace from "./impl/humanRace"
import kenderRace from "./impl/kenderRace"
import ogreRace from "./impl/ogreRace"

export default function createRaceFromRaceType(raceType: RaceType) {
  switch (raceType) {
    case RaceType.Drow:
      return drowRace()
    case RaceType.Dwarf:
      return dwarfRace()
    case RaceType.Elf:
      return elfRace()
    case RaceType.Faerie:
      return faerieRace()
    case RaceType.Giant:
      return giantRace()
    case RaceType.Gnome:
      return gnomeRace()
    case RaceType.Goblin:
      return goblinRace()
    case RaceType.Halfling:
      return halflingRace()
    case RaceType.HalfOrc:
      return halfOrcRace()
    case RaceType.Human:
      return humanRace()
    case RaceType.Kender:
      return kenderRace()
    case RaceType.Ogre:
      return ogreRace()
    default:
      return critterRace()
  }
}
