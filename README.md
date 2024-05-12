# MangaSculp
Proyecto de Aplicacion Web

# Dependecias para arrancar el proyecto
Necesitamos git, python y node.js

# Arrancar el backend
git clone https://github.com/Ikari38/MangaSculp.git

cd MangaSculp\MangaSculp

python -m venv env

.\env\Scripts\activate

pip install -r requirements.txt

python manage.py runserver

# Arrancar el frontend
En otro terminal distinto
cd frontend
npm i
npm run dev

Una vez que has arrancado todo, entra a la siguiente url
http://127.0.0.1:5173/

# Inicio Sesion
Para iniciar sesión, puedes usar el siguiente usuario

Usuario: admin@admin.com
Contraseña: admin




# BBDD
Para ver los datos de la base de datos, instalar Dbeaver (Yo uso la version portable)
https://dbeaver.io/download/
Una vez dentro debajo de Archivo, trae un icono de un enchufe
Le das a nueva conexión
Y apartir de ahi buscas la ruta del archivo de mysqlite