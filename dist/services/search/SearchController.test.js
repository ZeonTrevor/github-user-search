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
//jest.mock("request-promise");
describe("GetUsersByLanguage", () => {
    test("an empty query string", () => __awaiter(this, void 0, void 0, function* () {
        //(request as any).mockImplementation(() => "No Results Found for ");
        //const res: Response = jest.fn().mockResponse
        //const result = await SearchController.getUsersByLanguages("", res);
    }));
});
//# sourceMappingURL=SearchController.test.js.map