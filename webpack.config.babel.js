import webpack from "webpack";
import ExtractTextPlugin from "extract-text-webpack-plugin";
import autoprefixer from "autoprefixer";
import CopyWebpackPlugin from "copy-webpack-plugin";
import ReplacePlugin from "replace-bundle-webpack-plugin";
import path from "path";
import ScriptExtHtmlWebpackPlugin from "script-ext-html-webpack-plugin";
import git from 'git-rev-sync';
const ENV = process.env.NODE_ENV || "development";
const CSS_MAPS = ENV!=="production";

module.exports = {
  context: path.resolve(__dirname, "src"),
  entry: "./index.js",

  output: {
    path: path.resolve(__dirname, "build"),
    publicPath: "/",
    filename: "traitify.js"
  },

  resolve: {
    extensions: ["", ".jsx", ".js", ".json", ".scss"],
    modulesDirectories: [
      path.resolve(__dirname, "src/lib"),
      path.resolve(__dirname, "node_modules"),
      "node_modules"
    ],
    alias: {
      style: path.resolve(__dirname, "src/style")
    }
  },

  module: {
    preLoaders: [
      {
        test: /\.jsx?$/,
        exclude: path.resolve(__dirname, "src"),
        loader: "source-map"
      }
    ],
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: "babel"
      },
      {
        // Transform our own .(scss|css) files with PostCSS and CSS-modules
        test: /\.(scss|css)$/,
        include: [path.resolve(__dirname, "src/components")],
        loader: ExtractTextPlugin.extract("style?singleton", [
          `css-loader?modules&importLoaders=1&sourceMap=${CSS_MAPS}&localIdentName=traitify--[folder]--[local]`,
          "postcss-loader",
          `sass-loader?sourceMap=${CSS_MAPS}`
        ].join("!"))
      },
      {
        test: /\.(scss|css)$/,
        exclude: [path.resolve(__dirname, "src/components")],
        loader: ExtractTextPlugin.extract("style?singleton", [
          `css?sourceMap=${CSS_MAPS}`,
          `postcss`,
          `sass?sourceMap=${CSS_MAPS}`
        ].join("!"))
      },
      {
        test: /\.json$/,
        loader: "json"
      },
      {
        test: /\.(svg|woff2?|ttf|eot|jpe?g|png|gif)(\?.*)?$/i,
        loader: ENV==="production" ? "file?name=[path][name]_[hash:base64:5].[ext]" : "url"
      }
    ]
  },

  postcss: () => [
    autoprefixer({ browsers: "last 2 versions" })
  ],

  plugins: ([
    new webpack.DefinePlugin({
      __VERSION__: JSON.stringify(git.long())
    }),
    new webpack.NoErrorsPlugin(),
    new ExtractTextPlugin("style.css", {
      allChunks: true,
      disable: true
    }),
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify(ENV)
    }),
    new CopyWebpackPlugin([
      { from: "./manifest.json", to: "./" }
    ])
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
      // this is actually the property name https://github.com/kimhou/replace-bundle-webpack-plugin/issues/1
      partten: /throw\s+(new\s+)?[a-zA-Z]+Error\s*\(/g,
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

  devtool: ENV==="production" ? "source-map" : "cheap-module-eval-source-map",
};
