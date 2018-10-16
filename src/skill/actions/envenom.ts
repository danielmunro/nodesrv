import { AffectType } from "../../affect/affectType"
import { newAffect } from "../../affect/factory"
import CheckedRequest from "../../check/checkedRequest"
import { CheckType } from "../../check/checkType"
import { DamageType } from "../../damage/damageType"
import Weapon from "../../item/model/weapon"
import roll from "../../random/dice"
import Response from "../../request/response"
import { Costs, Messages } from "../constants"

export default async function(checkedRequest: CheckedRequest): Promise<Response> {
  const item = checkedRequest.getCheckTypeResult(CheckType.HasItem)
  const responseBuilder = checkedRequest.respondWith()

  if (!(item instanceof Weapon)) {
    return responseBuilder.error(Messages.Envenom.Error.NotAWeapon)
  }

  if (item.damageType !== DamageType.Slash && item.damageType !== DamageType.Pierce) {
    return responseBuilder.error(Messages.Envenom.Error.WrongWeaponType)
  }

  const skill = checkedRequest.getCheckTypeResult(CheckType.HasSkill)
  const mob = checkedRequest.mob

  if (roll(1, skill.level / 3) <= item.level) {
    return responseBuilder.fail(Messages.Envenom.Fail, { item })
  }

  mob.vitals.mana -= Costs.Envenom.Mana
  item.affects.push(newAffect(AffectType.Poison, mob.level))

  return responseBuilder.success(Messages.Envenom.Success, { item })
}
