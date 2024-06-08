import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn
} from 'typeorm';


@Entity()
export class Privileges {

    @PrimaryGeneratedColumn()
    privileged_id: number;

    @Column()
    create?: boolean;

    @Column({ default: true })
    read: boolean;

    @Column()
    update?: boolean;

    @Column()
    delete?: boolean;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt?: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt?: Date;
}
