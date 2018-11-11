import { default as MobReset } from "../../mob/model/mobReset"
import { default as ItemReset } from "../../item/model/itemReset"

export default class ResetService {
  constructor(
    public readonly mobResets: MobReset[],
    public readonly itemResets: ItemReset[]) {}
}
