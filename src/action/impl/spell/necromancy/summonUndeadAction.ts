import DelayCost from "../../../../check/cost/delayCost"
import ManaCost from "../../../../check/cost/manaCost"
import AbilityService from "../../../../check/service/abilityService"
import {SpecializationType} from "../../../../mob/specialization/enum/specializationType"
import {SpellMessages} from "../../../../mob/spell/constants"
import {SpellType} from "../../../../mob/spell/spellType"
import ResponseMessage from "../../../../request/responseMessage"
import SpellBuilder from "../../../builder/spellBuilder"
import {ActionType} from "../../../enum/actionType"
import Spell from "../../spell"

export const SKELETAL_WARRIOR_ID = 3

export default function(abilityService: AbilityService): Spell {
  return new SpellBuilder(abilityService)
    .setSpellType(SpellType.SummonUndead)
    .setActionType(ActionType.Defensive)
    .setCosts([
      new ManaCost(80),
      new DelayCost(1),
    ])
    .setApplySpell(async requestService =>
      abilityService.createSkeletalWarrior(requestService.getMob(), requestService.getRoom()))
    .setSuccessMessage(requestService =>
      new ResponseMessage(requestService.getMob(), SpellMessages.SummonUndead.Success))
    .setSpecializationType(SpecializationType.Mage)
    .create()
}
