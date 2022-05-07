# Git
## 初始操作
1. 生成ssh密钥
执行 ssh-keygen -t rsa -C "你公司内部邮箱地址"
如果执行成功，切换到 ~/.ssh 目录下，此时目录应该如下所示。复制 id_rsa.pub 的内容。
2. 全局配置Git的用户名和邮箱
```
git config --global user.name "xxx"
git config --global user.email "xxx@xx.com"
```


## 使用
一般来说分四部：
   1.在工作区开发，添加，修改文件。
   2.将修改后的文件放入暂存区。
   3.将暂存区域的文件提交到本地仓库。
   4.将本地仓库的修改推送到远程仓库。

### git add
```
# 添加某个文件到暂存区，后面可以跟多个文件，以空格区分
git add xxx

# 添加当前更改的所有文件到暂存区。
git add .
```

### git commit
```
# 提交暂存的更改，会新开编辑器进行编辑
git commit 

# 提交暂存的更改，并记录下备注
git commit -m "you message"

# 等同于 git add . && git commit -m
git commit -am

# 对最近一次的提交的信息进行修改,此操作会修改commit的hash值
git commit --amend
```
### git pull
```
# 从远程仓库拉取代码并合并到本地，可简写为 git pull 等同于 git fetch && git merge 
git pull <远程主机名> <远程分支名>:<本地分支名>

# 使用rebase的模式进行合并
git pull --rebase <远程主机名> <远程分支名>:<本地分支名>
```

### git fetch
```
# 获取远程仓库特定分支的更新
git fetch <远程主机名> <分支名>

# 获取远程仓库所有分支的更新
git fetch --all
```

### git branch
```
# 新建本地分支，但不切换
git branch <branch-name> 

# 查看本地分支
git branch

# 查看远程分支
git branch -r

# 查看本地和远程分支
git branch -a

# 删除本地分支
git branch -D <branch-nane>

# 重新命名分支
git branch -m <old-branch-name> <new-branch-name>
```
### git merge
命令用于将两个或两个以上的开发历史加入(合并)一起。

#### 描述
将来自命名提交的更改(从其历史从当前分支转移到当前分支之后)。 该命令由git pull用于合并来自另一个存储库的更改，可以手动使用将更改从一个分支合并到另一个分支。

#### 示例
1. 合并分支dev和leo在当前分支的顶部，使它们合并：
```git merge dev leo```

2. 合并dev分支到当前分支，使用ours合并策略：
```git merge -s ours dev```

3. 将分支dev合并到当前分支中，但不要自动进行新的提交：
```git merge --no-commit dev```

### git rebase
rebase 翻译为变基，他的作用和 merge 很相似，用于把一个分支的修改合并到当前分支上。

## 遇见的问题
### error: failed to push some refs to 'https://github.com/AlEX-NEO-7'
远程库与本地库不一致造成的，在hint中也有提示把远程库同步到本地库就可以了。
#### 解决
```git pull --rebase origin master```
