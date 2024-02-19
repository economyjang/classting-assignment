import {
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { User } from '../../auth/entity/User.entity';
import { Page } from '../../page/entity/Page.entity';

@Entity()
export class Subscription {
    @PrimaryGeneratedColumn()
    id: string;

    @ManyToOne(() => User, (user) => user.subscriptions)
    user: User;

    @ManyToOne(() => Page)
    page: Page;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;

    setUser(user: User) {
        this.user = user;
        return this;
    }

    setPage(page: Page) {
        this.page = page;
        return this;
    }
}
