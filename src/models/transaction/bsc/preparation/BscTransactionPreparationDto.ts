import GasPriceDto from './GasPriceDto';

export default class BscTransactionPreparationDto {

    public gasPrices!: GasPriceDto[];
    public gasLimit!: number;
    public reverted!: boolean;
}
