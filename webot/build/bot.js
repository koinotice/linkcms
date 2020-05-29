"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bot = void 0;
var path = require('path');
if (!process.env.GENV) {
    require('dotenv').config({ path: path.resolve(process.cwd(), '../.env') });
}
var address_1 = require("./address");
var worth_1 = require("./worth");
var CronJob = require('cron').CronJob;
var env = process.env;
var eachLimit_1 = __importDefault(require("async/eachLimit"));
var settings = {
    "LRC": {
        min: 100000,
        max: 200000,
    },
    "ETH": {
        min: 10,
        max: 50,
    },
    "DKEY": {
        min: 1000000,
        max: 20000,
    },
};
// // @ts-ignore
// const wedex = new WedexClient({
//     account: me,
//     logType: LogTypeValue.None,
//     baseUrl: me.url
//
// });
var Bot = /** @class */ (function () {
    function Bot() {
    }
    Bot.prototype.getBalance = function (account) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log(account);
                        return [4 /*yield*/, this.ads.setBalance(account, '0,1,2,3,4,5,6,7,8')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Bot.prototype.start = function () {
        return __awaiter(this, void 0, void 0, function () {
            var data, that;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.ads = new address_1.Address();
                        return [4 /*yield*/, this.ads.FetchAddress()];
                    case 1:
                        _a.sent();
                        data = this.ads.getAddress();
                        this.worth = new worth_1.Worth;
                        that = this;
                        if (!(data == "undefined")) return [3 /*break*/, 2];
                        setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, that.start()];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); }, 3000);
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, this.run()];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Bot.prototype.task = function () {
        return __awaiter(this, void 0, void 0, function () {
            var data, that;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.worth.GetWorth()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.ads.getAddress()];
                    case 2:
                        data = _a.sent();
                        that = this;
                        eachLimit_1.default(data.data.address, 1, function (account, callback) {
                            return __awaiter(this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: 
                                        // console.log("adfasdfa",account)
                                        return [4 /*yield*/, that.getBalance(account)];
                                        case 1:
                                            // console.log("adfasdfa",account)
                                            _a.sent();
                                            callback();
                                            return [2 /*return*/];
                                    }
                                });
                            });
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    Bot.prototype.run = function () {
        return __awaiter(this, void 0, void 0, function () {
            var that, job;
            return __generator(this, function (_a) {
                that = this;
                job = new CronJob(env.CRON_STRING, function () {
                    var d = new Date();
                    that.task();
                });
                job.start();
                return [2 /*return*/];
            });
        });
    };
    return Bot;
}());
exports.Bot = Bot;
