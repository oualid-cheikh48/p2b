import { useState } from "react";
import api from "../api/axios";

const ImageUploader = ({ propertyId, onUploadSuccess }) => {
  const [uploading, setUploading] = useState(false);
  const [previews, setPreviews] = useState([]);
  const [error, setError] = useState(null);

  const handleFiles = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    // Prévisualisations locales
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPreviews((prev) => [...prev, ...newPreviews]);

    setUploading(true);
    setError(null);

    try {
      for (let i = 0; i < files.length; i++) {
        const formData = new FormData();
        formData.append("image", files[i]);
        formData.append("property_id", propertyId);
        formData.append("is_main", i === 0 && previews.length === 0 ? "true" : "false");
        await api.post("/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      if (onUploadSuccess) onUploadSuccess();
    } catch (err) {
      setError("Erreur lors de l'upload. Vérifiez que MinIO est démarré.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      {/* Zone de drop */}
      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/20 rounded-xl cursor-pointer hover:border-violet-500/50 hover:bg-violet-500/5 transition-colors">
        <span className="text-2xl mb-2">📷</span>
        <span className="text-white/50 text-sm">
          {uploading ? "Upload en cours..." : "Cliquez ou glissez des images ici"}
        </span>
        <span className="text-white/30 text-xs mt-1">JPG, PNG, WebP</span>
        <input
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={handleFiles}
          disabled={uploading || !propertyId}
        />
      </label>

      {!propertyId && (
        <p className="text-yellow-400/70 text-xs mt-2">
          ⚠️ Les images seront disponibles après la création de l'annonce.
        </p>
      )}

      {error && (
        <p className="text-red-400 text-xs mt-2">❌ {error}</p>
      )}

      {/* Prévisualisations */}
      {previews.length > 0 && (
        <div className="flex gap-2 mt-3 flex-wrap">
          {previews.map((src, i) => (
            <div key={i} className="relative w-20 h-16 rounded-xl overflow-hidden">
              <img src={src} alt="" className="w-full h-full object-cover" />
              {i === 0 && (
                <span className="absolute bottom-0 left-0 right-0 bg-violet-600/80 text-white text-[10px] text-center py-0.5">
                  Principale
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUploader;