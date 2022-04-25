let a: boolean;
let b: number;
let c: string;
let d: BigInt;
let e: undefined;
let f: null;
let g: object;
let h: Array<number>;
let i: number | string;
let j: [number, string];
let k: any;
let l: unknown;
let m: never;
let n: "咻";
let o = {
   name: <unknown>"伪装成鸭子",
   sound: "嘎嘎嘎" as "嘎嘎嘎"
}

let p: number & string;

enum direction {
   West = "WEST",
   East = "EAST",
   South = "SOUTH",
   North = "NORTH"
}

type life = {
   lead: string,
   pawn: string,
   faker: string,
   rookie: string,
   fresher: string
}

function eat(food: string): boolean;
function eat(food: number): string;
function eat(food: string | number, type?: string): boolean | string {
   if (typeof food === "string") {
      return true;
   } else {
      return "换一个";
   }
}

interface IChess {
   type: string,
   rule(): void
}

const BBA = "NEW HORSE"

function text(target: new(...args: any[]) => object) {
   console.log(target)
}

function nnbb(target: any, key: string, descriptor: PropertyDescriptor) {
   console.log(target === B.prototype, key) // true
}

function nnb(target: any, key: string) {
   
}

// @text
class Horse implements IChess {
   readonly type: string = "Horse";
   @nnb
   props: string = "aaa";
   _eat: number = 0;
   @nnbb
   rule(): void {
      console.log("行动规则")
   }
   [BBA](){
      console.log("NEW MAMA!")
   }
   set eat(eat: number) {
      if (eat > 16) {
         this._eat = 16;
      }else if (eat < 0){
         this._eat = 0;
      }else {
         this._eat = Math.floor(eat);
      }
   }
   get eat() {
      return this._eat
   }
}

const horse = new Horse();
horse[BBA]();

