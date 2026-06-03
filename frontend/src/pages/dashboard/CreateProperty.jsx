import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import useAuthStore from "../../store/authStore";
import api from "../../api/axios";
import ImageUploader from "../../components/ImageUploader";

const propertyTypes = ["apartment", "house", "villa", "studio"];

const CreateProperty = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [createdPropertyId, setCreatedPropertyId] = useState(null);

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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await api.post("/properties", {
        ...form,
        owner_id: user.id,
        price_per_night: parseFloat(form.price_per_night),
        max_guests: parseInt(form.max_guests),
        bedrooms: parseInt(form.bedrooms),
        bathrooms: parseInt(form.bathrooms),
      });
      const newId = res.data.data?.id || res.data.id;
      setCreatedPropertyId(newId);
      setSuccess(true);
      // Ne redirige pas immédiatement — laisse uploader les images
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de la création de l'annonce.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl">
        <h1 className="text-3xl font-bold text-white mb-2">Créer une annonce</h1>
        <p className="text-white/40 mb-8">Publiez votre logement sur p2b</p>

        {success && (
          <div className="bg-green-500/20 border border-green-500/30 text-green-400 rounded-xl px-4 py-4 mb-6">
            <p className="font-semibold mb-2">✅ Annonce créée ! Ajoutez des photos ci-dessous.</p>
            <ImageUploader
              propertyId={createdPropertyId}
              onUploadSuccess={() => setTimeout(() => navigate("/dashboard/properties"), 1500)}
            />
            <button
              onClick={() => navigate("/dashboard/properties")}
              className="mt-3 text-green-400/70 hover:text-green-300 text-sm underline"
            >
              Passer cette étape →
            </button>
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
              <label className="text-white/60 text-sm mb-1 block">Titre de l'annonce *</label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                placeholder="Ex: Bel appartement au cœur de Paris"
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
                placeholder="Décrivez votre logement en détail..."
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
                  placeholder="85"
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
                  placeholder="4"
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
                  placeholder="France"
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
                  placeholder="Paris"
                  className="w-full bg-white/10 border border-white/20 text-white placeholder-white/30 rounded-xl px-4 py-3 focus:outline-none focus:border-violet-500 transition-colors"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-white/60 text-sm mb-1 block">Latitude</label>
                <input
                  type="number"
                  name="latitude"
                  value={form.latitude}
                  onChange={handleChange}
                  placeholder="48.8566"
                  step="any"
                  className="w-full bg-white/10 border border-white/20 text-white placeholder-white/30 rounded-xl px-4 py-3 focus:outline-none focus:border-violet-500 transition-colors"
                />
              </div>
              <div>
                <label className="text-white/60 text-sm mb-1 block">Longitude</label>
                <input
                  type="number"
                  name="longitude"
                  value={form.longitude}
                  onChange={handleChange}
                  placeholder="2.3522"
                  step="any"
                  className="w-full bg-white/10 border border-white/20 text-white placeholder-white/30 rounded-xl px-4 py-3 focus:outline-none focus:border-violet-500 transition-colors"
                />
              </div>
            </div>
            <p className="text-white/30 text-xs">
              💡 Trouvez les coordonnées sur <a href="https://www.latlong.net" target="_blank" rel="noreferrer" className="text-violet-400 hover:underline">latlong.net</a>
            </p>
              
            </div>

            <div>
              <label className="text-white/60 text-sm mb-1 block">Adresse</label>
              <input
                type="text"
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="12 Rue de la Paix, 75001 Paris"
                className="w-full bg-white/10 border border-white/20 text-white placeholder-white/30 rounded-xl px-4 py-3 focus:outline-none focus:border-violet-500 transition-colors"
              />
            </div>
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
              disabled={loading}
              className="flex-1 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white py-3 rounded-xl font-semibold transition-colors"
            >
              {loading ? "Publication en cours..." : "Publier l'annonce"}
            </button>
          </div>

        </form>
      </div>
    </DashboardLayout>
  );
};

export default CreateProperty;