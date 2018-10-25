import {expect} from 'chai';
import Api from '@/api';
import sinon from 'sinon';
import EthereumTransactionData from '@/api/EthereumTransactionData';
import VechainTransactionData from '@/api/VechainTransactionData';


describe('Api.ts', () => {
    it('signTransaction for ethereum', async () => {
        const stub = sinon.stub(Api, 'signTransaction').returns(Promise.resolve({
            success: true,
            result: {signedTransaction: 'transaction'},
        }));
        const data: EthereumTransactionData = Object.assign(new EthereumTransactionData(), {
            type: `ETHEREUM_TRANSACTION`,
            walletId: '1',
            submit: false,
            gasPrice: 10000000000,
            gas: 230000,
            nonce: 0,
            value: 10000000000,
            data: `0x`,
            to: `0xdc71b72db51e227e65a45004ab2798d31e8934c9`,
        });

        const result = await Api.signTransaction(data, '1234');
        expect(result.success).to.eql(true, 'success must be true');
        expect(result.result).to.eql({signedTransaction: 'transaction'});
        stub.restore();
    });

    it('signTransaction for vechain', async () => {
        const stub = sinon.stub(Api, 'signTransaction').returns(Promise.resolve({
            success: true,
            result: {signedTransaction: 'transaction'},
        }));
        const data: VechainTransactionData = Object.assign(new VechainTransactionData(), {
            type: `VECHAIN_TRANSACTION`,
            walletId: '1',
            submit: false,
            blockRef: '',
            chainTag: '',
            expiration: 0,
            gas: 230000,
            gasPriceCoef: '',
            nonce: 0,
            value: 10000000000,
            clauses: [{
                to: `0xdc71b72db51e227e65a45004ab2798d31e8934c9`,
                data: `0x0`,
                amount: ``,
            }],
        });

        const result = await Api.signTransaction(data, '1234');
        expect(result.success).to.eql(true, 'success must be true');
        expect(result.result).to.eql({signedTransaction: 'transaction'});
        stub.restore();
    });
});
