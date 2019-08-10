import { Response } from "express";
import request from "request-promise";
import dotenv from "dotenv";
import parse from "parse-link-header";
import errors from "request-promise/errors";
import Writable from "stream";
import { HTTP422Error } from "../../utils/httpErrors";

dotenv.config();


export const getUserInfo = async (user_uri: string) => {
	const key = process.env.GITHUB_AUTH_TOKEN;
	const options = {headers: {'Accept': 'application/vnd.github.v3+json', 
							   'Authorization': `token ${key}`,
							   'User-Agent': 'zeontrevor-demo-search-api'},
					 uri: user_uri,
					 json: true
					};

	const response = await request(options).catch(errors.RequestError, function(reason) {
		console.log(reason.error);
		return {};

	}).catch(errors.StatusCodeError, function(reason) {
		console.log(reason.statusCode);
		console.log(reason.error);
		return {};
	});

	return {username: response.login, 
			name: response.name, 
			avatar_url: response.avatar_url, 
			followers: response.followers};
}

export const getUsers = async (userItems: string[], res: Response) => {
	var users: Array<Object> = [];
	var completed_requests = 0;
	for(var index in userItems){
		users.push(getUserInfo(userItems[index]).then((userObj) => {
			completed_requests++;

			res.write(JSON.stringify(userObj) + "\n");
			
			if(completed_requests == userItems.length)
			{
				console.log("Done sending users response..");
				res.end();
			}
			return userObj;
		}));
	}
	return users;
}

export const getUsersByLanguageAndPage = async (language: string, page: string) => {
	const key = process.env.GITHUB_AUTH_TOKEN;
	const github_search_url = `https://api.github.com/search/users?q=language:${language}&type:user&page=${page}&per_page=100`;
	const options = {headers: {'Accept': 'application/vnd.github.v3+json', 
							   'Authorization': `token ${key}`,
							   'User-Agent': 'zeontrevor-demo-search-api'},
					 uri: github_search_url,
					 //json: true
					 resolveWithFullResponse: true
					};
	const response = await request(options).catch(errors.StatusCodeError, function(reason) {
		//This error captures invalid language parameters
		throw new HTTP422Error(reason.error + "\n");
	});
	return response;
}

export const getUsersByLanguage = async (language: string, res: Response) => {
	
	var page: number = 1;

	const response = await getUsersByLanguageAndPage(language, page.toString());
	if(response == undefined) //response is undefined if we send an invalid language
		return [];

	var pages: number = 1;
	if(response.headers.link != undefined)
	{
		var parsedHeaderLink:parse.Links | null = parse(response.headers.link);
		if(parsedHeaderLink != null)
			pages = Number(parsedHeaderLink.last.page);
		console.log("language: " + language + "; Total nr. of pages: " + pages);
	}

	var responseBody = JSON.parse(response.body);
	
	/* This checks if a timeout has occured, if yes then return empty array 
	so that we retry with next language
	*/
	if(responseBody.incomplete_results) 
		return [];

	var users: Array<Object> = [];
	var userItemsURL: string[] = responseBody.items.map((userItem: any) => userItem.url);
	
	page += 1;
	// while(page <= pages)
	// {
	// 	const response = await getUsersByLanguageAndPage(language, page.toString());
	// 	console.log(page, JSON.parse(response.body).items.length);
	// 	userItemsURL.push(...JSON.parse(response.body).items.map((userItem: any) => userItem.url));
	// 	//users.push(...await getUsers(userItemsURL, res));
	// 	page += 1;
	// }
	users.push(...await getUsers(userItemsURL, res));
	return users;
};

export const getUsersByLanguages = async (languages: string, res: Response) => {
	var languagesArr: string[] = languages.split(",");
	languagesArr = languagesArr.filter((x) => x !== '');
	
	for(var index in languagesArr) {
		var users: Array<Object> = await getUsersByLanguage(languagesArr[index], res);
		if(users.length > 0)
			return users;
	}
};