// babel.config.js (في جذر المشروع)
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    // مهم: بلجن Reanimated يكون "آخر" بلجن
    plugins: ['react-native-reanimated/plugin'],
  };
};
