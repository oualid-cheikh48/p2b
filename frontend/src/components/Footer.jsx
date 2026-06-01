import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="bg-black/50 border-t border-white/5 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          <div>
            <p className="font-bold text-lg mb-4 text-white">✈️ ETNAir</p>
            <p className="text-white/40 text-sm leading-relaxed">
              La plateforme de location moderne pour voyageurs et hôtes.
            </p>
          </div>
          <div>
            <p className="font-semibold mb-4 text-white">Explorer</p>
            <ul className="space-y-2 text-white/40 text-sm">
              <li><button onClick={() => navigate("/properties")} className="hover:text-white transition-colors">Tous les logements</button></li>
              <li><button onClick={() => navigate("/properties?city=Paris")} className="hover:text-white transition-colors">Paris</button></li>
              <li><button onClick={() => navigate("/properties?city=Lyon")} className="hover:text-white transition-colors">Lyon</button></li>
              <li><button onClick={() => navigate("/properties?city=Nice")} className="hover:text-white transition-colors">Nice</button></li>
            </ul>
          </div>
          <div>
            <p className="font-semibold mb-4 text-white">Hôtes</p>
            <ul className="space-y-2 text-white/40 text-sm">
              <li><button onClick={() => navigate("/dashboard/create")} className="hover:text-white transition-colors">Publier une annonce</button></li>
              <li><button onClick={() => navigate("/dashboard/properties")} className="hover:text-white transition-colors">Mes annonces</button></li>
            </ul>
          </div>
          <div>
            <p className="font-semibold mb-4 text-white">Compte</p>
            <ul className="space-y-2 text-white/40 text-sm">
              <li><button onClick={() => navigate("/login")} className="hover:text-white transition-colors">Connexion</button></li>
              <li><button onClick={() => navigate("/register")} className="hover:text-white transition-colors">Inscription</button></li>
              <li><button onClick={() => navigate("/dashboard/profile")} className="hover:text-white transition-colors">Mon profil</button></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-white/30 text-sm">
          <p>© 2025 ETNAir. Tous droits réservés.</p>
          <p>Projet ETNA — Module C2W-CBI1</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;