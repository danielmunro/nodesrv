import CheckBuilderFactory from "../../check/factory/checkBuilderFactory"
import getHealerSpellTable from "../../mob/healer/healerSpellTable"
import LocationService from "../../mob/service/locationService"
import MobService from "../../mob/service/mobService"
import Action from "../impl/action"
import HealAction from "../impl/merchant/healAction"
import NoopAction from "../impl/noopAction"
import Spell from "../impl/spell"

/* tslint:disable */
export default function getActionTable(
  mobService: MobService,
  spellTable: Spell[],
  locationService: LocationService): Action[] {
  const checkBuilderFactory = new CheckBuilderFactory(mobService)
  return [
    // merchants/healers
    new HealAction(checkBuilderFactory, locationService, getHealerSpellTable(spellTable)),

    // catch-all
    new NoopAction(),
  ]
}
