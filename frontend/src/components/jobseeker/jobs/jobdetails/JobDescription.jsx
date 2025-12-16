export default function JobDescription({
  description = `
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
    Quisque interdum consequat ipsum, at venenatis lorem. 
    Sed vitae justo at felis facilisis fermentum. 
    Vivamus non lacus nec lorem dictum luctus.
  `,
  responsibilities = [
    "Design, develop, and maintain web applications",
    "Collaborate with cross-functional teams",
    "Write clean, scalable, and maintainable code",
    "Participate in code reviews and technical discussions",
  ],
  requirements = [
    "Bachelor’s degree in Computer Science or related field",
    "2+ years of experience in web development",
    "Strong knowledge of JavaScript, React, and REST APIs",
    "Good understanding of databases and SQL",
  ],
  benefits = [
    "Competitive salary and performance bonuses",
    "Flexible working hours and remote options",
    "Health insurance and paid leaves",
    "Learning and career growth opportunities",
  ],
}) {
  return (
    <div className="border border-slate-200 rounded-2xl p-6 bg-white space-y-8">

      {/* DESCRIPTION */}
      <section>
        <h2 className="text-lg font-semibold text-slate-900 mb-4">
          Job Description
        </h2>
        <p className="text-slate-600 leading-relaxed whitespace-pre-line">
          {description}
        </p>
      </section>

      {/* RESPONSIBILITIES */}
      <section>
        <h3 className="text-md font-semibold text-slate-900 mb-3">
          Responsibilities
        </h3>
        <ul className="list-disc list-inside space-y-2 text-slate-600">
          {responsibilities.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </section>

      {/* REQUIREMENTS */}
      <section>
        <h3 className="text-md font-semibold text-slate-900 mb-3">
          Requirements
        </h3>
        <ul className="list-disc list-inside space-y-2 text-slate-600">
          {requirements.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </section>

      {/* BENEFITS */}
      <section>
        <h3 className="text-md font-semibold text-slate-900 mb-3">
          Benefits
        </h3>
        <ul className="list-disc list-inside space-y-2 text-slate-600">
          {benefits.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </section>

    </div>
  );
}
