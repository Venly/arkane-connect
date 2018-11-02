import GasPriceDto from './gasprice/GasPriceDto';

export default class EthTransactionPreparationDto {

    public gasPrices!: GasPriceDto[];
    public gasLimit!: number;
    public reverted!: boolean;
}
