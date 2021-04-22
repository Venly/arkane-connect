import { BuildSignRequestBaseDto } from './BuildSignRequestBaseDto';

export class BuildEip712SignRequestDto extends BuildSignRequestBaseDto {
    public data!: any;
}
