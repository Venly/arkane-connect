import { GasPriceCoefDto } from './GasPriceCoefDto';

export default class VeChainTransactionPreparationDto {
    public gasPriceCoefficients!: GasPriceCoefDto[];
    public gasLimit!: number;
    public reverted!: boolean;
}
