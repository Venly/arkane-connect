import GasPriceDto from './GasPriceDto';

export default class GochainTransactionPreparationDto {

    public gasPrices!: GasPriceDto[];
    public gasLimit!: number;
    public reverted!: boolean;
}
