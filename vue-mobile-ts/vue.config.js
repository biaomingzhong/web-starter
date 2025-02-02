/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");
const webpack = require("webpack");
const WebpackBar = require("webpackbar");
const FileManagerPlugin = require("filemanager-webpack-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;
const CompressionWebpackPlugin = require("compression-webpack-plugin");
const VConsolePlugin = require("vconsole-webpack-plugin");
const dayjs = require("dayjs");
const pkg = require("./package.json");

function resolve(dir) {
  return path.join(__dirname, dir);
}

const devServerPort = 4000;
const name = "WebApp";

const date = dayjs().format("YYYY-MM-DD HH:mm:ss");
const dateFormat = dayjs().format("YYYY.MM.DD");

const isProduction = process.env.NODE_ENV === "production";

module.exports = {
  publicPath: process.env.NODE_ENV === "production" ? "/dist/" : "/",
  // 在npm run build 或 yarn build 时 ，生成文件的目录名称（要和baseUrl的生产环境路径一致）（默认dist）
  outputDir: "dist",
  // 用于放置生成的静态资源 (js、css、img、fonts) 的；（项目打包之后，静态资源会放在这个文件夹下）
  // assetsDir: 'static',
  // 是否开启eslint保存检测，有效值：ture | false | 'error'
  lintOnSave: process.env.NODE_ENV === "development",
  // 如果你不需要生产环境的 source map，可以将其设置为 false 以加速生产环境构建。
  productionSourceMap: !isProduction,
  parallel: require("os").cpus().length > 1,
  css: {
    sourceMap: true
  },

  devServer: {
    port: devServerPort,
    open: true,
    overlay: {
      warnings: false,
      errors: true
    },
    proxy: {
      [process.env.VUE_APP_BASE_API_PREFIX]: {
        target: process.env.VUE_APP_BASE_API,
        changeOrigin: true, // needed for virtual hosted sites
        // ws: true, // proxy websockets
        autoRewrite: true,
        // cookieDomainRewrite: true,
        pathRewrite: {
          [`^${process.env.VUE_APP_BASE_API_PREFIX}`]: ""
        }
      }
    },
    disableHostCheck: true
  },
  configureWebpack(config) {
    const plugins = [
      // 在线调试器
      new VConsolePlugin({
        enable: !isProduction // 是否禁用
      })
    ];
    // 取消Webpack警告的性能提示
    config.performance = {
      hints: "warning",
      // 入口起点的最大体积,（以字节为单位 500k）
      maxEntrypointSize: 1000 * 5000,
      // 生成文件的最大体积,（以字节为单位 300k）
      maxAssetSize: 1000 * 3000,
      // 只给出 js 文件的性能提示
      assetFilter: assetFilename => assetFilename.endsWith(".js")
    };

    // 用于根据模块的相对路径生成 hash 作为模块 id, 一般用于生产环境
    if (isProduction) {
      plugins.push(
        new webpack.DefinePlugin({
          "process.env.VUE_APP_UPDATE_TIME": date
        })
      );

      plugins.push(
        new WebpackBar({
          name: `\u5f00\u59cb\u6784\u5efa[${pkg.name}]`
        })
      );
      plugins.push(
        new webpack.HashedModuleIdsPlugin({
          hashFunction: "sha256",
          hashDigest: "hex",
          hashDigestLength: 20
        })
      );
      // 服务器也要相应开启gzip
      plugins.push(
        new CompressionWebpackPlugin({
          algorithm: "gzip",
          test: /\.(js|css)$/, // 匹配文件名
          threshold: 10000, // 对超过10k的数据压缩
          deleteOriginalAssets: false, // 不删除源文件
          minRatio: 0.8 // 压缩比
        })
      );
    }

    return {
      plugins
    };
  },
  chainWebpack(config) {
    // provide the app's title in webpack's name field, so that
    // it can be accessed in index.html to inject the correct title.
    config.set("name", name);

    // 修复HMR
    config.resolve.symlinks(false);

    // 自定义, 可以配置的全局常量
    config
      .plugin("__VERSION__")
      .use(
        new webpack.DefinePlugin({ __VERSION__: JSON.stringify(pkg.version) })
      )
      .end();

    config.when(process.env.NODE_ENV === "development", config =>
      config.devtool("source-map")
    );

    // https://webpack.js.org/configuration/devtool/#development
    config.when(process.env.NODE_ENV !== "development", config =>
      config.devtool("cheap-source-map")
    );
    config.when(process.env.NODE_ENV !== "development", config => {
      config.devtool("none");
      config
        .plugin("ScriptExtHtmlWebpackPlugin")
        .after("html")
        .use("script-ext-html-Webpack-plugin", [
          {
            inline: /runtime\..*\.js$/
          }
        ])
        .end();

      config.optimization.splitChunks({
        chunks: "all",
        cacheGroups: {
          vendors: {
            name: "chunk-vendors",
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
            chunks: "initial" // 只打包初始时依赖的第三方
          },
          commons: {
            name: "chunk-commons",
            test: path.resolve(__dirname, "src/components"),
            minChunks: 3, // 最小公用次数
            priority: 5,
            reuseExistingChunk: true
          },
          vant: {
            name: "chunk-vant", // 单独将 Vant 拆包
            priority: 20, // 数字大权重到，满足多个 cacheGroups 的条件时候分到权重高的
            test: /[\\/]node_modules[\\/]_?vant(.*)/
          }
        }
      });
      config.optimization.runtimeChunk("single");

      config
        .plugin("banner")
        .use(webpack.BannerPlugin, [
          `[${pkg.name}]\nversion:${pkg.version}\nauthor: ${pkg.author}\ntime: ${date}`
        ])
        .end();

      config
        .plugin("fileManager")
        .use(FileManagerPlugin, [
          {
            onEnd: {
              delete: ["./dist/video", "./dist/data"],
              archive: [
                {
                  source: "./dist",
                  destination: `./dist/dist-${dateFormat}-${pkg.version}.zip`
                }
              ]
            }
          }
        ])
        .end();
    });

    // use cdn start
    // ------------------------------------------------------
    const externals = {
      vue: "Vue",
      "vue-router": "VueRouter",
      vuex: "Vuex",
      axios: "axios",
      "crypto-js": "CryptoJS"
    };

    // 忽略的打包文件
    config.externals(externals);

    const cdn = {
      css: [],
      js: [
        "./cdn/vue/2.6.11/vue.min.js",
        "./cdn/vuex/3.4.0/vuex.min.js",
        "./cdn/vue-router/3.2.0/vue-router.min.js",
        "./cdn/axios/0.18.1/axios.min.js",
        "./cdn/crypto-js/4.0.0/crypto-js.min.js"
      ]
    };

    config.plugin("html").tap(args => {
      args[0].cdn = cdn;
      return args;
    });

    // use cdn end
    // ------------------------------------------------------

    if (isProduction) {
      // it can improve the speed of the first screen, it is recommended to turn on preload
      config.plugin("preload").tap(() => [
        {
          rel: "preload",
          // to ignore runtime.js
          // https://github.com/vuejs/vue-cli/blob/dev/packages/@vue/cli-service/lib/config/app.js#L171
          fileBlacklist: [/\.map$/, /hot-update\.js$/, /runtime\..*\.js$/],
          include: "initial"
        }
      ]);

      // when there are many pages, it will cause too many meaningless requests
      config.plugins.delete("prefetch");

      // 打包分析
      config.plugin("webpack-report").use(BundleAnalyzerPlugin, [
        {
          analyzerMode: "static",
          openAnalyzer: false
        }
      ]);
    }

    // set svg-sprite-loader
    config.module
      .rule("svg")
      .exclude.add(resolve("src/assets/svgs"))
      .end();
    config.module
      .rule("icons")
      .test(/\.svg$/)
      .include.add(resolve("src/assets/svgs"))
      .end()
      .use("svg-sprite-loader")
      .loader("svg-sprite-loader")
      .options({
        symbolId: "icon-[name]"
      })
      .end();

    // set preserveWhitespace
    config.module
      .rule("vue")
      .use("vue-loader")
      .loader("vue-loader")
      .tap(options => {
        options.compilerOptions.preserveWhitespace = true;
        return options;
      })
      .end();
  },
  runtimeCompiler: true,
  // eslint-disable-next-line no-dupe-keys
  css: {
    requireModuleExtension: true,
    sourceMap: true,
    loaderOptions: {
      scss: {
        prependData:
          '@import "~@/assets/styles/core/_variables.scss";@import "~@/assets/styles/core/_mixins.scss";'
      }
    }
  }
};
