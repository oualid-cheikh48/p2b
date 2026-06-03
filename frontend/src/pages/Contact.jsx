import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Toast from "../components/Toast";
import ScrollToTop from "../components/ScrollToTop";
import useThemeStore from "../store/themeStore";

const Contact = () => {
  const { theme } = useThemeStore();
  const isDark = theme === "dark";
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "", rating: 0 });
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setToast({ message: "Message envoyé ! Nous vous répondrons sous 24h.", type: "success" });
    setForm({ name: "", email: "", subject: "", message: "", rating: 0 });
    setLoading(false);
  };

  const infoCardClass = isDark
    ? "bg-white/5 border border-white/10 rounded-2xl p-5 text-center"
    : "bg-white border border-gray-200 rounded-2xl p-5 text-center shadow-sm";

  const inputClass = isDark
    ? "w-full bg-white/10 border border-white/20 text-white placeholder-white/30 rounded-xl px-4 py-3 focus:outline-none focus:border-violet-500 transition-colors"
    : "w-full bg-white border border-gray-200 text-gray-900 placeholder-gray-400 rounded-xl px-4 py-3 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 transition-colors";

  return (
    <div className={isDark ? "min-h-screen bg-[#0a0a0a] text-white" : "min-h-screen bg-[#f8f8fb] text-gray-900"}>
      <Navbar />
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="max-w-3xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <p className={isDark ? "text-white/30 text-sm uppercase tracking-widest mb-3" : "text-gray-400 text-sm uppercase tracking-widest mb-3"}>
            Support
          </p>
          <h1 className={isDark ? "text-4xl font-bold text-white mb-4" : "text-4xl font-bold text-slate-900 mb-4"}>
            Contactez-nous
          </h1>
          <p className={isDark ? "text-white/40 text-lg" : "text-gray-500 text-lg"}>
            Une question, un problème ou un retour ? On est là pour vous.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
          {[
            { icon: "💬", title: "Chat", desc: "Réponse en moins d'1h" },
            { icon: "📧", title: "Email", desc: "support@p2b.com" },
            { icon: "🕐", title: "Horaires", desc: "Lun-Ven 9h-18h" },
          ].map((item, i) => (
            <div key={i} className={infoCardClass}>
              <span className="text-2xl mb-3 block">{item.icon}</span>
              <p className={isDark ? "text-white font-semibold mb-1" : "text-gray-900 font-semibold mb-1"}>{item.title}</p>
              <p className={isDark ? "text-white/40 text-sm" : "text-gray-500 text-sm"}>{item.desc}</p>
            </div>
          ))}
        </div>

        <div className={isDark ? "bg-white/5 border border-white/10 rounded-2xl p-8" : "bg-white border border-gray-200 rounded-2xl p-8 shadow-sm"}>
          <h2 className={isDark ? "text-white font-semibold text-xl mb-6" : "text-gray-900 font-semibold text-xl mb-6"}>
            Envoyer un message
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className={isDark ? "text-white/60 text-sm mb-1 block" : "text-gray-600 text-sm mb-1 block"}>Nom *</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder="Jean Dupont"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={isDark ? "text-white/60 text-sm mb-1 block" : "text-gray-600 text-sm mb-1 block"}>Email *</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="jean@email.com"
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className={isDark ? "text-white/60 text-sm mb-1 block" : "text-gray-600 text-sm mb-1 block"}>Sujet *</label>
              <select
                name="subject"
                value={form.subject}
                onChange={handleChange}
                required
                className={inputClass}
              >
                <option value="" className={isDark ? "bg-gray-900" : "bg-white text-gray-900"}>Choisir un sujet</option>
                <option value="reservation" className={isDark ? "bg-gray-900" : "bg-white text-gray-900"}>Problème de réservation</option>
                <option value="paiement" className={isDark ? "bg-gray-900" : "bg-white text-gray-900"}>Problème de paiement</option>
                <option value="annonce" className={isDark ? "bg-gray-900" : "bg-white text-gray-900"}>Problème avec une annonce</option>
                <option value="compte" className={isDark ? "bg-gray-900" : "bg-white text-gray-900"}>Problème de compte</option>
                <option value="feedback" className={isDark ? "bg-gray-900" : "bg-white text-gray-900"}>Feedback / Suggestion</option>
                <option value="autre" className={isDark ? "bg-gray-900" : "bg-white text-gray-900"}>Autre</option>
              </select>
            </div>

            <div>
              <label className={isDark ? "text-white/60 text-sm mb-2 block" : "text-gray-600 text-sm mb-2 block"}>
                Votre expérience sur P2B
              </label>
              <div className="flex gap-2 flex-wrap items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setForm({ ...form, rating: star })}
                    className={`text-2xl transition-transform hover:scale-110 ${
                      form.rating >= star ? "opacity-100" : isDark ? "opacity-30" : "opacity-40"
                    }`}
                  >
                    ⭐
                  </button>
                ))}
                {form.rating > 0 && (
                  <span className={isDark ? "text-white/40 text-sm self-center ml-2" : "text-gray-500 text-sm self-center ml-2"}>
                    {["", "Très mauvais", "Mauvais", "Correct", "Bien", "Excellent"][form.rating]}
                  </span>
                )}
              </div>
            </div>

            <div>
              <label className={isDark ? "text-white/60 text-sm mb-1 block" : "text-gray-600 text-sm mb-1 block"}>Message *</label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                required
                rows={5}
                placeholder="Décrivez votre problème ou votre suggestion..."
                className={`${inputClass} resize-none`}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white py-4 rounded-xl font-semibold transition-colors"
            >
              {loading ? "Envoi en cours..." : "Envoyer le message"}
            </button>
          </form>
        </div>
      </div>

      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default Contact;