
from telnetlib import STATUS
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from .serializers import *
from .models import *
from rest_framework import status
from rest_framework import viewsets
from rest_framework import status, generics, mixins
from django.shortcuts import get_object_or_404, render, redirect

from django.views.generic.list import ListView

from django.shortcuts import render


class TestView(APIView):
    def get(self, request, format=None):
        print("API Was Called")
        return Response("You Made It", status=200)

class UserView(APIView):
    def post(self, request, format=None):
        print("Creating a user")

        user_data = request.data
        user_data['is_active'] = False

        user_serializer = UserSerializer(data=user_data)
        if user_serializer.is_valid(raise_exception=False):
            user = user_serializer.save()
            
            return Response(user_serializer.data, status=200)

        else:
            print(user_serializer.errors)

        return Response({"msg":"ERR"}, status=400)


class UserLoginView(APIView):

    def get(self, request, format=None):

        if request.user.is_authenticated == False or request.user.is_active == False:
            return Response("Invalid Credentials", status=403)

        user = UserSerializer(request.user)
        return Response(user.data, status=200)

    def post(self, request, format=None):
        print("Login Class")

        user_obj = User.objects.filter(email=request.data['username']).first() or User.objects.filter(username=request.data['username']).first()

        if user_obj is not None:
            credentials = {
                'username': user_obj.username,
                'password': request.data['password']
            }
            user = authenticate(**credentials)

            if user and user.is_active:
                user_serializer = UserSerializer(user)
                return Response(user_serializer.data, status=200)

        return Response("Invalid Credentials", status=403)


class UserList(viewsets.ViewSet):
    def list(self, request):
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)



class ProducerView(viewsets.ViewSet):
    def list(self, request):
        producers = Producer.objects.all()
        serializer = ProducerSerializer(producers, many=True)
        return Response(serializer.data)

    def create(self, request):

        serializer = ProducerSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ProducerDetails(generics.GenericAPIView, mixins.RetrieveModelMixin, mixins.UpdateModelMixin, mixins.DestroyModelMixin):
    queryset = Producer.objects.all()
    serializer_class = ProducerSerializer
    lookup_fields = "email"

    def get(self, request, pk):
        return self.retrieve(request, email=pk)
    
    def put(self, request, pk):
        return self.update(request, email=pk)
    def delete(self, request, pk):
        return self.destroy(request, email=pk)


class PostView(viewsets.ViewSet):
    def list(self, request):
        posts = Post.objects.all()
        serializer = PostSerializer(posts, many=True)
        return Response(serializer.data)

    def create(self, request):
        print(request)
        serializer = PostSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PostDetails(generics.GenericAPIView, mixins.RetrieveModelMixin, mixins.UpdateModelMixin, mixins.DestroyModelMixin):
    queryset = Post.objects.all()
    serializer_class = PostSerializer

    def get(self, request, pk):
        return self.retrieve(request, pk=pk)
    
    def put(self, request, pk):
        return self.update(request, pk=pk)
    def delete(self, request, pk):
        return self.destroy(request, pk=pk)

class ReviewView(viewsets.ViewSet):
    def list(self, request):
        reviews = Review.objects.all()
        serializer = ReviewSerializer(reviews, many=True)
        return Response(serializer.data)

    def create(self, request):
        print(request)
        serializer = ReviewSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ReviewDetails(generics.GenericAPIView, mixins.RetrieveModelMixin, mixins.UpdateModelMixin, mixins.DestroyModelMixin):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer

    def get(self, request, pk):
        return self.retrieve(request, pk=pk)
    
    def put(self, request, pk):
        return self.update(request, pk=pk)
    def delete(self, request, pk):
        return self.destroy(request, pk=pk)


class GroupView(viewsets.ViewSet):
    def list(self, request):
        groups = Group.objects.all()
        serializer = GroupSerializer(groups, many=True)
        return Response(serializer.data)

    def create(self, request):
        print(request)
        serializer = GroupSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class GroupDetails(generics.GenericAPIView, mixins.RetrieveModelMixin, mixins.UpdateModelMixin, mixins.DestroyModelMixin):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer

    def get(self, request, pk):
        return self.retrieve(request, pk=pk)
    
    def put(self, request, pk):
        return self.update(request, pk=pk)
    def delete(self, request, pk):
        return self.destroy(request, pk=pk)