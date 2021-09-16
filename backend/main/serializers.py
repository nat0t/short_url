from rest_framework import serializers
from django.conf import settings

from .models import Shorter


class ShorterSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Shorter
        fields = ('id', 'token', 'long_url')

    def validate_token(self, value):
        if value and len(value) < settings.TOKEN_LENGTH:
            raise serializers.ValidationError(f'Token length must be {settings.TOKEN_LENGTH} symbols.')
        return value
