import { Request, Response, NextFunction } from "express";
import { HTTP400Error } from "../utils/httpErrors";

export const checkSearchParams = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	
	if(!req.query.language) {
		throw new HTTP400Error("Missing language parameter\n");
	}
	else {
		next();
	}
};