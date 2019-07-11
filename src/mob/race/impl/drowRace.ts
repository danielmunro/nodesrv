import AttributeBuilder from "../../../attributes/builder/attributeBuilder"
import {Vulnerability} from "../../enum/vulnerability"
import {createDamageModifier} from "../../fight/damageModifier"
import {DamageType} from "../../fight/enum/damageType"
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
      createDamageModifier(DamageType.Mental, Vulnerability.Resist),
      createDamageModifier(DamageType.Poison, Vulnerability.Vulnerable),
      createDamageModifier(DamageType.Frost, Vulnerability.Vulnerable),
      createDamageModifier(DamageType.Fire, Vulnerability.Vulnerable)])
    .setPreferredSpecializations([ SpecializationType.Mage ])
    .setAttributes(
      new AttributeBuilder()
        .setStats(-1, 2, 1, 1, -2, 0)
        .setHitRoll(1, 1)
        .build())
    .setCreationPoints(4)
    .create()
}
