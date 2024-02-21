import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { UserType } from '../../../types/UserType';
import { Subscription } from '../../subscription/entity/Subscription.entity';
import { Feed } from '../../feed/entity/Feed.entity';
import { Page } from '../../page/entity/Page.entity';

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

    @OneToOne(() => Page, (page) => page.manager)
    page: Page;

    @Column()
    type: UserType;

    @OneToMany(() => Subscription, (subscriptions) => subscriptions.user)
    subscriptions: Subscription[];

    @OneToMany(() => Feed, (feed) => feed.user)
    feeds: Feed[];

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;

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
