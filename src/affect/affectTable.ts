import {Messages} from "../spell/precondition/constants"
import AffectDefinition from "./affectDefinition"
import {AffectType} from "./affectType"
import {StackBehavior} from "./stackBehavior"

export default [
  new AffectDefinition(AffectType.Berserk, StackBehavior.Replace),
  new AffectDefinition(AffectType.Shield, StackBehavior.Replace),
  new AffectDefinition(AffectType.GiantStrength, StackBehavior.Replace),
  new AffectDefinition(AffectType.Poison, StackBehavior.Replace),
  new AffectDefinition(AffectType.Curse, StackBehavior.NoReplace),
  new AffectDefinition(AffectType.Blind, StackBehavior.NoReplace, Messages.Blind.AlreadyBlind),
]
