import App from "../src/app/app"
import createAppContainer from "../src/app/factory/factory"
import Cost from "../src/check/cost/cost"
import {CostType} from "../src/check/cost/costType"
import {getSkillTable} from "../src/mob/skill/skillTable"
import {initializeConnection} from "../src/support/db/connection"

initializeConnection().then(() => createAppContainer(null, null, null).then((app: App) => {
  console.log("spells:")
// getSpellTable(
//   mobService,
//   eventService,
//   new ItemService(),
//   new StateService(new WeatherService(), new TimeService()),
//   locationService).forEach(spell => {
//   console.log(spell.getCosts().reduce((previous: string, cost: Cost) =>
//     previous + ", " + getCostTypeLabel(cost.costType) + ": " + cost.amount, spell.getSpellType()))
// })

  console.log("\nskills:")
  getSkillTable(app.getContainer()).forEach(skill => {
    console.log(skill.getCosts().reduce((previous: string, cost: Cost) =>
      previous + ", " + getCostTypeLabel(cost.costType) + ": " + cost.amount, skill.getSkillType()))
  })
}))

function getCostTypeLabel(costType: CostType): string {
  switch (costType) {
    case CostType.Mv:
      return "mv"
    case CostType.Delay:
      return "delay"
    case CostType.Mana:
      return "mana"
    case CostType.Train:
      return "train"
    default:
      return ""
  }
}
