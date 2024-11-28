# Generated by Django 5.1.2 on 2024-11-26 01:03

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('reviews', '0022_reviewextra'),
    ]

    operations = [
        migrations.AddField(
            model_name='reviewextra',
            name='manual_is_true_review',
            field=models.BooleanField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='reviewextra',
            name='manual_true_label_attempted',
            field=models.BooleanField(default=False),
        ),
    ]
