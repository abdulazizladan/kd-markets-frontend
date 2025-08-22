import { Address } from "./address.model";
import { Building } from "./building.model";
import { Stall } from "./stall.model";

export class Market {

  "id": string;
  "name": string;
  "address": Address;
  "buildings": Building[];
  "stalls": Stall[];
}