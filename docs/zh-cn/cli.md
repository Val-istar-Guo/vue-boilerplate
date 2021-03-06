# CLI

使用 `npx mili -h`查看最新介绍

## `mili init [options] <repository>`

创建项目

### options

 option                     | default                                | description
:---------------------------|:---------------------------------------|:--------------
 `-v --version <version>`   | `latest`                               | 设置模版版本
 `--cwd <cwd>`              | `progress.cwd()`                       | 设置当前的工作目录
 `--no-deps`                | -                                      | 是否安装模版依赖，不安装可以节约时间
 `--force`                  | -                                      | 跳过安全检测

### repository

模版项目的存储地址，支持的类型有：

 repository          | description                           | example
:--------------------|:--------------------------------------|:--------
 `github:owner/name` | github仓库clone地址的缩写 | `npx mili init github:Val-istar-Guo/mili-template`
 `npm:package-name`  | 模版项目可以是npm包。| `npx mili init npm:mili-template`
 clone with HTTPS    | 模版项目的存储地址是一个远程git仓库 | `npx mili init https://github.com/Val-istar-Guo/mili-template.git`
 clone with SSH      | 模版项目的存储地址是一个远程git仓库 | `npx mili init git@github.com:Val-istar-Guo/mili-template.git`
 relative path       | 从指定的相对路径获取模版项目. 当在一个仓库中，管理多个具有相同模版项目时非常有用。例如使用learn工具时。 | `npx mili init ./template/module-template`
 absolute path       | 从制定的绝对路径获取模版项目，往往用于测试 | `npx mili ini /template/test-template`

## `mili upgrade [options]`

升级模版

### options

 option                     | default                                | description
:---------------------------|:---------------------------------------|:--------------
 `--cwd [cwd]`              | `progress.cwd()`                       | 设置工作目录
 `--force`                  | -                                      | 跳过安全检测

## `mili update [options]`

使用指定版本（默认为当前版本）的模版更新项目。

### options

 option                     | default              | description
:---------------------------|:---------------------|:--------------
 `-v --version [version]`   | 当前模版版本           | 设置模版版本
 `--cwd [cwd]`              | `progress.cwd()`     | 设置工作目录

## `mili clean`

清理mili缓存，例如缓存的已下载的模版项目


## `mili check [options]`

检查项目文件是否符合模版的规范，`mili check`会以`.milirc`中的模版配置编译模版，并对比生成的文件内容与当前项目文件内容做对比。
如果存在差异，则说明当前项目文件内容不符合模版要求。
`mili check`并不会自动修复错误内容。
因为文件内容的错误很可能并非简单的样式错误，有可能是项目开发人员错误的修改了配置规范或者项目模块造成的。
您可以运行`mili update`来修正文件错误，
在运行`mili update`前，推荐先提交代码或者保存到暂存区，这样可以方便的review项目的更新差异，确保项目能够正常运行。

另外，`mili check`可以配合`husky`工具使用，在用户提交代码时进行校验。避免用户提交不符合模版规范的代码。
也可以配合`lint-stage`, 从而实现只对改变的文件进行`check`，提高`check`速度。

### options

 option                     | default              | description
:---------------------------|:---------------------|:--------------
 `--cwd [cwd]`              | `progress.cwd()`     | 设置工作目录
 `-d --diff`                | `false`              | 展示文件内容的差异，类似`git diff`
 `--fold`                   | `false`              | 展示内容差异时，折叠未改动的代码。配合`--diff`使用
