import { MapPin, Phone, Mail } from "lucide-react";

export default function CompanyInfoCard({
  companyName = "AliThemes",
  location = "New York, US",
  openJobs = 2,
  address = "205 North Michigan Avenue, Suite 810 Chicago, 60601, USA",
  phone = "(123) 456-7890",
  email = "contact@evara.com",
  logoUrl,
}) {
  return (
    <div className="border border-slate-200 rounded-2xl p-6 bg-white">
      
      {/* HEADER */}
      <div className="flex items-start gap-4">
        {/* LOGO */}
        <div className="w-14 h-14 rounded-xl bg-slate-100 flex items-center justify-center overflow-hidden">
          {logoUrl ? (
            <img
              src={logoUrl}
              alt={companyName}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-slate-400 text-sm">Logo</span>
          )}
        </div>

        {/* NAME + META */}
        <div>
          <h3 className="text-lg font-semibold text-slate-900">
            {companyName}
          </h3>

          <div className="mt-1 flex items-center gap-1 text-sm text-slate-500">
            <MapPin size={14} />
            {location}
          </div>

          <a
            href="#"
            className="mt-1 inline-block text-sm text-blue-600 hover:underline"
          >
            {openJobs} Open Jobs
          </a>
        </div>
      </div>

      {/* DIVIDER */}
      <hr className="my-6 border-slate-200" />

      {/* MAP PLACEHOLDER */}
      <div className="h-40 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 text-sm">
        Map Preview
      </div>

      {/* CONTACT INFO */}
      <ul className="mt-6 space-y-4 text-sm text-slate-600">
        <li className="flex items-start gap-2">
          <MapPin size={16} className="mt-0.5 text-slate-400" />
          <span>{address}</span>
        </li>

        <li className="flex items-center gap-2">
          <Phone size={16} className="text-slate-400" />
          {phone}
        </li>

        <li className="flex items-center gap-2">
          <Mail size={16} className="text-slate-400" />
          {email}
        </li>
      </ul>
    </div>
  );
}
