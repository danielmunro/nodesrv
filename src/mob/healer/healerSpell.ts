import SpellDefinition from "../../spell/spellDefinition"

export default class HealerSpell {
  constructor(public readonly spellDefinition: SpellDefinition, public readonly goldValue: number) {}
}
