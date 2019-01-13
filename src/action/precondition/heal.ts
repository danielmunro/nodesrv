import Check from "../../check/check"
import {CheckType} from "../../check/checkType"
import GameService from "../../gameService/gameService"
import HealerSpell from "../../mob/healer/healerSpell"
import getHealerSpellTable from "../../mob/healer/healerSpellTable"
import {Request} from "../../request/request"
import collectionSearch from "../../support/matcher/collectionSearch"
import {Messages} from "./constants"

export default function(request: Request, service: GameService): Promise<Check> {
  const subject = request.getSubject()
  const healer = service.getMobsByRoom(request.room).find(mob => mob.isHealer())
  const checkBuilder = service.createDefaultCheckFor(request)
    .require(healer, Messages.Heal.Fail.HealerNotFound)

  if (subject) {
    const healerSpell: HealerSpell = collectionSearch(getHealerSpellTable(service), subject)
    checkBuilder.require(healerSpell, Messages.Heal.Fail.NotASpell, CheckType.HasSpell)
    checkBuilder.require(request.mob.gold >= healerSpell.goldValue, Messages.Heal.Fail.CannotAffordSpell)
  }

  return checkBuilder.create()
}
