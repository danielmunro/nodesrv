import Spell from "../../action/impl/spell"

export default interface HealerSpell {
  readonly spellDefinition: Spell,
  readonly goldValue: number,
}

export function createHealerSpell(spellDefinition: Spell, goldValue: number): HealerSpell {
  return { spellDefinition, goldValue }
}
