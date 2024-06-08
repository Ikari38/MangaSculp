from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from .models import Product
from .serializer import ProductSerializer, ReviewSerializer
from backend.pagination import CustomPagination
from django.utils.text import slugify
# Create your views here.

# Obtener todos los productos paginados
@api_view(['GET'])
def get_products(request):
    products = Product.objects.all()
    pagination = CustomPagination()
    paginated_products = pagination.paginate_queryset(products, request)
    serializer = ProductSerializer(paginated_products, many=True)
    return pagination.get_paginated_response(serializer.data)

# Obtener producto por su slug
@api_view(['GET'])
def get_product(request, slug):
    products = Product.objects.get(slug=slug)
    serializer = ProductSerializer(products, many=False)
    return Response(serializer.data)

# Obtener producto por su ID (Solo administradores)
@api_view(['GET'])
def get_product_admin(request, id):
    products = Product.objects.get(id=id)
    serializer = ProductSerializer(products, many=False)
    return Response(serializer.data)

# Crear un nuevo producto (Solo administradores)
@api_view(['POST'])
def create_product(request):
    if request.user.is_staff:
        serializer = ProductSerializer(data=request.data)
        if serializer.is_valid():
            name = serializer.validated_data['name']
            category = serializer.validated_data['category']
            concatslug = name+category
            slug = slugify(concatslug)
            if serializer.Meta.model.objects.filter(slug=slug).exists():
                return Response(serializer.data, status=status.HTTP_400_BAD_REQUEST)
            serializer.save(user=request.user, slug=slug)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.data, status=status.HTTP_400_BAD_REQUEST)
    else:
        return Response("Unauthorized", status=status.HTTP_401_UNAUTHORIZED)

# Editar un producto existente (Solo administradores)
@api_view(['PUT'])
def edit_product(request, pk):
    product = Product.objects.get(pk=pk)
    if request.user.is_staff:
        serializer = ProductSerializer(product, data=request.data)
        if serializer.is_valid():
            name = serializer.validated_data['name']
            category = serializer.validated_data['category']
            if 'image' not in request.data:
                serializer.validated_data.pop('image', None)
            if name != product.name or category != product.category:
                concatslug = name+category
                slug = slugify(concatslug)
                if serializer.Meta.model.objects.filter(slug=slug).exists():
                    return Response(serializer.data, status=status.HTTP_400_BAD_REQUEST)
                serializer.save(user=request.user, slug=slug)
            else:
                serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.data, status=status.HTTP_400_BAD_REQUEST)
    else:
        return Response(serializer.data, status=status.HTTP_401_UNAUTHORIZED)

# Eliminar un producto existente (Solo administradores)
@api_view(['DELETE'])
def delete_product(request, pk):
    product = Product.objects.get(pk=pk)
    if request.user.is_staff:
        product.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    else:
        return Response(status=status.HTTP_401_UNAUTHORIZED)

# Buscar productos por nombre
@api_view(['GET'])
def search(request):
    query = request.query_params.get('query')
    if query is None:
        query = ''
    product = Product.objects.filter(name__icontains=query)
    serializer = ProductSerializer( product, many = True)
    return Response({'products': serializer.data})

# Obtener productos por categoria
@api_view(['GET'])
def get_product_by_category(request, category):
    products = Product.objects.filter(category=category)
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)

# Crear una reseña para un producto (Necesitas autenticarte)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_review(request, pk):
    serializer = ReviewSerializer(data=request.data)
    product = Product.objects.get(pk=pk)
    if serializer.is_valid():
        serializer.save(user=request.user, product=product)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)