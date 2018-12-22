import { Item } from "../item/model/item"
import { Mob } from "../mob/model/mob"
import { Room } from "../room/model/room"
import Reset from "./reset"
import Shop from "../mob/model/shop"

export default class File {
  public rooms: Room[] = []
  public roomMap: object = {}
  public mobs: Mob[] = []
  public mobMap: object = {}
  public items: Item[] = []
  public roomDataMap: object = {}
  public resets: Reset[] = []
  public shops: Shop[] = []

  constructor(
    public readonly filename: string,
    public readonly data = []) {}
}
