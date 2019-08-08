import request from "request-promise";
import * as SearchController from "./SearchController";
import { Response } from "express";

jest.mock("request-promise");

describe("GetUsersByLanguage", () => {
	test("an empty query string", async () => {
		//(request as any).mockImplementation(() => "No Results Found for ");
		//const res: Response = jest.fn().mockResponse
		//const result = await SearchController.getUsersByLanguages("", res);
		const result = await SearchController.getUserInfo("https://api.github.com/users/n1nj4sec");
		expect(result).toEqual({username:"n1nj4sec", name: null, 
			avatar_url:"https://avatars0.githubusercontent.com/u/12549318?v=4", followers:967});

	});
});