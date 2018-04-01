import buble from 'rollup-plugin-buble';
import replace from 'rollup-plugin-re';
import resolve from 'rollup-plugin-node-resolve';
import postCSS from 'rollup-plugin-postcss';

import pkg from './package.json';

const external = Object.keys(pkg.dependencies)
  .concat(Object.keys(pkg.devDependencies))
  .concat('react-dom/server', 'stream');

const watch = {
  chokidar: true,
  include: 'src/**',
  exclude: 'node_modules/**',
};

const extensions = ['.js', '.jsx', '.css', '.scss'];

const cssDictionary = {};

const plugins = {
  resolve: resolve({
    extensions,
    modulesOnly: true,
  }),
  postcss: postCSS({
    inject: false,
    extract: false,
    modules: true,
    config: {
      ctx: {
        modules: cssDictionary,
        log: true,
      },
    },
    exec: true,
    getExportNamed: true,
  }),
  postcssTransform: {
    transform(code, id) {
      if (/\.(css|s[ac]ss)$/.test(id))
        return `export default ${JSON.stringify(cssDictionary[id])};`;
      return code;
    },
  },
  buble: buble({
    transforms: {
      letConst: false,
      arrow: false,
      classes: false,
      modules: false,
      destructuring: false,
      parameterDestructuring: false,
      defaultParameter: false,
      conciseMethodProperty: false,
      templateString: false,
    },
    objectAssign: 'Object.assign',
    jsx: 'React.createElement',
  }),
  replace: {
    server: replace({
      patterns: [
        {
          test: "import render from '../www';",
          replace: "const render = require('./www');",
        },
      ],
    }),
  },
};

const www = {
  external,
  watch,
  input: 'src/www/index.jsx',
  output: {
    file: 'dist/www.js',
    format: 'cjs',
  },
  plugins: [
    plugins.resolve,
    plugins.postcss,
    plugins.postcssTransform,
    plugins.buble,
  ],
};

const server = {
  external,
  watch,
  input: 'src/server/app.js',
  output: {
    interop: false,
    file: 'dist/app.js',
    format: 'cjs',
  },
  plugins: [plugins.replace.server, plugins.resolve, plugins.buble],
};

module.exports = [server, www];
