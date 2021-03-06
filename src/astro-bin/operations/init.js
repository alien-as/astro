const {Command} = require('@astro-bin/command')
    , structure = require('@astro-bin/structure')
    , display = require('@astro-bin/display')
const {validPackageName} = require('@astro-lib/validation')
const fs = require('fs')
    , path = require('path')
const chalk = require('chalk')
    , prompts = require('prompts')

/// `init` subcommand

const cmd = new Command('init')
cmd
    .usage({
        header: 'Synopsis',
        content: `{italic \
$ astro init
$ astro init --name proj
$ astro init --lib}`,
    })
    .option({
        name: 'name',
    })
    .option({
        name: 'bin',
        type: Boolean,
    })
    .option({
        name: 'lib',
        type: Boolean,
    })
    .onParse(args => {
        if (args.help)
          cmd.printUsage()

        prompts({
            type: 'text',
            name: 'v',
            message: 'Current directory will be overwritten. ' +
                     'Continue? (Y/n)',
        })
            .then(val => {
                if (val.v && val.v !== 'y')
                    return
                const basePath = process.cwd()

                let {name} = args
                if (!name) name = path.basename(basePath)
                if (!validPackageName(name)) {
                    display.error('illegal package name: ' + name)
                    process.exit(1)
                }

                const kind = args.lib ? 'lib' : 'bin'
                structure.init(basePath, name, kind)
                display.ok('initialized package '
                    + display.wrapOkTerm(name))
            },
            cause => 0)
    })

module.exports = cmd