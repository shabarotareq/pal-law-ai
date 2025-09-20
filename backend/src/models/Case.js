const [files, setFiles] = useState([]);

const handleFiles = (e) => setFiles(Array.from(e.target.files));

const mongoose = require("mongoose");

const attachmentSchema = new mongoose.Schema(
  {
    url: String,
    provider: { type: String, enum: ["s3", "cloudinary"] },
    publicId: String, // لـ Cloudinary
    key: String, // لـ S3
    name: String,
    mimeType: String,
    size: Number,
  },
  { _id: false }
);

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const fd = new FormData();
    fd.append("title", form.title);
    fd.append("description", form.description);
    fd.append("lawType", form.lawType);
    files.forEach((f) => fd.append("files", f));
    const newCase = await createCase(fd, true); // نمرر flag لتحديد multipart
    setCases([...cases, newCase]);
    setForm({ title: "", description: "", lawType: "جنائي" });
    setFiles([]);
  } catch {
    setError("فشل في إضافة القضية");
  }
};

const caseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    lawType: {
      type: String,
      enum: ["جنائي", "مدني", "شرعي", "عمل", "جرائم إلكترونية", "ضرائب"],
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    attachments: [attachmentSchema],
    deletedAt: { type: Date, default: null }, // Soft delete
    status: {
      type: String,
      enum: ["open", "in_review", "closed"],
      default: "open",
    },
    tags: [String],
  },
  { timestamps: true }
);

caseSchema.index({ title: "text", description: "text", tags: "text" });

module.exports = mongoose.model("Case", caseSchema);
