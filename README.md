# League Explorer - App Consumer

Este proyecto es un **ejercicio de aprendizaje** desarrollado mientras se exploraban las capacidades de **Grok Build** (la herramienta de construcción de proyectos de Grok).

## Propósito

Este proyecto fue creado principalmente como un **ejercicio de aprendizaje** para explorar las capacidades de Grok Build.

Los objetivos principales fueron:

- Practicar desarrollo frontend con Angular.
- Experimentar con la integración de APIs reales (especialmente la API de Twitch).
- Explorar el diseño de interfaces con un tema fuerte (League of Legends).
- Probar las capacidades de Grok Build para crear, modificar y estructurar aplicaciones completas a través de conversación.

No se trata de una aplicación lista para producción, sino de un espacio de práctica y experimentación.

## Tecnologías utilizadas

- **Angular 14** (versión con la que se inició el proyecto como ejercicio de aprendizaje)
- **TypeScript**
- **Three.js** (para el cristal 3D en la página principal)
- **SCSS** con un diseño temático de League of Legends
- Integración con la **API de Twitch** (Helix) para streams en vivo

## Funcionalidades actuales

El proyecto cuenta con las siguientes secciones:

- **Home**: Explorador de campeones con efecto 3D (Three.js) y parallax.
- **Regiones**: Lista de servidores de League of Legends con estado simulado y verificación de cliente instalado.
- **En Vivo**: Página para ver streams de League of Legends usando la API real de Twitch + listado de próximos eventos.
- **Comparador de Campeones**: Permite comparar estadísticas entre dos campeones.
- **Mi Perfil**: Página de usuario (con autenticación simulada).
- **Estadísticas**: Datos globales simulados del juego (invocadores activos, distribución de roles, etc.).
- **Autenticación**: Sistema de login, registro y verificación de cuenta (simulado con localStorage).

## Estado del proyecto

Este es un proyecto **en estado de aprendizaje**. Fue desarrollado principalmente para explorar las capacidades de Grok Build y practicar diferentes conceptos de desarrollo frontend.

Por este motivo se mantuvo en **Angular 14**, la versión con la que se generó originalmente el proyecto. El enfoque principal fue experimentar con features (integración de APIs, Three.js, diseño temático, etc.) más que mantener actualizado el framework.

Algunas características importantes:

- Gran parte de los datos son simulados (mock).
- La integración con Twitch requiere que el usuario proporcione su propio Client ID y Access Token.
- No cuenta con backend real.

## Cómo correr el proyecto localmente

```bash
# Instalar dependencias
npm install

# Levantar servidor de desarrollo
ng serve
```

La aplicación estará disponible en `http://localhost:4200`

### Configuración de Twitch (opcional pero recomendada)

Para ver streams reales en la sección **En Vivo**:

1. Crea una aplicación en [Twitch Developers](https://dev.twitch.tv/console/apps)
2. Genera un **App Access Token** (puedes usar [twitchtokengenerator.com](https://twitchtokengenerator.com))
3. En la página `/live`, ingresa tu Client ID y Access Token.

## Aprendizajes

Este proyecto sirvió principalmente para:

- Explorar las capacidades de Grok Build para desarrollar aplicaciones frontend completas.
- Practicar integración con APIs externas desde Angular.
- Trabajar con Three.js dentro de un proyecto Angular.
- Diseñar interfaces con un tema fuerte y coherente.
- Manejar autenticación simulada y estado de usuario.

## Autor

Proyecto creado como ejercicio de aprendizaje utilizando **Grok Build**.

---

> **Nota**: Este repositorio existe principalmente con fines educativos y de exploración de herramientas de IA para desarrollo de software.