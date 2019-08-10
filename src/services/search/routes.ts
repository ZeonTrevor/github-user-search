import { Request, Response, NextFunction } from "express";
import { getUsersByLanguages } from "./SearchController";
import { checkSearchParams } from "../../middleware/checkSearchParam";

export default [
	{
		path: "/api/search",
		method: "get",
		handler: [
			checkSearchParams, //checks if language parameter is empty
			async ({ query }: Request, res: Response, next: NextFunction) => {
				//res.writeHead(200, { "Content-Type": "application/json",
	            //             "Cache-control": "no-cache" });
				var users = await getUsersByLanguages(query.language, res);
				if(users == undefined)
				{	
					res.status(404).write(`No Results Found for ${query.language}\n`);
					res.end();
				}
			}
		]
	}
];