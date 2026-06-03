import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import useThemeStore from "../../store/themeStore";
import api from "../../api/axios";
import ImageUploader from "../../components/ImageUploader";

const propertyTypes = ["apartment", "house", "villa", "studio"];

const EditProperty = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { theme } = useThemeStore();
  const isDark = theme === "dark";
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [existingImages, setExistingImages] = useState([]);

  const [form, setForm] = useState({
    title: "",
    description: "",
    price_per_night: "",
    property_type: "apartment",
    max_guests: "",
    bedrooms: "1",
    bathrooms: "1",
    country: "",
    city: "",
    address: "",
    latitude: "",
    longitude: "",
  });

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await api.get(`/properties/${id}`);
        const data = res.data.data || res.data;
        setForm({
          title: data.title || "",
          description: data.description || "",
          price_per_night: data.price_per_night || "",
          property_type: data.property_type || "apartment",
          max_guests: data.max_guests || "",
          bedrooms: data.bedrooms || "1",
          bathrooms: data.bathrooms || "1",
          country: data.country || "",
          city: data.city || "",
          address: data.address || "",
          latitude: data.latitude || "",
          longitude: data.longitude || "",
        });
        setExistingImages(data.images || []);
      } catch (err) {
        setError("Annonce introuvable.");
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleDeleteImage = async (imageId) => {
    if (!window.confirm("Supprimer cette image ?")) return;
    try {
      await api.delete(`/properties/${id}/images/${imageId}`);
      setExistingImages((prev) => prev.filter((img) => img.id !== imageId));
    } catch (err) {
      alert("Erreur lors de la suppression de l'image.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      await api.put(`/properties/${id}`, {
        ...form,
        price_per_night: parseFloat(form.price_per_night),
        max_guests: parseInt(form.max_guests),
        bedrooms: parseInt(form.bedrooms),
        bathrooms: parseInt(form.bathrooms),
      });

      setSuccess(true);
      setTimeout(() => navigate("/dashboard/properties"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de la modification.");
    } finally {
      setSaving(false);
    }
  };

  const cardClass = isDark
    ? "bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4"
    : "bg-white border border-gray-200 rounded-2xl p-6 space-y-4 shadow-sm";

  const labelClass = isDark ? "text-white/60 text-sm mb-1 block" : "text-gray-600 text-sm mb-1 block";

  const inputClass = isDark
    ? "w-full bg-white/10 border border-white/20 text-white placeholder-white/30 rounded-xl px-4 py-3 focus:outline-none focus:border-violet-500 transition-colors"
    : "w-full bg-white border border-gray-200 text-gray-900 placeholder-gray-400 rounded-xl px-4 py-3 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 transition-colors";

  if (loading)
    return (
      <DashboardLayout>
        <div className="max-w-2xl animate-pulse space-y-4">
          <div className={isDark ? "h-8 bg-white/10 rounded w-1/3" : "h-8 bg-gray-200 rounded w-1/3"} />
          <div className={isDark ? "h-64 bg-white/10 rounded-2xl" : "h-64 bg-white border border-gray-200 rounded-2xl shadow-sm"} />
        </div>
      </DashboardLayout>
    );

  return (
    <DashboardLayout>
      <div className="max-w-2xl">
        <h1 className={isDark ? "text-3xl font-bold text-white mb-2" : "text-3xl font-bold text-slate-900 mb-2"}>
          Modifier l'annonce
        </h1>
        <p className={isDark ? "text-white/40 mb-8" : "text-gray-500 mb-8"}>
          Mettez à jour les informations de votre logement
        </p>

        {success && (
          <div
            className={
              isDark
                ? "bg-green-500/20 border border-green-500/30 text-green-400 rounded-xl px-4 py-3 mb-6"
                : "bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 mb-6"
            }
          >
            ✅ Annonce modifiée avec succès ! Redirection en cours...
          </div>
        )}

        {error && (
          <div
            className={
              isDark
                ? "bg-red-500/20 border border-red-500/30 text-red-400 rounded-xl px-4 py-3 mb-6"
                : "bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 mb-6"
            }
          >
            ❌ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className={cardClass}>
            <h2 className={isDark ? "text-white font-semibold text-lg mb-4" : "text-gray-900 font-semibold text-lg mb-4"}>
              Informations principales
            </h2>

            <div>
              <label className={labelClass}>Titre *</label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Description *</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                required
                rows={4}
                className={`${inputClass} resize-none`}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Type de logement</label>
                <select
                  name="property_type"
                  value={form.property_type}
                  onChange={handleChange}
                  className={inputClass}
                >
                  {propertyTypes.map((type) => (
                    <option key={type} value={type} className={isDark ? "bg-gray-900" : "bg-white text-gray-900"}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelClass}>Prix par nuit (€) *</label>
                <input
                  type="number"
                  name="price_per_night"
                  value={form.price_per_night}
                  onChange={handleChange}
                  required
                  min="1"
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          <div className={cardClass}>
            <h2 className={isDark ? "text-white font-semibold text-lg mb-4" : "text-gray-900 font-semibold text-lg mb-4"}>
              Capacité
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className={labelClass}>Voyageurs max *</label>
                <input
                  type="number"
                  name="max_guests"
                  value={form.max_guests}
                  onChange={handleChange}
                  required
                  min="1"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Chambres</label>
                <input
                  type="number"
                  name="bedrooms"
                  value={form.bedrooms}
                  onChange={handleChange}
                  min="1"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Salles de bain</label>
                <input
                  type="number"
                  name="bathrooms"
                  value={form.bathrooms}
                  onChange={handleChange}
                  min="1"
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          <div className={cardClass}>
            <h2 className={isDark ? "text-white font-semibold text-lg mb-4" : "text-gray-900 font-semibold text-lg mb-4"}>
              Localisation
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Pays</label>
                <input
                  type="text"
                  name="country"
                  value={form.country}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Ville</label>
                <input
                  type="text"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>Adresse</label>
              <input
                type="text"
                name="address"
                value={form.address}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Latitude</label>
                <input
                  type="number"
                  name="latitude"
                  value={form.latitude}
                  onChange={handleChange}
                  placeholder="48.8566"
                  step="any"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Longitude</label>
                <input
                  type="number"
                  name="longitude"
                  value={form.longitude}
                  onChange={handleChange}
                  placeholder="2.3522"
                  step="any"
                  className={inputClass}
                />
              </div>
            </div>

            <p className={isDark ? "text-white/30 text-xs" : "text-gray-500 text-xs"}>
              💡 Trouvez les coordonnées sur <a href="https://www.latlong.net" target="_blank" rel="noreferrer" className={isDark ? "text-violet-400 hover:underline" : "text-violet-600 hover:underline"}>latlong.net</a>
            </p>
          </div>

          <div className={cardClass}>
            <h2 className={isDark ? "text-white font-semibold text-lg mb-4" : "text-gray-900 font-semibold text-lg mb-4"}>
              Photos du logement
            </h2>

            {existingImages.length > 0 && (
              <div className="flex gap-3 flex-wrap mb-4">
                {existingImages.map((img) => (
                  <div key={img.id} className="relative w-24 h-20 rounded-xl overflow-hidden group">
                    <img src={img.image_url} alt="" className="w-full h-full object-cover" />
                    {img.is_main && (
                      <span className="absolute top-1 left-1 bg-violet-600/80 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                        Principale
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => handleDeleteImage(img.id)}
                      className="absolute top-1 right-1 w-6 h-6 bg-red-500/80 hover:bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}

            <ImageUploader
              propertyId={parseInt(id)}
              onUploadSuccess={() => {
                api.get(`/properties/${id}`).then((res) => {
                  const data = res.data.data || res.data;
                  setExistingImages(data.images || []);
                });
              }}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              type="button"
              onClick={() => navigate("/dashboard/properties")}
              className={
                isDark
                  ? "flex-1 bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl font-medium transition-colors"
                  : "flex-1 bg-white border border-gray-200 hover:bg-gray-50 text-gray-800 py-3 rounded-xl font-medium transition-colors shadow-sm"
              }
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white py-3 rounded-xl font-semibold transition-colors"
            >
              {saving ? "Sauvegarde..." : "Sauvegarder les modifications"}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default EditProperty;