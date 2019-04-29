const { join } = require('path')
const fs = require('fs-extra')
const git = require('simple-git/promise')
const throwError = require('./utils/throw-error')
const isChildPathOf = require('./utils/is-child-path-of')


const isEmpty = async path => {
  const files = await fs.readdir(path)
  if (files.length) return false

  return true
}

const reminder = [
  'This command may cause some files to be overwritten',
  "If you're sure you want to run this command, rerun it with --force.",
].join('\n')

const isWorkDirClean = async path => {
  const { files } =  await git(path).status()
  let toplevel = await git(path).revparse(['--show-toplevel'])
  toplevel = toplevel.replace(/\n$/, '')
  
  return !files
    .map(file => join(toplevel, file.path))
    .filter(isChildPathOf(path))
    .length
}

module.exports = async path => {
  const isRepo = await git(path).checkIsRepo()

  if (!isRepo && !(await isEmpty(path))) {
    throwError([
      'The project directory is not a git repository and is a non-empty folder.',
      reminder,
    ].join('\n'))
  } else if (isRepo && !(await isWorkDirClean(path))) {
    throwError([
      'Git working directory not clean',
      reminder,
    ].join('\n'))
  }
}
