// mapper 映射类型
type UserTemp = {
   account: string;
   password: string;
   name: string;
   telephone: string;
}

type UserRead = {
   readonly [P in keyof UserTemp]: UserTemp[P]
}

// 索引签名 (一般用Record代替)
interface Options {
   [key: string]: string | number;
   frequency: string;
}

const version: Options = {
   frequency: "200,000",
   V: "0.0.1.beta",
   N: 0
}

// 泛型具体使用
const momo: UserRead = {
   account: '2669661350',
   password: '002233',
   name: '王大',
   telephone: '13586567632'
}

function getProperty<T extends object, K extends keyof T>(obj: T, key: K) {
   return obj[key]
}

getProperty(momo, "account"); // 输入没有的属性则报错

