import AttributeBuilder from "../../../../../attributes/attributeBuilder"
import {newHitroll, newVitals} from "../../../../../attributes/factory"
import AbilityService from "../../../../../check/abilityService"
import CheckedRequest from "../../../../../check/checkedRequest"
import DelayCost from "../../../../../check/cost/delayCost"
import ManaCost from "../../../../../check/cost/manaCost"
import MobService from "../../../../../mob/mobService"
import {Mob} from "../../../../../mob/model/mob"
import {Race} from "../../../../../mob/race/race"
import {getRandomIntFromRange} from "../../../../../random/helpers"
import ResponseMessage from "../../../../../request/responseMessage"
import {SpellMessages} from "../../../../../spell/constants"
import {SpellType} from "../../../../../spell/spellType"
import {ActionType} from "../../../../enum/actionType"
import Spell from "../../../spell"
import SpellBuilder from "../../../../spellBuilder"

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
  warrior.race = Race.Undead
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
    .setApplySpell(async (checkedRequest: CheckedRequest) => mobService.add(
        createSkeletalWarrior(
          checkedRequest.mob,
          await mobService.createMobFromId(SKELETAL_WARRIOR_ID) as Mob),
        checkedRequest.room))
    .setSuccessMessage((checkedRequest: CheckedRequest) =>
      new ResponseMessage(checkedRequest.mob, SpellMessages.SummonUndead.Success))
    .create()
}
