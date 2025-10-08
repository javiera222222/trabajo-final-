from django.urls import path
from rest_framework_simplejwt.views import(TokenRefreshView,TokenVerifyView,)
from .views import CustomLoginView,RegistroUsuarioView

urlpatterns= [
    path('login/',CustomLoginView.as_view(),name='token_obtain_pair'),
    path('refresh/',TokenRefreshView.as_view(),name='token_refresh'),
    path('verify/',TokenVerifyView.as_view(),name='token_verify'),
    path('registro/', RegistroUsuarioView.as_view(), name='registro_usuario'),
] 