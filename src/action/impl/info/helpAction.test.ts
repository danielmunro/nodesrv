import {RequestType} from "../../../request/requestType"
import TestBuilder from "../../../test/testBuilder"
import Action from "../../action"
import {Messages} from "../../constants"

let testBuilder: TestBuilder
let action: Action

beforeEach(async () => {
  testBuilder = new TestBuilder()
  action = await testBuilder.getAction(RequestType.Help)
})

describe("help action", () => {
  it("describes cast action", async () => {
    // when
    const response = await action.handle(testBuilder.createRequest(RequestType.Help, "help cast"))

    // then
    expect(response.getMessageToRequestCreator())
      .toBe(`syntax: cast {spell} {target}

Before you can cast a spell, you have to practice it.  The more you practice,
the higher chance you have of success when casting.  Casting spells costs mana.
The mana cost decreases as your level increases.

The <target> is optional.  Many spells which need targets will use an
appropriate default target, especially during combat.

If the spell name is more than one word, then you must quote the spell name.
Example: cast 'cure critic' frag.  Quoting is optional for single-word spells.
You can abbreviate the spell name.

When you cast an offensive spell, the victim usually gets a saving throw.
The effect of the spell is reduced or eliminated if the victim makes the
saving throw successfully.

See also the help sections for individual spells.`)
  })

  it("describes buy action", async () => {
    // when
    const response = await action.handle(testBuilder.createRequest(RequestType.Help, "help buy"))

    // then
    expect(response.getMessageToRequestCreator())
      .toBe("syntax: buy {item with room mob}\n\nMore information coming soon.")
  })

  it("can handle when no help subject has found", async () => {
    // when
    const response = await action.handle(testBuilder.createRequest(RequestType.Help, "help foo"))

    // then
    expect(response.getMessageToRequestCreator()).toBe(Messages.Help.Fail)
  })
})
