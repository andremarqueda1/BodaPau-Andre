# Pau & André · 15 de mayo de 2027

Invitación web de la boda de **Paulina Montes** y **André Villalobos**.
Es una versión reconstruida de la invitación original, con el mismo contenido y fotos, que ahora también se ve bien en escritorio.

- **Sitio:** `index.html` (HTML/CSS/JS estático, sin dependencias ni build)
- **Generador de invitaciones:** `/generador` (crea enlaces personalizados con nombre y número de pases, y los envía por WhatsApp)

## Publicar en Vercel

1. En [vercel.com/new](https://vercel.com/new) importa este repositorio.
2. Framework preset: **Other**. No hace falta comando de build ni directorio de salida.
3. Deploy. Cada push a la rama principal vuelve a publicar el sitio.

## Invitaciones personalizadas

Abre **https://www.bodapauandre.app/generador**:

- **Una invitación:** escribe el nombre, los pases y (opcional) el WhatsApp. Se genera el enlace y un botón para mandarlo por WhatsApp con el mensaje ya escrito.
- **Lista de invitados:** pega la lista desde Excel/Sheets (`nombre, pases, teléfono`), genera todos los enlaces y descárgalos en CSV.

El invitado ve su nombre en el sobre de entrada y un "Pase de entrada" con su número de lugares.
También funcionan enlaces legibles: `/?n=Familia%20López&p=4`.

> Nota: los enlaces no son secretos ni están protegidos; cualquiera que edite la URL puede cambiar el nombre o los pases. El control real de invitados sigue siendo el formulario de confirmación.

## Música

Coloca un archivo `assets/audio/cancion.mp3` (de una canción que tengan derecho a usar). Si existe, aparece el botón de música y suena al abrir la invitación. Por derechos de autor, el MP3 no se incluye en el repositorio (`*.mp3` está en `.gitignore`; para publicarlo quita esa línea).

## Editar contenido

Todo el texto está en `index.html`; los estilos en `assets/css/styles.css`; la fecha de la cuenta regresiva y el archivo de calendario en `assets/js/main.js`.

## Contenido

| Sección | Detalle |
|---|---|
| Ceremonia y recepción | Jardín Nativa, Paso de Las Fuentes, Col. Valle Verde, 62569 Jiutepec, Mor. |
| Itinerario | Ceremonia 1:30 PM · Coctel 3:00 PM · Recepción 4:00 PM · Comida 4:30 PM · Fiesta 6:00 PM · Fin 1:00 AM |
| Hospedaje | Ex Hacienda Santa Cecilia · código **PAUYANDRE** |
| Vestimenta | Garden Formal |
| Confirmación | Formulario de Google |
