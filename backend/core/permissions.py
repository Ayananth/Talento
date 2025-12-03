from rest_framework.permissions import BasePermission

class IsRecruiter(BasePermission):
    message = "You must be an recruiter."

    def has_permission(self, request, view):
        user = request.user
        return bool(user and user.is_authenticated and user.role == 'recruiter')

class IsJobseeker(BasePermission):
    message = "You must be an jobseeker."

    def has_permission(self, request, view):
        user = request.user
        return bool(user and user.is_authenticated and user.role == 'jobseeker')

class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        user = request.user
        return bool(user and user.is_authenticated and user.is_superuser)
