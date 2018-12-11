var SignerFinisher = function() {
    var _this = this;
    var correlationID;

    this.init = function() {
        correlationID = _this.extractedQueryParam('cid');
        window.opener.postMessage({type: 'SIGNER_FINISHED', correlationID: correlationID, result: createResult()}, '*');
    };

    this.createResult = function() {
        var status = this.extractedQueryParam('status');
        if (status === 'ABORTED') {
            console.log('createResult', status);
            return {status};
        } else {
            var transactionHash = this.extractedQueryParam('transactionHash');
            var signedTransaction = this.extractedQueryParam('signedTransaction');
            console.log('createResult', status, transactionHash, signedTransaction);
            return transactionHash !== null ? this.createTransactionResult(status, transactionHash) : this.createSignResult(status, signedTransaction);
        }
    };

    this.createTransactionResult = function(status, transactionHash) {
        return {status: status, transactionHash: transactionHash};
    };

    this.createSignResult = function(status, signedTransaction) {
        return {status: status, signedTransaction: signedTransaction};
    };

    this.extractedQueryParam = function(name) {
        var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
        if (results == null) {
            return null;
        }
        return decodeURIComponent(results[1]) || 0;
    };

    return {
        init: this.init
    }
};

$(document).ready(function() {
    SignerFinisher().init();
}());