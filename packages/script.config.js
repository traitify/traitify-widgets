const ESLintPlugin = require("eslint-webpack-plugin");
const path = require("path");

module.exports = ({name}) => {
  const environment = process.env.NODE_ENV || "development";
  const config = {
    context: path.resolve(__dirname, name),
    entry: {[name]: `./index.js`},
    mode: environment,
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          loader: "babel-loader"
        }
      ]
    },
    output: {
      clean: true,
      filename: `${name}.js`,
      globalObject: "this",
      library: {
        name: "Traitify",
        type: "umd",
        umdNamedDefine: true
      },
      path: path.resolve(__dirname, `${name}/build`),
      publicPath: "/"
    },
    plugins: [
      new ESLintPlugin({
        context: path.resolve(__dirname, name),
        eslintPath: "../../eslint",
        emitWarning: true,
        failOnError: false
      })
    ],
    resolve: {
      alias: {
        traitify: path.resolve(__dirname, "../src")
      },
      extensions: [".js"],
      modules: [
        path.resolve(__dirname, "../src"),
        path.resolve(__dirname, `${name}/node_modules`)
      ]
    },
    target: "node"
  };

  return config;
};
