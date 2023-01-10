from email.policy import default
from rest_framework.validators import UniqueValidator
from rest_framework import serializers
from django.contrib.auth.models import User
from .models import *


class UserSerializer(serializers.ModelSerializer):

    email = serializers.EmailField(
        required=True,
        validators=[UniqueValidator(queryset=User.objects.all())]
        )

    username = serializers.CharField(
        required=True,
        max_length=32,
        validators=[UniqueValidator(queryset=User.objects.all())]
        )

    first_name = serializers.CharField(
        required=True,
        max_length=32,
        )

    last_name = serializers.CharField(
        required=True,
        max_length=32,
        )

    password = serializers.CharField(
        required=True,
        min_length=8,
        write_only=True
        )

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        instance = self.Meta.model(**validated_data)
        if password is not None:
            instance.set_password(password)
        instance.save()
        return instance

    class Meta:
        model=User
        fields = (
            'username',
            'password',
            'first_name',
            'last_name',
            'email',
            'id'
            )

class ProducerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Producer
        fields = ['email', 'SSN', 'avg_rating','num_pickups']

class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ['id', 'uri', 'header_text', 'body_text', 'produceremail','date_exp','city', 'street', 'state','country','zipcode', 'date_uploaded', 'recieveremail','group_directed', 'complete', 'oldreciever', 'date_finish']

class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ['id', 'header_text', 'body_text', 'useremail', 'number_of_stars', 'date', 'post_id', 'produceremail']


class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ['id', 'useremail', 'date_uploaded', 'admin']

