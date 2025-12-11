"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronRight, ChevronLeft, Target, User, Activity } from "lucide-react";

export default function Onboarding() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    goal_type: "",
    age: "",
    weight: "",
    height: "",
    sex: "",
    activity_level: ""
  });

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  const handleSubmit = async () => {
    setLoading(true);
    const res = await fetch("/api/onboarding", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    
    if (res.ok) {
      router.push("/dashboard");
    } else {
      alert("Failed to save profile. Please try again.");
    }
    setLoading(false);
  };

  const canProceed = () => {
    if (step === 1) return form.goal_type !== "";
    if (step === 2) return form.age && form.weight && form.height && form.sex;
    if (step === 3) return form.activity_level !== "";
    return true;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8">
        <div className="flex justify-center mb-6">
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`w-3 h-3 rounded-full ${step >= s ? "bg-blue-600" : "bg-gray-200"}`}
              />
            ))}
          </div>
        </div>

        {step === 1 && (
          <div className="space-y-6">
            <div className="text-center">
              <Target className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900">What's your goal?</h1>
              <p className="text-gray-500 mt-2">This helps us personalize your targets</p>
            </div>
            <div className="space-y-3">
              {[
                { value: "lose", label: "Lose Weight", desc: "Reduce body fat" },
                { value: "maintain", label: "Maintain Weight", desc: "Keep current weight" },
                { value: "gain", label: "Gain Weight", desc: "Build muscle mass" }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setForm({ ...form, goal_type: option.value })}
                  className={`w-full p-4 rounded-xl text-left border-2 transition-all ${
                    form.goal_type === option.value
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-200 hover:border-blue-300"
                  }`}
                >
                  <p className="font-semibold text-gray-900">{option.label}</p>
                  <p className="text-sm text-gray-500">{option.desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="text-center">
              <User className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900">Tell us about yourself</h1>
              <p className="text-gray-500 mt-2">We'll calculate your daily targets</p>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                  <input
                    type="number"
                    value={form.age}
                    onChange={(e) => setForm({ ...form, age: e.target.value })}
                    className="w-full p-3 border rounded-lg"
                    placeholder="25"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sex</label>
                  <select
                    value={form.sex}
                    onChange={(e) => setForm({ ...form, sex: e.target.value })}
                    className="w-full p-3 border rounded-lg bg-white"
                  >
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
                <input
                  type="number"
                  value={form.weight}
                  onChange={(e) => setForm({ ...form, weight: e.target.value })}
                  className="w-full p-3 border rounded-lg"
                  placeholder="70"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Height (cm)</label>
                <input
                  type="number"
                  value={form.height}
                  onChange={(e) => setForm({ ...form, height: e.target.value })}
                  className="w-full p-3 border rounded-lg"
                  placeholder="175"
                />
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div className="text-center">
              <Activity className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900">Activity Level</h1>
              <p className="text-gray-500 mt-2">How active are you on a typical day?</p>
            </div>
            <div className="space-y-3">
              {[
                { value: "sedentary", label: "Sedentary", desc: "Little or no exercise" },
                { value: "light", label: "Lightly Active", desc: "Light exercise 1-3 days/week" },
                { value: "moderate", label: "Moderately Active", desc: "Moderate exercise 3-5 days/week" },
                { value: "active", label: "Very Active", desc: "Hard exercise 6-7 days/week" },
                { value: "extra", label: "Extra Active", desc: "Very hard exercise & physical job" }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setForm({ ...form, activity_level: option.value })}
                  className={`w-full p-4 rounded-xl text-left border-2 transition-all ${
                    form.activity_level === option.value
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-200 hover:border-blue-300"
                  }`}
                >
                  <p className="font-semibold text-gray-900">{option.label}</p>
                  <p className="text-sm text-gray-500">{option.desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <Target className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">You're all set!</h1>
            <p className="text-gray-500">
              We've calculated your personalized daily targets based on your profile.
              You can always adjust these later in settings.
            </p>
            <div className="bg-gray-50 rounded-xl p-4 text-left">
              <p className="text-sm text-gray-500 mb-2">Your Profile Summary</p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <p><span className="text-gray-500">Goal:</span> <span className="font-semibold capitalize">{form.goal_type}</span></p>
                <p><span className="text-gray-500">Age:</span> <span className="font-semibold">{form.age}</span></p>
                <p><span className="text-gray-500">Weight:</span> <span className="font-semibold">{form.weight} kg</span></p>
                <p><span className="text-gray-500">Height:</span> <span className="font-semibold">{form.height} cm</span></p>
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-4 mt-8">
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              className="flex-1 p-3 border rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-gray-50"
            >
              <ChevronLeft size={20} /> Back
            </button>
          )}
          {step < 4 ? (
            <button
              onClick={() => setStep(step + 1)}
              disabled={!canProceed()}
              className={`flex-1 p-3 rounded-xl font-semibold flex items-center justify-center gap-2 ${
                canProceed()
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              Next <ChevronRight size={20} />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 p-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700"
            >
              {loading ? "Saving..." : "Start Tracking"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
