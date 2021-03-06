import { NpmRepository, Repository } from '@/interface/repository'
import * as isSSH from 'is-ssh'
import * as fs from 'fs-extra'
import * as path from 'path'
import * as isUrl from 'is-url'
import * as validateNpmPackageName from 'validate-npm-package-name'
import { TEMPLATE_STORAGE_FILEPATH } from '@/const'

function calcStorage(name, version): string {
  return path.join(TEMPLATE_STORAGE_FILEPATH, encodeURIComponent(name), version || 'noversion')
}


interface Options {
  cwd?: string
  registry?: string
}

export function parseTemplate(template: string, version = 'latest', options: Options): Repository {
  if (template.startsWith('npm:')) {
    const name = template.substr('npm:'.length)
    if (!validateNpmPackageName(name)) throw new Error(`Invalid npm package name ${name}`)

    const result: NpmRepository = {
      type: 'npm',
      name,
      version,
      storage: calcStorage(template, version),
    }

    if (options.registry) result.registry = options.registry

    return result
  } else if (isUrl(template)) {
    return {
      type: 'git',
      name: template,
      version,
      storage: calcStorage(template, version),
    }
  } else if (template.startsWith('github:')) {
    const name = `https://github.com/${template.substr('github:'.length)}.git`
    return {
      type: 'git',
      name,
      version,
      storage: calcStorage(name, version),
    }
  } else if (isSSH(template)) {
    return {
      type: 'git',
      name: template,
      version,
      storage: calcStorage(template, version),
    }
  } else if (fs.pathExistsSync(template)) {
    return {
      type: 'fs',
      name: template,
      version: 'latest',
      cwd: options.cwd || process.cwd(),
      storage: calcStorage(template, 'latest'),
    }
  }

  throw new Error(`Invalid template: ${template}`)
}
