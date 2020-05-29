"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Address = void 0;
var fetch = require('node-fetch');
var execute = require('apollo-link').execute;
var WebSocketLink = require('apollo-link-ws').WebSocketLink;
var SubscriptionClient = require('subscriptions-transport-ws').SubscriptionClient;
var ws = require('ws');
var ENV = process.env;
console.log("-------------");
console.log(ENV.GRAPHQL_WS_URL, ENV.GRAPHQL_ADMIN_PASSWORD);
console.log("-------------");
var BigNumber = require('bignumber.js');
var getWsClient = function (wsurl) {
    var client = new SubscriptionClient(wsurl, {
        reconnect: true,
        connectionParams: {
            headers: {
                "x-hasura-admin-secret": ENV.GRAPHQL_ADMIN_PASSWORD
            }
        }
    }, ws);
    return client;
};
var createSubscriptionObservable = function (wsurl, query, variables) {
    var link = new WebSocketLink(getWsClient(wsurl));
    return execute(link, { query: query, variables: variables });
};
var gql = require('graphql-tag');
function getAmount(amount) {
    return new BigNumber(amount).times(1e18).toString(10);
    //new BN(balance).plus(this.totalBalance).toString(10)
}
var Address = /** @class */ (function () {
    function Address() {
    }
    Address.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.FetchAddress()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Address.prototype.getAddress = function () {
        return this.Addresss;
    };
    Address.prototype.FetchAddress = function () {
        return __awaiter(this, void 0, void 0, function () {
            var SUBSCRIBE_QUERY, subscriptionClient, that, consumer;
            return __generator(this, function (_a) {
                SUBSCRIBE_QUERY = gql(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n            subscription getAddress {\n                address(\n                where: {dex: {_eq: \"wedex\"}}\n                ) {\n                    access_key\n                    secret_key\n                    account_id\n                    id\n                    dex\n                }\n            }\n        "], ["\n            subscription getAddress {\n                address(\n                where: {dex: {_eq: \"wedex\"}}\n                ) {\n                    access_key\n                    secret_key\n                    account_id\n                    id\n                    dex\n                }\n            }\n        "])));
                subscriptionClient = createSubscriptionObservable(ENV.GRAPHQL_WS_URL, // GraphQL endpoint
                SUBSCRIBE_QUERY, // Subscription query
                {} // Query variables
                );
                that = this;
                consumer = subscriptionClient.subscribe(function (eventData) {
                    that.Addresss = eventData;
                }, function (err) {
                    console.log('subscript address error', err);
                });
                console.log(consumer);
                return [2 /*return*/];
            });
        });
    };
    /*
    0 0x0000000000000000000000000000000000000000 eth
    3 0xdAC17F958D2ee523a2206206994597C13D831ec7 usdt
    6 0x7aa2467d7e201d2078ef38c6bfd5d0880b23cbde bull
    7 0x4fe21877bb9385237626b19718faa68ebe61d0c8 bear
    */
    Address.prototype.insertBalance = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var balance, assert, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        balance = {
                            id: 0,
                            bull: 0,
                            bear: 0,
                            usdt: 0,
                            eth: 0,
                            bullblock: 0,
                            bearblock: 0,
                            usdtblock: 0,
                        };
                        data.forEach(function (token) {
                            balance.id = token.accountId;
                            var amount = (new BigNumber(token.totalAmount).div(1e18).toFixed(2));
                            var block = (new BigNumber(token.amountLocked).div(1e18).toFixed(2));
                            if (token.tokenId == 0) {
                                balance.eth = parseFloat(amount);
                            }
                            if (token.tokenId == 6) {
                                balance.bull = parseFloat(amount);
                                balance.bullblock = parseFloat(block);
                            }
                            if (token.tokenId == 7) {
                                balance.bear = parseFloat(amount);
                                balance.bearblock = parseFloat(block);
                            }
                            if (token.tokenId == 3) {
                                var amount_1 = (new BigNumber(token.totalAmount).div(1e6).toFixed(2));
                                var block_1 = (new BigNumber(token.amountLocked).div(1e6).toFixed(2));
                                balance.usdtblock = parseFloat(block_1);
                                balance.usdt = parseFloat(amount_1);
                            }
                        });
                        assert = balance;
                        return [4 /*yield*/, fetch(ENV.GRAPHQL_URL, {
                                method: 'POST',
                                headers: {
                                    "x-hasura-admin-secret": ENV.GRAPHQL_ADMIN_PASSWORD
                                },
                                body: JSON.stringify({
                                    query: " \n                    mutation upsert_article($assets:[assets_insert_input!]!) {\n                        \n                        insert_assets(objects:$assets, on_conflict: {constraint: assets_pkey, update_columns: [bear, bull,usdt,eth,bearblock,bullblock]}) {\n                          returning {\n                            id\n                          }\n                        }\n                      }\n                  ",
                                    variables: {
                                        assets: assert
                                    }
                                })
                            })];
                    case 1:
                        res = _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Address.prototype.setBalance = function (accout, tokens) {
        return __awaiter(this, void 0, void 0, function () {
            var response, res, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetch(ENV.WEDEX_API + "/api/v2/user/balances?accountId=" + accout.account_id + "&tokens=" + tokens, {
                            method: 'GET',
                            headers: {
                                "X-API-KEY": accout.access_key
                            }
                        })];
                    case 1:
                        response = _a.sent();
                        return [4 /*yield*/, response.json()
                            //console.log(res,accout, tokens)
                        ];
                    case 2:
                        res = _a.sent();
                        data = res.data;
                        return [4 /*yield*/, this.insertBalance(data)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return Address;
}());
exports.Address = Address;
var templateObject_1;
