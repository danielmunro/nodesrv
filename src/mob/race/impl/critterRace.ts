import {Appetite} from "../enum/appetite"
import {Eyesight} from "../enum/eyesight"
import {RaceType} from "../enum/raceType"
import {Size} from "../enum/size"
import Race from "../race"
import RaceBuilder from "../raceBuilder"

export default function(): Race {
  return new RaceBuilder(RaceType.Critter)
    .setSize(Size.M)
    .setAppetite(Appetite.Medium)
    .setSight(Eyesight.Ok)
    .create()
}
