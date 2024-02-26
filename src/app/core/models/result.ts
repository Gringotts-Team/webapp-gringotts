/**
 * Generic result model to handle API responses.
 * @template T - The type of data contained in the result.
 */
export class Result<T> {
    public data: T;
    public ok: boolean;
    public errors: Array<any>;
}