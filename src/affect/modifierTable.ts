import { Trigger } from "../mob/trigger"
import AffectModifier from "./affectModifier"
import { AffectType } from "./affectType"

export const modifierTable = [
  // poison
  new AffectModifier(
    AffectType.Poison,
    Trigger.DamageModifier,
    damage => damage / 1.2),
  new AffectModifier(
    AffectType.Poison,
    Trigger.DamageAbsorption,
    damage => damage * 1.2),
  new AffectModifier(
    AffectType.Poison,
    Trigger.MovementCost,
    cost => cost * 1.3),

  // shield
  new AffectModifier(
    AffectType.Shield,
    Trigger.DamageAbsorption,
    damage => damage / 1.5),

  // berserk
  new AffectModifier(
    AffectType.Berserk,
    Trigger.DamageModifier,
    damage => damage * 1.2),
  new AffectModifier(
    AffectType.Berserk,
    Trigger.Tick,
    regenModifier => regenModifier + 0.1),
]
