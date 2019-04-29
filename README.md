# ![mili logo](./images/mili.svg)

[![version](https://img.shields.io/npm/v/mili.svg?style=flat-square)](https://www.npmjs.com/package/mili)
[![downloads](https://img.shields.io/npm/dm/mili.svg?style=flat-square)](https://www.npmjs.com/package/mili)
[![dependencies](https://img.shields.io/david/Val-istar-Guo/mili.svg?style=flat-square)](https://www.npmjs.com/package/mili)
[![coveralls](https://img.shields.io/coveralls/github/Val-istar-Guo/mili.svg?style=flat-square)](https://coveralls.io/github/Val-istar-Guo/mili)


[简体中文](./docs/zh-cn/readme.md)


**Projects that derived from the same scaffolding, have evolved over time and become different.**
Scaffolding lost control of the subsequent development of the project.
When we need to improve some of the basic functions of scaffolding(e.g. eslint rules), we need to modify each project, and even have to design a customized solution for some unrecognizable projects.

Therefore, in order to improve the control ability of scaffolding for the subsequent development of the project,
mili allows scaffolding to cure some files and provide upgrades for this part of the files.


## Usage

```
npx mili init https://github.com/Val-istar-Guo/mili-template.git

mili upgrade
```

## Shell

**mili init [option] [repository]**

init project
options:
* `-n` or `--app-name` set application name（defaulted: name in package.json || progress.cwd())

**mili upgrade**

upgrade your project if then template depended outdated.

**mili update**

Update your project file with the current version of the template

**mili clean**

Clean the cache of mili(e.g. cloned template)
