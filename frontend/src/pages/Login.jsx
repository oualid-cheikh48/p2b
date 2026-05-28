import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import useAuthStore from "../store/authStore";

const Login = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const res = await api.post("/auth/login", data);
      login(res.data.user, res.data.token);
      navigate("/dashboard/profile");
    } catch (err) {
      alert(err.response?.data?.error || "Erreur de connexion");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950">
      <div className="bg-white/10 backdrop-blur p-8 rounded-2xl w-full max-w-md">
        <h1 className="text-2xl font-bold text-white mb-6">Connexion</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <input
            {...register("email", { required: "Email requis" })}
            type="email"
            placeholder="Email"
            className="bg-white/5 text-white border border-white/20 rounded-lg px-4 py-3 outline-none focus:border-violet-500"
          />
          {errors.email && <p className="text-red-400 text-sm">{errors.email.message}</p>}

          <input
            {...register("password", { required: "Mot de passe requis" })}
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
            {isSubmitting ? "Connexion..." : "Se connecter"}
          </button>
        </form>
        <p className="text-white/60 text-sm mt-4 text-center">
          Pas de compte ? <Link to="/register" className="text-violet-400 hover:underline">S'inscrire</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;