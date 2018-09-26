import { Mob } from "../mob/model/mob"
import AbstractBuilder from "./abstractBuilder"
import ServiceBuilder from "../service/serviceBuilder"

export default class MobBuilder extends AbstractBuilder {
  constructor(public readonly mob: Mob, serviceBuilder: ServiceBuilder) {
    super(serviceBuilder)
  }
}
