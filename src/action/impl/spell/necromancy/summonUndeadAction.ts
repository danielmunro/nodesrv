import AttributeBuilder from "../../../../attributes/builder/attributeBuilder"
import DelayCost from "../../../../check/cost/delayCost"
import ManaCost from "../../../../check/cost/manaCost"
import AbilityService from "../../../../check/service/abilityService"
import {Mob} from "../../../../mob/model/mob"
import {RaceType} from "../../../../mob/race/enum/raceType"
import MobService from "../../../../mob/service/mobService"
import ResponseMessage from "../../../../request/responseMessage"
import {SpellMessages} from "../../../../spell/constants"
import {SpellType} from "../../../../spell/spellType"
import {getRandomIntFromRange} from "../../../../support/random/helpers"
import SpellBuilder from "../../../builder/spellBuilder"
import {ActionType} from "../../../enum/actionType"
import Spell from "../../spell"

export const SKELETAL_WARRIOR_ID = 3
const DEFAULT_MANA = 100
const DEFAULT_MV = 100

function createSkeletalWarrior(caster: Mob, warrior: Mob): Mob {
  const level = caster.level * 0.8
  const maxHp = level * 8 + getRandomIntFromRange(level * level / 8, level * level)
  warrior.level = level
  warrior.hp = maxHp
  warrior.mana = DEFAULT_MANA
  warrior.mv = DEFAULT_MV
  warrior.attributes.push(
    new AttributeBuilder()
      .setHitRoll(1, level / 2)
      .setVitals(maxHp, DEFAULT_MANA, DEFAULT_MV)
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
