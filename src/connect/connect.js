!function(e){var t={};function n(r){if(t[r])return t[r].exports;var o=t[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)n.d(r,o,function(t){return e[t]}.bind(null,o));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=9)}([function(e,t,n){"use strict";var r=n(3),o=n(14),i=Object.prototype.toString;function u(e){return"[object Array]"===i.call(e)}function a(e){return null!==e&&"object"==typeof e}function s(e){return"[object Function]"===i.call(e)}function c(e,t){if(null!==e&&void 0!==e)if("object"!=typeof e&&(e=[e]),u(e))for(var n=0,r=e.length;n<r;n++)t.call(null,e[n],n,e);else for(var o in e)Object.prototype.hasOwnProperty.call(e,o)&&t.call(null,e[o],o,e)}e.exports={isArray:u,isArrayBuffer:function(e){return"[object ArrayBuffer]"===i.call(e)},isBuffer:o,isFormData:function(e){return"undefined"!=typeof FormData&&e instanceof FormData},isArrayBufferView:function(e){return"undefined"!=typeof ArrayBuffer&&ArrayBuffer.isView?ArrayBuffer.isView(e):e&&e.buffer&&e.buffer instanceof ArrayBuffer},isString:function(e){return"string"==typeof e},isNumber:function(e){return"number"==typeof e},isObject:a,isUndefined:function(e){return void 0===e},isDate:function(e){return"[object Date]"===i.call(e)},isFile:function(e){return"[object File]"===i.call(e)},isBlob:function(e){return"[object Blob]"===i.call(e)},isFunction:s,isStream:function(e){return a(e)&&s(e.pipe)},isURLSearchParams:function(e){return"undefined"!=typeof URLSearchParams&&e instanceof URLSearchParams},isStandardBrowserEnv:function(){return("undefined"==typeof navigator||"ReactNative"!==navigator.product)&&"undefined"!=typeof window&&"undefined"!=typeof document},forEach:c,merge:function e(){var t={};function n(n,r){"object"==typeof t[r]&&"object"==typeof n?t[r]=e(t[r],n):t[r]=n}for(var r=0,o=arguments.length;r<o;r++)c(arguments[r],n);return t},extend:function(e,t,n){return c(t,function(t,o){e[o]=n&&"function"==typeof t?r(t,n):t}),e},trim:function(e){return e.replace(/^\s*/,"").replace(/\s*$/,"")}}},function(e,t,n){"use strict";n.r(t),n.d(t,"__extends",function(){return o}),n.d(t,"__assign",function(){return i}),n.d(t,"__rest",function(){return u}),n.d(t,"__decorate",function(){return a}),n.d(t,"__param",function(){return s}),n.d(t,"__metadata",function(){return c}),n.d(t,"__awaiter",function(){return f}),n.d(t,"__generator",function(){return l}),n.d(t,"__exportStar",function(){return p}),n.d(t,"__values",function(){return d}),n.d(t,"__read",function(){return h}),n.d(t,"__spread",function(){return v}),n.d(t,"__await",function(){return y}),n.d(t,"__asyncGenerator",function(){return m}),n.d(t,"__asyncDelegator",function(){return _}),n.d(t,"__asyncValues",function(){return g}),n.d(t,"__makeTemplateObject",function(){return w}),n.d(t,"__importStar",function(){return b}),n.d(t,"__importDefault",function(){return E});
/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
var r=function(e,t){return(r=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var n in t)t.hasOwnProperty(n)&&(e[n]=t[n])})(e,t)};function o(e,t){function n(){this.constructor=e}r(e,t),e.prototype=null===t?Object.create(t):(n.prototype=t.prototype,new n)}var i=function(){return(i=Object.assign||function(e){for(var t,n=1,r=arguments.length;n<r;n++)for(var o in t=arguments[n])Object.prototype.hasOwnProperty.call(t,o)&&(e[o]=t[o]);return e}).apply(this,arguments)};function u(e,t){var n={};for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&t.indexOf(r)<0&&(n[r]=e[r]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var o=0;for(r=Object.getOwnPropertySymbols(e);o<r.length;o++)t.indexOf(r[o])<0&&(n[r[o]]=e[r[o]])}return n}function a(e,t,n,r){var o,i=arguments.length,u=i<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,n):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)u=Reflect.decorate(e,t,n,r);else for(var a=e.length-1;a>=0;a--)(o=e[a])&&(u=(i<3?o(u):i>3?o(t,n,u):o(t,n))||u);return i>3&&u&&Object.defineProperty(t,n,u),u}function s(e,t){return function(n,r){t(n,r,e)}}function c(e,t){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(e,t)}function f(e,t,n,r){return new(n||(n=Promise))(function(o,i){function u(e){try{s(r.next(e))}catch(e){i(e)}}function a(e){try{s(r.throw(e))}catch(e){i(e)}}function s(e){e.done?o(e.value):new n(function(t){t(e.value)}).then(u,a)}s((r=r.apply(e,t||[])).next())})}function l(e,t){var n,r,o,i,u={label:0,sent:function(){if(1&o[0])throw o[1];return o[1]},trys:[],ops:[]};return i={next:a(0),throw:a(1),return:a(2)},"function"==typeof Symbol&&(i[Symbol.iterator]=function(){return this}),i;function a(i){return function(a){return function(i){if(n)throw new TypeError("Generator is already executing.");for(;u;)try{if(n=1,r&&(o=2&i[0]?r.return:i[0]?r.throw||((o=r.return)&&o.call(r),0):r.next)&&!(o=o.call(r,i[1])).done)return o;switch(r=0,o&&(i=[2&i[0],o.value]),i[0]){case 0:case 1:o=i;break;case 4:return u.label++,{value:i[1],done:!1};case 5:u.label++,r=i[1],i=[0];continue;case 7:i=u.ops.pop(),u.trys.pop();continue;default:if(!(o=(o=u.trys).length>0&&o[o.length-1])&&(6===i[0]||2===i[0])){u=0;continue}if(3===i[0]&&(!o||i[1]>o[0]&&i[1]<o[3])){u.label=i[1];break}if(6===i[0]&&u.label<o[1]){u.label=o[1],o=i;break}if(o&&u.label<o[2]){u.label=o[2],u.ops.push(i);break}o[2]&&u.ops.pop(),u.trys.pop();continue}i=t.call(e,u)}catch(e){i=[6,e],r=0}finally{n=o=0}if(5&i[0])throw i[1];return{value:i[0]?i[1]:void 0,done:!0}}([i,a])}}}function p(e,t){for(var n in e)t.hasOwnProperty(n)||(t[n]=e[n])}function d(e){var t="function"==typeof Symbol&&e[Symbol.iterator],n=0;return t?t.call(e):{next:function(){return e&&n>=e.length&&(e=void 0),{value:e&&e[n++],done:!e}}}}function h(e,t){var n="function"==typeof Symbol&&e[Symbol.iterator];if(!n)return e;var r,o,i=n.call(e),u=[];try{for(;(void 0===t||t-- >0)&&!(r=i.next()).done;)u.push(r.value)}catch(e){o={error:e}}finally{try{r&&!r.done&&(n=i.return)&&n.call(i)}finally{if(o)throw o.error}}return u}function v(){for(var e=[],t=0;t<arguments.length;t++)e=e.concat(h(arguments[t]));return e}function y(e){return this instanceof y?(this.v=e,this):new y(e)}function m(e,t,n){if(!Symbol.asyncIterator)throw new TypeError("Symbol.asyncIterator is not defined.");var r,o=n.apply(e,t||[]),i=[];return r={},u("next"),u("throw"),u("return"),r[Symbol.asyncIterator]=function(){return this},r;function u(e){o[e]&&(r[e]=function(t){return new Promise(function(n,r){i.push([e,t,n,r])>1||a(e,t)})})}function a(e,t){try{!function(e){e.value instanceof y?Promise.resolve(e.value.v).then(s,c):f(i[0][2],e)}(o[e](t))}catch(e){f(i[0][3],e)}}function s(e){a("next",e)}function c(e){a("throw",e)}function f(e,t){e(t),i.shift(),i.length&&a(i[0][0],i[0][1])}}function _(e){var t,n;return t={},r("next"),r("throw",function(e){throw e}),r("return"),t[Symbol.iterator]=function(){return this},t;function r(r,o){t[r]=e[r]?function(t){return(n=!n)?{value:y(e[r](t)),done:"return"===r}:o?o(t):t}:o}}function g(e){if(!Symbol.asyncIterator)throw new TypeError("Symbol.asyncIterator is not defined.");var t,n=e[Symbol.asyncIterator];return n?n.call(e):(e=d(e),t={},r("next"),r("throw"),r("return"),t[Symbol.asyncIterator]=function(){return this},t);function r(n){t[n]=e[n]&&function(t){return new Promise(function(r,o){(function(e,t,n,r){Promise.resolve(r).then(function(t){e({value:t,done:n})},t)})(r,o,(t=e[n](t)).done,t.value)})}}}function w(e,t){return Object.defineProperty?Object.defineProperty(e,"raw",{value:t}):e.raw=t,e}function b(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)Object.hasOwnProperty.call(e,n)&&(t[n]=e[n]);return t.default=e,t}function E(e){return e&&e.__esModule?e:{default:e}}},function(e,t,n){"use strict";(function(t){var r=n(0),o=n(16),i={"Content-Type":"application/x-www-form-urlencoded"};function u(e,t){!r.isUndefined(e)&&r.isUndefined(e["Content-Type"])&&(e["Content-Type"]=t)}var a={adapter:function(){var e;return"undefined"!=typeof XMLHttpRequest?e=n(5):void 0!==t&&(e=n(5)),e}(),transformRequest:[function(e,t){return o(t,"Content-Type"),r.isFormData(e)||r.isArrayBuffer(e)||r.isBuffer(e)||r.isStream(e)||r.isFile(e)||r.isBlob(e)?e:r.isArrayBufferView(e)?e.buffer:r.isURLSearchParams(e)?(u(t,"application/x-www-form-urlencoded;charset=utf-8"),e.toString()):r.isObject(e)?(u(t,"application/json;charset=utf-8"),JSON.stringify(e)):e}],transformResponse:[function(e){if("string"==typeof e)try{e=JSON.parse(e)}catch(e){}return e}],timeout:0,xsrfCookieName:"XSRF-TOKEN",xsrfHeaderName:"X-XSRF-TOKEN",maxContentLength:-1,validateStatus:function(e){return e>=200&&e<300},headers:{common:{Accept:"application/json, text/plain, */*"}}};r.forEach(["delete","get","head"],function(e){a.headers[e]={}}),r.forEach(["post","put","patch"],function(e){a.headers[e]=r.merge(i)}),e.exports=a}).call(this,n(4))},function(e,t,n){"use strict";e.exports=function(e,t){return function(){for(var n=new Array(arguments.length),r=0;r<n.length;r++)n[r]=arguments[r];return e.apply(t,n)}}},function(e,t){var n,r,o=e.exports={};function i(){throw new Error("setTimeout has not been defined")}function u(){throw new Error("clearTimeout has not been defined")}function a(e){if(n===setTimeout)return setTimeout(e,0);if((n===i||!n)&&setTimeout)return n=setTimeout,setTimeout(e,0);try{return n(e,0)}catch(t){try{return n.call(null,e,0)}catch(t){return n.call(this,e,0)}}}!function(){try{n="function"==typeof setTimeout?setTimeout:i}catch(e){n=i}try{r="function"==typeof clearTimeout?clearTimeout:u}catch(e){r=u}}();var s,c=[],f=!1,l=-1;function p(){f&&s&&(f=!1,s.length?c=s.concat(c):l=-1,c.length&&d())}function d(){if(!f){var e=a(p);f=!0;for(var t=c.length;t;){for(s=c,c=[];++l<t;)s&&s[l].run();l=-1,t=c.length}s=null,f=!1,function(e){if(r===clearTimeout)return clearTimeout(e);if((r===u||!r)&&clearTimeout)return r=clearTimeout,clearTimeout(e);try{r(e)}catch(t){try{return r.call(null,e)}catch(t){return r.call(this,e)}}}(e)}}function h(e,t){this.fun=e,this.array=t}function v(){}o.nextTick=function(e){var t=new Array(arguments.length-1);if(arguments.length>1)for(var n=1;n<arguments.length;n++)t[n-1]=arguments[n];c.push(new h(e,t)),1!==c.length||f||a(d)},h.prototype.run=function(){this.fun.apply(null,this.array)},o.title="browser",o.browser=!0,o.env={},o.argv=[],o.version="",o.versions={},o.on=v,o.addListener=v,o.once=v,o.off=v,o.removeListener=v,o.removeAllListeners=v,o.emit=v,o.prependListener=v,o.prependOnceListener=v,o.listeners=function(e){return[]},o.binding=function(e){throw new Error("process.binding is not supported")},o.cwd=function(){return"/"},o.chdir=function(e){throw new Error("process.chdir is not supported")},o.umask=function(){return 0}},function(e,t,n){"use strict";var r=n(0),o=n(17),i=n(19),u=n(20),a=n(21),s=n(6),c="undefined"!=typeof window&&window.btoa&&window.btoa.bind(window)||n(22);e.exports=function(e){return new Promise(function(t,f){var l=e.data,p=e.headers;r.isFormData(l)&&delete p["Content-Type"];var d=new XMLHttpRequest,h="onreadystatechange",v=!1;if("undefined"==typeof window||!window.XDomainRequest||"withCredentials"in d||a(e.url)||(d=new window.XDomainRequest,h="onload",v=!0,d.onprogress=function(){},d.ontimeout=function(){}),e.auth){var y=e.auth.username||"",m=e.auth.password||"";p.Authorization="Basic "+c(y+":"+m)}if(d.open(e.method.toUpperCase(),i(e.url,e.params,e.paramsSerializer),!0),d.timeout=e.timeout,d[h]=function(){if(d&&(4===d.readyState||v)&&(0!==d.status||d.responseURL&&0===d.responseURL.indexOf("file:"))){var n="getAllResponseHeaders"in d?u(d.getAllResponseHeaders()):null,r={data:e.responseType&&"text"!==e.responseType?d.response:d.responseText,status:1223===d.status?204:d.status,statusText:1223===d.status?"No Content":d.statusText,headers:n,config:e,request:d};o(t,f,r),d=null}},d.onerror=function(){f(s("Network Error",e,null,d)),d=null},d.ontimeout=function(){f(s("timeout of "+e.timeout+"ms exceeded",e,"ECONNABORTED",d)),d=null},r.isStandardBrowserEnv()){var _=n(23),g=(e.withCredentials||a(e.url))&&e.xsrfCookieName?_.read(e.xsrfCookieName):void 0;g&&(p[e.xsrfHeaderName]=g)}if("setRequestHeader"in d&&r.forEach(p,function(e,t){void 0===l&&"content-type"===t.toLowerCase()?delete p[t]:d.setRequestHeader(t,e)}),e.withCredentials&&(d.withCredentials=!0),e.responseType)try{d.responseType=e.responseType}catch(t){if("json"!==e.responseType)throw t}"function"==typeof e.onDownloadProgress&&d.addEventListener("progress",e.onDownloadProgress),"function"==typeof e.onUploadProgress&&d.upload&&d.upload.addEventListener("progress",e.onUploadProgress),e.cancelToken&&e.cancelToken.promise.then(function(e){d&&(d.abort(),f(e),d=null)}),void 0===l&&(l=null),d.send(l)})}},function(e,t,n){"use strict";var r=n(18);e.exports=function(e,t,n,o,i){var u=new Error(e);return r(u,t,n,o,i)}},function(e,t,n){"use strict";e.exports=function(e){return!(!e||!e.__CANCEL__)}},function(e,t,n){"use strict";function r(e){this.message=e}r.prototype.toString=function(){return"Cancel"+(this.message?": "+this.message:"")},r.prototype.__CANCEL__=!0,e.exports=r},function(e,t,n){var r,o;r=[n,t,n(1),n(10),n(11),n(31),n(33)],void 0===(o=function(e,t,n,r,o,i,u){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),o=n.__importDefault(o),i=n.__importDefault(i);var a=function(){function e(e,t,n){void 0===e&&(e="Arkane"),this.bearer="",this.clientId=e,i.default.environment=n||"prod",this.api=new o.default(i.default.urls.api),this.updateBearerToken(t)}return e.openWindow=function(e,t,n,r){void 0===t&&(t="Arkane Connect"),void 0===n&&(n=300),void 0===r&&(r=500);var o=screen.width/2-n/2,i="toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, ";i+="copyhistory=no, width="+n+", height="+r+", top="+(screen.height/2-r/2)+", left="+o;var u=window.open("",t,i);return u&&(u.location.href=e),u},e.prototype.init=function(e){return n.__awaiter(this,void 0,void 0,function(){var t,r,o;return n.__generator(this,function(n){switch(n.label){case 0:return[4,this.getWallets()];case 1:return(t=n.sent())&&t.length>0||(r=window.location,o=encodeURIComponent(r.origin+r.pathname+r.search),window.location.href=i.default.urls.connect+"/init/"+e+"/"+this.bearer+"?redirectUri="+o+(i.default.environment?"&environment="+i.default.environment:"")),[2]}})})},e.prototype.updateBearerToken=function(e){this.bearer=e,this.api.http.defaults.headers.common={Authorization:this.bearer?"Bearer "+this.bearer:""}},e.prototype.getWallets=function(){return n.__awaiter(this,void 0,void 0,function(){var e;return n.__generator(this,function(t){switch(t.label){case 0:return[4,this.api.http.get("wallets")];case 1:return(e=t.sent())&&e.data&&e.data.success?[2,e.data.result]:[2,[]]}})})},e.prototype.getProfile=function(){return n.__awaiter(this,void 0,void 0,function(){var e;return n.__generator(this,function(t){switch(t.label){case 0:return[4,this.api.http.get("profile")];case 1:return(e=t.sent())&&e.data&&e.data.success?[2,e.data.result]:[2,new u.Profile]}})})},e.prototype.signTransaction=function(e){return n.__awaiter(this,void 0,void 0,function(){var t=this;return n.__generator(this,function(n){return[2,this.signTransactionInPopup(function(){t.sendParams(e)})]})})},e.prototype.initPopup=function(){return n.__awaiter(this,void 0,void 0,function(){var t;return n.__generator(this,function(n){return t=i.default.urls.connect+"/sign/transaction/init",this.popup=e.openWindow(t),[2,{success:!1,errors:["Popup already open"]}]})})},e.prototype.signTransactionInPopup=function(t){return n.__awaiter(this,void 0,void 0,function(){var r=this;return n.__generator(this,function(n){switch(n.label){case 0:return this.popup&&!this.popup.closed?[3,2]:[4,this.initPopup()];case 1:n.sent(),n.label=2;case 2:return this.popup.focus(),[2,new Promise(function(n,o){var u=i.default.urls.connect+"/sign/transaction/"+r.bearer+(i.default.environment?"?environment="+i.default.environment:"");r.popup=e.openWindow(u);var a=t();r.addEventListener(a,n,o)})]}})})},e.prototype.sendParams=function(e){return this.sendMessage({type:r.EVENT_TYPES.SEND_PARAMS,params:e})},e.prototype.sendMessage=function(e){var t=this,n=setInterval(function(){t.popup?t.popup.postMessage(e,i.default.urls.connect):clearInterval(n)},3e3);return n},e.prototype.addEventListener=function(e,t,n){var r=this;window.addEventListener("message",function(o){if(o.origin===i.default.urls.connect){var u=r.messageHandler(o);u&&(clearInterval(e),u&&u.success?t(u):n(u))}},!1)},e.prototype.messageHandler=function(e){var t=e.data&&n.__assign({},e.data.data);switch(e.data&&e.data.type){case r.EVENT_TYPES.TRANSACTION_SIGNED:return this.popup.close(),t;case r.EVENT_TYPES.POPUP_CLOSED:return delete this.popup,{success:!1,errors:["Popup closed"],result:{}};default:return!1}},e}();t.default=a,window&&(window.ArkaneConnect=a)}.apply(t,r))||(e.exports=o)},function(e,t,n){var r;void 0===(r=function(e,t){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),function(e){e[e.TRANSACTION_SIGNED=0]="TRANSACTION_SIGNED",e[e.SEND_PARAMS=1]="SEND_PARAMS",e[e.POPUP_CLOSED=2]="POPUP_CLOSED"}(t.EVENT_TYPES||(t.EVENT_TYPES={}))}.apply(t,[n,t]))||(e.exports=r)},function(e,t,n){var r,o;r=[n,t,n(1),n(12)],void 0===(o=function(e,t,n,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),r=n.__importDefault(r);var o=function(){function e(e,t,n){var o=e.endsWith("/")?e.substring(0,e.length-1):e;this.http=r.default.create({baseURL:t?o+"/"+t:o}),n&&(this.http.defaults.headers.common={Authorization:"Bearer "+n}),this.http.interceptors.response.use(void 0,this.errorHandler)}return e.prototype.errorHandler=function(e){return Promise.resolve(e)},e}();t.default=o}.apply(t,r))||(e.exports=o)},function(e,t,n){e.exports=n(13)},function(e,t,n){"use strict";var r=n(0),o=n(3),i=n(15),u=n(2);function a(e){var t=new i(e),n=o(i.prototype.request,t);return r.extend(n,i.prototype,t),r.extend(n,t),n}var s=a(u);s.Axios=i,s.create=function(e){return a(r.merge(u,e))},s.Cancel=n(8),s.CancelToken=n(29),s.isCancel=n(7),s.all=function(e){return Promise.all(e)},s.spread=n(30),e.exports=s,e.exports.default=s},function(e,t){function n(e){return!!e.constructor&&"function"==typeof e.constructor.isBuffer&&e.constructor.isBuffer(e)}
/*!
 * Determine if an object is a Buffer
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */
e.exports=function(e){return null!=e&&(n(e)||function(e){return"function"==typeof e.readFloatLE&&"function"==typeof e.slice&&n(e.slice(0,0))}(e)||!!e._isBuffer)}},function(e,t,n){"use strict";var r=n(2),o=n(0),i=n(24),u=n(25);function a(e){this.defaults=e,this.interceptors={request:new i,response:new i}}a.prototype.request=function(e){"string"==typeof e&&(e=o.merge({url:arguments[0]},arguments[1])),(e=o.merge(r,{method:"get"},this.defaults,e)).method=e.method.toLowerCase();var t=[u,void 0],n=Promise.resolve(e);for(this.interceptors.request.forEach(function(e){t.unshift(e.fulfilled,e.rejected)}),this.interceptors.response.forEach(function(e){t.push(e.fulfilled,e.rejected)});t.length;)n=n.then(t.shift(),t.shift());return n},o.forEach(["delete","get","head","options"],function(e){a.prototype[e]=function(t,n){return this.request(o.merge(n||{},{method:e,url:t}))}}),o.forEach(["post","put","patch"],function(e){a.prototype[e]=function(t,n,r){return this.request(o.merge(r||{},{method:e,url:t,data:n}))}}),e.exports=a},function(e,t,n){"use strict";var r=n(0);e.exports=function(e,t){r.forEach(e,function(n,r){r!==t&&r.toUpperCase()===t.toUpperCase()&&(e[t]=n,delete e[r])})}},function(e,t,n){"use strict";var r=n(6);e.exports=function(e,t,n){var o=n.config.validateStatus;n.status&&o&&!o(n.status)?t(r("Request failed with status code "+n.status,n.config,null,n.request,n)):e(n)}},function(e,t,n){"use strict";e.exports=function(e,t,n,r,o){return e.config=t,n&&(e.code=n),e.request=r,e.response=o,e}},function(e,t,n){"use strict";var r=n(0);function o(e){return encodeURIComponent(e).replace(/%40/gi,"@").replace(/%3A/gi,":").replace(/%24/g,"$").replace(/%2C/gi,",").replace(/%20/g,"+").replace(/%5B/gi,"[").replace(/%5D/gi,"]")}e.exports=function(e,t,n){if(!t)return e;var i;if(n)i=n(t);else if(r.isURLSearchParams(t))i=t.toString();else{var u=[];r.forEach(t,function(e,t){null!==e&&void 0!==e&&(r.isArray(e)?t+="[]":e=[e],r.forEach(e,function(e){r.isDate(e)?e=e.toISOString():r.isObject(e)&&(e=JSON.stringify(e)),u.push(o(t)+"="+o(e))}))}),i=u.join("&")}return i&&(e+=(-1===e.indexOf("?")?"?":"&")+i),e}},function(e,t,n){"use strict";var r=n(0),o=["age","authorization","content-length","content-type","etag","expires","from","host","if-modified-since","if-unmodified-since","last-modified","location","max-forwards","proxy-authorization","referer","retry-after","user-agent"];e.exports=function(e){var t,n,i,u={};return e?(r.forEach(e.split("\n"),function(e){if(i=e.indexOf(":"),t=r.trim(e.substr(0,i)).toLowerCase(),n=r.trim(e.substr(i+1)),t){if(u[t]&&o.indexOf(t)>=0)return;u[t]="set-cookie"===t?(u[t]?u[t]:[]).concat([n]):u[t]?u[t]+", "+n:n}}),u):u}},function(e,t,n){"use strict";var r=n(0);e.exports=r.isStandardBrowserEnv()?function(){var e,t=/(msie|trident)/i.test(navigator.userAgent),n=document.createElement("a");function o(e){var r=e;return t&&(n.setAttribute("href",r),r=n.href),n.setAttribute("href",r),{href:n.href,protocol:n.protocol?n.protocol.replace(/:$/,""):"",host:n.host,search:n.search?n.search.replace(/^\?/,""):"",hash:n.hash?n.hash.replace(/^#/,""):"",hostname:n.hostname,port:n.port,pathname:"/"===n.pathname.charAt(0)?n.pathname:"/"+n.pathname}}return e=o(window.location.href),function(t){var n=r.isString(t)?o(t):t;return n.protocol===e.protocol&&n.host===e.host}}():function(){return!0}},function(e,t,n){"use strict";var r="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";function o(){this.message="String contains an invalid character"}o.prototype=new Error,o.prototype.code=5,o.prototype.name="InvalidCharacterError",e.exports=function(e){for(var t,n,i=String(e),u="",a=0,s=r;i.charAt(0|a)||(s="=",a%1);u+=s.charAt(63&t>>8-a%1*8)){if((n=i.charCodeAt(a+=.75))>255)throw new o;t=t<<8|n}return u}},function(e,t,n){"use strict";var r=n(0);e.exports=r.isStandardBrowserEnv()?{write:function(e,t,n,o,i,u){var a=[];a.push(e+"="+encodeURIComponent(t)),r.isNumber(n)&&a.push("expires="+new Date(n).toGMTString()),r.isString(o)&&a.push("path="+o),r.isString(i)&&a.push("domain="+i),!0===u&&a.push("secure"),document.cookie=a.join("; ")},read:function(e){var t=document.cookie.match(new RegExp("(^|;\\s*)("+e+")=([^;]*)"));return t?decodeURIComponent(t[3]):null},remove:function(e){this.write(e,"",Date.now()-864e5)}}:{write:function(){},read:function(){return null},remove:function(){}}},function(e,t,n){"use strict";var r=n(0);function o(){this.handlers=[]}o.prototype.use=function(e,t){return this.handlers.push({fulfilled:e,rejected:t}),this.handlers.length-1},o.prototype.eject=function(e){this.handlers[e]&&(this.handlers[e]=null)},o.prototype.forEach=function(e){r.forEach(this.handlers,function(t){null!==t&&e(t)})},e.exports=o},function(e,t,n){"use strict";var r=n(0),o=n(26),i=n(7),u=n(2),a=n(27),s=n(28);function c(e){e.cancelToken&&e.cancelToken.throwIfRequested()}e.exports=function(e){return c(e),e.baseURL&&!a(e.url)&&(e.url=s(e.baseURL,e.url)),e.headers=e.headers||{},e.data=o(e.data,e.headers,e.transformRequest),e.headers=r.merge(e.headers.common||{},e.headers[e.method]||{},e.headers||{}),r.forEach(["delete","get","head","post","put","patch","common"],function(t){delete e.headers[t]}),(e.adapter||u.adapter)(e).then(function(t){return c(e),t.data=o(t.data,t.headers,e.transformResponse),t},function(t){return i(t)||(c(e),t&&t.response&&(t.response.data=o(t.response.data,t.response.headers,e.transformResponse))),Promise.reject(t)})}},function(e,t,n){"use strict";var r=n(0);e.exports=function(e,t,n){return r.forEach(n,function(n){e=n(e,t)}),e}},function(e,t,n){"use strict";e.exports=function(e){return/^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(e)}},function(e,t,n){"use strict";e.exports=function(e,t){return t?e.replace(/\/+$/,"")+"/"+t.replace(/^\/+/,""):e}},function(e,t,n){"use strict";var r=n(8);function o(e){if("function"!=typeof e)throw new TypeError("executor must be a function.");var t;this.promise=new Promise(function(e){t=e});var n=this;e(function(e){n.reason||(n.reason=new r(e),t(n.reason))})}o.prototype.throwIfRequested=function(){if(this.reason)throw this.reason},o.source=function(){var e;return{token:new o(function(t){e=t}),cancel:e}},e.exports=o},function(e,t,n){"use strict";e.exports=function(e){return function(t){return e.apply(null,t)}}},function(e,t,n){var r,o;r=[n,t,n(1),n(32)],void 0===(o=function(e,t,n,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),r=n.__importDefault(r);var o=function(){function e(){}return Object.defineProperty(e,"env",{get:function(){var t=r.default;switch(e.environment){case"local":case"tst1":t.VUE_APP_REALM_PUBLIC_KEY=t.VUE_APP_REALM_PUBLIC_KEY_TST1;break;case"staging":t.VUE_APP_REALM_PUBLIC_KEY=t.VUE_APP_REALM_PUBLIC_KEY_STAGING;break;default:t.VUE_APP_REALM_PUBLIC_KEY=t.VUE_APP_REALM_PUBLIC_KEY_PROD}return t},enumerable:!0,configurable:!0}),e.getOrigin=function(e){var t=e.match(/^.+\:\/\/[^\‌​/]+/);return Array.isArray(t)&&t.length>0?t[0]:"unknown"},e.shuffleArray=function(e){for(var t,n=e.length-1;n>0;n--){var r=Math.floor(Math.random()*(n+1));t=[e[r],e[n]],e[n]=t[0],e[r]=t[1]}return e},Object.defineProperty(e,"urls",{get:function(){var t="";switch(e.environment){case"local":case"tst1":t="-tst1";break;case"staging":t="-staging"}return{api:"https://api"+t+".arkane.network/api",connect:"local"===e.environment?"http://localhost:8081":"https://connect"+t+".arkane.network",login:"https://login"+t+".arkane.network/auth"}},enumerable:!0,configurable:!0}),e.removeNulls=function(t){return Object.keys(t).filter(function(e){return null!==t[e]&&void 0!==t[e]}).reduce(function(n,r){var o,i;return"object"==typeof t[r]?Object.assign(n,((o={})[r]=e.removeNulls(t[r]),o)):Object.assign(n,((i={})[r]=t[r],i))},{})},e.environment="prod",e}();t.default=o}.apply(t,r))||(e.exports=o)},function(e,t,n){(function(r){var o;void 0===(o=function(e,t){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default={VUE_APP_CLIENT_ID:r.env.VUE_APP_CLIENT_ID||"Arkane",VUE_APP_REALM:r.env.VUE_APP_REALM||"Arkane",VUE_APP_REALM_PUBLIC_KEY_TST1:"MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAkvmUbtB+jez2GkHNleiudf0LIRgDQNbHdeBn787GQsM7k2s65k22cZnMSeHXzgzRiQAM1geiAfs00QvU10VWauUpOM8CcEI6ID7QrS5fv0GZN1mjzk+ymUk6u/rNJeQUsxh9EN0tW46IaFnlvHRbVeoUyRLO+JHiFNnH3ekj2deMCmlMNGVJY4n0G8kVRHV5UrFaUdZYBfF73gOHgOQJ8SMpRDRj4PAkz8PHWhSRvf/GXTauoJiCYe61DXtoj7gZ75m4nLbBHz9e1v879ndA0I6MgxC7F7MwgGx42hjyV7zwsQg2TP9EDcxiXDVaVZeasni1Q67Odi6iIK6RNLml2QIDAQAB",VUE_APP_REALM_PUBLIC_KEY_STAGING:"MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAkvmUbtB+jez2GkHNleiudf0LIRgDQNbHdeBn787GQsM7k2s65k22cZnMSeHXzgzRiQAM1geiAfs00QvU10VWauUpOM8CcEI6ID7QrS5fv0GZN1mjzk+ymUk6u/rNJeQUsxh9EN0tW46IaFnlvHRbVeoUyRLO+JHiFNnH3ekj2deMCmlMNGVJY4n0G8kVRHV5UrFaUdZYBfF73gOHgOQJ8SMpRDRj4PAkz8PHWhSRvf/GXTauoJiCYe61DXtoj7gZ75m4nLbBHz9e1v879ndA0I6MgxC7F7MwgGx42hjyV7zwsQg2TP9EDcxiXDVaVZeasni1Q67Odi6iIK6RNLml2QIDAQAB",VUE_APP_REALM_PUBLIC_KEY_PROD:"MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAkvmUbtB+jez2GkHNleiudf0LIRgDQNbHdeBn787GQsM7k2s65k22cZnMSeHXzgzRiQAM1geiAfs00QvU10VWauUpOM8CcEI6ID7QrS5fv0GZN1mjzk+ymUk6u/rNJeQUsxh9EN0tW46IaFnlvHRbVeoUyRLO+JHiFNnH3ekj2deMCmlMNGVJY4n0G8kVRHV5UrFaUdZYBfF73gOHgOQJ8SMpRDRj4PAkz8PHWhSRvf/GXTauoJiCYe61DXtoj7gZ75m4nLbBHz9e1v879ndA0I6MgxC7F7MwgGx42hjyV7zwsQg2TP9EDcxiXDVaVZeasni1Q67Odi6iIK6RNLml2QIDAQAB",VUE_APP_SSL_REQUIRED:r.env.VUE_APP_SSL_REQUIRED||"external",VUE_APP_PUBLIC_CLIENT:r.env.VUE_APP_PUBLIC_CLIENT||"true",VUE_APP_SECRET:r.env.VUE_APP_SECRET||"my-secret"}}.apply(t,[n,t]))||(e.exports=o)}).call(this,n(4))},function(e,t,n){var r;void 0===(r=function(e,t){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=function(){return function(){this.userId="",this.hasMasterPin=!1}}();t.Profile=n}.apply(t,[n,t]))||(e.exports=r)}]);