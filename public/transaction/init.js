var SignerInitializer = function() {
    var _this = this;
    var webURI;
    var jsURI;
    var correlationID;

    this.init = function() {
        correlationID = _this.extractedQueryParam('cid');
        webURI = _this.extractedQueryParam('webURI');
        jsURI = window.location.protocol + '//' + window.location.host;
        window.addEventListener('message', _this.onMessage);
        window.opener.postMessage({type: 'POPUP_MOUNTED', correlationID: correlationID}, '*');
    };

    this.onMessage = function(event) {
        if (event && event.data && event.data.type === 'SEND_TRANSACTION_DATA') {
            var transactionData = Object.assign({}, event.data.params);
            var action = _this.getAction(event, transactionData);
            var form = document.createElement('form');
            form.action = action;
            form.method = 'POST';
            var inputBearer = document.createElement('input');
            inputBearer.type = 'hidden';
            inputBearer.name = 'bearerToken';
            inputBearer.value = transactionData.bearerToken;
            form.appendChild(inputBearer);
            var inputData = document.createElement('input');
            inputData.type = 'hidden';
            inputData.name = 'data';
            inputData.value = JSON.stringify(Object.assign({}, transactionData.transactionRequest));
            form.appendChild(inputData);
            document.body.appendChild(form);
            form.submit();
        }
    };

    this.getAction = function(event, transactionData) {
        var transactionRequest = transactionData.transactionRequest;
        if (event.data.params.action === 'sign') {
            return _this.buildUrl(webURI + '/transaction/sign/' + transactionRequest.type, {redirectUri: jsURI + '/transaction/finish', correlationID: correlationID});
        } else {
            if (transactionRequest.type) {
                return _this.buildUrl(webURI + '/transaction/execute/' + transactionRequest.type, {redirectUri: jsURI + '/transaction/finish', correlationID: correlationID});
            } else {
                return _this.buildUrl(webURI + '/transaction/execute', {redirectUri: jsURI + '/transaction/finish', correlationID: correlationID});
            }
        }
    };

    this.buildUrl = function(to, options) {
        if (options) {
            var params = {};
            if (options.redirectUri) {
                params.redirectUri = options.redirectUri;
            }
            if (options.correlationID) {
                params.cid = options.correlationID;
            }
            return _this.addRequestParams(to, params);
        }
        return to;
    };

    this.addRequestParams = function(url, params) {
        if (url && params) {
            var paramsAsString = $.param(params);
            if (url && url.indexOf('?') > 0) {
                return url + "&" + paramsAsString;
            }
            else {
                return url + "?" + paramsAsString;
            }
        }
        return url;
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
    };
};

$(document).ready(function() {
    SignerInitializer().init();
}());