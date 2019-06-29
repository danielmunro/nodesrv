import {ConditionMessages} from "../../mob/spell/constants"
import AffectDefinition from "../affectDefinition"
import {AffectType} from "../enum/affectType"
import {StackBehavior} from "../enum/stackBehavior"
import {createAffectDefinition} from "../factory/affectFactory"

const affectTable = [
  createAffectDefinition(AffectType.Berserk, StackBehavior.Replace),
  createAffectDefinition(AffectType.Shield, StackBehavior.Replace),
  createAffectDefinition(AffectType.GiantStrength, StackBehavior.Replace),
  createAffectDefinition(AffectType.Poison, StackBehavior.Replace),
  createAffectDefinition(AffectType.Curse, StackBehavior.NoReplace),
  createAffectDefinition(AffectType.Blind, StackBehavior.NoReplace, ConditionMessages.Blind.AlreadyBlind),
  createAffectDefinition(AffectType.Stunned, StackBehavior.Replace),
]

export function findAffectDefinition(affectType: AffectType): AffectDefinition | undefined {
  return affectTable.find((affectDefinition: AffectDefinition) => affectDefinition.affectType === affectType)
}
