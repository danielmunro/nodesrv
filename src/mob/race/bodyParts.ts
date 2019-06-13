/* istanbul ignore next */
import {AffectType} from "../../affect/enum/affectType"
import {newAffect} from "../../affect/factory/affectFactory"
import {ItemEntity} from "../../item/entity/itemEntity"
import {newFood, newTrash} from "../../item/factory/itemFactory"
import {format} from "../../support/string"
import {MobEntity} from "../entity/mobEntity"
import {Messages} from "./constants"
import {BodyPart} from "./enum/bodyParts"

export function getBodyPartItem(mob: MobEntity, bodyPart: BodyPart): ItemEntity {
  switch (bodyPart) {
    case BodyPart.Guts:
      const item = newFood(
        format(Messages.Guts.Name, mob.name),
        format(Messages.Guts.Description, mob.name))
      item.affect().add(newAffect(AffectType.Poison))
      return item
    case BodyPart.Head:
      return newTrash(
        format(Messages.Head.Name, mob.name),
        format(Messages.Head.Description, mob.name))
    case BodyPart.Heart:
      return newFood(
        format(Messages.Heart.Name, mob.name),
        format(Messages.Heart.Description, mob.name))
    case BodyPart.Arm:
      return newTrash(
        format(Messages.Arm.Name, mob.name),
        format(Messages.Arm.Description, mob.name))
    case BodyPart.Leg:
      return newTrash(
        format(Messages.Leg.Name, mob.name),
        format(Messages.Leg.Description, mob.name))
    case BodyPart.Brains:
      return newFood(
        format(Messages.Brains.Name, mob.name),
        format(Messages.Brains.Description, mob.name))
    default:
      return newTrash(
        format(Messages.Trash.Name, bodyPart, mob.name),
        format(Messages.Trash.Description, bodyPart, mob.name))
  }
}
