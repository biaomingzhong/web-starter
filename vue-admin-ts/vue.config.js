const path = require("path");

function resolve(dir) {
  return path.join(__dirname, dir);
}

const devServerPort = 4000;
const name = "大数据统一管理平台";

module.exports = {
  pwa: {
    name
  },

  publicPath: process.env.NODE_ENV === "production" ? "/client/" : "/",
  // 在npm run build 或 yarn build 时 ，生成文件的目录名称（要和baseUrl的生产环境路径一致）（默认dist）
  outputDir: 'dist',
  // 用于放置生成的静态资源 (js、css、img、fonts) 的；（项目打包之后，静态资源会放在这个文件夹下）
  // assetsDir: 'static',
  // 是否开启eslint保存检测，有效值：ture | false | 'error'
  lintOnSave: process.env.NODE_ENV === "development",
  // 如果你不需要生产环境的 source map，可以将其设置为 false 以加速生产环境构建。
  productionSourceMap: false,

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
      [process.env.VUE_APP_BASE_API]: {
        target: process.env.VUE_APP_API_PREFIX,
        changeOrigin: true, // needed for virtual hosted sites
        // ws: true, // proxy websockets
        // autoRewrite: true,
        // cookieDomainRewrite: true,
        pathRewrite: {
          [`^${process.env.VUE_APP_BASE_API}`]: ""
        }
      }
    },
    disableHostCheck: true
  },
  configureWebpack: {
    name: name,
    resolve: {
      alias: {
        "@": resolve("src")
      }
    }
  },
  chainWebpack(config) {
    // provide the app's title in webpack's name field, so that
    // it can be accessed in index.html to inject the correct title.
    config.set("name", name);

    config.when(process.env.NODE_ENV === "development", (config) => config.devtool("source-map"));

    // https://webpack.js.org/configuration/devtool/#development
    config.when(process.env.NODE_ENV !== "development", (config) => config.devtool("cheap-source-map"));
    config.when(process.env.NODE_ENV !== "development", (config) => {


      config.optimization.splitChunks({
        chunks: "all",
        cacheGroups: {
          vendors: {
            name: "chunk-vendors",
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
            chunks: "initial" // only package third parties that are initially dependent
          },
          commons: {
            name: "chunk-commons",
            test: path.resolve(__dirname, "src/components"),
            minChunks: 3, //  minimum common number
            priority: 5,
            reuseExistingChunk: true
          }
        }
      });
      config.optimization.runtimeChunk("single");
    });

    // use cdn start
    // ------------------------------------------------------
    const externals = {
      "vue": "Vue",
      "vue-router": "VueRouter",
      "vuex": "Vuex",
      "axios": "axios",
      "element-ui": "ELEMENT",
      "echarts/lib/echarts": "echarts",
      // lodash: '_',
      "dayjs": "dayjs",
      "crypto-js": "CryptoJS"
    };

    // 忽略的打包文件
    config.externals(externals);

    const cdn = {
      css: [
        "./cdn/element-ui/2.13.0/theme-chalk/index.css"
      ],
      js: [
        "./cdn/vue/2.6.11/vue.min.js",
        "./cdn/vuex/3.1.3/vuex.min.js",
        "./cdn/vue-router/3.1.6/vue-router.min.js",
        "./cdn/axios/0.18.1/axios.min.js",
        "./cdn/element-ui/2.13.0/index.js",
        "./cdn/echarts/4.7.0/echarts.min.js",
        "./cdn/dayjs/1.8.24/dayjs.min.js",
        "./cdn/crypto-js/4.0.0/crypto-js.min.js"
      ]
    };
    config.plugin("html").tap((args) => {
      args[0].cdn = cdn;
      return args;
    });
    // use cdn end
    // ------------------------------------------------------

    config
      .plugin("ScriptExtHtmlWebpackPlugin")
      .after("html")
      .use("script-ext-html-webpack-plugin", [
        {
          // `runtime` must same as runtimeChunk name. default is `runtime`
          inline: /runtime\..*\.js$/
        }
      ])
      .end();

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
      .tap((options) => {
        options.compilerOptions.preserveWhitespace = true;
        return options;
      })
      .end();
  },
  // node_modules依赖项es6语法未转换问题
  transpileDependencies: ["vuex-module-decorators", "resize-detector"]
};
