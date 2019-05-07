import {AsyncContainerModule} from "inversify"
import MobRepository, {getMobRepository} from "../../mob/repository/mob"
import PlayerRepository, {getPlayerRepository} from "../../player/repository/player"
import {Types} from "../../support/types"

export default new AsyncContainerModule(async bind => {
  bind<PlayerRepository>(Types.PlayerRepository)
    .toConstantValue(await getPlayerRepository())
  bind<MobRepository>(Types.MobRepository)
    .toConstantValue(await getMobRepository())
})
