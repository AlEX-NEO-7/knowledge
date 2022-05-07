interface Student {
   name: string,
   age: number,
   isPass: boolean
}

// Partial（部分的）
type MyPartial<T> = {   // 源代码
   [P in keyof T]?: T[P] | undefined;
}

const student1: Partial<Student> = {
   name: "Wang"
}




// Required（必须的）
interface UnesStudent {
   name?: string,
   age?: number,
   isPass?: boolean
}

type MyRequired<T> = {  // 源代码
   [P in keyof T]-?: T[P];
}

const student2: Required<UnesStudent> = {
   name: "E",
   age: 18,
   isPass: false
}




// Readonly（只读的）
type MyReadonly<T> = {
   readonly [P in keyof T]: T[P];
};

const student3: Readonly<Student> = {
   name: "TeamKiller",
   age: 18,
   isPass: true
}

// student3.age = 0;  // 报错




// Pick（选择）
type MyPick<T, K extends keyof T> = {
   [P in K]: T[P];
}

const student4: Pick<Student, "name"> = {
   name: "Gu",
   // age: 18  // 报错
}





// Record（记录） K: key的类型 T: value的类型
type MyRecord<K extends keyof any, T> = {
   [P in K]: T;
}

// 日常使用频率较高的内置类型了，主要用来描述对象，一般建议是不用Object来描述对象，
// 而是用Record代替，Record<string, any>几乎可以说是万金油了
const student5: Record<string, string> = {
   name: "One",
   // age: 18 // 报错
}




// Exclude（排除）
type MyExclude<T, U> = T extends U ? never : T;

// 针对联合类型（interface这种没用）
type Person = "name" | "age";
type Engineer = "name" | "age" | "workingYears";

const engineer1: Exclude<Engineer, Person> = "workingYears"; // 删除了name和age




// Extract（取出） 与Exclude相反
type MyExtract<T, U> = T extends U ? T : never;

const engineer2: Extract<Engineer, Person> = "name"; // 可以写name或age





// Omit（省略）
type MyOmit<T, K extends keyof any> = MyPick<T, MyExclude<keyof T, K>>

const student6: MyOmit<Student, Person> = {
   isPass: true
}





// NonNullable（不能为null）
type MyNonNullable<T> = T extends null | undefined ? never : T;

// const student7: MyNonNullable<Student | null | undefined> = null; // 报错





// Parameters（参数）  获取传入函数的参数组成的类型
type MyParameters<T extends (...args: any) => any> = T extends (...args: infer P) => any ? P : any;

interface StudentFunc {
   (name: string, age: number): Student
}
type SetFunc = (val: string) => boolean;

const student8: MyParameters<StudentFunc> = ["Ares", 18];
const set: Parameters<SetFunc> = ["value"];




// ReturnType（返回类型）
type MyReturnType<T extends (...args: any) => any> = T extends (...args: any) => infer R ? R : any;

const student10: MyReturnType<StudentFunc> = {
   name: "Tang",
   age: 18,
   isPass: true
}




// ConstructorParameters（构造参数） 获取传入类的构造函数的参数组成的类型
type MyConstructorParameters<T extends abstract new (...args: any) => any> = T extends abstract new (...args: infer P) => any ? P : any;

interface StudentConstructor {
   new(name: string, age: number): Student;
}

const student9: MyConstructorParameters<StudentConstructor> = ["kevin", 18];




// InstanceType（构造返回类型、实例类型）    声明类或者类型声明空间
type MyInstanceType<T extends abstract new (...args: any) => any> = T extends abstract new (...args: any) => infer R ? R : any;

const Nurse = class {      // 因为Student用作变量声明空间，没有用作类型声明空间, 直接const student1: Student会报错的
   name: string;
   age: number;
   constructor(name: string, age: number) {
      this.name = name;
      this.age = age;
   }
   showInfo() {
      console.log(this.name, this.age);
   }
}

const nurse1:MyInstanceType<typeof Nurse> = new Nurse("Mei", 18);




// Uppercase（大写）
type Sex = "male" | "female";
const sex1:Uppercase<Sex> = "MALE";




// Lowercase（小写）
type Cup = "BLACK" | "WHITE";
const cup1:Lowercase<Cup> = "black";





// Capitalize（首字母大写）
const sex2:Capitalize<Sex> = "Male";




// Uncapitalize（首字母小写）
const cup2:Uncapitalize<Cup> = "wHITE";
