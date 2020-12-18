/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
const {override, fixBabelImports, addWebpackPlugin} = require('customize-cra')
const FilterWarningsPlugin = require('webpack-filter-warnings-plugin')

module.exports = override(
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: 'css',
  }),
  addWebpackPlugin(
    new FilterWarningsPlugin({
      exclude: /\[mini-css-extract-plugin\][^]*Conflicting order. Following module has been added:/,
    }),
  ),
)
