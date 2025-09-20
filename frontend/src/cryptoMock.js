// ملف وهمي لوحدة crypto
module.exports = {
  createHash: () => ({
    update: () => ({
      digest: () => "mock-hash",
    }),
  }),
  randomBytes: (size) => Buffer.alloc(size),
};
