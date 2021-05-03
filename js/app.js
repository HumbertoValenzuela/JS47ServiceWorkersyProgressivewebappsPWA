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