export enum SecretType {
    ETHEREUM = 'ETHEREUM',
    VECHAIN = 'VECHAIN',
}

export class SecretTypeUtil {
    public static byChain(chain: string): SecretType | undefined {
        switch (chain && chain.toUpperCase()) {
            case 'ETHEREUM':
                return SecretType.ETHEREUM;
            case 'VECHAIN':
                return SecretType.VECHAIN;
            default:
                return undefined;
        }
    }
}
