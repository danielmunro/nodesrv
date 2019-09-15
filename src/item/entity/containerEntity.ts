import { Column, Entity, Generated, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm"
import v4 from "uuid"
import { InventoryEntity } from "./inventoryEntity"
import { ItemEntity } from "./itemEntity"

@Entity()
export default class ContainerEntity {
  @PrimaryGeneratedColumn()
  public id: number

  @Column()
  @Generated("uuid")
  public uuid: string = v4()

  @Column()
  public isOpen: boolean = false

  @Column({ nullable: true })
  public isCloseable: boolean = false

  @Column({ default: 0 })
  public weightCapacity: number

  @Column({ default: 0 })
  public itemCapacity: number

  @Column({ default: 0 })
  public maxWeightForItem: number

  @Column({ default: 0 })
  public gold: number

  @OneToOne(() => InventoryEntity, { eager: true, cascade: true })
  @JoinColumn()
  public inventory: InventoryEntity

  public addItem(item: ItemEntity, carriedBy?: any) {
    this.inventory.addItem(item)
    item.carriedBy = carriedBy
  }

  public getItemFrom(item: ItemEntity, inventory: InventoryEntity) {
    this.inventory.getItemFrom(item, inventory)
  }

  public toString(): string {
    return this.inventory.items.reduce((previous, current) => `${previous}\n${current.name}`, "")
  }
}
