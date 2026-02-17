from rest_framework.permissions import BasePermission


class IsTicketOwnerOrAdmin(BasePermission):
    message = "You do not have permission to access this ticket."

    def has_object_permission(self, request, view, obj):
        user = request.user
        return bool(
            user
            and user.is_authenticated
            and (user.is_superuser or obj.user_id == user.id)
        )
