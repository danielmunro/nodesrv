import {ContainerModule} from "inversify"
import MobRepository from "../../mob/repository/mob"
import PlayerRepository from "../../player/repository/player"
import {RealEstateBidEntity} from "../../room/entity/realEstateBidEntity"
import {RealEstateListingEntity} from "../../room/entity/realEstateListingEntity"
import {RoomEntity} from "../../room/entity/roomEntity"
import RealEstateBidRepository from "../../room/repository/realEstateBidRepository"
import RealEstateListingRepository from "../../room/repository/realEstateListingRepository"
import RoomRepository from "../../room/repository/room"
import TickRepository from "../../server/repository/tickRepository"
import {getTestMob} from "../../support/test/mob"
import {getTestPlayer} from "../../support/test/player"
import {Types} from "../../support/types"

const mockPlayerRepository = jest.fn(() => ({
  findOneByEmail: () => getTestPlayer(),
  findOneByMob: () => getTestPlayer(),
  save: (player: any) => player,
}))
const mockMobRepository = jest.fn(() => ({
  findOneByName: (name: string) => getTestMob(name),
  save: async (mob: any) => mob,
}))
const mockTickRepository = jest.fn(() => ({
  save: async (tick: any) => tick,
}))
const mockRealEstateListingRepository = jest.fn(() => ({
  save: async (realEstateListing: RealEstateListingEntity) => Promise.resolve(realEstateListing),
}))
const mockRealEstateBidRepository = jest.fn(() => ({
  save: async (realEstateBid: RealEstateBidEntity) => Promise.resolve(realEstateBid),
}))
const mockRoomRepository = jest.fn(() => ({
  save: async (room: RoomEntity) => Promise.resolve(room),
}))

export default new ContainerModule(bind => {
  // @ts-ignore
  bind<PlayerRepository>(Types.PlayerRepository).toConstantValue(mockPlayerRepository())
  // @ts-ignore
  bind<MobRepository>(Types.MobRepository).toConstantValue(mockMobRepository())
  // @ts-ignore
  bind<TickRepository>(Types.TickRepository).toConstantValue(mockTickRepository())
  bind<RealEstateListingRepository>(Types.RealEstateListingRepository)
    // @ts-ignore
    .toConstantValue(mockRealEstateListingRepository())
  bind<RealEstateBidRepository>(Types.RealEstateBidRepository)
    // @ts-ignore
    .toConstantValue(mockRealEstateBidRepository())
  bind<RoomRepository>(Types.RoomRepository)
    // @ts-ignore
    .toConstantValue(mockRoomRepository())
})
