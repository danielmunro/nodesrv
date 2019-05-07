import {ContainerModule} from "inversify"
import TestRunner from "../../support/test/testRunner"
import {Types} from "../../support/types"

export default new ContainerModule(bind => {
  bind<TestRunner>(Types.TestRunner).to(TestRunner).inSingletonScope()
})
