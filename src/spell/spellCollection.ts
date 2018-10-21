import SpellDefinition from "./spellDefinition"
import { SpellType } from "./spellType"

export default class SpellCollection {
  public readonly collection: SpellDefinition[]

  constructor(collection: SpellDefinition[]) {
    this.collection = collection
  }

  public findSpell(spellType: SpellType): SpellDefinition | undefined {
    return this.collection.find((s) => s.spellType === spellType)
  }
}
