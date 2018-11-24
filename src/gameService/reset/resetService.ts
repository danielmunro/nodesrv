import { default as ItemReset } from "../../item/model/itemReset"
import { default as MobReset } from "../../mob/model/mobReset"

export default class ResetService {
  constructor(
    public readonly mobResets: MobReset[],
    public readonly itemResets: ItemReset[]) {}
}
