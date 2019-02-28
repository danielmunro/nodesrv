import MobService from "../mob/mobService"
import GoldActionPartCheck from "./actionPartCheck/goldActionPartCheck"
import HostileActionPartCheck from "./actionPartCheck/hostileActionPartCheck"
import PlayerMobActionPartCheck from "./actionPartCheck/playerMobActionPartCheck"

export default function getActionPartTable(mobService: MobService) {
  return [
    new PlayerMobActionPartCheck(mobService),
    new HostileActionPartCheck(),
    new GoldActionPartCheck(),
  ]
}
