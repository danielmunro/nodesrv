import Spell from "../../action/impl/spell"

export default class HealerSpell {
  constructor(public readonly spellDefinition: Spell, public readonly goldValue: number) {}
}
