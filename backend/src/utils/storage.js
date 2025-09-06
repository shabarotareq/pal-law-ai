const path = require("path");

// اختيار المزوّد من البيئة: "cloudinary" أو "s3"
const PROVIDER = (process.env.STORAGE_PROVIDER || "cloudinary").toLowerCase();

let uploader;

if (PROVIDER === "cloudinary") {
  const cloudinary = require("cloudinary").v2;
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  uploader = async (file) => {
    const res = await cloudinary.uploader.upload(file.path, {
      folder: process.env.CLOUDINARY_FOLDER || "smartjudge",
    });
    return {
      url: res.secure_url,
      provider: "cloudinary",
      publicId: res.public_id,
      name: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
    };
  };
} else if (PROVIDER === "s3") {
  const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
  const fs = require("fs");
  const crypto = require("crypto");

  const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });
  const bucket = process.env.AWS_S3_BUCKET;

  uploader = async (file) => {
    const key = `${process.env.S3_PREFIX || "smartjudge"}/${Date.now()}_${crypto
      .randomBytes(6)
      .toString("hex")}_${file.originalname}`;
    const body = fs.readFileSync(file.path);
    await s3.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: body,
        ContentType: file.mimetype,
      })
    );
    return {
      url: `https://${bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`,
      provider: "s3",
      key,
      name: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
    };
  };
} else {
  throw new Error("STORAGE_PROVIDER غير معروف. استخدم cloudinary أو s3.");
}

module.exports = { uploadFile: uploader };
