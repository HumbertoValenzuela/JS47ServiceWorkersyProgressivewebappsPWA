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

