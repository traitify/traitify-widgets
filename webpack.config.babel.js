import webpack from "webpack";
import autoprefixer from "autoprefixer";
import ReplacePlugin from "replace-bundle-webpack-plugin";
import path from "path";
import git from "git-rev-sync";

const env = process.env.NODE_ENV || "development";
const cssMaps = env !== "production";

let config = {
  context: path.resolve(__dirname, "src"),
  entry: [
    "babel-polyfill",
    "./index.js"
  ],
  output: {
    path: path.resolve(__dirname, "build"),
    publicPath: "/",
    filename: "traitify.js",
    library: "Traitify",
    libraryTarget: "umd",
    umdNamedDefine: true
  },
  resolve: {
    extensions: [".jsx", ".js", ".json", ".scss"],
    modules: [
      path.resolve(__dirname, "src/lib"),
      path.resolve(__dirname, "node_modules"),
      "node_modules"
    ],
    alias: {
      style: path.resolve(__dirname, "src/style")
    }
  },
  module: {
    rules: [
      {
        enforce: "pre",
        test: /\.jsx?$/,
        exclude: path.resolve(__dirname, "src"),
        loader: "source-map-loader"
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: "eslint-loader"
      },
      {
        test: /\.(scss|css)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "style-loader",
            options: {
              sourceMap: cssMaps,
              singleton: true
            }
          },
          {
            loader: "css-loader",
            options:  {
              sourceMap: cssMaps,
              modules: true,
              importLoaders: 2,
              localIdentName: "traitify--[path]--[local]"
            }
          },
          {
            loader: "postcss-loader",
            options: {
              sourceMap: cssMaps,
              plugins: function() {
                return [autoprefixer({ browsers: "last 2 versions" })]
              }
            }
          },
          {
            loader: "sass-loader",
            options: {
              sourceMap: cssMaps
            }
          }
        ]
      },
      {
        test: /\.(svg|woff2?|ttf|eot|jpe?g|png|gif)(\?.*)?$/i,
        loader: env === "production" ? "file-loader" : "url-loader"
      }
    ]
  },
  plugins: ([
    new webpack.DefinePlugin({
      __VERSION__: JSON.stringify(git.long())
    }),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify(env)
    })
  ]).concat(env === "production" ? [
    new webpack.optimize.UglifyJsPlugin(),

    // strip out babel-helper invariant checks
    new ReplacePlugin([{
      pattern: /throw\s+(new\s+)?[a-zA-Z]+Error\s*\(/g,
      replacement: () => "return;("
    }])
  ] : []),
  stats: { colors: true },
  devtool: "source-map",
  devServer: {
    publicPath: "/build/"
  }
};

const ie = process.env.MODE === "ie";
const compatibility = ie || process.env.MODE === "compatibility";
const browser = compatibility || process.env.MODE === "browser";

if(browser){ config.output.libraryExport = "default"; }
if(compatibility){ config.entry[1] = "./compatibility.js"; }
if(ie){
  config.devServer.inline = false;
  delete config.devtool;
}

module.exports = config;
