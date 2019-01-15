import Spell from "../../spell/spell"

export default class HealerSpell {
  constructor(public readonly spellDefinition: Spell, public readonly goldValue: number) {}
}
