// ملف وهمي لوحدة path
module.exports = {
  join: (...args) => args.join("/"),
  resolve: (...args) => args.join("/"),
  basename: (path) => path.split("/").pop(),
  dirname: (path) => path.split("/").slice(0, -1).join("/"),
  extname: (path) => {
    const match = path.match(/\.([^./]+)$/);
    return match ? match[0] : "";
  },
};
