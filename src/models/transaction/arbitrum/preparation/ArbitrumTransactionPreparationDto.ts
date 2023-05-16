import GasPriceDto from './GasPriceDto';

export default class ArbitrumTransactionPreparationDto {

    public gasPrices!: GasPriceDto[];
    public gasLimit!: number;
    public reverted!: boolean;
}
