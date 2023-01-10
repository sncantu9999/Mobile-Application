from django.urls import path, include
from .views import *

from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register('producers', ProducerView, basename = 'producers')
router.register('posts', PostView, basename = 'posts')
router.register('reviews', ReviewView, basename = 'reviews')
router.register('users', UserList, basename = 'users')
router.register('groups', GroupView, basename = 'groups')


urlpatterns = [
     path('auth/test', TestView.as_view()),
    path('auth/create-user/', UserView.as_view()),
    path('auth/get-user/', UserLoginView.as_view()),
    path('auth/producers/<str:pk>', ProducerDetails.as_view()),
    path('auth/posts/<str:pk>', PostDetails.as_view()),
    path('auth/reviews/<str:pk>', ReviewDetails.as_view()),
    path('auth/groups/<str:pk>', GroupDetails.as_view()),
    path('auth/login-user/', UserLoginView.as_view()),
    path('auth/', include(router.urls)),
]

