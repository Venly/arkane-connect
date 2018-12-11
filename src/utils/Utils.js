"use strict";
exports.__esModule = true;
var env_1 = require("../../env");
var Utils = /** @class */ (function () {
    function Utils() {
    }
    Object.defineProperty(Utils, "env", {
        get: function () {
            var env = env_1["default"];
            switch (Utils.environment) {
                case 'local':
                case 'tst1':
                    env.CONNECT_JS_REALM_PUBLIC_KEY = env.CONNECT_JS_REALM_PUBLIC_KEY_TST1;
                    break;
                case 'staging':
                    env.CONNECT_JS_REALM_PUBLIC_KEY = env.CONNECT_JS_REALM_PUBLIC_KEY_STAGING;
                    break;
                default:
                    env.CONNECT_JS_REALM_PUBLIC_KEY = env.CONNECT_JS_REALM_PUBLIC_KEY_PROD;
            }
            return env;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Utils, "urls", {
        get: function () {
            var prefix = '';
            switch (Utils.environment) {
                case 'local':
                    prefix = '-tst1';
                    break;
                case 'tst1':
                    prefix = '-tst1';
                    break;
                case 'staging':
                    prefix = '-staging';
                    break;
            }
            return {
                api: "https://api" + prefix + ".arkane.network/api",
                connectJS: Utils.environment === 'local' ? 'http://localhost:8081' : "https://connect-js" + prefix + ".arkane.network",
                connectWeb: Utils.environment === 'local' ? 'http://localhost:8181' : "https://connect" + prefix + ".arkane.network",
                login: "https://login" + prefix + ".arkane.network/auth"
            };
        },
        enumerable: true,
        configurable: true
    });
    Utils.removeNulls = function (obj) {
        return Object.keys(obj)
            .filter(function (key) { return obj[key] !== null && obj[key] !== undefined; }) // Remove undef. and null.
            .reduce(function (newObj, key) {
            var _a, _b;
            if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
                return Object.assign(newObj, (_a = {}, _a[key] = Utils.removeNulls(obj[key]), _a));
            }
            else {
                return Object.assign(newObj, (_b = {}, _b[key] = obj[key], _b));
            }
        }, {});
    };
    Utils.removeNullsAndEmpty = function (obj) {
        return Object.keys(obj)
            .filter(function (key) { return obj[key] !== null && obj[key] !== undefined && obj[key] !== ''; }) // Remove undef. and null.
            .reduce(function (newObj, key) {
            var _a, _b;
            if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
                return Object.assign(newObj, (_a = {}, _a[key] = Utils.removeNullsAndEmpty(obj[key]), _a));
            }
            else {
                return Object.assign(newObj, (_b = {}, _b[key] = obj[key], _b));
            }
        }, {});
    };
    Utils.messages = function () {
        return {
            hasValidOrigin: function (message) {
                return message.origin === Utils.urls.connectJS;
            },
            hasType: function (message) {
                return message.data && message.data.type && message.data.type !== '';
            },
            isOfType: function (message, eventType) {
                return Utils.messages().hasType(message) && message.data.type === eventType;
            }
        };
    };
    Utils.formatNumber = function (value, minDecimals, maxDecimals) {
        if (minDecimals === void 0) { minDecimals = 2; }
        if (maxDecimals === void 0) { maxDecimals = minDecimals; }
        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: minDecimals,
            maximumFractionDigits: maxDecimals
        }).format(value);
    };
    Utils.rawValue = function () {
        return {
            toTokenValue: function (rawValue, decimals) { return rawValue / Math.pow(10, decimals); },
            toGwei: function (rawValue) { return rawValue / Math.pow(10, 9); }
        };
    };
    Utils.gwei = function () {
        return {
            toRawValue: function (rawValue) { return rawValue * Math.pow(10, 9); }
        };
    };
    Utils.openExternalUrl = function (url, targetBlank) {
        if (targetBlank === void 0) { targetBlank = true; }
        if (targetBlank) {
            var newWindow = window.open('', '_blank');
            if (newWindow) {
                newWindow.opener = null;
                newWindow.location.assign(url);
            }
            return newWindow;
        }
        else {
            window.location.href = url;
            return window;
        }
    };
    Utils.zeroIfUndefined = function (numberToVerify) {
        return numberToVerify ? numberToVerify : 0;
    };
    Utils.environment = 'prod';
    return Utils;
}());
exports["default"] = Utils;
