# Cookie与Session
会话跟踪是Web程序中常用的技术，HTTP协议是无状态的，确定用户身份就需要跟踪用户的整个会话。最常用的会话跟踪是使用Cookie与Session，简单来说Cookie通过在客户端记录信息确定用户身份，Session通过在服务器端记录信息确定用户身份。

## Cookie
### 介绍
cookie 是服务器端保存在浏览器的一小段文本信息，浏览器每次向服务器端发出请求，都会附带上这段信息（不是所有都带上，具体的下文会介绍

### Cookie的几个重要属性

#### Expires 和 Max-Age
这两个属性涉及到 cookie 的存活时间Expires 属性指定一个具体的到期时间，到了这个指定的时间之后，浏览器就不再保留这个cookie,它的值是UTC格式，可以使用Date.prototype.toUTCString() 格式进行转换

#### Domain 和 path
这两个属性决定了，HTTP 请求的时候，哪些请求会带上哪些 Cookie，具体下面会做讲解。

#### Secure 和 HttpOnly
Secure 属性指定浏览器只有在加密协议 HTTPS 下，才能将这个 Cookie 发送到服务器。另一方面，如果当前协议是 HTTP，浏览器会自动忽略服务器发来的 Secure 属性。该属性只是一个开关，不需要指定值。如果通信是 HTTPS 协议，该开关自动打开。
HttpOnly 属性设置后Cookie就不能被document.cookie获取到

### cookie 自动删除和手动删除
自动删除主要存在以下几种可能：

- 会话 cookie(session cookie)在会话结束的时候（浏览器关闭）会被删除

- 持久化 cookie(Persistent cookie)在到达失效日期的时候会被删除

- 浏览器的 cookie 达到上限，会自动清除，然后为新建的 cookie 腾出空间

### 前端操作Cookie
对于前端而言，我们获取 cookie 和设置 cookie 都是通过 document.cookie 的方式进行的。

#### 添加Cookie
document.cookie一次只能写入一个 Cookie，而且写入并不是覆盖，而是添加。

   ```
   document.cookie = 'fontSize=14; '
    + 'expires=' + someDate.toGMTString() + '; '
    + 'path=/subdirectory; '
    + 'domain=*.example.com';
   ```

#### 删除 cookie

删除一个现存 Cookie 的唯一方法，是设置它的 expires 属性为一个过去的日期

```document.cookie = 'fontSize=;expires=Thu, 01-Jan-1970 00:00:01 GMT';```

## Session
Session是服务器端使用的一种记录客户端状态的机制，相应的也增加了服务器的存储压力。
对于客户端的每个会话，都有一个唯一的SESSIONID与其对应，服务端将用户数据存储进SESSIONID对应的文件或者是内存中，只要客户端每次请求将SESSIONID交予服务端，服务端就能区别用户进行会话跟踪。

## 实例
现在普遍使用的方式就是将COOKIE与SESSION结合使用，直接将SESSIONID存储于COOKIE中，浏览器自动将同源的COOKIE携带在请求头中，进行会话跟踪，这样既不需要在COOKIE中存储大量信息，也不需要对每次请求都需要操作附带SESSIONID。浏览请求头中Cookie字段的JSESSIONID=XXXXXXXXXXXXXXXXXXX就是Java默认的SESSIONID，PHPSESSID=XXXXXXXXXXXXXXXXXXXXXXXXXX就是PHP默认的SESSIONID。

## 区别
### 存储位置
Cookie将数据存储在浏览器，Session则将数据存储在服务端。

### 类型
Cookie是存储的String类型，Session在服务端则是Object类型。

### 安全
Cookie在客户端用户可以进行修改伪造，Session在服务端用户无法进行直接的修改伪造。

### 作用域
Cookie由于浏览器的同源策略，只有同源的情况下才会发送，Session在服务端理论上可以进行多域共享。

### 存储大小
Cookie大小由浏览器限制，一般不超过4KB，Session在服务端大小可以灵活控制。