import React, { useState } from "react";
import { X, Plus, Check } from "lucide-react";

export default function KeySkillsCard() {
  const [skills, setSkills] = useState(["Python", "AWS"]);
  const [adding, setAdding] = useState(false);
  const [newSkill, setNewSkill] = useState("");

  const removeSkill = (skill) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  const addSkill = () => {
    const skill = newSkill.trim();

    if (!skill) return;
    if (skills.includes(skill)) return;

    setSkills([...skills, skill]);
    setNewSkill("");
    setAdding(false);
  };

  return (
    <div className="rounded-xl border bg-white px-6 py-4 shadow-sm">
      <h3 className="text-base font-semibold text-gray-900 mb-3">Key skills</h3>

      <div className="flex items-center flex-wrap gap-3">

        {/* Existing Skill Pills */}
        {skills.map((skill, index) => (
          <div
            key={index}
            className="flex items-center gap-1 border border-gray-300 px-3 py-1 rounded-full text-sm text-gray-700 bg-gray-50"
          >
            {skill}
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
          // Show + button when not adding
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
