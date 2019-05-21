import { Trigger } from "../../mob/enum/trigger"
import {createAffectModifier} from "../affectModifier"
import { AffectType } from "../enum/affectType"

export const modifierTable = [
  // poison
  createAffectModifier(
    AffectType.Poison,
    Trigger.DamageModifier,
    damage => damage * 0.85),
  createAffectModifier(
    AffectType.Poison,
    Trigger.DamageAbsorption,
    damage => damage * 1.2),
  createAffectModifier(
    AffectType.Poison,
    Trigger.MovementCost,
    cost => cost * 1.3),

  // curse
  createAffectModifier(
    AffectType.Curse,
    Trigger.DamageModifier,
    cost => cost * 0.9),

  // shield
  createAffectModifier(
    AffectType.Shield,
    Trigger.DamageAbsorption,
    damage => damage / 1.5),

  // berserk
  createAffectModifier(
    AffectType.Berserk,
    Trigger.DamageModifier,
    damage => damage * 1.2),
  createAffectModifier(
    AffectType.Berserk,
    Trigger.Tick,
    regenModifier => regenModifier + 0.1),

  // stun
  createAffectModifier(
    AffectType.Stunned,
    Trigger.DamageModifier,
    damage => damage * 0.95),
  createAffectModifier(
    AffectType.Stunned,
    Trigger.DamageAbsorption,
    damage => damage * 1.05),

  // giant strength
  createAffectModifier(
    AffectType.GiantStrength,
    Trigger.DamageModifier,
    damage => damage * 1.1),
]
