import { Mob } from "../mob/model/mob"
import ServiceBuilder from "../service/serviceBuilder"
import AbstractBuilder from "./abstractBuilder"

export default class MobBuilder extends AbstractBuilder {
  constructor(public readonly mob: Mob, serviceBuilder: ServiceBuilder) {
    super(serviceBuilder)
  }
}
