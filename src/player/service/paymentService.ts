import {inject, injectable} from "inversify"
import * as Stripe from "stripe"
import {Environment} from "../../app/enum/environment"
import {Types} from "../../support/types"
import {PaymentMethodEntity} from "../entity/paymentMethodEntity"
import {PlayerEntity} from "../entity/playerEntity"
import ICardSourceCreationOptions = Stripe.cards.ICardSourceCreationOptions

const stripePlanId = "plan_FRLSOX5KKZWg66"

@injectable()
export default class PaymentService {
  constructor(
    @inject(Types.StripeClient) private readonly stripeClient: Stripe,
    @inject(Types.Environment) private readonly environment: Environment) {}

  public async createCustomer(player: PlayerEntity) {
    const response = await this.stripeClient.customers.create({
      name: player.uuid,
    })
    player.stripeCustomerId = response.id
  }

  public async addPaymentMethod(
    player: PlayerEntity, nickname: string, ccNumber: string, expMonth: number, expYear: number) {
    if (!player.stripeCustomerId) {
      await this.createCustomer(player)
    }
    const response = await this.stripeClient.customers.createSource(player.stripeCustomerId, {
      source: this.getSource(ccNumber, expMonth, expYear),
    })
    const paymentMethod = new PaymentMethodEntity()
    paymentMethod.nickname = nickname
    paymentMethod.stripePaymentMethodId = response.id
    paymentMethod.player = player
    if (!player.paymentMethods) {
      player.paymentMethods = []
    }
    player.paymentMethods.push(paymentMethod)
  }

  public async purchaseSubscription(player: PlayerEntity): Promise<boolean> {
    if (!player.stripeCustomerId) {
      await this.createCustomer(player)
    }
    if (!player.paymentMethods) {
      return false
    }
    const response = await this.stripeClient.customers.createSubscription(player.stripeCustomerId, {
      items: [{ plan: stripePlanId }],
    })
    player.stripeSubscriptionId = response.id
    return response.status === "active"
  }

  private getSource(ccNumber: string, expMonth: number, expYear: number): string | ICardSourceCreationOptions {
    return this.environment === Environment.Production ? {
      exp_month: expMonth,
      exp_year: expYear,
      number: ccNumber,
      object: "card",
    } : "tok_visa"
  }
}
