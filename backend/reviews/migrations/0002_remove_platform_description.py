# Generated by Django 5.1.2 on 2024-11-09 09:13

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('reviews', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='platform',
            name='description',
        ),
    ]