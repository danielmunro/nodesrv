import {AsyncContainerModule} from "inversify"
import Spell from "../../action/impl/spell"
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
import PlayerTable from "../../player/table/playerTable"
import ExitTable from "../../room/table/exitTable"
import RealEstateBidTable from "../../room/table/realEstateBidTable"
import RealEstateListingTable from "../../room/table/realEstateListingTable"
import RoomTable from "../../room/table/roomTable"
import {Types} from "../../support/types"

export default new AsyncContainerModule(async bind => {
  bind<MobTable>(Types.MobTable).toConstantValue(new MobTable())
  bind<RoomTable>(Types.RoomTable).toConstantValue(new RoomTable())
  bind<ItemTable>(Types.ItemTable).toConstantValue(new ItemTable())
  bind<ExitTable>(Types.ExitTable).toConstantValue(new ExitTable())
  bind<FightTable>(Types.FightTable).toConstantValue(new FightTable())
  bind<PlayerTable>(Types.PlayerTable).toConstantValue(new PlayerTable())
  bind<SpecializationLevel[]>(Types.SpecializationLevels).toConstantValue(defaultSpecializationLevels)
  bind<SpecializationGroup[]>(Types.SpecializationGroups).toDynamicValue(context => {
    const specializationService = context.container.get<SpecializationService>(Types.SpecializationService)
    return specializationGroups(specializationService)
  })
  bind<RealEstateListingTable>(Types.RealEstateListingTable).toConstantValue(new RealEstateListingTable())
  bind<RealEstateBidTable>(Types.RealEstateBidTable).toConstantValue(new RealEstateBidTable())
  bind<HealerSpell[]>(Types.HealerSpells).toDynamicValue(context =>
    getHealerSpellTable(context.container.getAll<Spell>(Types.Spells)))
})
