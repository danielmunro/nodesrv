import {ItemType} from "../../item/enum/itemType"
import { ItemType as ImportItemType } from "../enum/itemType"

export const itemTypeMap = [
  { import: ImportItemType.Map, type: ItemType.Map },
  { import: ImportItemType.Trash, type: ItemType.Trash },
  { import: ImportItemType.Gem, type: ItemType.Gem },
  { import: ImportItemType.Key, type: ItemType.Key },
  { import: ImportItemType.Money, type: ItemType.Money },
  { import: ImportItemType.Treasure, type: ItemType.Treasure },
  { import: ImportItemType.Potion, type: ItemType.Potion },
  { import: ImportItemType.Scroll, type: ItemType.Scroll },
  { import: ImportItemType.SpellPage, type: ItemType.SpellPage },
  { import: ImportItemType.ItemPart, type: ItemType.ItemPart },
  { import: ImportItemType.Boat, type: ItemType.Boat },
  { import: ImportItemType.Grenade, type: ItemType.Grenade },
  { import: ImportItemType.Jukebox, type: ItemType.Jukebox },
  { import: ImportItemType.TrapPart, type: ItemType.TrapPart },
  { import: ImportItemType.Jewelry, type: ItemType.Jewelry },
  { import: ImportItemType.Pill, type: ItemType.Pill },
  { import: ImportItemType.WarpStone, type: ItemType.WarpStone },
  { import: ImportItemType.Portal, type: ItemType.Portal },
  { import: ImportItemType.None, type: ItemType.None },
  { import: ImportItemType.RoomKey, type: ItemType.Key },
  { import: ImportItemType.NpcCorpse, type: ItemType.Corpse },
  { import: ImportItemType.PcCorpse, type: ItemType.Corpse },
]
