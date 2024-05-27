from enum import Enum
from django.db import models
from users.models import User

# Create your models here.
class Category(Enum):
    FIGURE = 'figura'
    PLAN = 'plano'

class Product(models.Model):
    slug = models.SlugField(max_length=50, null=True, blank=True)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null= True)
    name = models.CharField(max_length=200, blank=True)
    image = models.ImageField(default='placeholder.png')
    category = models.CharField(max_length=20, choices=[(tag.value, tag.name) for tag in Category])
    description = models.CharField(max_length=200, blank=True)
    rating = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    num_reviews = models.IntegerField(default=0)
    price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    stock = models.IntegerField(default=0)
    created = models.DateTimeField(auto_now_add=True)
    


class Reviews(models.Model):
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null= True)
    rating = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    description = models.CharField(max_length=200, blank=True)
    created = models.DateTimeField(auto_now_add=True)
