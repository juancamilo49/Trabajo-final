// seed.js – Inyección de datos con campo "zona" y más relatos curados
// Ejecutar:  node seed.js

const PROJECT_ID = "ciclistas-fantasmas-cf99";
const API_KEY    = "AIzaSyDQjCjijV1TTgnBS3GHX56eTEAQqweYk0U";

const FIRESTORE_URL = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/incidentes?key=${API_KEY}`;

// ─── REPORTES CIUDADANOS (tipo: "reporte") ──
const reportes = [
    { titulo: "Cruce peligroso en San Juan",        relato: "Un vehículo giró sin señalizar y casi golpea a un ciclista que iba por el carril bici. No hay semáforo exclusivo para bicicletas.",                             lat: 6.2480, lng: -75.5740, zona: "Centro" },
    { titulo: "Vehículo invadiendo carril bici",     relato: "Un carro parqueó sobre la ciclorruta de la 70, obligando a los ciclistas a salir al tráfico vehicular.",                                                   lat: 6.2520, lng: -75.5880, zona: "Laureles" },
    { titulo: "Hueco profundo en ciclorruta",        relato: "Bache de más de 30cm en la ciclorruta de la Avenida El Poblado. Muy peligroso de noche.",                                                                  lat: 6.2100, lng: -75.5700, zona: "El Poblado" },
    { titulo: "Taxi cerrando paso",                  relato: "Taxi se atravesó bruscamente para recoger un pasajero. Frené en seco y casi caigo.",                                                                        lat: 6.2442, lng: -75.5650, zona: "Centro" },
    { titulo: "Motociclistas en vía exclusiva",      relato: "Motos circulando a alta velocidad por la ciclorruta del río. Pasan constantemente en las tardes.",                                                          lat: 6.2350, lng: -75.5790, zona: "Río Medellín" },
    { titulo: "Frenada brusca de buseta",            relato: "Buseta frenó sin aviso en la carrera 80. Casi me lleva por delante.",                                                                                       lat: 6.2560, lng: -75.6100, zona: "Carrera 80" },
    { titulo: "Esquina sin visibilidad",             relato: "En la calle 10 con carrera 43A no hay espejo ni señalización. Los carros salen sin ver ciclistas.",                                                         lat: 6.2380, lng: -75.5720, zona: "El Poblado" },
    { titulo: "Punto ciego peligroso",               relato: "Curva cerrada en el puente de la 4 Sur. No se ven los ciclistas que vienen del otro lado.",                                                                 lat: 6.2300, lng: -75.5850, zona: "Envigado" },
    { titulo: "Falta señalización",                  relato: "En la glorieta de Bulerías no hay ninguna señal que indique prioridad ciclista. Todos los días hay conflictos.",                                            lat: 6.2610, lng: -75.5950, zona: "Laureles" },
    { titulo: "Conductor agresivo",                  relato: "Un conductor me gritó e intentó cerrarme el paso por usar la calzada en la Avenida Nutibara.",                                                             lat: 6.2700, lng: -75.5920, zona: "Robledo" },
    { titulo: "Cruce Avenida Oriental",              relato: "Al cruzar la Avenida Oriental, el semáforo para peatones/ciclistas dura solo 8 segundos. Imposible cruzar.",                                               lat: 6.2500, lng: -75.5640, zona: "Centro" },
    { titulo: "Bache tapado por agua",               relato: "Cuando llueve, un bache enorme se llena de agua y es invisible. Ya me caí una vez ahí.",                                                                    lat: 6.2200, lng: -75.5760, zona: "El Poblado" },
];

// ─── RELATOS CURADOS (tipo: "relato") ──
const relatos = [
    {
        titulo: "El Eco de San Juan",
        zona: "Centro",
        lat: 6.2442, lng: -75.5812,
        relato: `La calle San Juan, usualmente un torrente de metal y ruido, guardó un silencio antinatural esa noche. Las luces de sodio teñían el asfalto de un naranja enfermizo. El aire olía a gasolina quemada y a lluvia vieja.

Los testigos hablan de un destello amarillo, una silueta que se movía a contracorriente entre los buses detenidos. No hubo estruendo, solo el chirrido seco de frenos que llegaron demasiado tarde. Un sonido que quedó grabado en la memoria colectiva del barrio.

El conductor siguió su camino. La bicicleta quedó doblada contra el separador como un signo de interrogación de acero. Los vecinos salieron con sus celulares, pero las cámaras de la alcaldía no grababan ese tramo. Nunca graban ese tramo.

Hoy, un fantasma digital recorre esa misma ruta. Una marca de calor invisible que persiste en el servidor. Un recordatorio de que las calles tienen memoria, aunque la ciudad prefiera olvidar. Cada punto en este mapa es una pregunta sin respuesta.`
    },
    {
        titulo: "La Sombra de Laureles",
        zona: "Laureles",
        lat: 6.2530, lng: -75.5960,
        relato: `En la circular primera, donde los árboles forman un túnel oscuro que los ciclistas nocturnos conocen de memoria, ella pedaleaba cada noche a las 11pm. La ruta siempre era la misma: desde la estación Suramericana hasta su casa en la 76.

Conocía cada bache, cada semáforo roto, cada esquina donde los taxis paraban sin avisar. Había desarrollado un sexto sentido para anticipar los peligros de la ciudad dormida. Pero esa noche no pudo anticipar al conductor ebrio que se saltó el semáforo de la glorieta.

El impacto la lanzó seis metros. Su casco se partió en dos. Las luces de su bicicleta siguieron parpadeando sobre el pavimento durante cuarenta minutos hasta que alguien se acercó. Los paramédicos dijeron que el casco le salvó la vida, pero no le salvó los seis meses de rehabilitación.

Ahora hay flores secas atadas al poste del semáforo, y un punto cian en nuestro mapa que late como un corazón que se niega a detenerse. Ella volvió a montar bicicleta. Pero nunca más de noche.`
    },
    {
        titulo: "Frenos Cortos",
        zona: "El Poblado",
        lat: 6.2090, lng: -75.5680,
        relato: `El muchacho de la bicicleta roja no tenía más de 19 años. Bajaba por la loma de Los Balsos a toda velocidad, como lo hacía cada mañana para llegar a tiempo al trabajo en El Poblado. El viento le pegaba en la cara y las manos le sudaban sobre los frenos gastados que nunca tuvo dinero para cambiar.

El camión que subía en sentido contrario no lo vio. O quizás sí lo vio, pero el peso de la carga y la pendiente de la loma hicieron que los frenos del camión fueran tan inútiles como los de la bicicleta. Dos máquinas sin frenos en una ciudad construida sobre montañas.

Los frenos dejaron una marca negra de 4 metros en el pavimento. La bicicleta roja quedó doblada como un origami roto bajo la llanta trasera del camión. Los vecinos cubrieron la mancha con aserrín y flores. Al día siguiente, alguien pintó una bicicleta blanca en la pared del edificio más cercano.

Nadie recuerda su nombre. Todos recuerdan la bicicleta roja. En esta ciudad, los ciclistas mueren dos veces: la primera en el asfalto, la segunda en la memoria de una burocracia que clasifica sus muertes como "accidentes de tránsito menores".`
    },
    {
        titulo: "Ruta Nocturna del Río",
        zona: "Río Medellín",
        lat: 6.2270, lng: -75.5770,
        relato: `Los ciclistas nocturnos del parque lineal del río tienen un pacto silencioso: nunca ir solos. Desde que desapareció la iluminación del tramo entre la estación Industriales y Aguacatala, esa franja de tres kilómetros se convirtió en tierra de nadie.

Tres atracos en una semana. Un ciclista hospitalizado con fractura de cráneo después de que le tiraron una piedra desde el puente. Dos bicicletas robadas a punta de cuchillo. La policía respondió con una patrulla que duró exactamente dos noches antes de ser reasignada a otra zona.

El río sigue corriendo indiferente, arrastrando basura y secretos. Y ellos siguen pedaleando en grupo, con luces delanteras que cortan la oscuridad como bisturíes nerviosos. Se comunican por un grupo de WhatsApp llamado "Fantasmas del Río" donde reportan en tiempo real las condiciones de la ruta.

Han aprendido que la ciudad no los va a proteger. Así que se protegen entre ellos. Cada noche, antes de salir, alguien escribe en el grupo: "¿Quién rueda hoy?". Y siempre hay alguien que responde.`
    },
    {
        titulo: "El Fantasma de la 80",
        zona: "Carrera 80",
        lat: 6.2580, lng: -75.6050,
        relato: `Dicen que en la carrera 80, a la altura del estadio, aparece un reflejo naranja en los espejos retrovisores de los conductores nocturnos. Es el chaleco reflectivo de Andrés, un mensajero en bicicleta que recorría esa avenida seis veces al día, llevando paquetes de un lado a otro de la ciudad.

Andrés conocía cada hueco, cada tapa de alcantarilla suelta, cada tramo donde el asfalto se convertía en una trampa mortal cuando llovía. Tenía 28 años y un hijo de 3. Trabajaba 12 horas diarias sobre dos ruedas porque era la única forma de llevar comida a la mesa.

El bus articulado que lo arrolló en la intersección con la calle 44 no se detuvo. Las cámaras del sistema integrado de transporte captaron el momento exacto: 7:42 de la noche. El semáforo estaba en verde para Andrés. El bus giró sin señalizar.

Su familia puso una bicicleta blanca encadenada al separador vial. Cada noche, alguien le deja una veladora encendida que el viento nunca apaga. Los ciclistas que pasan por ahí tocan el timbre una vez, como un saludo silencioso a un compañero de ruta que ya no puede responder.`
    },
    {
        titulo: "Cicatriz de Asfalto",
        zona: "Envigado",
        lat: 6.2300, lng: -75.5850,
        relato: `La cicatriz mide exactamente 47 centímetros. Cruza el antebrazo izquierdo de Valentina desde la muñeca hasta el codo, una línea rosada que brilla bajo las luces del gimnasio donde ahora hace rehabilitación tres veces por semana.

Fue un espejo retrovisor. El de una camioneta blindada que pasó tan cerca que el metal le abrió el brazo como si fuera papel. Valentina cayó sobre el pavimento y rodó tres metros antes de detenerse contra un poste de luz. El conductor de la camioneta no se detuvo. Los de seguridad privada nunca se detienen.

En el hospital le dijeron que tuvo suerte. Que si el espejo hubiera golpeado dos centímetros más arriba, habría seccionado la arteria. Valentina no se sintió afortunada. Se sintió furiosa. Furiosa con la ciudad que construye ciclorrutas que terminan en la nada. Furiosa con los conductores que ven a los ciclistas como obstáculos. Furiosa con ella misma por haber creído que un chaleco reflectivo y un casco eran suficiente protección contra dos toneladas de metal blindado.

Hoy Valentina lidera un colectivo de ciclistas que documenta las intersecciones más peligrosas de la ciudad. Cada cicatriz, dice ella, es un mapa. Y este mapa es su venganza silenciosa contra el olvido.`
    },
    {
        titulo: "Los Niños de la Ciclorruta",
        zona: "Robledo",
        lat: 6.2700, lng: -75.5920,
        relato: `Todos los días a las 6:30 de la mañana, una fila de siete bicicletas pequeñas recorre la ciclorruta de la avenida Nutibara. Son los niños del barrio Kennedy que van al colegio en Robledo. El mayor tiene 12 años. La menor tiene 7.

Van en fila india, con chalecos reflectivos que les quedan grandes y cascos prestados que nunca son del tamaño correcto. Los guía don Jorge, un señor de 65 años que alguna vez fue ciclista profesional y que ahora dedica sus mañanas a acompañar a estos niños por una ruta que ningún padre se atreve a dejarlos hacer solos.

La semana pasada, un camión de basura ignoró la ciclorruta y los obligó a subirse al andén. La más pequeña se cayó y se raspó las rodillas. Don Jorge le secó las lágrimas con su pañuelo, revisó que la bicicleta estuviera bien, y siguieron adelante. Porque seguir adelante es lo que hacen los ciclistas en esta ciudad.

Nadie les ha construido una ruta segura al colegio. Nadie ha puesto un semáforo en el cruce donde cada mañana se juegan la vida. Pero don Jorge sigue ahí, cada mañana, llueva o truene, pedaleando al frente de su pequeño pelotón de fantasmas que se niegan a ser invisibles.`
    },
    {
        titulo: "Bitácora de la Avenida Oriental",
        zona: "Centro",
        lat: 6.2500, lng: -75.5640,
        relato: `Llevo tres años contando. Tres años anotando en una libreta de pasta negra cada incidente que veo desde mi balcón en el quinto piso del edificio Coltejer, que da directamente a la Avenida Oriental.

El primer año conté 142 incidentes. Ciclistas que se subían al andén para esquivar buses. Motociclistas que invadían el carril bici. Peatones que cruzaban la ciclorruta sin mirar. Carros que abrían las puertas sin fijarse. 142 momentos en los que alguien pudo morir y no murió.

El segundo año fueron 198. La ciclorruta se deterioró y nadie la reparó. Los baches se llenaron de agua sucia. Los ciclistas empezaron a usar la calzada vehicular y los conductores respondieron con bocinas y groserías. Hubo dos hospitalizaciones que yo sepa.

Este año llevo 87 y apenas estamos en mayo. Ayer vi cómo un ciclista fue embestido por un taxi que iba hablando por celular. El ciclista se levantó, recogió su bicicleta torcida, y siguió su camino cojeando. El taxista ni siquiera bajó la ventanilla. Anoté: "Incidente #87. Hora: 18:35. Sin testigos que quieran declarar." Nadie quiere declarar. Todos ven. Nadie habla. Mi libreta es la única testigo fiel.`
    },
];

async function insertDoc(data, tipo) {
    const fields = {
        titulo:      { stringValue: data.titulo },
        relato:      { stringValue: data.relato },
        tipo:        { stringValue: tipo },
        zona:        { stringValue: data.zona || "" },
        imagen_url:  { stringValue: "" },
        coordenadas: {
            mapValue: {
                fields: {
                    lat: { doubleValue: data.lat },
                    lng: { doubleValue: data.lng }
                }
            }
        },
        fecha: { timestampValue: new Date().toISOString() }
    };

    const res = await fetch(FIRESTORE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fields })
    });

    if (!res.ok) {
        const text = await res.text();
        console.error(`Error insertando "${data.titulo}":`, text);
    } else {
        console.log(`✓ [${tipo}] ${data.titulo}`);
    }
}

async function main() {
    console.log("Insertando datos con campo 'zona'…\n");

    for (const r of reportes) await insertDoc(r, 'reporte');
    for (const r of relatos)  await insertDoc(r, 'relato');

    console.log(`\nCompletado: ${reportes.length} reportes + ${relatos.length} relatos = ${reportes.length + relatos.length} documentos.`);
}

main();
