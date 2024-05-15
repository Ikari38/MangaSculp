from django.db.models import F
from rest_framework import serializers
from . models import Product, Reviews

class ProductSerializer(serializers.ModelSerializer):
    reviews = serializers.SerializerMethodField(read_only=True)
    class Meta:
        model = Product
        fields = "__all__"

    def get_reviews(self,obj):
        reviews = obj.review_set.all()
        serializer = ReviewSerializer(reviews, many=True)
        return serializer.data

class ReviewSerializer(serializers.ModelSerializer):
    avatar = serializers.SerializerMethodField(source='user.avatar.url')
    username = serializers.ReadOnlyField(source='user.name')
    user_last_name = serializers.ReadOnlyField(source='user.last_name')

    class Meta:
        model = Reviews
        fields = "__all__"

    def get_avatar(self, obj):
        return obj.user.avatar.url