"""
URL configuration for core project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
import os
from django.contrib import admin
from django.urls import path, include


from django.conf import settings
from django.conf.urls.static import static

ADMIN_PATH = os.getenv("ADMIN_PATH",  "admin/")

urlpatterns = [
    path(f'{ADMIN_PATH}', admin.site.urls),
    path("v1/auth/", include("authentication.urls", namespace="authentication")),
    path("v1/profile/", include("profiles.urls", namespace="profile")),
    path("v1/recruiter/", include("recruiter.urls", namespace="recruiter")),
    path("v1/admin/", include("dashboard.urls", namespace="custom_admin")),
    path("v1/jobs/", include("jobs.urls", namespace="jobs")),
    path("v1/applications/", include("applications.urls", namespace="applications")),
    path("v1/chat/", include("chat.urls", namespace="chat")),
    path("v1/subscriptions/", include("subscriptions.urls", namespace="subscriptions")),
    path("v1/vector/", include("embeddings.urls", namespace="embeddings")),


]

if settings.DEBUG:
    urlpatterns += static(
        settings.STATIC_URL,
        document_root=settings.STATIC_ROOT,
    )
