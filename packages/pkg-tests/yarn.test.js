/* @flow */

const {delimiter} = require(`path`);

const {
  tests: {generatePkgDriver, startPackageServer, getPackageRegistry},
  exec: {execFile},
} = require(`pkg-tests-core`);

const {basic: basicSpecs, dragon: dragonSpecs, pnp: pnpSpecs, script: scriptSpecs} = require(`pkg-tests-specs`);

const pkgDriver = generatePkgDriver({
  runDriver: (path, [command, ...args], {registryUrl, plugNPlay}) => {
    let extraArgs = [];

    if (command === 'install') {
      extraArgs = [...extraArgs, `--cache-folder`, `${path}/.cache`];
    }

    return execFile(process.execPath, [`${process.cwd()}/../../bin/yarn.js`, command, ...extraArgs, ...args], {
      env: {
        [`NPM_CONFIG_REGISTRY`]: registryUrl,
        [`YARN_SILENT`]: `1`,
        [`YARN_PLUGNPLAY_EXPERIMENTAL`]: plugNPlay ? `true` : `false`,
        [`PATH`]: `${path}/bin${delimiter}${process.env.PATH}`,
      },
      cwd: path,
    });
  },
});

beforeEach(async () => {
  await startPackageServer();
  await getPackageRegistry();
});

basicSpecs(pkgDriver);
dragonSpecs(pkgDriver);
pnpSpecs(pkgDriver);
scriptSpecs(pkgDriver);