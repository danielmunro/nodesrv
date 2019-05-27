import { Column, Entity, Generated, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm"
import * as v4 from "uuid"
import { Affect } from "../../affect/model/affect"
import AffectService from "../../affect/service/affectService"
import { newEmptyAttributes } from "../../attributes/factory/attributeFactory"
import Attributes from "../../attributes/model/attributes"
import { Equipment } from "../enum/equipment"
import { ItemType } from "../enum/itemType"
import { MaterialType } from "../enum/materialType"
import Container from "./container"
import Drink from "./drink"
import Food from "./food"
import Forge from "./forge"
import { Inventory } from "./inventory"

@Entity()
export class Item {
  @PrimaryGeneratedColumn()
  public id: number

  @Column("text")
  @Generated("uuid")
  public uuid: string = v4()

  @Column("text", { nullable: true })
  public canonicalId: string

  @Column("text", { nullable: true })
  public canonicalIdentifier: string

  @Column("text")
  public name: string

  @Column("text")
  public brief: string

  @Column("text")
  public description: string

  @Column("text", { nullable: true })
  public equipment: Equipment

  @Column("integer")
  public itemType: ItemType

  @Column("integer")
  public value: number = 0

  @Column("integer", { nullable: true })
  public hunger: number

  @Column("boolean", { default: true })
  public isTransferable: boolean = true

  @Column("integer")
  public level: number = 0

  @Column("integer")
  public weight: number = 0

  @Column("text")
  public material: MaterialType = MaterialType.Undefined

  @Column("integer")
  public condition: number = 1

  @Column("boolean", { default: true })
  public identified = true

  @Column("integer", { nullable: true })
  public capacity: number

  @Column("integer", { nullable: true })
  public wearTimer: number

  @ManyToOne(() => Inventory, inventory => inventory.items, { eager: true })
  public inventory: Inventory

  @OneToOne(() => Attributes, attributes => attributes.item, { cascade: true, eager: true })
  public attributes: Attributes = newEmptyAttributes()

  @OneToMany(() => Affect, affect => affect.item, { cascade: true, eager: true })
  public affects: Affect[]

  @OneToOne(() => Container, { cascade: true, eager: true })
  @JoinColumn()
  public container: Container

  @OneToOne(() => Food, food => food.item, { cascade: true, eager: true})
  @JoinColumn()
  public food: Food

  @OneToOne(() => Drink, drink => drink.item, { cascade: true, eager: true })
  @JoinColumn()
  public drink: Drink

  @OneToOne(() => Forge, { eager: true, cascade: true })
  @JoinColumn()
  public forge: Forge

  public carriedBy: any

  public affect(): AffectService {
    return new AffectService(this)
  }

  public isFood(): boolean {
    return this.itemType === ItemType.Food
  }

  public isContainer(): boolean {
    return !!this.container
  }

  public describe(): string {
    return this.description + (this.itemType === ItemType.Container ?
      `\n\n${this.name} contents:\n${this.container.toString()}` : "")
  }

  public toString(): string {
    return this.name
  }
}
