import typescriptPlugin from 'rollup-plugin-typescript2'
import pkg from './package.json'

const deps = Object.keys(Object.assign({}, pkg.dependencies))

const plugins = [
  typescriptPlugin({
    tsconfigOverride: { exclude: ['**/*.spec.*'] },
  }),
]

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        file: pkg.main,
        format: 'cjs',
        sourcemap: true,
      },
    ],
    plugins,
    external: deps,
  },
]
