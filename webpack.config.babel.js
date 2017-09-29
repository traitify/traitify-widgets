import webpack from "webpack";
import autoprefixer from "autoprefixer";
import ReplacePlugin from "replace-bundle-webpack-plugin";
import path from "path";
import git from "git-rev-sync";
const ENV = process.env.NODE_ENV || "development";
const CSS_MAPS = ENV !== "production";

module.exports = {
  context: path.resolve(__dirname, "src"),
  entry: ["babel-polyfill", "./index.js"],

  output: {
    path: path.resolve(__dirname, "build"),
    publicPath: "/",
    filename: "traitify.js"
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
        test: /\.(scss|css)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "style-loader",
            options: {
              sourceMap: CSS_MAPS,
              singleton: true
            }
          },
          {
            loader: "css-loader",
            options:  {
              sourceMap: CSS_MAPS,
              modules: true,
              importLoaders: 2,
              localIdentName: "traitify--[folder]--[local]"
            }
          },
          {
            loader: "postcss-loader",
            options: {
              sourceMap: CSS_MAPS,
              plugins: function() {
                return [autoprefixer({ browsers: "last 2 versions" })]
              }
            }
          },
          {
            loader: "sass-loader",
            options: {
              sourceMap: CSS_MAPS
            }
          }
        ]
      },
      {
        test: /\.(svg|woff2?|ttf|eot|jpe?g|png|gif)(\?.*)?$/i,
        loader: ENV==="production" ? "file-loader" : "url-loader"
      }
    ]
  },

  plugins: ([
    new webpack.DefinePlugin({
      __VERSION__: JSON.stringify(git.long())
    }),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify(ENV)
    })
  ]).concat(ENV==="production" ? [
    new webpack.optimize.UglifyJsPlugin({
      output: {
        comments: false
      },
      compress: {
        warnings: false,
        conditionals: true,
        unused: true,
        comparisons: true,
        sequences: true,
        dead_code: true,
        evaluate: true,
        if_return: true,
        join_vars: true,
        negate_iife: false
      }
    }),

    // strip out babel-helper invariant checks
    new ReplacePlugin([{
      pattern: /throw\s+(new\s+)?[a-zA-Z]+Error\s*\(/g,
      replacement: () => "return;("
    }])
  ] : []),

  stats: { colors: true },

  node: {
    global: true,
    process: false,
    Buffer: false,
    __filename: false,
    __dirname: false,
    setImmediate: false
  },

  devtool: ENV==="production" ? "source-map" : "cheap-module-eval-source-map", // Remove for IE 10 Testing
  devServer: {
    // inline: false, // Add for IE 10 Testing
    publicPath: "/build/"
  }
};
