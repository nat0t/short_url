from rest_framework import mixins
from rest_framework import viewsets, status
from django.http import HttpResponseNotFound, HttpResponseRedirect
import redis
from django.conf import settings
from rest_framework.response import Response

from .models import Shorter
from .serializers import ShorterSerializer


class ShorterView(mixins.CreateModelMixin, mixins.ListModelMixin, mixins.RetrieveModelMixin, viewsets.GenericViewSet):
    queryset = Shorter.objects.all()
    serializer_class = ShorterSerializer

    def create(self, request, *args, **kwargs):
        redis_instance = redis.StrictRedis(host=settings.REDIS_HOST, port=settings.REDIS_PORT, db=0)
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        shorter = Shorter.objects.get(long_url=request.data['long_url'])
        redis_instance.set(shorter.token, shorter.long_url, settings.REDIS_TIMEOUT)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


def redirect_shorted(request, token):
    """Redirect from shorted URL to full URL."""
    redis_instance = redis.StrictRedis(host=settings.REDIS_HOST, port=settings.REDIS_PORT, db=0)
    # Get URL from cache
    cached_url = redis_instance.get(token)
    if cached_url:
        return HttpResponseRedirect(cached_url.decode('utf-8'))
    else:
        try:
            url = Shorter.objects.get(token=token).long_url
            # Add URL to cache
            redis_instance.set(token, url, settings.REDIS_TIMEOUT)
            return HttpResponseRedirect(url)
        except Shorter.DoesNotExist:
            return HttpResponseNotFound('<h1>Page not found</h1>')
