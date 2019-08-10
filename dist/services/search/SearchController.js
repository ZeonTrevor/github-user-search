"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const request_promise_1 = __importDefault(require("request-promise"));
const dotenv_1 = __importDefault(require("dotenv"));
const parse_link_header_1 = __importDefault(require("parse-link-header"));
const errors_1 = __importDefault(require("request-promise/errors"));
const httpErrors_1 = require("../../utils/httpErrors");
dotenv_1.default.config();
exports.getUserInfo = (user_uri) => __awaiter(this, void 0, void 0, function* () {
    const key = process.env.GITHUB_AUTH_TOKEN;
    const options = { headers: { 'Accept': 'application/vnd.github.v3+json',
            'Authorization': `token ${key}`,
            'User-Agent': 'zeontrevor-demo-search-api' },
        uri: user_uri,
        json: true
    };
    const response = yield request_promise_1.default(options).catch(errors_1.default.RequestError, function (reason) {
        console.log(reason.error);
        return {};
    }).catch(errors_1.default.StatusCodeError, function (reason) {
        console.log(reason.statusCode);
        console.log(reason.error);
        return {};
    });
    return { username: response.login,
        name: response.name,
        avatar_url: response.avatar_url,
        followers: response.followers };
});
exports.getUsers = (userItems, res) => __awaiter(this, void 0, void 0, function* () {
    var users = [];
    var completed_requests = 0;
    for (var index in userItems) {
        users.push(exports.getUserInfo(userItems[index]).then((userObj) => {
            completed_requests++;
            res.write(JSON.stringify(userObj) + "\n");
            if (completed_requests == userItems.length) {
                console.log("Done sending users response..");
                res.end();
            }
            return userObj;
        }));
    }
    return users;
});
exports.getUsersByLanguageAndPage = (language, page) => __awaiter(this, void 0, void 0, function* () {
    const key = process.env.GITHUB_AUTH_TOKEN;
    const github_search_url = `https://api.github.com/search/users?q=language:${language}&type:user&page=${page}&per_page=100`;
    const options = { headers: { 'Accept': 'application/vnd.github.v3+json',
            'Authorization': `token ${key}`,
            'User-Agent': 'zeontrevor-demo-search-api' },
        uri: github_search_url,
        //json: true
        resolveWithFullResponse: true
    };
    const response = yield request_promise_1.default(options).catch(errors_1.default.StatusCodeError, function (reason) {
        //This error captures invalid language parameters
        throw new httpErrors_1.HTTP422Error(reason.error + "\n");
    });
    return response;
});
exports.getUsersByLanguage = (language, res) => __awaiter(this, void 0, void 0, function* () {
    var page = 1;
    const response = yield exports.getUsersByLanguageAndPage(language, page.toString());
    if (response == undefined) //response is undefined if we send an invalid language
        return [];
    var pages = 1;
    if (response.headers.link != undefined) {
        var parsedHeaderLink = parse_link_header_1.default(response.headers.link);
        if (parsedHeaderLink != null)
            pages = Number(parsedHeaderLink.last.page);
        console.log("language: " + language + "; Total nr. of pages: " + pages);
    }
    var responseBody = JSON.parse(response.body);
    /* This checks if a timeout has occured, if yes then return empty array
    so that we retry with next language
    */
    if (responseBody.incomplete_results)
        return [];
    var users = [];
    var userItemsURL = responseBody.items.map((userItem) => userItem.url);
    page += 1;
    // while(page <= pages)
    // {
    // 	const response = await getUsersByLanguageAndPage(language, page.toString());
    // 	console.log(page, JSON.parse(response.body).items.length);
    // 	userItemsURL.push(...JSON.parse(response.body).items.map((userItem: any) => userItem.url));
    // 	//users.push(...await getUsers(userItemsURL, res));
    // 	page += 1;
    // }
    users.push(...yield exports.getUsers(userItemsURL, res));
    return users;
});
exports.getUsersByLanguages = (languages, res) => __awaiter(this, void 0, void 0, function* () {
    var languagesArr = languages.split(",");
    languagesArr = languagesArr.filter((x) => x !== '');
    for (var index in languagesArr) {
        var users = yield exports.getUsersByLanguage(languagesArr[index], res);
        if (users.length > 0)
            return users;
    }
});
//# sourceMappingURL=SearchController.js.map