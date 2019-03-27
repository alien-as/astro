const {Command} = require('@astro-bin/cli')
    , structure = require('@astro-bin/structure')
    , clfmt = require('@astro-bin/console-format')
const {validPackageName} = require('@astro-lib/validation')
const fs = require('fs')
    , path = require('path')
const chalk = require('chalk')
    , prompts = require('prompts')

/// `new` subcommand

const cmd = new Command('new')
cmd
    .usage({
        header: 'Synopsis',
        content: `{italic \
$ astro new hello-world
$ astro new --lib mech}`,
    })
    .option({
        name: 'name',
        defaultOption: true,
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
        if (args.help || !args.name)
            cmd.printUsage()

        const {name} = args
        if (!validPackageName(name)) {
            clfmt.error('Illegal package name: ' + name)
            process.exit(1)
        }

        let basePath = path.join(process.cwd(), name)

        if (fs.existsSync(basePath)) {
            clfmt.error(`A directory or file '${name}' already exists`)
            process.exit(1)
        }

        fs.mkdirSync(basePath)
        const kind = args.lib ? 'lib' : 'bin'
        structure.init(basePath, name, kind)
        clfmt.success('Created package '
            + clfmt.fmtSuccessTerm(name))
    })

module.exports = cmd