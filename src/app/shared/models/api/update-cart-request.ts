import { Product } from "../product";

export class UpdateCartRequest {
    constructor(
        public id : number,
        public userId : number,
        public products : Product[]
    ){}
}