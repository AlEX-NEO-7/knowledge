let array: Array<number>;   //基本类型
let name: string | undefined;  //联合类型 有类型保护

function Menu(): void { //void类型

}

function throwError(msg: string): never { // never类型
   throw new Error(msg)
}

let gender: "男" | "女"; //字面量类型
let user: {
   id: string,
   name: string
}

let arr: [number, string]; // 元祖类型

let date: any //any类型

// 类型别名
type User = {
   readonly id: string, // readonly 只读修饰符 不参与编译
   name: string,
   age: number,
   gender: "男" | "女",
   get: (n: number) => boolean //约束为函数
}

const one: User = {
   id: "adasdas",
   name: "EA",
   age: 10,
   gender: "男",
   get: (n: number): boolean => {
      return Boolean(n);
   }
}

//readonly 只读修饰符 不参与编译
const num: readonly number[] = [1, 2, 3]; //整个num都无法改变了 

//类型兼容性 (鸭子辩型法)
//类型断言
let person = {
   name: <unknown>"伪装成鸭子的人",// 把name-“伪装成鸭子的人”断言为unknown类型
   sound: "嘎嘎嘎" as "嘎嘎嘎" // 把sound从string类型断言为字面量类型"嘎嘎嘎"
}

//函数的相关约束
//函数重载
function combine(a: number, b: number): number;
function combine(a: string, b: string): string;
function combine(a: string | number, b: string | number): string | number {
   if (typeof a === "string" && typeof b === "string") {
      return a + b;
   } else if (typeof a === "number" && typeof b === "number") {
      return a * b;
   } else {
      throw new Error("Error type");
   }
}
//函数参数相关
function sum(a: number, b: number = 0, c?: number) {

}

sum(3);
sum(3, 4);
sum(3, 4, 5);

//拓展类型 - 枚举类型
enum Gender {
   Male = "男", // number or string 如果是 number 类型值会自增不需要全部赋值 全部不赋值第一个为0
   Female = "女"
}

let newGender: Gender;

newGender = Gender.Male; // 如果是 number 类型的值可以直接写数字
newGender = Gender.Female;

// 接口 接口可以继承可以一次继承多个 不能重新覆盖父接口的成员
// 使用类型别名可以有类似继承的效果 在后面写 & （交叉）类型别名覆盖相同成员会生成交叉类型
interface Student {
   readonly id: string,
   name: string,
   age: number,
   say?: () => void
}

// 类 可以用get set（java写法） 下面写法为语法糖（C#写法）
class Teacher {
   readonly pid: string;// 可简写
   name: string;
   private _age: number;
   private _frequency: number;

   constructor(pid: string, name: string, _age: number) {
      this.pid = pid;
      this.name = name;
      this._age = _age;
      this._frequency = 3;
   }

   get age() {
      return this._age;
   }

   set age(value: number) {
      if (value < 0) {
         this._age = 0;
      } else if (value > 150) {
         this._age = 150;
      } else {
         this._age = Math.floor(value);
      }
   }

   getFrequency() {
      console.log(`fisrt${this._frequency}`);
   }
}

let aa = new Teacher("12312", "kami", 18);
aa.age = 18.435345; //使用了C#语法糖可以直接调
aa.getFrequency()
console.log(aa.age)

// 泛型 函数、类、接口、类型别名都可用
function foo<T = number>(array: T[], num: number): T[] {
   return [];
}

foo<string>(['1', '2'], 3);

// 泛型约束
interface hasNameProps {
   name: string
}

function nameToUpper<T extends hasNameProps>(obj: T): T {
   let a = obj.name;
   return obj;
}

// 多泛型
function check<T, K>(a: T[], b: K[]): (T | K)[] {
   return [];
}

// 深入类和接口

/**
 * 1. 继承与java一样
 * 2. 抽象类也一样
 *  
 */

// 抽象类 继承的子类需要实现抽象类中的方法和属性 也可以只抽象某个属性
abstract class Chess {
   abstract name: string;
   abstract getName(): void;
   move(x: number, y: number): boolean {
      console.log("1. 边界")
      this.rule(x, y);
      return true;
   };
   protected panduan(): boolean {   // 只能子类调用的方法
      return true;
   }
   protected abstract rule(x: number, y: number): boolean; // 只能子类实现的方法
}

// 静态方法

class ACE {
   static boss = "HARO";
   static vitory(name: string): void {
      console.log(`${name} vitory!`)
   };
}

ACE.vitory("nas");

// 接口 某个类有某种能力  is 判断
// 接口可以继承类，可以多继承
interface IJump {
   jumpRing(): void;
}

class Lion implements IJump {
   type: string = "咕咕";
   jumpRing(): void {
      console.log(`${this.type}跳火圈`)
   }
}

// 索引器
// 在严格检查下，可以实现为类动态添加成员
// 可以实现动态操作类成员 用数组做成员名最终都会转换为字符串
const NB: string = "dhaosdjoa";
class IDCard {
   [NB]() {
      console.log("ss");
   }
}

const id = new IDCard();
id[NB]();

// 装饰器 js装饰器是一个函数 要参与运行
// 可装饰 类 成员 参数   类：new (...args: any[]) => object
// 运行时间是在类、成员、参数定义后 

// 类装饰器
// 类装饰器可以为void，仅仅运行函数  也可以返回一个新的类，用于替换旧的目标
function test(target: new (...args: any[]) => object) {
   console.log(target);
}
function dd(str: string) {
   console.log("dd" + str)
   return function (target: new (...args: any[]) => object) { // 外面的为普通函数 里面返回的才是装饰器

   }
}

@test
@dd("调用")  //从下到上依次运行 运行普通函数是从上到下
class A {

}

// 成员装饰器
// 参数 
// 1. 如果是静态方法返回类本身；如果是实例方法返回类原型。
// 2. 固定为一个字符串，表示方法名。
// 3. 属性描述符对象 Object.defineProperty(key, value, {enumerable}) 的第三个对象参数
function s(target: any, key: string, descriptor: PropertyDescriptor) {
   console.log(target === B.prototype, key) // true
}

function pp(target: any, key: string) {
   console.log(target === B.prototype, key) // true
}

class B {

   @pp
   props1: string;

   @pp
   props2: string;

   constructor(props1: string, props2: string) {
      this.props1 = props1;
      this.props2 = props2;
   }

   @s
   sayHi() {
      console.log("Hi")
   }
}

// 参数装饰器
function loop(target: any, method: string, index: number) {
   // 原型对象 方法名称 序号
}

class C {
   type: string
   constructor(@loop type: string) {
      this.type = type;
   }
}