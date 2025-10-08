from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from django.contrib.auth.models import User, Group

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        data['grupos'] = list(self.user.groups.values_list('name', flat=True))

        return data


class RegistroUsuarioSerializer(serializers.ModelSerializer):
    grupo = serializers.ChoiceField(choices=[("cliente", "Cliente"), ("propietario", "Propietario")])

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'grupo']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        grupo_nombre = validated_data.pop('grupo')  
        user = User.objects.create_user(**validated_data)  
        grupo = Group.objects.get(name=grupo_nombre)
        user.groups.add(grupo)  
        return user
