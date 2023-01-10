import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

import prompts from 'prompts'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import c from 'picocolors'

import { version } from '../package.json'

import { copy, emptyDir, formatTargetDir, isEmpty, isValidPackageName, pkgFromUserAgent, toValidPackageName } from './utils'
import type { Framework } from './frameworks'
import { FRAMEWORKS } from './frameworks'

let defaultTargetDir = 'my-iu-app'
const cwd = process.cwd()

const res = yargs(hideBin(process.argv))
  .scriptName('iucli')
  .usage('$0 [path] <options>')
  .option('template', {
    alias: 't',
    default: '',
    type: 'string',
    describe: 'project template: [\'vue-ts\', \'ts-starter\']',
  })
  .showHelpOnFail(true)
  .alias('h', 'help')
  .version('version', version)
  .alias('v', 'version')
  .help()

const TEMPLATES = FRAMEWORKS.map(
  f => (f.variants && f.variants.map(v => v.name)) || [f.name],
).reduce((a, b) => a.concat(b), [])

const renameFiles: Record<string, string | undefined> = {
  _gitignore: '.gitignore',
}

const init = async () => {
  // await create(await res.argv)
  const argv = await res.argv

  const argTemplate = argv.template
  const argTargetDir = formatTargetDir(argv._[0])
  let targetDir = argTargetDir || defaultTargetDir
  const getProjectName = () =>
    targetDir === '.' ? path.basename(path.resolve()) : targetDir

  let result: prompts.Answers<'projectName' | 'overwrite' | 'packageName' | 'framework' | 'variant'>

  try {
    result = await prompts(
      [
        {
          type: argTargetDir ? null : 'text',
          name: 'projectName',
          message: c.white('Project name:'),
          initial: defaultTargetDir,
          onState: (state) => {
            targetDir = formatTargetDir(state.value) || defaultTargetDir
          },
        },
        {
          type: () =>
            !fs.existsSync(targetDir) || isEmpty(targetDir) ? null : 'confirm',
          name: 'overwrite',
          message: () =>
            `${targetDir === '.'
              ? 'Current directory'
              : `Target directory "${targetDir}"`
            } is not empty. Remove existing files and continue?`,
        },
        {
          type: (_, { overwrite }: { overwrite?: boolean }) => {
            if (overwrite === false)
              throw new Error(`${c.red('✖')} ${c.white('Operation cancelled')}`)

            return null
          },
          name: 'overwriteChecker',
        },
        {
          type: () => (isValidPackageName(getProjectName()) ? null : 'text'),
          name: 'packageName',
          message: c.white('Package name:'),
          initial: () => toValidPackageName(getProjectName()),
          validate: dir =>
            isValidPackageName(dir) || 'Invalid package.json name',
        },
        {
          type:
            argTemplate && TEMPLATES.includes(argTemplate) ? null : 'select',
          name: 'framework',
          message:
            typeof argTemplate === 'string' && !TEMPLATES.includes(argTemplate)
              ? c.white(
                'Template has not been specified. Please choose from below: ',
              )
              : c.white('Select a framework:'),
          initial: 0,
          choices: FRAMEWORKS.map((framework) => {
            const frameworkColor = framework.color
            return {
              title: frameworkColor(framework.display || framework.name),
              value: framework,
            }
          }),
        },
        {
          type: (framework: Framework) => framework && framework.variants ? 'select' : null,
          name: 'variant',
          message: c.white('Select a variant:'),
          choices: (framework: Framework) =>
            framework.variants.map((variant) => {
              const variantColor = variant.color
              return {
                title: variantColor(variant.display || variant.name),
                value: variant.name,
              }
            }),
        },
      ],
      {
        onCancel: () => {
          throw new Error(`${c.red('✖')} ${c.white('Operation cancelled')}`)
        },
      },
    )
  }
  catch (cancelled: any) {
    console.log(cancelled.message)
    return
  }

  const { framework, overwrite, packageName, variant } = result

  const root = path.join(cwd, targetDir)

  if (overwrite)
    emptyDir(root)
  else if (!fs.existsSync(root))
    fs.mkdirSync(root, { recursive: true })

  // determine template
  let template: string = variant || framework?.name || argTemplate

  const pkgInfo = pkgFromUserAgent(process.env.npm_config_user_agent)
  const pkgManager = pkgInfo ? pkgInfo.name : 'npm'
  // const isYarn1 = pkgManager === 'yarn' && pkgInfo?.version.startsWith('1.')

  console.log(`\nScaffolding project in ${root}...`)

  const templateDir = path.resolve(
    fileURLToPath(import.meta.url),
    '../../template/',
    `${template}`,
  )

  const write = (file: string, content?: string) => {
    const targetPath = path.join(root, renameFiles[file] ?? file)
    if (content)
      fs.writeFileSync(targetPath, content)
    else
      copy(path.join(templateDir, file), targetPath)
  }

  const files = fs.readdirSync(templateDir)
  for (const file of files.filter(f => f !== 'package.json'))
    write(file)

  const pkg = JSON.parse(
    fs.readFileSync(path.join(templateDir, 'package.json'), 'utf-8'),
  )

  pkg.name = packageName || getProjectName()

  write('package.json', JSON.stringify(pkg, null, 2))

  console.log('\nDone. Now run:\n')
  if (root !== cwd)
    console.log(`  cd ${path.relative(cwd, root)}`)

  switch (pkgManager) {
    case 'yarn':
      console.log('  yarn')
      console.log('  yarn dev')
      break
    default:
      console.log(`  ${pkgManager} install`)
      console.log(`  ${pkgManager} run dev`)
      break
  }
}

init()
