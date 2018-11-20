import ItemRepository from "../item/repository/item"
import ItemResetRepository from "../item/repository/itemReset"
import { newMobReset } from "../mob/factory"
import MobRepository from "../mob/repository/mob"
import MobResetRepository from "../mob/repository/mobReset"
import RoomRepository from "../room/repository/room"
import File from "./file"

export default class ResetMaterializer {
  constructor(
    public readonly mobResetRepository: MobResetRepository,
    public readonly itemResetRepository: ItemResetRepository,
    public readonly mobRepository: MobRepository,
    public readonly itemRepository: ItemRepository,
    public readonly roomRepository: RoomRepository,
  ) {}

  public async materializeResets(file: File) {
    await Promise.all(file.mobResets.map(async resetObject => {
      const room = await this.roomRepository.findOneByImportId(resetObject.idOfResetDestination)
      const mob = await this.mobRepository.findOneByImportId(resetObject.idOfResetSubject)
      await this.mobResetRepository.save(newMobReset(mob, room))
    }))
  }
}
