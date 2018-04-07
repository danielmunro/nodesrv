import { AffectType } from "../affect/constants"
import { newAffect } from "../affect/factory"
import { DamageType } from "../damage/damageType"
import roll from "../dice/dice"
import { ActionType } from "../handler/constants"
import { Request } from "../server/request/request"
import { SpellType } from "../spell/spellType"
import { Check } from "./check"
import { SpellDefinition } from "./spellDefiniton"

export default [
  // Attack
  new SpellDefinition(
    SpellType.MagicMissile,
    1,
    ActionType.Offensive,
    50,
    (request: Request, check: Check) => check.target.vitals.hp -= roll(1, 4),
    DamageType.Magic,
  ),
  new SpellDefinition(
    SpellType.LightningBolt,
    12,
    ActionType.Offensive,
    100,
    (request: Request, check: Check) => check.target.vitals.hp -= roll(2, 6),
    DamageType.Electric,
  ),

  // Healing
  new SpellDefinition(
    SpellType.CureLight,
    1,
    ActionType.Defensive,
    50,
    (request: Request, check: Check) => check.target.vitals.hp += roll(1, 4),
  ),

  // Benedictions
  new SpellDefinition(
    SpellType.Shield,
    5,
    ActionType.Defensive,
    100,
    (request: Request, check: Check) =>
      check.target.addAffect(newAffect(AffectType.Shield, check.target, check.caster.level)),
  ),
]
