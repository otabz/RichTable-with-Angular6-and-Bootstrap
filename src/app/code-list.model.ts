import {Code} from './code.model';


export class List {
  constructor(public message: string, public outcome: string,
              public results: Code[]) {}

}
