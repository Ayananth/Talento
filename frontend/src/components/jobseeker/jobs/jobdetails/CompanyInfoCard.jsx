import {
  ExternalLink,
  Users,
  MapPin,
  Briefcase,
  Phone,
  Mail,
  Calendar,
} from "lucide-react";

export default function CompanyInfoCard({
  companyName,
  companyAbout,
  companySize,
  companyWebsite,
  logo,

  // FUTURE BACKEND FIELDS (dummy for now)
  industry = "Software Development",
  location = "India",
  foundedYear = "2020",
  email = "contact@company.com",
  phone = "+91 98765 43210",
  openJobs = 3,
}) {
  return (
    <div className="border border-slate-200 rounded-2xl p-6 bg-white space-y-6">
      
      {/* HEADER */}
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-xl bg-slate-100 flex items-center justify-center overflow-hidden shrink-0">
          {logo ? (
            <img
              src={logo}
              alt={companyName}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-slate-400 text-sm">Logo</span>
          )}
        </div>

        <div>
          <h3 className="text-lg font-semibold text-slate-900">
            {companyName}
          </h3>

          {companySize && (
            <p className="mt-1 flex items-center gap-1 text-sm text-slate-500">
              <Users size={14} />
              {companySize} employees
            </p>
          )}
        </div>
      </div>

      {/* ABOUT */}
      {companyAbout && (
        <p className="text-sm text-slate-600 leading-relaxed">
          {companyAbout}
        </p>
      )}

      {/* META DETAILS */}
      <div className="space-y-3 text-sm text-slate-600">
        <div className="flex items-center gap-2">
          <Briefcase size={16} className="text-slate-400" />
          <span>Industry:</span>
          <span className="font-medium">{industry}</span>
        </div>

        <div className="flex items-center gap-2">
          <MapPin size={16} className="text-slate-400" />
          <span>Location:</span>
          <span className="font-medium">{location}</span>
        </div>

        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-slate-400" />
          <span>Founded:</span>
          <span className="font-medium">{foundedYear}</span>
        </div>

        <div className="flex items-center gap-2">
          <Mail size={16} className="text-slate-400" />
          <span>Email:</span>
          <span className="font-medium">{email}</span>
        </div>

        <div className="flex items-center gap-2">
          <Phone size={16} className="text-slate-400" />
          <span>Phone:</span>
          <span className="font-medium">{phone}</span>
        </div>

        <div className="flex items-center gap-2">
          <Briefcase size={16} className="text-slate-400" />
          <span>Open Jobs:</span>
          <span className="font-medium">{openJobs}</span>
        </div>
      </div>

      {/* WEBSITE */}
      {companyWebsite && (
        <a
          href={companyWebsite}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline"
        >
          Visit website
          <ExternalLink size={14} />
        </a>
      )}
    </div>
  );
}
