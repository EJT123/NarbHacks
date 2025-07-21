'use client';
import React, { useState } from "react";
import { api } from "@packages/backend/convex/_generated/api";
import { useQuery, useMutation } from "convex/react";

const GOAL_LABELS = {
  fat_loss: "Fat Loss",
  muscle_gain: "Muscle Gain",
  cardio_endurance: "Cardio Endurance",
  mobility_recovery: "Mobility/Recovery",
};

const getBarColor = (percent: number) => {
  if (percent < 33) return "bg-red-500";
  if (percent < 66) return "bg-blue-500";
  return "bg-green-500";
};

const types = ["fat_loss", "muscle_gain", "cardio_endurance", "mobility_recovery"];

export default function Goals() {
  const createGoal = useMutation(api.goals.createGoal);
  const [formState, setFormState] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [suggestion, setSuggestion] = useState({});

  const handleInput = (type, field, value) => {
    setFormState((prev) => ({
      ...prev,
      [type]: { ...prev[type], [field]: value },
    }));
  };

  const handleSuggest = (type) => {
    const weightChange = Number(formState[type]?.weightChange || 0);
    if (!weightChange) return;
    // Suggest 1 lb (0.45kg) per week for loss/gain
    const perWeek = 1;
    const weeks = Math.ceil(Math.abs(weightChange) / perWeek);
    const today = new Date();
    const end = new Date(today);
    end.setDate(today.getDate() + weeks * 7);
    setSuggestion((prev) => ({
      ...prev,
      [type]: {
        target: Math.abs(weightChange),
        startDate: today.toISOString().slice(0, 10),
        endDate: end.toISOString().slice(0, 10),
        weeks,
      },
    }));
    setFormState((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        target: Math.abs(weightChange),
        startDate: today.toISOString().slice(0, 10),
        endDate: end.toISOString().slice(0, 10),
      },
    }));
  };

  const handleCreateGoal = async (type) => {
    setSubmitting(true);
    const { target, startDate, endDate } = formState[type] || {};
    if (!target || !startDate || !endDate) {
      alert("Please fill all fields");
      setSubmitting(false);
      return;
    }
    await createGoal({ type, target: Number(target), startDate, endDate });
    setSubmitting(false);
    setFormState((prev) => ({ ...prev, [type]: undefined }));
    setSuggestion((prev) => ({ ...prev, [type]: undefined }));
  };

  return (
    <div className="max-w-xl mx-auto py-8">
      <h2 className="text-2xl font-bold mb-6 text-center text-white">Your Goals</h2>
      {types.map((type) => {
        const progress = useQuery(api.goals.getGoalProgress, { type });
        if (!progress) {
          // Show goal creation form
          return (
            <div key={type} className="mb-8 bg-gray-800 rounded-xl p-6 shadow-lg">
              <div className="font-semibold text-lg text-white mb-2">{GOAL_LABELS[type]}</div>
              <form
                className="space-y-3"
                onSubmit={e => {
                  e.preventDefault();
                  handleCreateGoal(type);
                }}
              >
                {(type === "fat_loss" || type === "muscle_gain") && (
                  <>
                    <input
                      type="number"
                      min="1"
                      placeholder={`How much weight do you want to ${type === "fat_loss" ? "lose" : "gain"}? (lbs)`}
                      className="w-full rounded-lg px-3 py-2 bg-gray-700 text-white"
                      value={formState[type]?.weightChange || ""}
                      onChange={e => handleInput(type, "weightChange", e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="w-full py-2 rounded-lg bg-blue-500 hover:bg-blue-600 font-bold text-lg"
                      onClick={() => handleSuggest(type)}
                    >
                      Suggest Goal
                    </button>
                    {suggestion[type] && (
                      <div className="bg-gray-700 rounded-lg p-3 text-white text-sm mt-2">
                        Suggested: {suggestion[type].target} lbs in {suggestion[type].weeks} weeks (by {suggestion[type].endDate})
                      </div>
                    )}
                  </>
                )}
                <input
                  type="number"
                  min="1"
                  placeholder="Target value"
                  className="w-full rounded-lg px-3 py-2 bg-gray-700 text-white"
                  value={formState[type]?.target || ""}
                  onChange={e => handleInput(type, "target", e.target.value)}
                  required
                />
                <input
                  type="date"
                  className="w-full rounded-lg px-3 py-2 bg-gray-700 text-white"
                  value={formState[type]?.startDate || ""}
                  onChange={e => handleInput(type, "startDate", e.target.value)}
                  required
                />
                <input
                  type="date"
                  className="w-full rounded-lg px-3 py-2 bg-gray-700 text-white"
                  value={formState[type]?.endDate || ""}
                  onChange={e => handleInput(type, "endDate", e.target.value)}
                  required
                />
                <button
                  type="submit"
                  className="w-full py-2 rounded-lg bg-orange-500 hover:bg-orange-600 font-bold text-lg mt-2"
                  disabled={submitting}
                >
                  {submitting ? "Saving..." : "Set Goal"}
                </button>
              </form>
            </div>
          );
        }
        return (
          <div key={type} className="mb-8 bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold text-lg text-white">{GOAL_LABELS[type]}</span>
              <span className="text-sm text-gray-300">{progress.percent.toFixed(0)}%</span>
            </div>
            <div className="w-full h-5 bg-gray-700 rounded-full overflow-hidden mb-2">
              <div
                className={`h-5 ${getBarColor(progress.percent)} transition-all duration-500`}
                style={{ width: `${progress.percent}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-sm text-gray-400">
              <span>Current: {progress.current}</span>
              <span>Target: {progress.target}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
} 