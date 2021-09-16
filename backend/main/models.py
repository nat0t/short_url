import datetime
from hashids import Hashids

from django.db import models
from django.conf import settings


class Shorter(models.Model):
    token = models.CharField(max_length=settings.TOKEN_LENGTH, blank=True, unique=True)
    long_url = models.URLField(max_length=2048, blank=False)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField(default=datetime.datetime.now() + datetime.timedelta(days=7))

    def __str__(self):
        return f'{self.token}: {self.long_url}'

    @staticmethod
    def set_token(id: int) -> models.CharField:
        """Set token's value if it's empty."""

        hashids = Hashids(min_length=7, salt=settings.SECRET_KEY)
        token = hashids.encode(id)
        return token

    def save(self, *args, **kwargs):
        if not self.token:
            last = Shorter.objects.all().last()
            pk = last.pk + 1 if last else 1
            self.token = self.set_token(pk)
        super(Shorter, self).save(*args, **kwargs)
