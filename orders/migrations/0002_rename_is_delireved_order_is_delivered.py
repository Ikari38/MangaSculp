# Generated by Django 5.0.6 on 2024-05-31 06:25

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('orders', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='order',
            old_name='is_delireved',
            new_name='is_delivered',
        ),
    ]
