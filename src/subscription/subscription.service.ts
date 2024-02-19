import { Injectable } from '@nestjs/common';
import { User } from '../auth/entity/User.entity';
import { Subscription } from './entity/Subscription.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Page } from '../page/entity/Page.entity';

@Injectable()
export class SubscriptionService {
    constructor(
        @InjectRepository(Subscription)
        private subscriptionRepository: Repository<Subscription>,
    ) {}

    async getMySubscribePages(user: User) {
        const result = await this.subscriptionRepository.find({
            where: { user: { id: user.id } },
            relations: { user: true, page: true },
        });
        return result.map((subscription) => subscription.page);
    }

    async saveSubscription(user: User, page: Page) {
        const subscription = new Subscription().setUser(user).setPage(page);
        await this.subscriptionRepository.save(subscription);
    }

    async deleteSubscription(user: User, page: Page) {
        await this.subscriptionRepository.softDelete({ user, page });
    }
}
