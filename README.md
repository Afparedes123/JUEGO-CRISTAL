# 🐱✨ Aventuras de Cristal y los Gatitos Mágicos

Una aplicación web educativa e interactiva diseñada especialmente para **Cristal** (9 años), orientada a apoyar sus habilidades de lectura mediante refuerzo positivo, estimulación multisensorial (auditiva, visual y cinestésica) y la temática de **Gatitos Mágicos**.

---

## 🌟 Características Principales

### 🎙️ Sistema de Voz Inteligente (`window.speechSynthesis`)
- **Voz de Gatita Amigable**: Configurada con tono agudo (*pitch 1.55x*), ritmo pausado y claro (*rate 0.93x*) y selección preferencial de voces femeninas en español.
- **Narración y Diálogo en Vivo**: La gatita guía (Misi) acompaña a Cristal paso a paso con subtítulos en tiempo real y botón de repetición de voz (`🔊 Escuchar`).
- **Control de Voz**: Panel de ajustes para calibrar tono y velocidad de lectura según las necesidades de Cristal.

### 💖 Diseño Accesible para Dificultades de Lectura (Dislexia / Desarrollo Lector)
- **Tipografía de Alta Legibilidad**: Incorpora fuentes diseñadas para reducir errores de inversión y confusión de letras (*Lexend* y *Comic Neue*).
- **Refuerzo Positivo sin Castigos**: Los errores no tienen penalizaciones, tiempos límite estresantes ni sonidos de error negativos; al hacer clic en una consonante, la burbuja simplemente rebota suavemente mientras la gatita recuerda con cariño buscar las vocales.
- **Efectos de Sonido Web Audio API**: Campanitas mágicas para aciertos, rebote jugoso para consonantes, maullidos tiernos y fanfarria de victoria sin necesidad de conexión externa.

---

## 🎮 Niveles del Juego

### 1. Pantalla de Inicio
- Presentación de la gatita guía animada.
- Al pulsar **"¡Empezar a Jugar!"**, la gatita dice en audio:
  > *"¡Hola Cristal! Soy tu nueva amiga gatita. ¡Vamos a jugar y aprender juntas!"*

### 2. Nivel 1: "Atrapa la Vocal"
- Al iniciar, la gatita guía dice:
  > *"Cristal, atrapa solo las vocales, como la A, E, I, O, U"*
- Burbujas flotantes en movimiento suave con letras mayúsculas y minúsculas.
- **Vocal acertada**: La burbuja explota con partículas brillantes (confeti de estrellas), efecto sonoro de campanita y la gatita felicita a Cristal.
- **Consonante**: Rebota suavemente con sonido amable, sin quitar puntos ni penalizaciones.
- **Victoria del Nivel 1**: Al conseguir 5 vocales, la gatita exclama:
  > *"¡Miau! ¡Eres increíble, Cristal! Vamos al siguiente nivel"*
  Se lanzan fuegos artificiales de confeti y se desbloquea el **Nivel 2**.

### 3. Nivel 2: "Alimenta al Minino" (Desbloqueable)
- Al entrar al nivel, la gatita guía dice en audio:
  > *"¡Cristal, los gatitos tienen hambre! ¿Me ayudas a encontrar el plato con la letra correcta?"*
- El gatito pide una letra en un cartel con pistas fonéticas amigables.
- Hay 3 platos de comida con letras diferentes (galletas de pececito, estrellitas, lechita).
- Al hacer clic en el plato correcto, la gatita dice con entusiasmo en audio:
  > *"¡Qué rico! ¡Gracias Cristal!"*
- Lista fija de 5 letras esenciales: **M**, **P**, **S**, **L**, **T**.
- Al completar las 5 letras alimentadas, se reproduce la fanfarria de victoria y se desbloquea el **Nivel 3**.

### 4. Nivel 3: "Saltos en las Nubes" (Desbloqueable)
- Al entrar al nivel, la gatita guía dice en audio:
  > *"Cristal, mira las nubes. Si las juntamos, ¡hacemos magia! Vamos a formar sílabas"*
- Se muestran dos nubes separadas (una consonante y una vocal) y un botón interactivo **"¡Juntar!"**.
- Al presionar el botón, las nubes se fusionan en una gran nube brillante mientras la gatita salta sobre ella y lee la sílaba completa en voz alta:
  > *"¡MA!"*
- Combinaciones fijas: **M+A**, **P+E**, **S+I**, **L+O**, **T+U**.
- Al completar todas las combinaciones, la gatita felicita a Cristal:
  > *"¡Qué inteligente eres, Cristal! Ya casi llegamos a la gran fiesta"*
  y se desbloquea el **Nivel 4**.

### 5. Nivel 4: "La Gran Fiesta de los Gatitos" (Desbloqueable)
- Celebración de lectura donde Cristal completa palabras mágicas (GATO, LUNA, MIAU, SOL, FIESTA).
- Al concluir, Cristal recibe la **Gran Corona de Lectura de Cristal**.

---

## 🛠️ Tecnologías Utilizadas

- **React 18**
- **Tailwind CSS**
- **Vite**
- **Web Speech API** (`SpeechSynthesis`)
- **Web Audio API** (Sintetizador de campanas, pops y maullidos sin dependencias externas)
- **Canvas-Confetti** y **Lucide React**

---

## 🚀 Cómo Ejecutar el Proyecto Localmente

1. Clonar el repositorio:
```bash
git clone https://github.com/Afparedes123/JUEGO-CRISTAL.git
cd JUEGO-CRISTAL
```

2. Instalar dependencias:
```bash
npm install
```

3. Iniciar el servidor de desarrollo:
```bash
npm run dev
```

4. Abrir en el navegador:
`http://localhost:5173`
