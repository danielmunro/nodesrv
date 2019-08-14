import {AsyncContainerModule} from "inversify"
import Spell from "../../action/impl/spell"
import {getItemRepository} from "../../item/repository/item"
import ItemTable from "../../item/table/itemTable"
import FightTable from "../../mob/fight/fightTable"
import HealerSpell from "../../mob/healer/healerSpell"
import getHealerSpellTable from "../../mob/healer/healerSpellTable"
import SpecializationService from "../../mob/specialization/service/specializationService"
import SpecializationGroup from "../../mob/specialization/specializationGroup"
import specializationGroups from "../../mob/specialization/specializationGroups"
import SpecializationLevel from "../../mob/specialization/specializationLevel"
import {defaultSpecializationLevels} from "../../mob/specialization/specializationLevels/specializationLevels"
import MobTable from "../../mob/table/mobTable"
import {getPlayerTable} from "../../player/factory/factory"
import PlayerTable from "../../player/table/playerTable"
import {newExitTable, newRoomTable} from "../../room/factory/roomFactory"
import {createRealEstateBidRepository} from "../../room/repository/realEstateBidRepository"
import {createRealEstateListingRepository} from "../../room/repository/realEstateListingRepository"
import ExitTable from "../../room/table/exitTable"
import RealEstateBidTable from "../../room/table/realEstateBidTable"
import RealEstateListingTable from "../../room/table/realEstateListingTable"
import RoomTable from "../../room/table/roomTable"
import {Types} from "../../support/types"
import {Timings} from "../constants"

export default new AsyncContainerModule(async bind => {
  console.time(Timings.tables)
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
  bind<PlayerTable>(Types.PlayerTable).toConstantValue(await getPlayerTable())
  bind<RealEstateListingTable>(Types.RealEstateListingTable)
    .toConstantValue(new RealEstateListingTable(await (await createRealEstateListingRepository()).find()))
  bind<RealEstateBidTable>(Types.RealEstateBidTable)
    .toConstantValue(new RealEstateBidTable(await (await createRealEstateBidRepository()).find()))
  bind<HealerSpell[]>(Types.HealerSpells).toDynamicValue(context =>
    getHealerSpellTable(context.container.getAll<Spell>(Types.Spells)))
  console.timeEnd(Timings.tables)
})
