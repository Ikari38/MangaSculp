# MangaSculp
Proyecto de Aplicacion Web

# Dependecias para arrancar el proyecto
Necesitamos git, python y node.js

Estas son las versiones que he usado

Version python
Python 3.12.3
Version node.js
v20.12.2

# Correccion de errores en windows
Si por algun casual no puedes ejecutar scripts de python en windows
entrar a una powershell con permisos de admin

Este abres los scripts solo a modo local, lo cual es mas seguro, pero puede dar algun error
Set-ExecutionPolicy RemoteSigned

Esta abres paso a todos los scripts de todo el mundo
Set-ExecutionPolicy Unrestricted

Y luego una vez instalado todo, los puedes cerrar de nuevo, para no dejar una brecha de seguridad
Set-ExecutionPolicy Restricted

# Arrancar el backend
git clone https://github.com/Ikari38/MangaSculp.git

cd MangaSculp\MangaSculp

python -m venv env

En windows
.\env\Scripts\activate

En linux
source env/bin/activate

pip install -r requirements.txt

python manage.py runserver

# Arrancar el frontend
En otro terminal distinto

cd frontend

npm install

npm run dev

Una vez que has arrancado todo, entra a la siguiente url
http://127.0.0.1:5173/

# Inicio Sesion
Para iniciar sesiÃ³n, puedes usar el siguiente usuario

Usuario: admin@admin.com
ContraseÃ±a: admin

O si la base de datos esta vacía puedes crearlo tú mismo
python manage.py createsuperuser


# BBDD
Para ver los datos de la base de datos, instalar Dbeaver (Yo uso la version portable)
https://dbeaver.io/download/
Una vez dentro debajo de Archivo, trae un icono de un enchufe
Le das a nueva conexiÃ³n
Y apartir de ahi buscas la ruta del archivo de mysqlite