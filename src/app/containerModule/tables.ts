import {AsyncContainerModule} from "inversify"
import ItemTable from "../../item/itemTable"
import {getItemRepository} from "../../item/repository/item"
import FightTable from "../../mob/fight/fightTable"
import MobTable from "../../mob/mobTable"
import {getMobRepository} from "../../mob/repository/mob"
import SpecializationService from "../../mob/specialization/service/specializationService"
import SpecializationGroup from "../../mob/specialization/specializationGroup"
import specializationGroups from "../../mob/specialization/specializationGroups"
import SpecializationLevel from "../../mob/specialization/specializationLevel"
import {defaultSpecializationLevels} from "../../mob/specialization/specializationLevels"
import ExitTable from "../../room/exitTable"
import {newExitTable, newRoomTable} from "../../room/factory"
import RoomTable from "../../room/roomTable"
import {Types} from "../../support/types"

export default new AsyncContainerModule(async bind => {
  bind<MobTable>(Types.MobTable).toConstantValue(new MobTable(await(await getMobRepository()).findAll()))
  bind<RoomTable>(Types.RoomTable).toConstantValue(await newRoomTable())
  bind<ItemTable>(Types.ItemTable).toConstantValue(new ItemTable(await (await getItemRepository()).findAll()))
  bind<ExitTable>(Types.ExitTable).toConstantValue(await newExitTable())
  bind<FightTable>(Types.FightTable).toConstantValue(new FightTable())
  bind<SpecializationLevel[]>(Types.SpecializationLevels).toConstantValue(defaultSpecializationLevels)
  bind<SpecializationGroup[]>(Types.SpecializationGroups).toDynamicValue(context => {
    const specializationService = context.container.get<SpecializationService>(Types.SpecializationService)
    return specializationGroups(specializationService)
  })
})
