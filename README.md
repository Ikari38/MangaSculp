# MangaSculp

## Proyecto de Aplicacion Web

### Dependencias para arrancar el proyecto
Necesitamos **git**, **python** y **node.js**.

#### Versiones utilizadas
- **Python**: 3.12.3 [Descargar Python](https://www.python.org/downloads/release/python-3123/)
- **Node.js**: v20.12.2 [Descargar Node.js](https://nodejs.org/en/blog/release/v20.12.2)

#### Versiones compatibles
- **Python**: 3.10.0 o superior (Almenos hasta le version que he utilizado)
- **Node.js**: v16.13.2 o superior (Almenos hasta la version que he utilzado)

#### Correccion de errores en Windows
Si por algun casual no puedes ejecutar scripts de Python en Windows, entra a una PowerShell con permisos de administrador y ejecuta los siguientes comandos:

   Para abrir los scripts solo a modo local (mas seguro, pero puede dar algun error):
   ```powershell
   Set-ExecutionPolicy RemoteSigned
   ```
   Esto abre paso a todos los scripts de todo el mundo
   ```powershell
   Set-ExecutionPolicy Unrestricted
   ```
   Y luego una vez instalado todo, los puedes cerrar de nuevo, para no dejar una brecha de seguridad
   ```powershell
   Set-ExecutionPolicy Restricted
   ```

### Arrancar el backend
```bash
git clone https://github.com/Ikari38/MangaSculp.git
cd MangaSculp
python -m venv env
```
Luego, para activar el entorno virtual el comando es distinto en windows y linux:
### En Windows
```bash
.\env\Scripts\activate
```
### En Linux
```bash
source env/bin/activate
```
### Instalar dependencias del backend y arrancarlo
```bash
pip install -r requirements.txt
mkdir dist/static
```
##### Si por lo que sea no te funciona asi para crear dist/static
```bash
mkdir dist
cd dist
mkdir static
cd ..
```
#### Arrancar el backend
```bash
python manage.py runserver
```

### Arrancar el frontend
En otro terminal distinto, dentro de la carpeta de MangaSculp:
```bash
cd frontend
npm install
npm run dev
```

Una vez que has arrancado todo, entra a la siguiente url: http://127.0.0.1:5173/

### Inicio de Sesion
Para iniciar sesion, puedes usar el siguiente usuario:

Usuario: admin@admin.com
Contraseña: admin

O si la base de datos esta vacia, puedes crearlo tu mismo ejecutando:

```bash
python manage.py createsuperuser
```

### Base de Datos
Para ver los datos de la base de datos, instala Dbeaver (yo uso la version portable): [Descarga DBeaver](https://dbeaver.io/download/)

Una vez dentro, debajo de Archivo, selecciona un icono de un enchufe. Luego, crea una nueva conexion y busca la ruta del archivo de MySQLite.

### Pagos Paypal
Para poder pagar con Paypal, y que se cree correctamente el pedido, Debes meter las credenciales que hay en el archivo paypal.txt.