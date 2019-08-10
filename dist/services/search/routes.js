"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const SearchController_1 = require("./SearchController");
const checkSearchParam_1 = require("../../middleware/checkSearchParam");
exports.default = [
    {
        path: "/api/search",
        method: "get",
        handler: [
            checkSearchParam_1.checkSearchParams,
            ({ query }, res, next) => __awaiter(this, void 0, void 0, function* () {
                //res.writeHead(200, { "Content-Type": "application/json",
                //             "Cache-control": "no-cache" });
                var users = yield SearchController_1.getUsersByLanguages(query.language, res);
                if (users == undefined) {
                    res.status(404).write(`No Results Found for ${query.language}\n`);
                    res.end();
                }
            })
        ]
    }
];
//# sourceMappingURL=routes.js.map