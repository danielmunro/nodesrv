import {Mob} from "../mob/model/mob"
import RaceService from "../mob/race/raceService"
import {newEmptyAttributes} from "./factory"
import Attributes from "./model/attributes"

export default class AttributeService {
  public static combine(mob: Mob): Attributes {
    let attributes = newEmptyAttributes()
    mob.attributes.forEach(a => attributes = attributes.combine(a))
    mob.equipped.items.forEach(i => attributes = attributes.combine(i.attributes))
    attributes = RaceService.combineAttributes(mob, attributes)
    if (mob.playerMob) {
      attributes = attributes.combine(mob.playerMob.trainedAttributes)
    }
    mob.affects.filter(affect => affect.attributes)
      .forEach(affect => attributes = attributes.combine(affect.attributes))

    return attributes
  }

  public static getHp(mob: Mob): number {
    return AttributeService.combine(mob).vitals.hp
  }

  public static getMv(mob: Mob): number {
    return AttributeService.combine(mob).vitals.mv
  }

  public static getInt(mob: Mob): number {
    return AttributeService.combine(mob).stats.int
  }

  public static getWis(mob: Mob): number {
    return AttributeService.combine(mob).stats.wis
  }

  public static getDex(mob: Mob): number {
    return AttributeService.combine(mob).stats.dex
  }
}
