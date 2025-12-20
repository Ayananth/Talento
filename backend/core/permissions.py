from rest_framework.permissions import BasePermission

class IsRecruiter(BasePermission):
    message = "You must be an recruiter."

    def has_permission(self, request, view):
        user = request.user
        return bool(user and user.is_authenticated and user.role == 'recruiter' and not user.is_blocked)

class IsJobseeker(BasePermission):
    message = "You must be an jobseeker."

    def has_permission(self, request, view):
        user = request.user
        return bool(user and user.is_authenticated and user.role == 'jobseeker' and not user.is_blocked)

class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        user = request.user
        return bool(user and user.is_authenticated and user.is_superuser and not user.is_blocked)
    
class IsNotBlocked(BasePermission):
    message = "Your account has been blocked by admin."

    def has_permission(self, request, view):
        return not request.user.is_blocked
