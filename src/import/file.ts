import { ItemEntity } from "../item/entity/itemEntity"
import { MobEntity } from "../mob/entity/mobEntity"
import ShopEntity from "../mob/entity/shopEntity"
import { RoomEntity } from "../room/entity/roomEntity"
import Reset from "./reset"

export default class File {
  public rooms: RoomEntity[] = []
  public roomMap: object = {}
  public mobs: MobEntity[] = []
  public mobMap: object = {}
  public items: ItemEntity[] = []
  public roomDataMap: object = {}
  public resets: Reset[] = []
  public shops: ShopEntity[] = []

  constructor(
    public readonly filename: string,
    public readonly data = []) {}
}
