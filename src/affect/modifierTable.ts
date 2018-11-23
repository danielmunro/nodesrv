import { Trigger } from "../mob/enum/trigger"
import AffectModifier from "./affectModifier"
import { AffectType } from "./affectType"

export const modifierTable = [
  // poison
  new AffectModifier(
    AffectType.Poison,
    Trigger.DamageModifier,
    damage => damage * 0.85),
  new AffectModifier(
    AffectType.Poison,
    Trigger.DamageAbsorption,
    damage => damage * 1.2),
  new AffectModifier(
    AffectType.Poison,
    Trigger.MovementCost,
    cost => cost * 1.3),

  // curse
  new AffectModifier(
    AffectType.Curse,
    Trigger.DamageModifier,
    cost => cost * 0.9),

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

  // stun
  new AffectModifier(
    AffectType.Stunned,
    Trigger.DamageModifier,
    damage => damage * 0.95),
  new AffectModifier(
    AffectType.Stunned,
    Trigger.DamageAbsorption,
    damage => damage * 1.05),

  // giant strength
  new AffectModifier(
    AffectType.GiantStrength,
    Trigger.DamageModifier,
    damage => damage * 1.1),
]
