export default function JobDescription({
  description,
  skills = [],
}) {
  return (
    <div className="border border-slate-200 rounded-2xl p-6 bg-white space-y-8">

      {/* DESCRIPTION */}
      <section>
        <h2 className="text-lg font-semibold text-slate-900 mb-4">
          Job Description
        </h2>

        {description ? (
          <p className="text-slate-600 leading-relaxed whitespace-pre-line">
            {description}
          </p>
        ) : (
          <p className="text-slate-400 text-sm">
            No job description provided.
          </p>
        )}
      </section>

      {/* SKILLS */}
      {skills.length > 0 && (
        <section>
          <h3 className="text-md font-semibold text-slate-900 mb-4">
            Required Skills
          </h3>

          <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 text-sm rounded-md bg-slate-100 text-slate-700 capitalize"
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
