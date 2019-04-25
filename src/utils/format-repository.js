const throwError = require('./throw-error')
const fs = require('fs-extra')
const { join, isAbsolute } = require('path')

const githubSH = /^(github:)?[-a-zA-Z0-9@:%._\+~#=]+\/[-a-zA-Z0-9@:%._\+~#=]+$/
const gitUrlRegexp = /((git|ssh|http(s)?)|(git@[\w.]+))(:(\/\/)?)([\w.@:/\-~]+)(\.git)(\/)?$/
const isRelative = path => /^\.\.?\//.test(path)


const formatRepository = repository => {
  if (gitUrlRegexp.test(repository)) {

    if (/github.com/.test(repository)) {
      const matched = repository.match(gitUrlRegexp)
      const [, , , , , , , links] = matched
      const [owner, name] = links.split('/').slice(-2)
      return { type: 'git', service: 'github', url: repository, owner, name, path: repository }
    }

    return { type: 'git', service: 'unknow', url: repository, owner: null, name: null, path: repository }
  }

  return { type: 'unknow', url: repository ,owner: null, name: null, path: repository }
}


const dirExist = async link => {
  const exist = await fs.pathExists(link)
  if (!exist) return false

  const stats = await fs.stat(link)
  if (stats.isDirectory()) return true

  return false
}

module.exports = (link) => {
  const cwd = process.cwd()

  if (isRelative(link) || isAbsolute(link)) {
    if (isAbsolute(link) && dirExist(link)) {
      return { type: 'local', url: link, owner: null, name: null, path: link }
    }

    const url = join(cwd, link)
    if (dirExist(url)) {
      return { type: 'local', url, owner: null, name: null, path: link }
    }

    throwError('Template path cannot be found. Ensure it is an exist directory.')
  } else if (githubSH.test(link)) {
    return formatRepository(`https://github.com/${link.replace(/^github:/, '')}.git`)
  } else if (gitUrlRegexp.test(link)) {
    return formatRepository(link)
  }

  throwError(`Invalid repository url: ${link}`)
}
