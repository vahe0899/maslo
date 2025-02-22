const path = require('path');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const configurePostCSS = require('../postcss.config.js');
module.exports = {
    stories: ['../src/**/*.stories.@(js|jsx|ts|tsx|mdx)'],
    staticDirs: ['../public'],
    addons: [
        'storybook-addon-swc',
        '@storybook/addon-links',
        '@storybook/addon-essentials',
        '@storybook/addon-interactions',
        '@storybook/addon-a11y',
        '@storybook/addon-designs',
        {
            name: '@storybook/addon-styling',
            options: {
                postCss: {
                    implementation: require('postcss'),
                    postcssOptions: configurePostCSS,
                },
            },
        },
    ],
    framework: {
        name: '@storybook/nextjs',
        options: {},
    },
    webpackFinal: async (config, { configType }) => {
        config.resolve.plugins = [new TsconfigPathsPlugin()];
        config.resolve.modules.push(path.resolve(__dirname, '../'));

        const fileLoaderRule = config.module.rules.find((rule) => rule.test && rule.test.test('.svg'));
        fileLoaderRule.exclude = /\.svg$/;

        // TO-DO лоадер для картинок
        config.module.rules.push({
            test: /\.svg$/i,
            issuer: {
                and: [/\.(js|ts|md)x?$/],
            },
            use: [
                {
                    loader: '@svgr/webpack',
                    options: {
                        prettier: false,
                        svgo: true,
                        svgoConfig: {
                            plugins: [
                                {
                                    name: 'preset-default',
                                    params: {
                                        overrides: {
                                            removeViewBox: false,
                                        },
                                    },
                                },
                            ],
                        },
                        titleProp: true,
                    },
                },
            ],
        });
        return config;
    },
};
