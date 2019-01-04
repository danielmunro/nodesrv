import {SpellType} from "../../spell/spellType"

export default class HealerSpell {
  constructor(public readonly spellType: SpellType, public readonly goldValue: number) {}
}
