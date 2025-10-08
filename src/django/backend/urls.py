from rest_framework import routers
from django.urls import path, include
from .views import  AlojamientoViewSet, HabitacionViewSet,FotosViewSet, ReservaViewSet, PagoViewSet

router = routers.DefaultRouter()
router.register(r'alojamiento', AlojamientoViewSet, basename='alojamiento')
router.register(r'habitacion', HabitacionViewSet, basename='habitacion')
router.register(r'fotos', FotosViewSet, basename='fotos')
router.register(r'reserva', ReservaViewSet, basename='reserva')
router.register(r'pago', PagoViewSet, basename='pago')

urlpatterns = [
    path('api/', include(router.urls)),
]

    
    