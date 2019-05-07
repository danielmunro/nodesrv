import {AsyncContainerModule} from "inversify"
import ItemTable from "../../item/itemTable"
import FightTable from "../../mob/fight/fightTable"
import MobTable from "../../mob/mobTable"
import ExitTable from "../../room/exitTable"
import RoomTable from "../../room/roomTable"
import {Types} from "../../support/types"

export default new AsyncContainerModule(async bind => {
  bind<MobTable>(Types.MobTable).toConstantValue(new MobTable())
  bind<RoomTable>(Types.RoomTable).toConstantValue(new RoomTable())
  bind<ItemTable>(Types.ItemTable).toConstantValue(new ItemTable())
  bind<ExitTable>(Types.ExitTable).toConstantValue(new ExitTable())
  bind<FightTable>(Types.FightTable).toConstantValue(new FightTable())
})
