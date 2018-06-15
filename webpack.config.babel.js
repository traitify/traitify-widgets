import autoprefixer from "autoprefixer";
import path from "path";
import webpack from "webpack";

const env = process.env.NODE_ENV || "development";
const cssMaps = env !== "production";

let config = {
  context: path.resolve(__dirname, "src"),
  devServer: {
    publicPath: "/build/"
  },
  devtool: "source-map",
  entry: ["./index.js"],
  mode: env,
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
  output: {
    path: path.resolve(__dirname, "build"),
    publicPath: "/",
    filename: "traitify.js",
    library: "Traitify",
    libraryTarget: "umd",
    umdNamedDefine: true
  },
  plugins: [
    new webpack.DefinePlugin({
      VERSION: JSON.stringify(process.env.npm_package_version)
    })
  ],
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
  }
};

const ie = process.env.MODE === "ie";
const compatibility = ie || process.env.MODE === "compatibility";
const browser = compatibility || process.env.MODE === "browser";

if(browser){
  config.entry.unshift("babel-polyfill");
  config.output.libraryExport = "default";
}
if(compatibility){ config.entry[1] = "./compatibility.js"; }
if(ie){
  config.devServer.inline = false;
  delete config.devtool;
}

module.exports = config;
