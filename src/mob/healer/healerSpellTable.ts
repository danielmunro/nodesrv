import GameService from "../../gameService/gameService"
import {SpellType} from "../../spell/spellType"
import HealerSpell from "./healerSpell"

export default function getHealerSpellTable(gameService: GameService): HealerSpell[] {
  return [
    new HealerSpell(gameService.getSpellDefinition(SpellType.CureLight), 10),
    // new HealerSpell(gameService.getSpellDefinition(SpellType.CureSerious), 15),
    new HealerSpell(gameService.getSpellDefinition(SpellType.Heal), 50),
    // new HealerSpell(gameService.getSpellDefinition(SpellType.CureBlindness), 20),
    // new HealerSpell(gameService.getSpellDefinition(SpellType.CureDisease), 15),
    new HealerSpell(gameService.getSpellDefinition(SpellType.CurePoison), 25),
    // new HealerSpell(gameService.getSpellDefinition(SpellType.RemoveCurse), 50),
    // new HealerSpell(gameService.getSpellDefinition(SpellType.RefreshMovement), 5),
    // new HealerSpell(gameService.getSpellDefinition(SpellType.RestoreMana), 10),
    // new HealerSpell(gameService.getSpellDefinition(SpellType.Bless), 5),
    // new HealerSpell(gameService.getSpellDefinition(SpellType.Armor), 8),
    // new HealerSpell(gameService.getSpellDefinition(SpellType.Sanctuary), 80),
  ]
}
