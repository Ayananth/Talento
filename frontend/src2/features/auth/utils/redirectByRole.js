export function navigateNowByRole(navigate, role) {
  switch (role) {
    case "jobseeker": navigate("/login"); break;
    case "recruiter": navigate("/recruiter/login"); break;
    case "admin": navigate("/admin/login"); break;
    default: navigate("/login");
  }
}
