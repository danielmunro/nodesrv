import {AsyncContainerModule} from "inversify"
import {getConnection} from "typeorm"
import MobRepository, {getMobRepository} from "../../mob/repository/mob"
import PlayerRepository, {getPlayerRepository} from "../../player/repository/player"
import RealEstateBidRepository, {createRealEstateBidRepository} from "../../room/repository/realEstateBidRepository"
import RealEstateListingRepository,
{createRealEstateListingRepository} from "../../room/repository/realEstateListingRepository"
import RoomRepository, {getRoomRepository} from "../../room/repository/room"
import {TickEntity} from "../../server/entity/tickEntity"
import TickRepository from "../../server/repository/tickRepository"
import {Types} from "../../support/types"

export default new AsyncContainerModule(async bind => {
  const connection = getConnection()
  bind<PlayerRepository>(Types.PlayerRepository)
    .toConstantValue(await getPlayerRepository())
  bind<MobRepository>(Types.MobRepository)
    .toConstantValue(await getMobRepository())
  bind<TickRepository>(Types.TickRepository)
    .toConstantValue(connection.getRepository(TickEntity))
  bind<RealEstateListingRepository>(Types.RealEstateListingRepository)
    .toConstantValue(await createRealEstateListingRepository())
  bind<RealEstateBidRepository>(Types.RealEstateBidRepository)
    .toConstantValue(await createRealEstateBidRepository())
  bind<RoomRepository>(Types.RoomRepository)
    .toConstantValue(await getRoomRepository())
})
