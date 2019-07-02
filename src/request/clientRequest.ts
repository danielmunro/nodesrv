import {MobEntity} from "../mob/entity/mobEntity"

export default interface ClientRequest {
  getTargetMobInRoom(): MobEntity | undefined
  getMob(): MobEntity
}
