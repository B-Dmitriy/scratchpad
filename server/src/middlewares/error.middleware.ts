import { APIError } from '../utils/APIError';

import type { NextFunction, Request, Response } from 'express';

/** NextFunction - из параметров не удалять! Express так понимает что это error handler */
// eslint-disable-next-line
export function errorsMiddleware(err: Error, _: Request, res: Response, next: NextFunction): Response<any, Record<string, any>> {
    if (err instanceof APIError) {
        return res
            .status(err.status)
            .send({
                message: err.message,
                errors: err.errors,
            });
    }
    return res
        .status(500)
        .send({ message: 'Server internal error' });
}