// Addons que funcionan en WoW Forever (versión del juego 1.60.1, interfaz 16001).
// Comprobado con las listas de ForeverMastery (31 oct) y Timesaver (3 nov) y la guía de LepreStore.
// Un addon "funciona" si su autor ha subido un archivo para Forever. Puede que alguna función falle.

const ADDONS_FECHA = "6 nov 2026";

// Categorías: [id, nombre, icono]
const ADDON_CATS = [
  ["basico", "Imprescindibles", "inv_misc_book_09"],
  ["misiones", "Misiones y mapa", "inv_misc_map_01"],
  ["combate", "Mazmorras y raids", "achievement_boss_onyxia"],
  ["curar", "Curar", "spell_holy_flashheal"],
  ["oro", "Oro y profesiones", "inv_misc_coin_01"],
  ["interfaz", "Interfaz", "inv_gizmo_02"],
  ["forever", "Hechos para Forever", "inv_misc_note_06"]
];

// Clases que más lo aprovechan (vacío = vale para todas)
// [nombre, categoría, icono, para qué sirve, por qué en Forever, estado ("ok" o "prueba"), clases, ¿imprescindible?]
const ADDONS = [
  ["Questie", "misiones", "inv_misc_note_01", "Te marca en el mapa dónde están las misiones, qué tienes que matar y dónde entregar.", "Del 1 al 60 te ahorra muchísimo tiempo. Las misiones nuevas de Forever pueden tener algún punto mal: fíate del objetivo del juego.", "ok", [], true],
  ["Leatrix Plus", "basico", "inv_misc_wrench_01", "Un montón de opciones pequeñas: reparar solo, vender basura, aceptar misiones más rápido, quitar cosas molestas…", "Baja el archivo que pone «forever», no el de Classic.", "ok", [], true],
  ["Auctionator", "oro", "inv_misc_coin_01", "Buscar y vender en la casa de subastas mucho más rápido, con precios recientes.", "Para vender lo que recoges con tus profesiones y comprar materiales sin perder la tarde.", "ok", [], true],
  ["Pawn", "basico", "inv_chest_plate16", "Te pone una flecha verde cuando un objeto es mejor que el tuyo.", "Subiendo cambias de equipo cada dos por tres. Con esto no tienes que comparar números.", "ok", [], true],
  ["Deadly Boss Mods (DBM)", "combate", "achievement_boss_onyxia", "Avisos y temporizadores de los jefes: «apártate», «viene el fuego»…", "Las raids abren el 9 de diciembre. Instala DBM o BigWigs, no los dos.", "ok", [], true],
  ["ThreatClassic2", "combate", "ability_warrior_defensivestance", "Te dice cuánta amenaza llevas. Si te acercas al tanque, el jefe va a por ti.", "El juego trae una barra de amenaza (busca «Threat» en Opciones), pero esta enseña la de todo el grupo.", "ok", ["cazador", "paladin"], true],
  ["Baganator", "basico", "inv_misc_bag_10", "Todas tus bolsas en una ventana, con buscador y lo que llevan tus otros personajes.", "Necesita Syndicator (se instala junto). Muy útil si tienes alts para profesiones.", "ok", [], false],

  ["TomTom", "misiones", "inv_misc_map_01", "Una flecha en pantalla que te lleva a unas coordenadas (/way).", "Para ir a por mascotas raras o a un sitio exacto de una guía.", "ok", ["cazador"], false],
  ["HandyNotes + WoW Forever", "misiones", "inv_misc_map02", "Marca tesoros y bichos raros de Forever en el mapa.", "El plugin de Forever necesita HandyNotes. Las dos versiones están en pruebas.", "prueba", ["cazador"], false],
  ["Silver Dragon", "misiones", "inv_misc_head_dragon_01", "Suena un aviso cuando hay un bicho raro (élite plateado) cerca.", "Ideal para cazadores: muchas mascotas bonitas son raras (Coldrasp, Mystmane…).", "ok", ["cazador"], false],
  ["RareScanner", "misiones", "inv_misc_spyglass_02", "Detecta raros, tesoros y eventos y los marca en el mapa.", "Tiene versión de Forever en pruebas (beta).", "prueba", ["cazador"], false],
  ["Leatrix Maps", "misiones", "inv_misc_map_01", "Mapa del mundo mejorado: nivel de cada zona y zonas sin explorar.", "Coge el archivo «forever».", "ok", [], false],

  ["BigWigs", "combate", "inv_misc_head_dragon_01", "Avisos de jefes, como DBM pero más ligero.", "Elige uno: DBM o BigWigs.", "ok", [], false],
  ["Details!", "combate", "inv_misc_pocketwatch_01", "Medidor de daño y curación muy completo.", "Opcional: Forever ya trae un medidor de daño.", "ok", [], false],
  ["GTFO", "combate", "spell_fire_fire", "Suena una alarma cuando pisas algo que hace daño (fuego, veneno…).", "Te salva en mazmorras. Muy simple de usar.", "ok", [], false],
  ["AtlasLoot Classic Forever", "combate", "inv_box_01", "Lo que suelta cada jefe de mazmorras y raids.", "Es una versión aparte de la de Classic: busca la que pone Forever.", "ok", [], false],
  ["Attune", "combate", "inv_misc_key_03", "Sigue las cadenas de misiones para entrar a mazmorras y raids.", "Para tenerlo listo antes del 9 de diciembre.", "ok", [], false],

  ["HealBot Continued", "curar", "spell_holy_flashheal", "Marcos de grupo y raid: un clic y curas a quien quieras.", "Para sacerdotes y paladines sagrados. El juego ya trae curar con clic, pero HealBot es más cómodo.", "ok", ["sacerdote", "paladin"], false],
  ["VuhDo", "curar", "spell_holy_renew", "Marcos de raid para curanderos, muy configurables.", "Alternativa a HealBot. Cell no funciona en Forever.", "ok", ["sacerdote", "paladin"], false],
  ["Grid2", "curar", "spell_holy_prayerofhealing02", "Marcos de grupo pequeños y limpios.", "Bájalo de CurseForge: el de GitHub no trae la versión de Forever.", "ok", ["sacerdote", "paladin"], false],
  ["Decursive", "curar", "spell_holy_dispelmagic", "Quita maldiciones, venenos y magia con un clic.", "Para sacerdotes (Disipar) y paladines (Limpiar).", "ok", ["sacerdote", "paladin"], false],

  ["GatherLite", "oro", "trade_herbalism", "Puntos de hierbas, minerales y pesca en el mapa, con rutas.", "Ya trae la lista de puntos, no tienes que descubrirlos tú.", "ok", [], false],
  ["GatherMate2", "oro", "trade_mining", "Guarda las hierbas y minerales que vas encontrando.", "Versión de Forever en pruebas (alpha).", "prueba", [], false],
  ["Altoholic", "oro", "inv_misc_book_11", "Oro, bolsas y profesiones de todos tus personajes en una ventana.", "Si tienes varios alts para profesiones, sabes al momento quién tiene qué.", "ok", [], false],
  ["Better Fishing", "oro", "trade_fishing", "Pescar con una sola tecla.", "Para subir pesca sin volverte loco.", "ok", [], false],

  ["ElvUI", "interfaz", "inv_gizmo_02", "Cambia toda la interfaz por una más moderna.", "No está en CurseForge: se baja de la web de Tukui.", "ok", [], false],
  ["Bartender4", "interfaz", "inv_misc_gear_01", "Barras de acción que puedes mover y cambiar de tamaño.", "El modo edición del juego ya mueve muchas cosas; esto da más control.", "ok", [], false],
  ["Plater", "interfaz", "spell_shadow_charm", "Placas de nombre encima de los enemigos, muy personalizables.", "Útil para ver lanzamientos y amenaza.", "ok", ["paladin"], false],
  ["MoveAny", "interfaz", "inv_misc_wrench_01", "Mueve cualquier ventana o marco del juego.", "Tiene versión «forever».", "ok", [], false],
  ["BugSack", "interfaz", "inv_misc_bag_07", "Guarda los errores de los addons sin que te salten en pantalla.", "Forever esconde los errores; con esto sabes qué addon falla. Necesita BugGrabber.", "ok", [], false],

  ["Forever Quest Pins", "forever", "inv_misc_note_06", "Marca en el mapa las misiones que puedes coger.", "Hecho solo para Forever.", "ok", [], false],
  ["GearQuest Forever", "forever", "inv_chest_chain_05", "Te dice qué mejoras de equipo hay para tu clase y nivel, y dónde se consiguen.", "Hecho solo para Forever. Del 1 al 60.", "ok", [], false],
  ["Books on Map Forever", "forever", "inv_misc_book_09", "Dónde están los libros de las bibliotecas de Forever.", "Es una actividad nueva de Forever.", "ok", [], false],
  ["ForeverAuras", "forever", "spell_holy_innerfire", "Avisos de bufos, debufos y tiempos de espera. Es una copia de WeakAuras.", "WeakAuras no funciona en Forever. Esta sí, pero no todas las auras de WeakAuras se pueden importar.", "prueba", ["cazador", "sacerdote", "paladin"], false]
];

// Lo que ya viene en el juego (no hace falta addon)
const ADDONS_DE_SERIE = [
  ["inv_misc_pocketwatch_01", "Medidor de daño", "Sustituye a Skada y Recount (que no funcionan)"],
  ["spell_holy_borrowedtime", "Gestor de tiempos de espera", "Opciones › Mejoras de juego. Viene apagado"],
  ["ability_warrior_defensivestance", "Barra de amenaza", "Busca «Threat» en Opciones"],
  ["inv_misc_wrench_01", "Modo edición", "Mueve y cambia de tamaño los marcos"],
  ["inv_misc_bag_10", "Bolsas juntas", "Opción de combinar bolsas"],
  ["spell_holy_flashheal", "Curar con clic", "Y te marca lo que puedes disipar"],
  ["inv_chest_plate16", "Gestor de equipo", "Guarda conjuntos de equipo"],
  ["inv_misc_coin_02", "Vender lo gris", "Botón en los vendedores"]
];

// Los que no funcionan y qué usar en su lugar
const ADDONS_ROTOS = [
  ["WeakAuras", "ForeverAuras o el gestor de tiempos de espera del juego"],
  ["OmniCC", "El gestor de tiempos de espera del juego"],
  ["TradeSkillMaster", "Auctionator"],
  ["Spy", "Nada de momento"],
  ["Nova World Buffs", "Nada de momento"],
  ["Cell", "VuhDo, HealBot o Grid2"],
  ["Skada / Recount", "El medidor de daño del juego o Details!"],
  ["Shadowed Unit Frames", "ElvUI"]
];
