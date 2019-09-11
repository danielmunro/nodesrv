import AttributesEntity from "../../attributes/entity/attributesEntity"
import Maybe from "../../support/functional/maybe/maybe"
import {MobEntity} from "../entity/mobEntity"
import {newSkill} from "../skill/factory"
import {RaceType} from "./enum/raceType"
import createRaceFromRaceType from "./factory"

export default class RaceService {
  public static assignRaceToMob(mob: MobEntity, raceType: RaceType): void {
    mob.raceType = raceType
    if (mob.isPlayerMob()) {
      const race = createRaceFromRaceType(raceType)
      mob.playerMob.appetite = race.appetite
      mob.playerMob.hunger = race.appetite
    }
    mob.skills.push(...mob.race().startingSkills.map(skillType => newSkill(skillType)))
  }

  public static combineAttributes(mob: MobEntity, attributes: AttributesEntity): AttributesEntity {
    return new Maybe<AttributesEntity>(mob.race().attributes)
      .do(raceAttr => attributes.combine(raceAttr))
      .or(() => attributes)
      .get()
  }
}
