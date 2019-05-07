import {ContainerModule} from "inversify"
import MobRepository from "../../mob/repository/mob"
import PlayerRepository from "../../player/repository/player"
import {getTestMob} from "../../support/test/mob"
import {Types} from "../../support/types"

const mockPlayerRepository = jest.fn(() => ({
  findOneByEmail: () => getTestMob(),
}))
const mockMobRepository = jest.fn()

export default new ContainerModule(bind => {
  bind<PlayerRepository>(Types.PlayerRepository)
    .toConstantValue(mockPlayerRepository())
  bind<MobRepository>(Types.MobRepository)
    .toConstantValue(mockMobRepository())
})
