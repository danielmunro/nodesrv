import Attributes from "../../attributes/model/attributes"
import {newSkill} from "../../skill/factory"
import Maybe from "../../support/functional/maybe"
import {Mob} from "../model/mob"
import {RaceType} from "./enum/raceType"
import createRaceFromRaceType from "./factory"

export default class RaceService {
  public static assignRaceToMob(mob: Mob, raceType: RaceType): void {
    mob.raceType = raceType
    if (mob.playerMob) {
      const race = createRaceFromRaceType(raceType)
      mob.playerMob.appetite = race.appetite
      mob.playerMob.hunger = race.appetite
    }
    mob.skills.push(...mob.race().startingSkills.map(skillType => newSkill(skillType)))
  }

  public static combineAttributes(mob: Mob, attributes: Attributes): Attributes {
    return new Maybe(mob.race().attributes)
      .do(raceAttr => attributes.combine(raceAttr))
      .or(() => attributes)
      .get()
  }
}
