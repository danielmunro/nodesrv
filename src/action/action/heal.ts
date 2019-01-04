import CheckedRequest from "../../check/checkedRequest"
import {CheckType} from "../../check/checkType"

import GameService from "../../gameService/gameService"
import HealerSpell from "../../mob/healer/healerSpell"
import getHealerSpellTable from "../../mob/healer/healerSpellTable"
import {Mob} from "../../mob/model/mob"
import Response from "../../request/response"
import {format} from "../../support/string"

export default async function(checkedRequest: CheckedRequest, gameService: GameService): Promise<Response> {
  const request = checkedRequest.request
  const healer = checkedRequest.getCheckTypeResult(CheckType.HasTarget)
  const subject = request.getSubject()
  console.log("subject received", subject)
  if (!subject) {
    return checkedRequest.respondWith().info(listSpells(healer, gameService))
  }
  const healerSpell: HealerSpell = checkedRequest.getCheckTypeResult(CheckType.HasSpell)
  request.mob.gold -= healerSpell.goldValue
  return healerSpell.spellDefinition.doAction(request)
}

function listSpells(healer: Mob, gameService: GameService) {
  console.log("listSpells. start")
  const spells = getHealerSpellTable(gameService)
  console.log("sanity")
  return format(
    "{0} offers the following spells:\n{1}Type heal [spell] to be healed",
    healer.name,
    spells.reduce((previous, current: HealerSpell) => {
      console.log(current instanceof HealerSpell)
      console.log(current.goldValue)
      console.log(current.spellDefinition.spellType)
      return previous + current.spellDefinition.spellType + " - " + current.goldValue + " gold\n"
    }, ""))
}
