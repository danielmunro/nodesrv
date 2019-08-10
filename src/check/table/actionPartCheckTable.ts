import MobService from "../../mob/service/mobService"
import ActionPartCheck from "../actionPartCheck/actionPartCheck"
import CcNumberActionPartCheck from "../actionPartCheck/ccNumberActionPartCheck"
import ExpirationMonthActionPartCheck from "../actionPartCheck/expirationMonthActionPartCheck"
import ExpirationYearActionPartCheck from "../actionPartCheck/expirationYearActionPartCheck"
import FreeFormActionPartCheck from "../actionPartCheck/freeFormActionPartCheck"
import GoldActionPartCheck from "../actionPartCheck/goldActionPartCheck"
import HostileActionPartCheck from "../actionPartCheck/hostileActionPartCheck"
import ItemInInventoryActionPartCheck from "../actionPartCheck/itemInInventoryActionPartCheck"
import ItemInRoomActionPartCheck from "../actionPartCheck/itemInRoomActionPartCheck"
import MobInRoomActionPartCheck from "../actionPartCheck/mobInRoomActionPartCheck"
import PlayerMobActionPartCheck from "../actionPartCheck/playerMobActionPartCheck"

export default function getActionPartTable(mobService: MobService): ActionPartCheck[] {
  return [
    new PlayerMobActionPartCheck(mobService),
    new HostileActionPartCheck(mobService),
    new GoldActionPartCheck(),
    new MobInRoomActionPartCheck(),
    new ItemInInventoryActionPartCheck(),
    new ItemInRoomActionPartCheck(),
    new CcNumberActionPartCheck(),
    new ExpirationMonthActionPartCheck(),
    new ExpirationYearActionPartCheck(),
    new FreeFormActionPartCheck(),
  ]
}
