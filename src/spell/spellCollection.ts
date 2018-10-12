import { ActionType } from "../action/actionType"
import { DamageType } from "../damage/damageType"
import cureLight from "./actions/cureLight"
import curePoison from "./actions/curePoison"
import giantStrength from "./actions/giantStrength"
import lightningBolt from "./actions/lightningBolt"
import magicMissile from "./actions/magicMissile"
import poison from "./actions/poison"
import shield from "./actions/shield"
import { SpellDefinition } from "./spellDefinition"
import { SpellType } from "./spellType"

class SpellCollection {
  public readonly collection: SpellDefinition[]

  constructor(collection: SpellDefinition[]) {
    this.collection = collection
  }

  public findSpell(spellType: SpellType): SpellDefinition | undefined {
    return this.collection.find((s) => s.spellType === spellType)
  }
}

const spellCollection = new SpellCollection([
  // Attack
  new SpellDefinition(
    SpellType.MagicMissile,
    1,
    ActionType.Offensive,
    50,
    magicMissile,
    DamageType.Magic,
  ),
  new SpellDefinition(
    SpellType.LightningBolt,
    12,
    ActionType.Offensive,
    100,
    lightningBolt,
    DamageType.Electric,
  ),

  // Healing
  new SpellDefinition(
    SpellType.CureLight,
    1,
    ActionType.Defensive,
    50,
    cureLight,
  ),

  // Benedictions
  new SpellDefinition(
    SpellType.Shield,
    5,
    ActionType.Defensive,
    100,
    shield),
  new SpellDefinition(
    SpellType.GiantStrength,
    20,
    ActionType.Defensive,
    100,
    giantStrength),

  // Maladictions
  new SpellDefinition(
    SpellType.Poison,
    20,
    ActionType.Offensive,
    100,
    poison,
  ),

  // Curative
  new SpellDefinition(
    SpellType.CurePoison,
    20,
    ActionType.Defensive,
    100,
    curePoison,
  ),
])

export default spellCollection
