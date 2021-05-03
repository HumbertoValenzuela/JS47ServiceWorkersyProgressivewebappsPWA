# JS47ServiceWorkersyProgressivewebappsPWA
JS 47. Service Workers y Progressive web apps (PWA)


* 1. Que son los Service Workers
* 2. Generando un Reporte de Lighthouse
app.js

```javascript
// Progresive web application
// rapida - cargan toda la info en menos de 5 segundos
//  Instalable: Se pueden navegar o instalar en tu navegador
// o teléfono móvil como una apicación nátiva
// Soporte offline, funcionan sin conexión a internet

// 1. Que son los Service Workers
// Service Workers
// Es la base de una PWA. Son Scripts que están corriendo
// todo el tiempo detrás de escenas
// Funcionan Offline
// No tiene acceso al DOM
// Carga de forma instantanea
// Puede sincronizar datos en segundo plano o sin interferir
// en la navegación
// Es posible guardar datos en cache

// Funciones no dispinibles en Services Workers
// No soporta window. Utiliza self
// No utiliza document. Utiliza caches 
// No utiliza localStorage( Utiliza fetch)

// 2. Generando un Reporte de Lighthouse
// comenzando - Requisitos: Chrome debe tener Lighthouse
// Tiene categorias: quitar Accessibility, SEO
// Luego presionar el botón reporte. Esto informará
// que se debe mejorar para que sea PWA

// Obligación crear manifest.json
// Llenar con datos obligatorios
// Se añade en el html-head el manifest
// En lighthouse presionar clear y report
// manifest debería estar en verde.
// revisar en chrome - application -manifest
// Se podrá observar los iconos y sus tamaños

// 3. Detectar el soporte de Service Workers
// Revisar en Chrome - application - source sw.js
if( 'serviceWorker' in navigator ) {//Si Soporta
    // Registrarlo
    navigator.serviceWorker.register('./sw.js')
        .then( registrado => console.log('Se instalo correctamente...', registrado))// Retorna un Promise
        .catch(error => console.log('Fallo la instalación...', error))
} else {
    console.log('Service Workers no Soportados');
}
// 4. Instalar y Activar un Service Worker
// Ir al archivo sw.js
```

* manifest.json
```javascript
{
    "name": "APV",
    "short_name": "APV",
    "start_url": "./index.html",    
    "display": "standalone",
    "background_color": "#D41872",
    "theme_color": "#D41872",
    "orientation": "portrait",
    "icons": [
        {
            "src": "img/icons/Icon-72.png",
            "type": "image/png",
            "sizes": "72x72"
          },
          {
            "src": "img/icons/Icon-120.png",
            "type": "image/png",
            "sizes": "120x120"
          },
          {
            "src": "img/icons/Icon-128.png",
            "type": "image/png",
            "sizes": "128x128"
          },
          {
            "src": "img/icons/Icon-144.png",
            "type": "image/png",
            "sizes": "144x144",
            "purpose": "any maskable"
          },
          {
            "src": "img/icons/Icon-152.png",
            "type": "image/png",
            "sizes": "152x152"
          },
          {
            "src": "img/icons/Icon-196.png",
            "type": "image/png",
            "sizes": "196x196",
            "purpose": "any maskable"
          },
          {
            "src": "img/icons/Icon-256.png",
            "type": "image/png",
            "sizes": "256x256"
          },
          {
            "src": "img/icons/Icon-512.png",
            "type": "image/png",
            "sizes": "512x512"
          }
    ]
}
```
* 4. Instalar y Activar un Service Worker
* 6. Cachear Archivos
* 9. Como Realizar nuevas secciones del PWA
* 5. Hacer una PWA Instalable
* 7. Agregar soporte Offline
* 8. Agregar una página de error cuando no hay conexión

sw.js
```javascript
// 4. Instalar y Activar un Service Worker

const nombreCache = 'apv-v3';
// Dio este error: Failed to execute 'Cache' on 'addAll': Request failed
// Solución: Lo que el "punto" hace es ('./index.html'), convertir de una dirección absoluta a una dirección relativa.
// El navegador busca http://127.0.0.1:5500/47-ServiceWorkers-PWA/index.html
// Pero la función cache.addAll lo mira así http://127.0.0.1:5500/index.html
// Lo mismo sucede en el manifest.json "start_url": "./index.html", necesita de una ruta relativa o
// dar la dirección completa explicito http://127.0.0.1:5500/47-ServiceWorkers-PWA/index.html
const archivos = [
    './',
    './index.html',
    './css/bootstrap.css',
    './css/styles.css',
    './js/app.js',
    './js/apv.js',
    './error.html'
];

// evento install, se encarga de instalar
// Solo se ejecuta una vez, es decir, no muestra los console
// Nota: cuando se instala es un buen lugar para cachear ciertos archivos
self.addEventListener('install', e => {
    console.log('Instalando el Service Worker');
    //console.log(e);//al evento que tiene info del service Worker

    // 6. Cachear Archivos
    // Una de los requisitos para que sea PWA, es que la página funcione
    // OffLine, es decir, cuando no tenga internet siga funcionando.
    e.waitUntil(//Esperar hasta que se descarguen todos los archivos de cache
        caches.open(nombreCache)
            .then( cache => {//irlos cacheando
                console.log('cacheando');
                // addAll para agregar un arreglo de archivos
                // Si fuera un archivo entonces add
                return cache.addAll(archivos)//Agregar al cache
                    .then( () => self.skipWaiting())
            })
            .catch(err => console.log('Falló registro de cache', err))
    )
});

// Ir a chrome - application - unregister(para eliminar la instalación)
// Volver a cargar página y volverá a instalar

// Otro evento para Activar el Service Worker
self.addEventListener('activate', e => {
    console.log('Service Worker activado');
    console.log(e);//al evento que tiene info del service Worker
    const cacheWhitelist = [nombreCache]

    // 9. Como Realizar nuevas secciones del PWA
    // Los pasos son: Modificar archivos ej: index.html
    // Luego modificar const nombreCache = 'apv-v2';
    // Actualizar la página
    // Esto borra el antiguo CacheStorage y crea uno nuevo con los nuevos cambios
    e.waitUntil(
        caches.keys()
        .then(cacheNames => {
            return Promise.all(
            cacheNames.map(cacheName => {
                //Eliminamos lo que ya no se necesita en cache
                if (cacheWhitelist.indexOf(cacheName) === -1) {
                return caches.delete(cacheName)
                }
            })
            )
        })
        // Le indica al SW activar el cache actual
        .then(() => self.clients.claim())
    )
})

// Ir a Chrome - Application - skipWaiting
// Al realizar este paso mostrará en la consola de chrome Service Worker activado

// Nota Cuando se activa es un buen lugar para nuevas versiones de 
// nuestra PWA

// 5. Hacer una PWA Instalable
// Requisitos. manifest valido, dominio https o localhost, registrado
// el addEventListener de fetch

// 7. Agregar soporte Offline: Mostrar los archivos que tenemos en cache. Para una carga rápida
// Evento fetch para descargar archivos estáticos
self.addEventListener('fetch', e => {
    console.log('Fetch...', e)

    e.respondWith(//Dale esta respuesta, una vez que este haciendo el fetch
        caches.match(e.request)//Identicar el request(Pedido)
            // Revisa lo que esta en cache, si es igual entonces cargar el cache
            .then( respuestaCache => {
                if (respuestaCache) {
                    //recuperar del cache
                    return respuestaCache
                  }
                  //recuperar de la petición a la url
                  return fetch(e.request)
            })
            // 8. Agregar una página de error cuando no hay conexión
            // Algo que no se a cacheado muestra el catch
            // Agregar en el objeto archivos el error.html
            .catch( () => {
                return caches.match('./error.html')
            })
    )
})

// da error al colocar "start_url": "index.html"
// "start_url": "http://127.0.0.1:5500/47-ServiceWorkers-PWA/index.html",
// Al terminar hasta el punto 5. Aparece en chrome el boton de instalar
```
