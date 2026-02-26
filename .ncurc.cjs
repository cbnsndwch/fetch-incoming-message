/**
 * @type {import('npm-check-updates').RunOptions}
 */
module.exports = {
    packageManager: 'pnpm',

    // Use workspaces instead of deep to support pnpm catalogs
    deep: true,

    reject: [
        // stay on LTS
        '@types/node',
        // it takes a while for the ecosystem to catch up to TS updates
        'typescript'
    ]
};
