const exec = require('@actions/exec');
const core = require('@actions/core');
const os = require('os');
const systemExec = require('child_process').exec;

const BITCOIND_VERSION = core.getInput('bitcoind-version');
const LND_VERSION = core.getInput('lnd-version');
const ELECTRS_VERSION = core.getInput('electrs-version');

console.log(`bitcoindVersion: ${BITCOIND_VERSION}`);
console.log(`lndVersion: ${LND_VERSION}`);
console.log(`electrsVersion: ${ELECTRS_VERSION}`);

function shell(cmd) {
  return new Promise((resolve, reject) => {
    systemExec(cmd, function (error, stdout, stderr) {
      if (error) {
        reject(error);
      }

      if (stderr) {
        reject(stderr);
      }

      resolve(stdout.trim());
    });
  });
}


async function run() {
  const platform = os.platform();
  const arch = os.arch();

  if (platform !== 'darwin') {
    throw new Error('This action is only supported on macOS');
  }

  if (arch !== 'arm64') {
    throw new Error('This action is only supported on arm64 architecture');
  }

  core.startGroup('install bitcoind');
  await exec.exec('brew install --cask bitcoin-core');
  core.endGroup();

  core.startGroup('install lnd');
  const lndVersion = LND_VERSION || 'v0.18.3-beta';
  const lndArchive = `lnd-darwin-arm64-${lndVersion}.tar.gz`;
  console.info(lndUrl)
  const lndUrl = `https://github.com/lightningnetwork/lnd/releases/download/${lndVersion}/${lndArchive}`;
  
  await exec.exec(`curl -L -o ${lndArchive} ${lndUrl}`);
  await exec.exec(`tar -xzf ${lndArchive}`);
  await exec.exec(`sudo mv lnd-darwin-arm64-${lndVersion}/lnd /usr/local/bin/`);
  await exec.exec(`sudo mv lnd-darwin-arm64-${lndVersion}/lncli /usr/local/bin/`);
  await exec.exec(`rm -rf ${lndArchive} lnd-darwin-arm64-${lndVersion}`);
  core.endGroup();
}

run().then(() => {
  console.log('Run success');
}).catch((e) => {
  core.setFailed(e.toString());
});
