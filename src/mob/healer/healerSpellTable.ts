import {SpellType} from "../../spell/spellType"
import HealerSpell from "./healerSpell"

export default [
  new HealerSpell(SpellType.CureLight, 10),
  new HealerSpell(SpellType.CureSerious, 15),
  new HealerSpell(SpellType.Heal, 50),
  new HealerSpell(SpellType.CureBlindness, 20),
  new HealerSpell(SpellType.CureDisease, 15),
  new HealerSpell(SpellType.CurePoison, 25),
  new HealerSpell(SpellType.RemoveCurse, 50),
  new HealerSpell(SpellType.RefreshMovement, 5),
  new HealerSpell(SpellType.RestoreMana, 10),
  new HealerSpell(SpellType.Bless, 5),
  new HealerSpell(SpellType.Armor, 8),
  new HealerSpell(SpellType.Sanctuary, 80),
]
