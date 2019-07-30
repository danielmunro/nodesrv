import {ContainerModule} from "inversify"
import MobRepository from "../../mob/repository/mob"
import PlayerRepository from "../../player/repository/player"
import {RealEstateListingEntity} from "../../room/entity/realEstateListingEntity"
import RealEstateListingRepository from "../../room/repository/realEstateListingRepository"
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

export default new ContainerModule(bind => {
  bind<PlayerRepository>(Types.PlayerRepository)
    .toConstantValue(mockPlayerRepository())
  bind<MobRepository>(Types.MobRepository)
    .toConstantValue(mockMobRepository())
  bind<TickRepository>(Types.TickRepository)
    .toConstantValue(mockTickRepository())
  bind<RealEstateListingRepository>(Types.RealEstateListingRepository)
    .toConstantValue(mockRealEstateListingRepository())
})
