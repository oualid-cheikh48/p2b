const { minioClient, BUCKET } = require("../config/minio");
const prisma = require("../config/prisma");
const path = require("path");

exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "Aucun fichier envoyé" });
    }

    const ext = path.extname(req.file.originalname);
    const fileName = `properties/${Date.now()}${ext}`;

    await minioClient.putObject(BUCKET, fileName, req.file.buffer, req.file.size, {
      "Content-Type": req.file.mimetype,
    });

    const imageUrl = `http://${process.env.MINIO_ENDPOINT || "p2b_minio"}:${process.env.MINIO_PORT || 9000}/${BUCKET}/${fileName}`;

    if (req.body.property_id) {
      await prisma.propertyImage.create({
        data: {
          property_id: parseInt(req.body.property_id),
          image_url: imageUrl,
          is_main: req.body.is_main === "true",
        },
      });
    }

    res.status(201).json({
      success: true,
      image_url: imageUrl,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
