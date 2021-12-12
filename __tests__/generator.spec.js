const generateWithPlugin = require("@vue/cli-test-utils/generateWithPlugin");

test("base", async () => {
  const { pkg } = await generateWithPlugin({
    id: "@raul338/vue-cli-plugin-stylelint",
    apply: require("../generator"),
    options: {},
  });

  expect(pkg.scripts["lint:style"]).toBeTruthy();
});

test("recommended", async () => {
  const { pkg } = await generateWithPlugin({
    id: "@raul338/vue-cli-plugin-stylelint",
    apply: require("../generator"),
    options: {
      config: "recommended",
      scss: false,
    },
  });

  expect(pkg.scripts["lint:style"]).toBeTruthy();
  expect(pkg.devDependencies).toHaveProperty("stylelint-config-recommended-vue");
  expect(pkg.stylelint.extends).toEqual(["stylelint-config-recommended-vue"]);
});

test("recommended:scss", async () => {
  const { pkg } = await generateWithPlugin({
    id: "@raul338/vue-cli-plugin-stylelint",
    apply: require("../generator"),
    options: {
      config: "recommended",
      scss: true,
    },
  });

  expect(pkg.scripts["lint:style"]).toBeTruthy();
  expect(pkg.devDependencies).toHaveProperty("stylelint-config-recommended-scss");
  expect(pkg.devDependencies).toHaveProperty("stylelint-config-recommended-vue");
  expect(pkg.stylelint.extends).toEqual([
    "stylelint-config-recommended-scss",
    "stylelint-config-recommended-vue/scss",
  ]);
});

test("prettier", async () => {
  const { pkg } = await generateWithPlugin({
    id: "@raul338/vue-cli-plugin-stylelint",
    apply: require("../generator"),
    options: {
      config: "prettier",
      scss: false,
    },
  });

  expect(pkg.scripts["lint:style"]).toBeTruthy();
  expect(pkg.devDependencies).toHaveProperty("stylelint-config-recommended-vue");
  expect(pkg.devDependencies).toHaveProperty("stylelint-config-prettier");
  expect(pkg.devDependencies).toHaveProperty("stylelint-prettier");
  expect(pkg.devDependencies).toHaveProperty("prettier");
  expect(pkg.stylelint.extends).toEqual([
    "stylelint-config-recommended-vue",
    "stylelint-prettier/recommended",
  ]);
});

test("prettier:scss", async () => {
  const { pkg } = await generateWithPlugin({
    id: "@raul338/vue-cli-plugin-stylelint",
    apply: require("../generator"),
    options: {
      config: "prettier",
      scss: true,
    },
  });

  expect(pkg.scripts["lint:style"]).toBeTruthy();
  expect(pkg.devDependencies).toHaveProperty("stylelint-config-recommended-scss");
  expect(pkg.devDependencies).toHaveProperty("stylelint-config-recommended-vue");
  expect(pkg.devDependencies).toHaveProperty("stylelint-config-prettier");
  expect(pkg.devDependencies).toHaveProperty("stylelint-prettier");
  expect(pkg.devDependencies).toHaveProperty("prettier");
  expect(pkg.stylelint.extends).toEqual([
    "stylelint-config-recommended-scss",
    "stylelint-config-recommended-vue/scss",
    "stylelint-prettier/recommended",
  ]);
});

test("lint on save", async () => {
  const { pkg } = await generateWithPlugin({
    id: "@raul338/vue-cli-plugin-stylelint",
    apply: require("../generator"),
    options: {
      lintStyleOn: "build",
    },
  });
  expect(pkg.vue.pluginOptions.lintStyleOnBuild).toEqual(true);
});

test("lint on commit", async () => {
  const { pkg } = await generateWithPlugin({
    id: "@raul338/vue-cli-plugin-stylelint",
    apply: require("../generator"),
    options: {
      lintStyleOn: "commit",
    },
  });
  expect(pkg.gitHooks["pre-commit"]).toBe("lint-staged");
  expect(pkg.devDependencies).toHaveProperty("lint-staged");
  expect(pkg["lint-staged"]).toEqual({
    "*.{vue,htm,html,css,sss,less,scss}": [
      "vue-cli-service lint:style",
    ],
  });
  expect(pkg.vue.pluginOptions.lintStyleOnBuild).toEqual(false);
});

test("cancel", async () => {
  const { pkg } = await generateWithPlugin({
    id: "@raul338/vue-cli-plugin-stylelint",
    apply: require("../generator"),
    options: {
      overwriteConfig: "abort",
    },
  });

  expect(pkg).toEqual({
    scripts: undefined,
    devDependencies: undefined,
    vue: undefined,
  });
});
