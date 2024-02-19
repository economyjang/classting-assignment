import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { UserType } from '../../../types/UserType';
import { Subscription } from '../../subscription/entity/Subscription.entity';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    email_id: string;

    @Column()
    password: string;

    @Column()
    name: string;

    @Column()
    type: UserType;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;

    @OneToMany(() => Subscription, (subscriptions) => subscriptions.user)
    subscriptions: Subscription[];

    setEmailId(emailId: string) {
        this.email_id = emailId;
        return this;
    }

    setPassword(password: string) {
        this.password = password;
        return this;
    }

    setName(name: string) {
        this.name = name;
        return this;
    }

    setType(type: UserType) {
        this.type = type;
        return this;
    }
}
