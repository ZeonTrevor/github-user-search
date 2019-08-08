import { Request, Response } from "express";
import { getUsersByLanguages } from "./SearchController";

export default [
	{
		path: "/api/search",
		method: "get",
		handler: async ({ query }: Request, res: Response) => {
			//res.writeHead(200, { "Content-Type": "application/json",
            //             "Cache-control": "no-cache" });
			var users = await getUsersByLanguages(query.language, res);
			if(users == undefined)
			{	
				res.status(404).write(`No Results Found for ${query.language}\n`);
				res.end();
			}
		}
	}
];