import { Mob } from "../mob/model/mob"
import AbstractBuilder from "./abstractBuilder"

export default class MobBuilder extends AbstractBuilder {
  constructor(public readonly mob: Mob) {
    super()
  }
}
