import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import api from "../../api/axios";
import ImageUploader from "../../components/ImageUploader";

const propertyTypes = ["apartment", "house", "villa", "studio"];

const EditProperty = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

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
        });
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

  if (loading) return (
    <DashboardLayout>
      <div className="max-w-2xl animate-pulse space-y-4">
        <div className="h-8 bg-white/10 rounded w-1/3" />
        <div className="h-64 bg-white/10 rounded-2xl" />
      </div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout>
      <div className="max-w-2xl">
        <h1 className="text-3xl font-bold text-white mb-2">Modifier l'annonce</h1>
        <p className="text-white/40 mb-8">Mettez à jour les informations de votre logement</p>

        {success && (
          <div className="bg-green-500/20 border border-green-500/30 text-green-400 rounded-xl px-4 py-3 mb-6">
            ✅ Annonce modifiée avec succès ! Redirection en cours...
          </div>
        )}

        {error && (
          <div className="bg-red-500/20 border border-red-500/30 text-red-400 rounded-xl px-4 py-3 mb-6">
            ❌ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
            <h2 className="text-white font-semibold text-lg mb-4">Informations principales</h2>

            <div>
              <label className="text-white/60 text-sm mb-1 block">Titre *</label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                className="w-full bg-white/10 border border-white/20 text-white placeholder-white/30 rounded-xl px-4 py-3 focus:outline-none focus:border-violet-500 transition-colors"
              />
            </div>

            <div>
              <label className="text-white/60 text-sm mb-1 block">Description *</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                required
                rows={4}
                className="w-full bg-white/10 border border-white/20 text-white placeholder-white/30 rounded-xl px-4 py-3 focus:outline-none focus:border-violet-500 transition-colors resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-white/60 text-sm mb-1 block">Type de logement</label>
                <select
                  name="property_type"
                  value={form.property_type}
                  onChange={handleChange}
                  className="w-full bg-white/10 border border-white/20 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-violet-500 transition-colors"
                >
                  {propertyTypes.map((type) => (
                    <option key={type} value={type} className="bg-gray-900">
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-white/60 text-sm mb-1 block">Prix par nuit (€) *</label>
                <input
                  type="number"
                  name="price_per_night"
                  value={form.price_per_night}
                  onChange={handleChange}
                  required
                  min="1"
                  className="w-full bg-white/10 border border-white/20 text-white placeholder-white/30 rounded-xl px-4 py-3 focus:outline-none focus:border-violet-500 transition-colors"
                />
              </div>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
            <h2 className="text-white font-semibold text-lg mb-4">Capacité</h2>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-white/60 text-sm mb-1 block">Voyageurs max *</label>
                <input
                  type="number"
                  name="max_guests"
                  value={form.max_guests}
                  onChange={handleChange}
                  required
                  min="1"
                  className="w-full bg-white/10 border border-white/20 text-white placeholder-white/30 rounded-xl px-4 py-3 focus:outline-none focus:border-violet-500 transition-colors"
                />
              </div>

              <div>
                <label className="text-white/60 text-sm mb-1 block">Chambres</label>
                <input
                  type="number"
                  name="bedrooms"
                  value={form.bedrooms}
                  onChange={handleChange}
                  min="1"
                  className="w-full bg-white/10 border border-white/20 text-white placeholder-white/30 rounded-xl px-4 py-3 focus:outline-none focus:border-violet-500 transition-colors"
                />
              </div>

              <div>
                <label className="text-white/60 text-sm mb-1 block">Salles de bain</label>
                <input
                  type="number"
                  name="bathrooms"
                  value={form.bathrooms}
                  onChange={handleChange}
                  min="1"
                  className="w-full bg-white/10 border border-white/20 text-white placeholder-white/30 rounded-xl px-4 py-3 focus:outline-none focus:border-violet-500 transition-colors"
                />
              </div>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
            <h2 className="text-white font-semibold text-lg mb-4">Localisation</h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-white/60 text-sm mb-1 block">Pays</label>
                <input
                  type="text"
                  name="country"
                  value={form.country}
                  onChange={handleChange}
                  className="w-full bg-white/10 border border-white/20 text-white placeholder-white/30 rounded-xl px-4 py-3 focus:outline-none focus:border-violet-500 transition-colors"
                />
              </div>

              <div>
                <label className="text-white/60 text-sm mb-1 block">Ville</label>
                <input
                  type="text"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  className="w-full bg-white/10 border border-white/20 text-white placeholder-white/30 rounded-xl px-4 py-3 focus:outline-none focus:border-violet-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="text-white/60 text-sm mb-1 block">Adresse</label>
              <input
                type="text"
                name="address"
                value={form.address}
                onChange={handleChange}
                className="w-full bg-white/10 border border-white/20 text-white placeholder-white/30 rounded-xl px-4 py-3 focus:outline-none focus:border-violet-500 transition-colors"
              />
            </div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
            <h2 className="text-white font-semibold text-lg mb-4">Photos du logement</h2>
            <ImageUploader
              propertyId={parseInt(id)}
              onUploadSuccess={() => {}}
            />
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate("/dashboard/properties")}
              className="flex-1 bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl font-medium transition-colors"
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