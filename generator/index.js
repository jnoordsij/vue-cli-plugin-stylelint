const { chalk } = require("@vue/cli-shared-utils");
const lint = require("../lint");

const styleLint = {
  stylelint: "^13.13.1",
};

const styleLintStandard = {
  "stylelint-config-standard": "^22.0.0",
};

const styleLintPrettier = {
  "stylelint-config-prettier": "^9.0.3",
  "stylelint-prettier": "^1.2.0",
  prettier: "^2.4.1",
};

const lintStaged = {
  "lint-staged": "^11.2.3",
};

module.exports = (api, options = {}) => {
  const { overwriteConfig } = options;
  if (overwriteConfig === "abort") {
    api.exitLog(chalk`{yellow Plugin setup successfully cancelled}`, "warn");
    return;
  }

  let { lintStyleOn = [] } = options;
  if (typeof lintStyleOn === "string") {
    lintStyleOn = lintStyleOn.split(",");
  }

  const pkg = {
    scripts: {
      "lint:style": "vue-cli-service lint:style",
    },
    devDependencies: {
      ...styleLint,
    },
    vue: {
      pluginOptions: {
        lintStyleOnBuild: lintStyleOn.includes("build"),
        stylelint: {},
      },
    },
    stylelint: {
      root: true,
      extends: [],
    },
  };

  const { config } = options;

  if (config === "standard") {
    pkg.stylelint.extends.push("stylelint-config-standard");
    Object.assign(pkg.devDependencies, {
      ...styleLintStandard,
    });
  } else if (config === "prettier") {
    pkg.stylelint.extends.push("stylelint-config-standard");
    pkg.stylelint.extends.push("stylelint-prettier/recommended");
    Object.assign(pkg.devDependencies, {
      ...styleLintStandard,
      ...styleLintPrettier,
    });
  }

  if (lintStyleOn.includes("commit")) {
    Object.assign(pkg.devDependencies, {
      ...lintStaged,
    });
    pkg.gitHooks = {
      "pre-commit": "lint-staged",
    };
    pkg["lint-staged"] = {
      "*.{vue,htm,html,css,sss,less,scss}": [
        "vue-cli-service lint:style",
        "git add",
      ],
    };
  }

  api.render("./template");
  api.addConfigTransform("stylelint", {
    file: {
      js: [".stylelintrc.js", "stylelint.config.js"],
      json: [".stylelintrc", ".stylelintrc.json"],
      yaml: [".stylelintrc.yaml", ".stylelintrc.yml"],
    },
  });
  api.extendPackage(pkg);

  api.onCreateComplete(async () => {
    await lint(api, { silent: true });
  });
};
