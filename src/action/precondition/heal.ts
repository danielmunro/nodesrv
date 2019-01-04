import Check from "../../check/check"
import CheckBuilder from "../../check/checkBuilder"
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
  const checkBuilder = new CheckBuilder(service.mobService)
    .requireMob(healer, Messages.Heal.Fail.HealerNotFound)

  if (subject) {
    console.log("test 1")
    const healerSpell: HealerSpell = collectionSearch(getHealerSpellTable(service), subject)
    console.log("test 2")
    checkBuilder.require(healerSpell, Messages.Heal.Fail.SpellNotKnown, CheckType.HasSpell)
    checkBuilder.require(request.mob.gold >= healerSpell.goldValue, Messages.Heal.Fail.CannotAffordSpell)
  }

  return checkBuilder.create()
}
