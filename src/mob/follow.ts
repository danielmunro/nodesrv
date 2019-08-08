import {MobEntity} from "./entity/mobEntity"

export default interface Follow {
  readonly mob: MobEntity
  readonly follower: MobEntity
}
