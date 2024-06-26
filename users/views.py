from django.shortcuts import render
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth.hashers import make_password
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.db.models import Q

from . models import User
from . serializers import RegisterUserSerializer, MyTokenObtainPairSerializer, UserSerializer

# Create your views here.

# Obtener el usuario por su clave primaria
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_solo_user(request, pk):
    user = User.objects.get(pk=pk)
    serializer = UserSerializer(user)
    return Response(serializer.data)

# Editar el usuario, buscandolo por el email
@api_view(['PUT'])
def edit_profile(request, email):
    try:
        user = User.objects.get(email=email)
    except:
        return Response({'mensaje': 'Usario no encontrado'}, status=status.HTTP_404_NOT_FOUND)
    
    if request.user == user:
        # Edita el perfil del usuario si el user actual coincide con el user solicitado
        serializer = UserSerializer(user, data=request.data)
        if serializer.is_valid():
            if 'avatar' not in request.data:
                serializer.validated_data.pop('image', None)
            serializer.save()
            return Response(serializer.data)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)
    else:
        return Response(status=status.HTTP_401_UNAUTHORIZED)

# Busca usuarios por su nombre, apellido o email
@api_view(['GET'])
def search(request):
    query = request.query_params.get('query')
    if query is None:
        query = ''
    user = User.objects.filter(
        Q(email__icontains=query) |
        Q(name__icontains=query) |
        Q(last_name__icontains=query)
        )
    serializer = UserSerializer( user, many = True)
    return Response({'users': serializer.data})

# Elimina un usuario por clave primaria
@api_view(['DELETE'])
def delete_user(request,pk):
    if request.user.is_staff:
        user = User.objects.get(pk=pk)
        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    return Response(status=status.HTTP_401_UNAUTHORIZED)

# Obtiene todos los usuarios si el usuario es administrador
@api_view(['GET'])
def get_users(request):
    if request.user.is_staff:
        users = User.objects.exclude(email='admin@admin.com')
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)
    return Response(status=status.HTTP_401_UNAUTHORIZED)

# Registra un nuevo usuario y encripta la contraseņa
@api_view(['POST'])
def register(request):
    data = request.data
    user = User.objects.create(
        email = data['email'],
        name = data['name'],
        last_name = data['last_name'],
        password = make_password(data['password'])
    )
    serializer = RegisterUserSerializer(user, many=False)
    return Response(serializer.data)

#Vista para iniciar sesion y obtener el par de tokens de acceso y actualizacion
class LoginView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer