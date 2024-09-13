import { validationResult } from 'express-validator';

import { APIError } from '../utils/APIError';

import type { NextFunction, Request, Response } from 'express';

export function validationMiddleware(req: Request, _: Response, next: NextFunction): void {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        next(APIError.BadRequest('validation error', result.array()));
    }
    next();
}