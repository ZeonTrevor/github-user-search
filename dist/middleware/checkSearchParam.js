"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const httpErrors_1 = require("../utils/httpErrors");
exports.checkSearchParams = (req, res, next) => {
    if (!req.query.language) {
        throw new httpErrors_1.HTTP400Error("Missing language parameter\n");
    }
    else {
        next();
    }
};
//# sourceMappingURL=checkSearchParam.js.map