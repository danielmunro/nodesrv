import AttributeBuilder from "../../../attributes/attributeBuilder"
import {newStats} from "../../../attributes/factory"
import {DamageType} from "../../../damage/damageType"
import {Vulnerability} from "../../enum/vulnerability"
import DamageModifier from "../../fight/damageModifier"
import {SpecializationType} from "../../specialization/enum/specializationType"
import {Appetite} from "../enum/appetite"
import {Eyesight} from "../enum/eyesight"
import {RaceType} from "../enum/raceType"
import {Size} from "../enum/size"
import Race from "../race"
import RaceBuilder from "../raceBuilder"

export default function(): Race {
  return new RaceBuilder(RaceType.Drow)
    .setSize(Size.S)
    .setAppetite(Appetite.Small)
    .setSight(Eyesight.Excellent)
    .setDamageAbsorption([
      new DamageModifier(DamageType.Mental, Vulnerability.Resist),
      new DamageModifier(DamageType.Poison, Vulnerability.Vulnerable),
      new DamageModifier(DamageType.Frost, Vulnerability.Vulnerable),
      new DamageModifier(DamageType.Fire, Vulnerability.Vulnerable)])
    .setPreferredSpecializations([ SpecializationType.Mage ])
    .setAttributes(
      new AttributeBuilder()
        .setStats(newStats(-1, 2, 1, 1, -2, 0))
        .build())
    .create()
}
