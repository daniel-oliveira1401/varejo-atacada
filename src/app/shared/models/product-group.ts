import { Product } from "./product";

export class ProductGroup {

    constructor(
        public product : Product,
        public count : number = 1
    ){}

    increaseCount(){
        this.count++;
    }

    decreaseCount(){
        this.count--;
    }
}