const fs = require('fs')
const https = require('https')

/**
 * Make GET request and parse JSON.
 */
const getJson = (url, callback) => {
  https.request(url, res => {
    let body = ''
    res.on('data', chunk => { body += chunk })
    res.on('end', () => { callback(JSON.parse(body)) })
  }).end()
}

/**
 * Get latest version string of a Conda package.
 */
const getLatestVersion = (pkg, callback) => {
  getJson(`https://api.anaconda.org/package/conda-forge/${pkg}`, data => {
    callback(data.latest_version)
  })
}

/**
 * Read file into array of lines.
 */
const readLines = f => fs.readFileSync(f, { encoding: 'utf8' }).trim().split(/\n/)

/**
 * Read environment.yml file into array of lines and parsed package name.
 */
const parseEnvironmentYaml = f => {
  const allLines = readLines(f)
  const lastLine = allLines[allLines.length - 1]
  const { groups: { pkg } } = lastLine.match(/ {2}- (?<pkg>\S+)=\S+/)
  return { allLines, pkg }
}

/**
 * Regenerate environment.yml file from original array of lines, package name
 * and new package version specifier.
 */
const unparseEnvironmentYaml = (allLines, pkg, newVersion) => {
  const newVersionSpecifier = `  - ${pkg}=${newVersion}`
  return allLines.slice(0, -1).concat([newVersionSpecifier, '']).join('\n')
}

/**
 * Parse environment.yml, get latest package version, write new environment.yml.
 */
module.exports = callback => {
  const { allLines, pkg } = parseEnvironmentYaml('environment.yml')
  getLatestVersion(pkg, latestVersion => {
    const newEnvironmentYaml = unparseEnvironmentYaml(allLines, pkg, latestVersion)
    fs.writeFileSync('environment.yml', newEnvironmentYaml)
    callback({ pkg, newVersion: latestVersion })
  })
}
