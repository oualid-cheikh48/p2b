import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import Toast from "../components/Toast";

const Register = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const navigate = useNavigate();
  const [toast, setToast] = useState(null);

  const onSubmit = async (data) => {
    try {
      await api.post("/auth/register", data);
      setToast({ message: "Compte créé avec succès !", type: "success" });
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setToast({ message: err.response?.data?.error || "Erreur d'inscription", type: "error" });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <div className="bg-white/10 backdrop-blur p-8 rounded-2xl w-full max-w-md">
        <h1 className="text-2xl font-bold text-white mb-6">Inscription</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <input
            {...register("first_name", { required: "Prénom requis" })}
            placeholder="Prénom"
            className="bg-white/5 text-white border border-white/20 rounded-lg px-4 py-3 outline-none focus:border-violet-500"
          />
          {errors.first_name && <p className="text-red-400 text-sm">{errors.first_name.message}</p>}

          <input
            {...register("last_name", { required: "Nom requis" })}
            placeholder="Nom"
            className="bg-white/5 text-white border border-white/20 rounded-lg px-4 py-3 outline-none focus:border-violet-500"
          />
          {errors.last_name && <p className="text-red-400 text-sm">{errors.last_name.message}</p>}

          <input
            {...register("email", { required: "Email requis" })}
            type="email"
            placeholder="Email"
            className="bg-white/5 text-white border border-white/20 rounded-lg px-4 py-3 outline-none focus:border-violet-500"
          />
          {errors.email && <p className="text-red-400 text-sm">{errors.email.message}</p>}

          <input
            {...register("password", { required: "Mot de passe requis", minLength: { value: 8, message: "8 caractères minimum" } })}
            type="password"
            placeholder="Mot de passe"
            className="bg-white/5 text-white border border-white/20 rounded-lg px-4 py-3 outline-none focus:border-violet-500"
          />
          {errors.password && <p className="text-red-400 text-sm">{errors.password.message}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-violet-600 hover:bg-violet-700 text-white font-semibold py-3 rounded-lg transition"
          >
            {isSubmitting ? "Inscription..." : "S'inscrire"}
          </button>
        </form>
        <p className="text-white/60 text-sm mt-4 text-center">
          Déjà un compte ? <Link to="/login" className="text-violet-400 hover:underline">Se connecter</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;