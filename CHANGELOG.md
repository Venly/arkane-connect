#Changelog

## 1.13.0
* Add `signer.resubmitTransaction(transactionId: String, redirectOptions?: RedirectOptions)`.
* Add `signer.cancelTransaction(transactionId: String, redirectOptions?: RedirectOptions)`.
* Add `signer.signMessage(buildSignatureData: BuildMessageSignRequestDto, redirectOptions?: RedirectOptions)` to easily sign a message.
* Add support `MATIC` blockchain
* PopupSigner adds by default an overlay on the parent window when the popup opens. This functionality can be disabled using the `useOverlay` in `PopupOptions`.
* Add `api.getTransactionStatus(transactionHash: string, secretType: SecretType)` to retrieve the status of a transaction.

## 1.12.0
* Add `VECHAIN_RAW` SignatureRequestType

## 1.11.0
* Add `AETERNITY_RAW` SignatureRequestType

## 1.10.0
* Add `networkFee` and `systemFee` properties to the `NeoContractExecutionRequest`

## 1.7.0
* Add Neo `outputs` to contract execution request

### Bug Fixes
* When user closes `SignerPopup`, it should raise `{ status: "ABORTED" }`.
