import { Item } from "../item/model/item"
import ItemReset from "../item/model/itemReset"
import { Mob } from "../mob/model/mob"
import MobReset from "../mob/model/mobReset"
import { Room } from "../room/model/room"

export default class File {
  public rooms: Room[] = []
  public roomMap: object = {}
  public mobs: Mob[] = []
  public mobMap: object = {}
  public items: Item[] = []
  public roomDataMap: object = {}
  public itemResets: ItemReset[] = []
  public mobResets: MobReset[] = []

  constructor(
    public readonly filename: string,
    public readonly data = []) {}
}
