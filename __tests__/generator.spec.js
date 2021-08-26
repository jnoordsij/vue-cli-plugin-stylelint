const generateWithPlugin = require('@vue/cli-test-utils/generateWithPlugin');

test('base', async () => {
  const { pkg } = await generateWithPlugin({
    id: '@samhammer/vue-cli-plugin-stylelint',
    apply: require('../generator'),
    options: {},
  });

  expect(pkg.scripts['lint:style']).toBeTruthy();
});

test('standard', async () => {
  const { pkg } = await generateWithPlugin({
    id: '@samhammer/vue-cli-plugin-stylelint',
    apply: require('../generator'),
    options: {
      config: 'standard',
    },
  });

  expect(pkg.scripts['lint:style']).toBeTruthy();
  expect(pkg.devDependencies).toHaveProperty('stylelint-config-standard');
  expect(pkg.stylelint.extends).toEqual(['stylelint-config-standard']);
});

test('primer', async () => {
  const { pkg } = await generateWithPlugin({
    id: '@samhammer/vue-cli-plugin-stylelint',
    apply: require('../generator'),
    options: {
      config: 'primer',
    },
  });

  expect(pkg.scripts['lint:style']).toBeTruthy();
  expect(pkg.devDependencies).toHaveProperty('stylelint-config-primer');
  expect(pkg.stylelint.extends).toEqual(['stylelint-config-primer']);
});

test('prettier', async () => {
  const { pkg } = await generateWithPlugin({
    id: '@samhammer/vue-cli-plugin-stylelint',
    apply: require('../generator'),
    options: {
      config: 'prettier',
    },
  });

  expect(pkg.scripts['lint:style']).toBeTruthy();
  expect(pkg.devDependencies).toHaveProperty('stylelint-config-standard');
  expect(pkg.devDependencies).toHaveProperty('stylelint-config-prettier');
  expect(pkg.devDependencies).toHaveProperty('stylelint-prettier');
  expect(pkg.devDependencies).toHaveProperty('prettier');
  expect(pkg.stylelint.extends).toEqual(['stylelint-config-standard', 'stylelint-prettier/recommended']);
});

test('lint on save', async () => {
  const { pkg } = await generateWithPlugin({
    id: '@samhammer/vue-cli-plugin-stylelint',
    apply: require('../generator'),
    options: {
      lintStyleOn: 'build',
    },
  });
  expect(pkg.vue.pluginOptions.lintStyleOnBuild).toEqual(true);
});

test('lint on commit', async () => {
  const { pkg } = await generateWithPlugin({
    id: '@samhammer/vue-cli-plugin-stylelint',
    apply: require('../generator'),
    options: {
      lintStyleOn: 'commit',
    },
  });
  expect(pkg.gitHooks['pre-commit']).toBe('lint-staged');
  expect(pkg.devDependencies).toHaveProperty('lint-staged');
  expect(pkg['lint-staged']).toEqual({
    '*.{vue,htm,html,css,sss,less,scss}': ['vue-cli-service lint:style', 'git add'],
  });
  expect(pkg.vue.pluginOptions.lintStyleOnBuild).toEqual(false);
});

test('cancel', async () => {
  const { pkg } = await generateWithPlugin({
    id: '@samhammer/vue-cli-plugin-stylelint',
    apply: require('../generator'),
    options: {
      overwriteConfig: 'abort',
    },
  });

  expect(pkg).toEqual({
    scripts: undefined,
    devDependencies: undefined,
    vue: undefined,
  });
});
