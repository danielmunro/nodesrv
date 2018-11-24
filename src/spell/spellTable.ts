import { ActionType } from "../action/actionType"
import { DamageType } from "../damage/damageType"
import GameService from "../gameService/gameService"
import { improveSpell } from "../improve/improve"
import blind from "./action/blind"
import cureLight from "./action/cureLight"
import curePoison from "./action/curePoison"
import curse from "./action/curse"
import giantStrength from "./action/giantStrength"
import heal from "./action/heal"
import lightningBolt from "./action/lightningBolt"
import magicMissile from "./action/magicMissile"
import poison from "./action/poison"
import shield from "./action/shield"
import wrath from "./action/wrath"
import { newDefinition } from "./factory"
import blindPrecondition from "./precondition/blind"
import cureLightPrecondition from "./precondition/cureLight"
import curePoisonPrecondition from "./precondition/curePoison"
import cursePrecondition from "./precondition/curse"
import giantStrengthPrecondition from "./precondition/giantStrength"
import healPrecondition from "./precondition/heal"
import lightningBoltPrecondition from "./precondition/lightningBolt"
import magicMissilePrecondition from "./precondition/magicMissile"
import poisonPrecondition from "./precondition/poison"
import shieldPrecondition from "./precondition/shield"
import wrathPrecondition from "./precondition/wrath"
import SpellCollection from "./spellCollection"
import { SpellType } from "./spellType"

export default function getSpellTable(service: GameService) {
  return new SpellCollection([
    // attack
    newDefinition(service, SpellType.MagicMissile, ActionType.Offensive, magicMissilePrecondition,
      improveSpell(magicMissile), DamageType.Magic),
    newDefinition(
      service, SpellType.LightningBolt, ActionType.Offensive, lightningBoltPrecondition,
      improveSpell(lightningBolt), DamageType.Electric),

    // healing
    newDefinition(service, SpellType.CureLight, ActionType.Defensive, cureLightPrecondition,
      improveSpell(cureLight)),
    newDefinition(service, SpellType.Heal, ActionType.Defensive, healPrecondition,
      improveSpell(heal)),

    // benedictions
    newDefinition(service, SpellType.Shield, ActionType.Defensive, shieldPrecondition, improveSpell(shield)),
    newDefinition(service, SpellType.GiantStrength, ActionType.Defensive,
      giantStrengthPrecondition, improveSpell(giantStrength)),
    newDefinition(service, SpellType.Wrath, ActionType.Defensive, wrathPrecondition, improveSpell(wrath)),

    // maladictions
    newDefinition(service, SpellType.Poison, ActionType.Offensive, poisonPrecondition, improveSpell(poison)),
    newDefinition(service, SpellType.Curse, ActionType.Offensive, cursePrecondition, improveSpell(curse)),
    newDefinition(service, SpellType.Blind, ActionType.Offensive, blindPrecondition, improveSpell(blind)),

    // curative
    newDefinition(service, SpellType.CurePoison, ActionType.Defensive,
      curePoisonPrecondition, improveSpell(curePoison)),
  ])
}
