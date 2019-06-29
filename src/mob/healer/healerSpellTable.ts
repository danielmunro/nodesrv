import Spell from "../../action/impl/spell"
import {SpellType} from "../spell/spellType"
import HealerSpell, {createHealerSpell} from "./healerSpell"

export default function getHealerSpellTable(spells: Spell[]): HealerSpell[] {
  return [
    createHealerSpell(
      spells.find(spell => spell.getSpellType() === SpellType.CureLight) as Spell, 10),
    // new HealerSpell(gameService.getSpell(SpellType.CureSerious), 15),
    // new HealerSpell(gameService.getSpell(SpellType.Heal), 50),
    // new HealerSpell(gameService.getSpell(SpellType.CureBlindness), 20),
    // new HealerSpell(gameService.getSpell(SpellType.CureDisease), 15),
    // new HealerSpell(gameService.getSpell(SpellType.CurePoison), 25),
    // new HealerSpell(gameService.getSpell(SpellType.RemoveCurse), 50),
    // new HealerSpell(gameService.getSpell(SpellType.RefreshMovement), 5),
    // new HealerSpell(gameService.getSpell(SpellType.RestoreMana), 10),
    // new HealerSpell(gameService.getSpell(SpellType.Bless), 5),
    // new HealerSpell(gameService.getSpell(SpellType.Armor), 8),
    // new HealerSpell(gameService.getSpell(SpellType.Sanctuary), 80),
  ]
}
