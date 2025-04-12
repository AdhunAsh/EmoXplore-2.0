from django.urls import path
from main import views
from django.conf import settings
from django.conf.urls.static import static



urlpatterns = [
    path('login/', views.login_user, name='login'),
    path('register/', views.register_user, name='register'),
    path('', views.home, name='home'),
    path('contact/', views.contact, name='contact'),
    path('landing_page/', views.landing , name ='landing'),
    path('file-upload/', views.file_upload, name='file_upload')
    # path('chat/', views.chat_view , name= 'chat'),
    # path('get-messages/', views.chat_view, name='get_messages'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
