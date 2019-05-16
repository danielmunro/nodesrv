import {ConditionMessages} from "../spell/constants"
import AffectDefinition from "./affectDefinition"
import {AffectType} from "./enum/affectType"
import {StackBehavior} from "./enum/stackBehavior"

export default [
  new AffectDefinition(AffectType.Berserk, StackBehavior.Replace),
  new AffectDefinition(AffectType.Shield, StackBehavior.Replace),
  new AffectDefinition(AffectType.GiantStrength, StackBehavior.Replace),
  new AffectDefinition(AffectType.Poison, StackBehavior.Replace),
  new AffectDefinition(AffectType.Curse, StackBehavior.NoReplace),
  new AffectDefinition(AffectType.Blind, StackBehavior.NoReplace, ConditionMessages.Blind.AlreadyBlind),
  new AffectDefinition(AffectType.Stunned, StackBehavior.Replace),
]
