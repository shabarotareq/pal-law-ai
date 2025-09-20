// ملف وهمي لوحدة fs
module.exports = {
  readFileSync: () => "",
  writeFileSync: () => {},
  existsSync: () => false,
  readdirSync: () => [],
  statSync: () => ({ isFile: () => false, isDirectory: () => false }),
  mkdirSync: () => {},
  rmdirSync: () => {},
  unlinkSync: () => {},
};
