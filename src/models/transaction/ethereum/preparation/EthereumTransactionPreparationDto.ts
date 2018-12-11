import GasPriceDto from './GasPriceDto';

export default class EthereumTransactionPreparationDto {

    public gasPrices!: GasPriceDto[];
    public gasLimit!: number;
    public reverted!: boolean;
}
