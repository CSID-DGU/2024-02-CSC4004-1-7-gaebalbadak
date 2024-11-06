from django.db import models

class Restaurant(models.Model):
    name = models.CharField(max_length=255)
    location = models.TextField()
    cuisine_type = models.CharField(max_length=100, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class Platform(models.Model):
    name = models.CharField(max_length=100)

class User(models.Model):
    username = models.CharField(max_length=255)
    joined_at = models.DateTimeField(auto_now_add=True)

class Review(models.Model):
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    platform = models.ForeignKey(Platform, on_delete=models.CASCADE)
    rating = models.IntegerField()
    review_text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    sentiment = models.CharField(max_length=20, null=True, blank=True)

class AIScore(models.Model):
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE)
    ai_review_score = models.DecimalField(max_digits=5, decimal_places=2)
    trustworthiness = models.DecimalField(max_digits=5, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
from django.db import models

# Create your models here.
