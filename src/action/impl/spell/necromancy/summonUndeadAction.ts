import AttributeBuilder from "../../../../attributes/attributeBuilder"
import {newHitroll, newVitals} from "../../../../attributes/factory"
import AbilityService from "../../../../check/abilityService"
import DelayCost from "../../../../check/cost/delayCost"
import ManaCost from "../../../../check/cost/manaCost"
import {Mob} from "../../../../mob/model/mob"
import {RaceType} from "../../../../mob/race/enum/raceType"
import MobService from "../../../../mob/service/mobService"
import ResponseMessage from "../../../../request/responseMessage"
import {SpellMessages} from "../../../../spell/constants"
import {SpellType} from "../../../../spell/spellType"
import {getRandomIntFromRange} from "../../../../support/random/helpers"
import {ActionType} from "../../../enum/actionType"
import SpellBuilder from "../../../spellBuilder"
import Spell from "../../spell"

export const SKELETAL_WARRIOR_ID = 3
const DEFAULT_MANA = 100
const DEFAULT_MV = 100

function createSkeletalWarrior(caster: Mob, warrior: Mob): Mob {
  const level = caster.level * 0.8
  const maxHp = level * 8 + getRandomIntFromRange(level * level / 8, level * level)
  warrior.level = level
  warrior.vitals.hp = maxHp
  warrior.vitals.mana = DEFAULT_MANA
  warrior.vitals.mv = DEFAULT_MV
  warrior.attributes.push(
    new AttributeBuilder()
      .setHitRoll(newHitroll(1, level / 2))
      .setVitals(newVitals(maxHp, DEFAULT_MANA, DEFAULT_MV))
      .build())
  warrior.deathTimer = (level / 5) + 10
  warrior.follows = caster
  warrior.raceType = RaceType.Undead
  return warrior
}

export default function(abilityService: AbilityService, mobService: MobService): Spell {
  return new SpellBuilder(abilityService)
    .setSpellType(SpellType.SummonUndead)
    .setActionType(ActionType.Defensive)
    .setCosts([
      new ManaCost(80),
      new DelayCost(1),
    ])
    .setApplySpell(async requestService => mobService.add(
        createSkeletalWarrior(
          requestService.getMob(),
          await mobService.createMobFromId(SKELETAL_WARRIOR_ID) as Mob),
          mobService.getLocationForMob(requestService.getMob()).room))
    .setSuccessMessage(requestService =>
      new ResponseMessage(requestService.getMob(), SpellMessages.SummonUndead.Success))
    .create()
}
