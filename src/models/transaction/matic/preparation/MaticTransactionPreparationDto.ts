import GasPriceDto from './GasPriceDto';

export default class MaticTransactionPreparationDto {

    public gasPrices!: GasPriceDto[];
    public gasLimit!: number;
    public reverted!: boolean;
}
