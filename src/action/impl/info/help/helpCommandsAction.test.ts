import {createTestAppContainer} from "../../../../app/factory/testFactory"
import {RequestType} from "../../../../messageExchange/enum/requestType"
import TestRunner from "../../../../support/test/testRunner"
import {Types} from "../../../../support/types"

let testRunner: TestRunner

beforeEach(async () => {
  testRunner = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)
})

describe("help commands action", () => {
  it("describes all commands", async () => {
    // when
    const response = await testRunner.invokeAction(RequestType.HelpCommands, "help commands")

    // then
    expect(response.getMessageToRequestCreator()).toBe(`Commands:
affects
afk
alias add
alias list
alias remove
alias reset
attributes
autoassist
backstab
ban
bash
berserk
bounty
buy
cast
cc add
cc list
cc remove
close
consider
demote
detect hidden
detect touch
dirt kick
disarm
down
drop
east
eat
endurance
envenom
equipped
exits
eye gouge
flee
follow
garotte
get
gossip
group
group tell
hamstring
heal
help
help commands
inventory
kill
kill
level
list
lock
look
loot
lore
nofollow
noop
north
open
owned
password
peek
practice
promote
put
quit
remove
repair
reply
room bid
room bid accept
room bid list
room group
room info
room info
room join
room sell
sacrifice
say
scan
score
sell
sharpen
shield bash
sit
sleep
sneak
south
steal
subscribe
tell
time
trade add
trade approve
trade reject
trade request
train
trip
unban
unlock
unsubscribe
up
wake
wear
weather
west
who
wimpy
`)
  })
})
