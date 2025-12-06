import React, { useState, useEffect } from "react";
import { X, Plus, Check, AlertCircle } from "lucide-react";
import api from "../../apis/api";

export default function KeySkillsCard() {
  const [skills, setSkills] = useState([]);
  const [adding, setAdding] = useState(false);
  const [newSkill, setNewSkill] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // -------------------------------------------------
  // Load skills on component mount
  // -------------------------------------------------
  useEffect(() => {
    api
      .get("/v1/profile/me/skills/")
      .then((res) => setSkills(res.data)) // expects list of skills
      .catch(() => setSkills([]));
  }, []);

  // Auto-hide alerts
  useEffect(() => {
    if (error || success) {
      const t = setTimeout(() => {
        setError("");
        setSuccess("");
      }, 2500);
      return () => clearTimeout(t);
    }
  }, [error, success]);

  // -------------------------------------------------
  // Remove skill
  // -------------------------------------------------
  const removeSkill = async (skill) => {
    try {
      await api.delete(`/v1/profile/me/skills/${skill.id}/`);
      setSkills(skills.filter((s) => s.id !== skill.id));
      setSuccess("Skill removed");
    } catch (err) {
      setError("Failed to delete skill");
    }
  };

  // -------------------------------------------------
  // Add skill
  // -------------------------------------------------
const addSkill = async () => {
  const skill = newSkill.trim();

  // 1. Empty check
  if (!skill) {
    setError("Skill cannot be empty");
    return;
  }

  // 2. Only letters, numbers, space, and hyphens
  const regex = /^[A-Za-z0-9\s-]+$/;
  if (!regex.test(skill)) {
    setError("Skill cannot contain special characters");
    return;
  }

  // 3. Minimum length
  if (skill.length < 2) {
    setError("Skill must be at least 2 characters");
    return;
  }

  // 4. Duplicate check
  if (skills.some((s) => s.skill_name.toLowerCase() === skill.toLowerCase())) {
    setError("Skill already exists");
    return;
  }

  // Backend POST
  try {
    const res = await api.post("/v1/profile/me/skills/", {
      skill_name: skill,
    });

    setSkills((prev) => [...prev, res.data]);
    setNewSkill("");
    setAdding(false);
    setSuccess("Skill added!");
  } catch (err) {
    console.log(err);
    setError("Failed to add skill");
  }
};


  return (
    <div className="rounded-xl border bg-white px-6 py-4 shadow-sm">
      <h3 className="text-base font-semibold text-gray-900 mb-3">Key skills</h3>

      {/* SUCCESS MESSAGE */}
      {success && (
        <div className="bg-green-100 text-green-700 border border-green-300 px-3 py-2 rounded mb-3 flex items-center gap-2">
          ✓ {success}
        </div>
      )}

      {/* ERROR MESSAGE */}
      {error && (
        <div className="bg-red-100 text-red-700 border border-red-300 px-3 py-2 rounded mb-3 flex items-center gap-2">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      <div className="flex items-center flex-wrap gap-3">
        {/* Existing/Loaded Skills */}
        {skills.map((skill) => (
          <div
            key={skill.id}
            className="flex items-center gap-1 border border-gray-300 px-3 py-1 rounded-full text-sm text-gray-700 bg-gray-50"
          >
            {skill.skill_name}
            <X
              size={14}
              className="cursor-pointer text-gray-500 hover:text-gray-700"
              onClick={() => removeSkill(skill)}
            />
          </div>
        ))}

        {/* Add Skill Mode */}
        {adding ? (
          <div className="flex items-center gap-2 border rounded-full px-3 py-1 bg-gray-50">
            <input
              autoFocus
              type="text"
              className="outline-none bg-transparent text-sm"
              placeholder="Type skill"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addSkill()}
            />

            <Check
              size={18}
              className="text-blue-600 cursor-pointer"
              onClick={addSkill}
            />
          </div>
        ) : (
          // + button
          <button
            className="w-7 h-7 flex items-center justify-center text-black border border-gray-300 rounded-full hover:bg-gray-100"
            onClick={() => setAdding(true)}
          >
            <Plus size={18} strokeWidth={2} />
          </button>
        )}
      </div>
    </div>
  );
}
