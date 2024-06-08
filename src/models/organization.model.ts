import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn
} from 'typeorm';

@Entity()
export class Organizations {

    @PrimaryGeneratedColumn()
    org_id?: number;

    @Column()
    name: string;

    @Column()
    user_id: number;

    @Column()
    account_id: string;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt?: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt?: Date;
}
