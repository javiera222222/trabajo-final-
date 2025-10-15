from rest_framework.permissions import  IsAuthenticated
from rest_framework import  viewsets
from .models import Alojamiento, Habitacion,Fotos, Reserva, Pago
from .serializer import AlojamientoSerializer, HabitacionSerializer,FotosSerializer, ReservaSerializer, PagoSerializer
from rest_framework import serializers


class AlojamientoViewSet(viewsets.ModelViewSet):
    queryset =Alojamiento.objects.all()
    serializer_class = AlojamientoSerializer
    permission_classes = [IsAuthenticated]

    
    def perform_create(self, serializer):
        serializer.save(propietario=self.request.user)



class HabitacionViewSet(viewsets.ModelViewSet):
    serializer_class = HabitacionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.groups.filter(name="cliente").exists():
            return Habitacion.objects.all()
        return Habitacion.objects.filter(alojamiento__propietario=user)
    def perform_create(self, serializer):
        user = self.request.user
        alojamiento = Alojamiento.objects.filter(propietario=user).first()
        if alojamiento is None:
            raise serializers.ValidationError("El usuario no tiene un alojamiento asociado.")
        serializer.save(alojamiento=alojamiento)
    

class FotosViewSet(viewsets.ModelViewSet):
    serializer_class = FotosSerializer
    queryset = Fotos.objects.all()

    def get_queryset(self):
        habitacion = self.request.query_params.get('habitacion')
        if habitacion:
            return Fotos.objects.filter(habitacion=habitacion)
        return Fotos.objects.all()


class ReservaViewSet(viewsets.ModelViewSet):
    serializer_class = ReservaSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        if user.groups.filter(name="cliente").exists():
            return Reserva.objects.filter(huesped=user)
        return Reserva.objects.filter(habitacion__alojamiento__propietario=user)
 

class PagoViewSet(viewsets.ModelViewSet):
    serializer_class = PagoSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        
        return Pago.objects.filter(reserva__habitacion__alojamiento__propietario=user)


