from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework import status
from datetime import datetime

from .models import Order, Orderitem, ShippingAddress
from .serializers import OrderItemSerializer, OrderSerializer
from products.models import Product
# Create your views here.

# Funcion para buscar pedidos
@api_view(['GET'])
@permission_classes([IsAdminUser])
def search(request):
    query = request.query_params.get('query')
    if query is None:
        query = ''
    order = Order.objects.filter(user__email__icontains=query)
    serializer = OrderSerializer(order, many=True)
    return Response({'orders': serializer.data})

# Funcion para obtener todos los pedidos
@api_view(['GET'])
@permission_classes([IsAdminUser])
def get_orders(request):
    orders = Order.objects.all()
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)

# Funcion para crear pedidos
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_order(request):
    user = request.user
    data = request.data
    orderItems = data['order_items']
    total_price = data['total_price']

    # Calcula la suma de los precios de los productos
    sum_of_prices = sum(int(float(item['price'])) * item['quantity'] for item in orderItems)

    if total_price == sum_of_prices:
        # Crea la orden
        order = Order.objects.create(
            user = user,
            total_price = total_price
        )

        # Crea la direccion a la que se va a enviar el pedido
        ShippingAddress.objects.create(
            order = order,
            address = data['address'],
            city = data['city'],
            postal_code = data['postal_code'],
        )

        # Crea un artículo del pedido por cada producto en orderItems y lo enlaza con el pedido actual
        for i in orderItems:
            product = Product.objects.get(id=i['id'])
            item = Orderitem.objects.create(
                product = product,
                order = order,
                quantity = i['quantity'],
                price = i['price']
            )

            product.stock -= item.quantity
            product.save()

        serializer = OrderSerializer(order, many=False)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    else:
        return Response({'mensaje': sum_of_prices}, status=status.HTTP_400_BAD_REQUEST)

# Funcion para ver un pedido

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def solo_order(request, pk):
    user = request.user
    try:
        order = Order.objects.get(pk=pk)
        if user.is_staff or order.user == user:
            # Obtener los artículos asociados al pedido
            order_items = Orderitem.objects.filter(order=order)
            # Serializar tanto el pedido como sus articulos
            order_data = OrderSerializer(order, many=False).data
            order_items_data = OrderItemSerializer(order_items, many=True).data
            # Agregar los artículos al objeto de datos del pedido
            order_data['order_items'] = order_items_data
            return Response(order_data)
        else:
            return Response({'detail': 'No tienes permiso para ver este pedido.'}, status=status.HTTP_401_UNAUTHORIZED)
    except Order.DoesNotExist:
        return Response({'detail': 'El pedido no existe'}, status=status.HTTP_404_NOT_FOUND)


# Funcion para ver los pedidos del usuario actual
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_orders(request):
    user = request.user
    orders = user.order_set.all()
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)

# Funcion para ver si esta entregado el pedido o no
@api_view(['PUT'])
@permission_classes([IsAdminUser])
def delivered(request, pk):
    order = Order.objects.get(pk=pk)
    order.is_delireved = True
    order.delivered_at = datetime.now()
    order.save()
    return Response('Pedido entregado.')