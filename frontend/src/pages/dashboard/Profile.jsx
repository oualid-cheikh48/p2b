import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import DashboardLayout from "../../components/DashboardLayout";
import useAuthStore from "../../store/authStore";
import api from "../../api/axios";
import Toast from "../../components/Toast";

const Profile = () => {
  const { user, login, token } = useAuthStore();
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm();
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (user) reset(user);
  }, [user]);

  const onSubmit = async (data) => {
    try {
      const res = await api.put(`/users/${user.id}`, data);
      login(res.data, token);
      setToast({ message: "Profil mis à jour !", type: "success" });
    } catch (err) {
      setToast({ message: err.response?.data?.error || "Erreur lors de la mise à jour", type: "error" });
    }
  };

  return (
    <DashboardLayout>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <h1 className="text-3xl font-bold mb-8">Mon Profil</h1>
      <div className="bg-white/5 rounded-2xl p-8 max-w-xl">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex gap-4">
            <input
              {...register("first_name")}
              placeholder="Prénom"
              className="flex-1 bg-white/5 text-white border border-white/20 rounded-lg px-4 py-3 outline-none focus:border-violet-500"
            />
            <input
              {...register("last_name")}
              placeholder="Nom"
              className="flex-1 bg-white/5 text-white border border-white/20 rounded-lg px-4 py-3 outline-none focus:border-violet-500"
            />
          </div>
          <input
            {...register("email")}
            type="email"
            placeholder="Email"
            className="bg-white/5 text-white border border-white/20 rounded-lg px-4 py-3 outline-none focus:border-violet-500"
          />
          <input
            {...register("phone_number")}
            placeholder="Téléphone"
            className="bg-white/5 text-white border border-white/20 rounded-lg px-4 py-3 outline-none focus:border-violet-500"
          />
          <textarea
            {...register("bio")}
            placeholder="Bio"
            rows={4}
            className="bg-white/5 text-white border border-white/20 rounded-lg px-4 py-3 outline-none focus:border-violet-500 resize-none"
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-violet-600 hover:bg-violet-700 text-white font-semibold py-3 rounded-lg transition"
          >
            {isSubmitting ? "Sauvegarde..." : "Sauvegarder"}
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default Profile;