export default function JobDescription({
  description,
  responsibilities,
  requirements,
  educationRequirement,
  skills = [],
}) {
  const blocks = [
    {
      title: "Job Description",
      content: description,
      empty: "No job description provided.",
    },
    {
      title: "Responsibilities",
      content: responsibilities,
      empty: "No responsibilities listed.",
    },
    {
      title: "Requirements",
      content: requirements,
      empty: "No requirements listed.",
    },
    {
      title: "Education Requirement",
      content: educationRequirement,
      empty: "No education requirement listed.",
    },
  ];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-8 shadow-sm">
      {blocks.map((block) => (
        <section key={block.title}>
          <h2 className="mb-4 text-lg font-semibold text-slate-900">
            {block.title}
          </h2>
          {block.content ? (
            <p className="whitespace-pre-line leading-relaxed text-slate-600">
              {block.content}
            </p>
          ) : (
            <p className="text-sm text-slate-400">{block.empty}</p>
          )}
        </section>
      ))}

      {/* SKILLS */}
      {skills.length > 0 && (
        <section>
          <h3 className="mb-4 text-md font-semibold text-slate-900">
            Required Skills
          </h3>

          <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <span
                key={index}
                className="rounded-md bg-blue-50 px-3 py-1 text-sm capitalize text-blue-800"
              >
                {skill}
              </span>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
