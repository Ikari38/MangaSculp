# MangaSculp

## Proyecto de Aplicaci�n Web

### Dependencias para arrancar el proyecto
Necesitamos **git**, **python** y **node.js**.

#### Versiones utilizadas
- **Python**: 3.12.3
- **Node.js**: v20.12.2

#### Correcci�n de errores en Windows
Si por alg�n casual no puedes ejecutar scripts de Python en Windows, entra a una PowerShell con permisos de administrador y ejecuta los siguientes comandos:

   Para abrir los scripts solo a modo local (m�s seguro, pero puede dar alg�n error):
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
cd MangaSculp\MangaSculp
python -m venv env
# En Windows
.\env\Scripts\activate
# En Linux
source env/bin/activate
pip install -r requirements.txt
mkdir dist/static
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

### Inicio de Sesi�n
Para iniciar sesi�n, puedes usar el siguiente usuario:

Usuario: admin@admin.com
Contrase�a: admin

O si la base de datos est� vac�a, puedes crearlo t� mismo ejecutando:

```bash
python manage.py createsuperuser
```

### Base de Datos
Para ver los datos de la base de datos, instala Dbeaver (yo uso la versi�n portable): [Descarga DBeaver](https://dbeaver.io/download/)

Una vez dentro, debajo de Archivo, selecciona un icono de un enchufe. Luego, crea una nueva conexi�n y busca la ruta del archivo de MySQLite.