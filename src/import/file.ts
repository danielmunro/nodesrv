import { Item } from "../item/model/item"
import { Mob } from "../mob/model/mob"
import Shop from "../mob/model/shop"
import { RoomEntity } from "../room/entity/roomEntity"
import Reset from "./reset"

export default class File {
  public rooms: RoomEntity[] = []
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
