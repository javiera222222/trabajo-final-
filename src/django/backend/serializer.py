from rest_framework import serializers
from .models import Alojamiento, Habitacion,Fotos, Reserva, Pago


class AlojamientoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Alojamiento
        fields = '__all__'
        read_only_fields = ['propietario']  


class HabitacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Habitacion
        fields = '__all__'
        read_only_fields = ['alojamiento']
        

class FotosSerializer(serializers.ModelSerializer):
    class Meta:
        model = Fotos
        fields = '__all__'



class ReservaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reserva
        fields = "__all__"

    def validate(self, data):
        habitacion = data.get('habitacion')
        desde = data.get('desde')
        hasta = data.get('hasta')

        reserva_id = self.instance.id if self.instance else None

        if Reserva.objects.filter(
            habitacion=habitacion,
            desde__lt=hasta,
            hasta__gt=desde
        ).exclude(id=reserva_id).exists():
            raise serializers.ValidationError(
                "La habitación ya está reservada en esas fechas."
            )

        return data

    def create(self, validated_data):
        request = self.context["request"]
        if not validated_data.get("huesped"):
            validated_data["huesped"] = request.user
        return super().create(validated_data)


class PagoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pago
        fields = '__all__'
