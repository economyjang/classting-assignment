import { IsNotEmpty } from 'class-validator';

export class SubscriptionDto {
    @IsNotEmpty()
    id: string;
}
