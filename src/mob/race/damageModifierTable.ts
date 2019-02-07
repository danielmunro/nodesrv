import {DamageType} from "../../damage/damageType"
import {Vulnerability} from "../enum/vulnerability"
import DamageModifier from "./damageModifier"
import {Race} from "./race"

export default [
  new DamageModifier(Race.Faerie, DamageType.Magic, Vulnerability.Resist),
  new DamageModifier(Race.Faerie, DamageType.Bash, Vulnerability.Vulnerable),

  new DamageModifier(Race.Dwarf, DamageType.Bash, Vulnerability.Resist),

  new DamageModifier(Race.Troll, DamageType.Magic, Vulnerability.Vulnerable),

  new DamageModifier(Race.Giant, DamageType.Frost, Vulnerability.Resist),
  new DamageModifier(Race.Giant, DamageType.Fire, Vulnerability.Resist),
  new DamageModifier(Race.Giant, DamageType.Magic, Vulnerability.VeryVulnerable),

  new DamageModifier(Race.Goblin, DamageType.Poison, Vulnerability.Invulnerable),

  new DamageModifier(Race.Kender, DamageType.Bash, Vulnerability.Vulnerable),

  new DamageModifier(Race.Gnome, DamageType.Bash, Vulnerability.Vulnerable),

  new DamageModifier(Race.Ogre, DamageType.Mental, Vulnerability.Vulnerable),
]
