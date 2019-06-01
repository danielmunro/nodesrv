import {AsyncContainerModule} from "inversify"
import {getItemRepository} from "../../item/repository/item"
import ItemTable from "../../item/table/itemTable"
import FightTable from "../../mob/fight/fightTable"
import SpecializationService from "../../mob/specialization/service/specializationService"
import SpecializationGroup from "../../mob/specialization/specializationGroup"
import specializationGroups from "../../mob/specialization/specializationGroups"
import SpecializationLevel from "../../mob/specialization/specializationLevel"
import {defaultSpecializationLevels} from "../../mob/specialization/specializationLevels"
import MobTable from "../../mob/table/mobTable"
import {newExitTable, newRoomTable} from "../../room/factory/roomFactory"
import ExitTable from "../../room/table/exitTable"
import RoomTable from "../../room/table/roomTable"
import {Types} from "../../support/types"

export default new AsyncContainerModule(async bind => {
  bind<MobTable>(Types.MobTable).toConstantValue(new MobTable())
  bind<RoomTable>(Types.RoomTable).toConstantValue(await newRoomTable())
  bind<ItemTable>(Types.ItemTable).toConstantValue(new ItemTable(await (await getItemRepository()).findAll()))
  bind<ExitTable>(Types.ExitTable).toConstantValue(await newExitTable())
  bind<FightTable>(Types.FightTable).toConstantValue(new FightTable())
  bind<SpecializationLevel[]>(Types.SpecializationLevels).toConstantValue(defaultSpecializationLevels)
  bind<SpecializationGroup[]>(Types.SpecializationGroups).toDynamicValue(context => {
    const specializationService = context.container.get<SpecializationService>(Types.SpecializationService)
    return specializationGroups(specializationService)
  })
  console.log("done loading tables")
})
