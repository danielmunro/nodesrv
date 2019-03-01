import MobService from "../mob/mobService"
import GoldActionPartCheck from "./actionPartCheck/goldActionPartCheck"
import HostileActionPartCheck from "./actionPartCheck/hostileActionPartCheck"
import ItemInInventoryActionPartCheck from "./actionPartCheck/itemInInventoryActionPartCheck"
import ItemInRoomActionPartCheck from "./actionPartCheck/itemInRoomActionPartCheck"
import MobInRoomActionPartCheck from "./actionPartCheck/mobInRoomActionPartCheck"
import PlayerMobActionPartCheck from "./actionPartCheck/playerMobActionPartCheck"

export default function getActionPartTable(mobService: MobService) {
  return [
    new PlayerMobActionPartCheck(mobService),
    new HostileActionPartCheck(mobService),
    new GoldActionPartCheck(),
    new MobInRoomActionPartCheck(),
    new ItemInInventoryActionPartCheck(),
    new ItemInRoomActionPartCheck(),
  ]
}
