const {LocalStorage} = require('node-localstorage')

const {Compiler}         = require('./compiler')
    , {validPackageName} = require('./validation')

const path   = require('path')
    , semver = require('semver')

const localStorage = new LocalStorage(path.join(__dirname, '../../data/config'))

let astroStorage = {
    _compilers: null,
    _defaultCompiler: null,

    localStorage() {
        return localStorage
    },

    // ## Compiler data

    compilers() {
        if (!this._compilers) {
            this._compilers = []
            const item = localStorage.getItem('bc')
            const raw = item && JSON.parse(item)

            if (raw) {
                for (let r of raw) {
                    let {name, verRaw} = r
                    const ver = semver.coerce(verRaw)
                    if (!(validPackageName(name) && ver))
                        continue
                    const bc = new Compiler(name, ver)
                    bc.isSealed = !r.isSealed
                    bc.cliScript = r.cliScript || ''
                    this._compilers.push(bc)
                }
            }
        }
        return this._compilers
    },
    
    defaultCompiler() {
        if (!this._defaultCompiler) {
            const item = localStorage.getItem('default_bc')
            if (!item) return null

            const {name, version: verRaw} = JSON.parse(item)

            const ver = semver.validRange(verRaw)
            if (!ver) return null
            const compilers = this.compilers()

            for (let bc of compilers) {
                if (bc.name === name
                 && semver.satisfies(bc.version, ver))
                {
                    this._defaultCompiler = bc
                    break
                }
            }
        }
        return this._defaultCompiler
    },
    
    lookupCompiler(name, range) {
        for (let bc of this.compilers()) {
            if (bc.name == name
             && semver.satisfies(bc.version, range))
                return bc
        }
        return null
    },
}

module.exports = { astroStorage, }