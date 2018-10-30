import {SecretType} from './SecretType';
import {Chain, Chains} from './Chain';
import {ImportWalletType} from './ImportWalletType';

export class SupportedChains {

    public static getInstance(): SupportedChains {
        if (!SupportedChains.instance) {
            SupportedChains.instance = new SupportedChains();
        }
        return SupportedChains.instance;
    }

    public static getAll(): Chains {
        return SupportedChains.getInstance().chains;
    }

    public static getByIndex(index: number): Chain | undefined {
        if (SupportedChains.getAll().length > index) {
            return SupportedChains.getAll()[index];
        }
    }


    public static getByName(name: string): Chain | undefined {
        return SupportedChains.getAll()
                              .find((chain: Chain) => !!name && (name.toLowerCase() === chain.name.toLowerCase()));
    }

    public static getIndexBySecretType(secretType: SecretType): number {
        return SupportedChains.getAll().findIndex((c: Chain) => c.secretType === secretType);
    }

    public static getBySecretType(secretType: SecretType): Chain | undefined {
        return SupportedChains.getAll().find((c: Chain) => c.secretType === secretType);
    }

    private static instance: SupportedChains;

    private chains: Chain[];

    public constructor() {
        this.chains = [
            new Chain(
                'Ethereum',
                SecretType.ETHEREUM,
                ImportWalletType.ETHEREUM_PRIVATE_KEY,
            ),
            new Chain(
                'VeChain',
                SecretType.VECHAIN,
                ImportWalletType.VECHAIN_KEYSTORE,
            ),
        ];
    }
}
