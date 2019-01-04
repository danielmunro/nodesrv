import CheckedRequest from "../../check/checkedRequest"
import {CheckType} from "../../check/checkType"

import healerSpellTable from "../../mob/healer/healerSpellTable"
import {Mob} from "../../mob/model/mob"
import Response from "../../request/response"
import {format} from "../../support/string"

export default async function(checkedRequest: CheckedRequest): Promise<Response> {
  const request = checkedRequest.request
  const healer = checkedRequest.getCheckTypeResult(CheckType.HasTarget)
  if (!request.getSubject()) {
    return checkedRequest.respondWith().info(listSpells(healer))
  }
}

function listSpells(healer: Mob) {
  return format(
    "{0} offers the following spells:\n{1}Type heal <spell> to be healed",
    healer.name,
    healerSpellTable.reduce((previous, current) =>
      previous + current.spellType + " - " + current.goldValue + " gold\n", ""))
}
