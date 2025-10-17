from django.db import models
from django.conf import settings


class Alojamiento(models.Model):
    id = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=50)
    direccion = models.CharField(max_length=50)
    tipoAlojamiento = models.CharField(max_length=50, null=True)  
    ubicacion = models.CharField(max_length=50, null=True)  
    propietario = models.ForeignKey( settings.AUTH_USER_MODEL, on_delete=models.CASCADE,null=True, blank=True)

class Habitacion(models.Model):
   id= models.AutoField(primary_key=True)
   nombre= models.CharField(max_length=50)
   camasSimples= models.IntegerField()
   camasDobles= models.IntegerField()
   banoPrivado=models.BooleanField()
   cocina =models.BooleanField()
   desayuno=models.BooleanField()
   precio= models.DecimalField(max_digits=10, decimal_places=2)
   alojamiento = models.ForeignKey(Alojamiento, on_delete=models.CASCADE)  
   

class Fotos (models.Model):
  id= models.AutoField(primary_key=True)
  habitacion= models.ForeignKey(Habitacion, on_delete=models.CASCADE)  
  imagen= models.ImageField( null=True, blank=True)  
 
class Reserva(models.Model):
   id= models.AutoField(primary_key=True)
   habitacion = models.ForeignKey(Habitacion, on_delete=models.CASCADE)
   cantNoches= models.IntegerField()
   desde = models.DateField()
   hasta = models.DateField()
   checkIn= models.DateTimeField(null=True, blank=True)
   checkOut= models.DateTimeField(null=True, blank=True)
   precio= models.DecimalField(max_digits=10, decimal_places=2)
   pagado= models.BooleanField()
   huesped = models.ForeignKey( settings.AUTH_USER_MODEL, on_delete=models.CASCADE,null=True, blank=True)
   dniHuesped= models.CharField(max_length=50)
   nombreHuesped = models.CharField(max_length=255, blank=True, null=True)
   cantHuespedes= models.IntegerField()

class Pago(models.Model):
   id= models.AutoField(primary_key=True)
   reserva = models.ForeignKey(Reserva, on_delete=models.CASCADE)
   fecha= models.DateTimeField()
   cantidad= models.DecimalField(max_digits=10, decimal_places=2)
   metodoDePago = models.CharField(max_length=50)   