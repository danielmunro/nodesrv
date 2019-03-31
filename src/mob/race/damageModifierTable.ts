import {DamageType} from "../../damage/damageType"
import {Vulnerability} from "../enum/vulnerability"
import DamageModifier from "./damageModifier"
import {RaceType} from "./raceType"

export default [
  new DamageModifier(RaceType.Faerie, DamageType.Magic, Vulnerability.Resist),
  new DamageModifier(RaceType.Faerie, DamageType.Bash, Vulnerability.Vulnerable),

  new DamageModifier(RaceType.Dwarf, DamageType.Bash, Vulnerability.Resist),

  new DamageModifier(RaceType.Troll, DamageType.Magic, Vulnerability.Vulnerable),

  new DamageModifier(RaceType.Giant, DamageType.Frost, Vulnerability.Resist),
  new DamageModifier(RaceType.Giant, DamageType.Fire, Vulnerability.Resist),
  new DamageModifier(RaceType.Giant, DamageType.Magic, Vulnerability.VeryVulnerable),

  new DamageModifier(RaceType.Goblin, DamageType.Poison, Vulnerability.Invulnerable),

  new DamageModifier(RaceType.Kender, DamageType.Bash, Vulnerability.Vulnerable),

  new DamageModifier(RaceType.Gnome, DamageType.Bash, Vulnerability.Vulnerable),

  new DamageModifier(RaceType.Ogre, DamageType.Mental, Vulnerability.Vulnerable),
]
