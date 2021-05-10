import GasPriceDto from './GasPriceDto';

export default class AvacTransactionPreparationDto {

    public gasPrices!: GasPriceDto[];
    public gasLimit!: number;
    public reverted!: boolean;
}
