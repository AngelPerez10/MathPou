#!/usr/bin/env bash
# Exit on error
set -o errexit

# Install dependencies
pip install -r requirements.txt

# Collect static files
python manage.py collectstatic --no-input

# Apply database migrations
python manage.py migrate

# Create superuser (solo se ejecutará si no existe)
echo "from django.contrib.auth import get_user_model; User = get_user_model(); User.objects.create_superuser('AngelPerez10', '', 'PEREZA01FL0') if not User.objects.filter(username='AngelPerez10').exists() else None" | python manage.py shell

# Alternativa más robusta (incluye email y otros campos)
echo "
from django.contrib.auth import get_user_model;
User = get_user_model();
if not User.objects.filter(username='AngelPerez10').exists():
    User.objects.create_superuser(
        username='AngelPerez10',
        email='angel@example.com',
        password='PEREZA01FL0',
        first_name='Angel',
        last_name='Perez'
    )
" | python manage.py shell