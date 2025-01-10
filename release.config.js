/**
 * @type {import('semantic-release').GlobalConfig}
 */
export default {
    branches: [
        'main',
        {name: 'next', prerelease: true},
    ],
    plugins: [
        [
            '@semantic-release/commit-analyzer',
            {preset: 'conventionalcommits'},
        ],
        '@semantic-release/release-notes-generator',
        [
            "@semantic-release/github",
            {
                assets: [
                    {
                        label: "macOS Universal DMG",
                        path: "src-tauri/target/universal-apple-darwin/release/bundle/dmg/*.dmg"
                    },
                ],
            },
        ],
    ],
};
