import AffectDefinition from "./affectDefinition"
import {AffectType} from "./affectType"
import {StackBehavior} from "./stackBehavior"
import {Messages} from "../spell/precondition/constants"

export default [
  new AffectDefinition(AffectType.Berserk, StackBehavior.NoReplace),
  new AffectDefinition(AffectType.Shield, StackBehavior.Replace),
  new AffectDefinition(AffectType.GiantStrength, StackBehavior.Replace),
  new AffectDefinition(AffectType.Poison, StackBehavior.Replace),
  new AffectDefinition(AffectType.Curse, StackBehavior.NoReplace),
  new AffectDefinition(AffectType.Blind, StackBehavior.NoReplace, Messages.Blind.AlreadyBlind),
]
