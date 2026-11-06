// Parches de WoW Forever en español.
// Cada cambio: [fecha, clase, "Nombre en inglés", "Nombre en español", tipo, "qué cambia", icono]
//   tipo: "+" = mejora (buff), "-" = empeora (nerf), "=" = cambio
//   Si el nombre está en la calculadora, el icono y el nombre en español salen solos.
//   El icono es opcional (si falta, se usa el de la clase).
// Fuentes: notas de lanzamiento y hotfixes de Blizzard (recogidas por ForeverChanges).

const PARCHES_FECHAS = {
  "2026-11-03": "Lanzamiento · 3 nov",
  "2026-11-04": "Hotfix · 4 nov",
  "2026-11-05": "Hotfix · 5 nov"
};

const PARCHES_ACTUALIZADO = "5 nov 2026";

const PARCHES = [
  // ---------- Guerrero ----------
  ["2026-11-03", "guerrero", "Two-Handed Weapon Specialization", "Especialización en armas de dos manos", "+", "Daño con dos manos: 1/2/3% → 2/4/6%"],
  ["2026-11-03", "guerrero", "Improved Slam", "Embate mejorado", "+", "Ahora quita 2,5 / 5 s"],
  ["2026-11-03", "guerrero", "Slam", "Embate", "+", "Tiempo de espera 18 → 15 s", "ability_warrior_decisivestrike"],
  ["2026-11-03", "guerrero", "Flurry", "Ráfaga", "+", "Ya no pide Deseo de muerte. 3 rangos: 10/20/30% de velocidad"],
  ["2026-11-03", "guerrero", "Booming Voice", "Voz retumbante", "+", "También abarata Aullido perforador un 5–25%"],
  ["2026-11-03", "guerrero", "Improved Tactical Mastery", "Maestría táctica mejorada", "=", "5 rangos → 3 (5/10/15 de ira)"],
  ["2026-11-03", "guerrero", "Bloodthrill", "Bloodthrill", "=", "5 rangos → 2 (10/20% de Abrumar)"],
  ["2026-11-03", "guerrero", "Bloodthirst", "Sed de sangre", "=", "Ahora pide Deseo de muerte"],
  ["2026-11-03", "guerrero", "Blood Craze", "Locura sangrienta", "=", "Su curación ya no da amenaza"],
  ["2026-11-03", "guerrero", "Reckless Swings", "Reckless Swings", "=", "Talento nuevo: pagas 25% de vida y tus 4 siguientes golpes dan +5 de ira"],
  ["2026-11-03", "guerrero", "Improved Whirlwind", "Torbellino mejorado", "=", "Talento nuevo: −1/−2 s y +15/30% de daño al más cercano"],
  ["2026-11-04", "guerrero", "Defensive Stance", "Actitud defensiva", "+", "Amenaza +30% → +80%", "ability_warrior_defensivestance"],
  ["2026-11-04", "guerrero", "Defiance", "Desafío", "+", "Amenaza 5/10/15% → 7/13/20% (con escudo)"],

  // ---------- Paladín ----------
  ["2026-11-03", "paladin", "Two-Handed Weapon Specialization", "Especialización en armas de dos manos", "+", "También sube el daño Sagrado, hasta 6%"],
  ["2026-11-03", "paladin", "Vengeance", "Venganza", "+", "Se acumula 5 veces (antes 3): hasta 15%"],
  ["2026-11-03", "paladin", "Templar's Bulwark", "Templar's Bulwark", "-", "El escudo ahora es mágico: te lo pueden disipar"],

  // ---------- Cazador ----------
  ["2026-11-03", "cazador", "Aspect of the Hawk", "Aspecto del halcón", "+", "Poder de ataque: hasta 110 (rango 7: 120). Antes 55", "spell_nature_ravenform"],
  ["2026-11-03", "cazador", "Trueshot Aura", "Aura de disparo certero", "+", "Poder de ataque 15–50 → 20–100"],
  ["2026-11-03", "cazador", "Aimed Shot", "Disparo apuntado", "+", "Más daño en todos los rangos", "inv_spear_07"],
  ["2026-11-03", "cazador", "Arcane Shot", "Disparo arcano", "+", "Usa el 15% del poder de ataque (antes 10%) y pega más", "ability_impalingbolt"],
  ["2026-11-03", "cazador", "Serpent Sting", "Picadura de serpiente", "+", "Cada tick usa el 5% del poder de ataque (antes 3%)", "ability_hunter_quickshot"],
  ["2026-11-03", "cazador", "Sniper Shot", "Disparo de francotirador", "+", "Más daño (320 / 450 / 590)", "ability_hunter_snipershot"],
  ["2026-11-03", "cazador", "Barrage", "Tromba", "+", "Vuelve a 5/10/15%"],
  ["2026-11-03", "cazador", "Lightning Reflexes", "Reflejos relámpago", "+", "Vuelve a 3–15% de agilidad"],
  ["2026-11-03", "cazador", "Pets", "Mascotas", "+", "Ya no pierden velocidad de ataque si no tienen habilidades (error arreglado)", "ability_hunter_beasttaming"],
  ["2026-11-03", "cazador", "Hunter's Mark", "Marca del cazador", "=", "Arreglado: el rango 4 da 143 de poder a distancia", "ability_hunter_snipershot"],
  ["2026-11-03", "cazador", "Immolation Trap", "Trampa de inmolación", "-", "Las trampas de fuego y hielo comparten 30 s de espera", "spell_fire_flameshock"],
  ["2026-11-03", "cazador", "Lacerating Strikes", "Lacerating Strikes", "=", "El sangrado nuevo siempre sustituye al viejo"],

  // ---------- Pícaro ----------
  ["2026-11-03", "picaro", "Shank", "Shank", "+", "Habilidad nueva (nivel 24): 50% del arma izquierda, te devuelve 15 de energía", "ability_rogue_shadowstrikes"],
  ["2026-11-03", "picaro", "Deadly Poison", "Veneno mortal", "+", "Poder de ataque 0,45% → 0,9%", "ability_rogue_dualweild"],
  ["2026-11-03", "picaro", "Instant Poison", "Veneno instantáneo", "+", "Poder de ataque 0,5% → 1%", "ability_poisons"],
  ["2026-11-03", "picaro", "Mutilate", "Mutilar", "+", "90% por arma + 40/57/79 (3 rangos)"],
  ["2026-11-03", "picaro", "Opportunity", "Oportunidad", "+", "5 rangos: hasta 20% (antes 10%)"],
  ["2026-11-03", "picaro", "Dual Wield Specialization", "Especialización en ambidiestro", "+", "2 rangos: 25/50% de daño con la izquierda"],
  ["2026-11-03", "picaro", "Flawless Execution", "Flawless Execution", "+", "Eviscerar cuesta 15 menos (antes 10)"],
  ["2026-11-03", "picaro", "Ghostly Strike", "Golpe fantasmal", "=", "Te deja usar Emboscada o Garrote sin sigilo. Pega mucho menos con dagas"],
  ["2026-11-03", "picaro", "Hemorrhage", "Hemorragia", "-", "Pega mucho menos con dagas"],
  ["2026-11-03", "picaro", "Setup", "Preparación", "-", "Puntos de combo 33/66/100% → 15/30/45%"],
  ["2026-11-03", "picaro", "Death Mark", "Death Mark", "=", "Talento nuevo de 31 puntos: guarda daño y lo suelta a los 6 s"],
  ["2026-11-03", "picaro", "Blood Splatter", "Blood Splatter", "=", "Talento nuevo: Ruptura +6 s y Garrote +9 s"],
  ["2026-11-03", "picaro", "Boot Knife", "Boot Knife", "=", "Talento nuevo: Shank puede dar 2 puntos de combo"],
  ["2026-11-03", "picaro", "Flash of Steel", "Flash of Steel", "=", "Talento nuevo: Shank devuelve más energía y sale antes"],
  ["2026-11-03", "picaro", "Quick Getaway", "Quick Getaway", "=", "Talento nuevo: un objetivo más con Aturdir y +30% de velocidad"],
  ["2026-11-03", "picaro", "Composure", "Composure", "=", "Talento nuevo: Poised cuesta 5/10 menos"],
  ["2026-11-03", "picaro", "Seal Fate", "Sellar destino", "=", "3 rangos: 33/66/100%"],
  ["2026-11-03", "picaro", "Lethality", "Letalidad", "=", "2 rangos: 10/20% de daño crítico"],
  ["2026-11-03", "picaro", "Removed", "Fuera del juego", "-", "Quitan Quietus, Murder, Distracción mejorada, Cutthroat y Thousand Cuts", "spell_shadow_sacrificialshield"],

  // ---------- Sacerdote ----------
  ["2026-11-03", "sacerdote", "Power Word: Shield", "Palabra de poder: escudo", "+", "Se puede renovar con un rango igual o mayor", "spell_holy_powerwordshield"],
  ["2026-11-03", "sacerdote", "Shadow Word: Death", "Palabra de las Sombras: muerte", "+", "Si fallas ya no te hace daño", "spell_shadow_demonicfortitude"],
  ["2026-11-03", "sacerdote", "Vampiric Embrace", "Abrazo vampírico", "-", "Su curación ya no puede ser crítica"],
  ["2026-11-03", "sacerdote", "Dark Sacrifice", "Dark Sacrifice", "=", "Ya no rompe el control (error arreglado)"],
  ["2026-11-03", "sacerdote", "Devouring Contagion", "Devouring Contagion", "=", "Ya no se contagia desde bichitos"],

  // ---------- Chamán ----------
  ["2026-11-03", "chaman", "Lightning Bolt", "Descarga de relámpagos", "+", "Mucho más daño (rango 10: +80%) y se lanza antes", "spell_nature_lightning"],
  ["2026-11-03", "chaman", "Chain Lightning", "Cadena de relámpagos", "+", "Rango 4: 119 → 495 de daño. Cuesta más maná y tarda 2,5 s", "spell_nature_chainlightning"],
  ["2026-11-03", "chaman", "Lightning Overload", "Sobrecarga de relámpagos", "+", "3/7/10% → 10/20/30% de lanzarse dos veces"],
  ["2026-11-03", "chaman", "Stormstrike", "Golpe de tormenta", "+", "150% de daño del arma (antes 100%) y espera 6 s (antes 8)"],
  ["2026-11-03", "chaman", "Maelstrom Weapon", "Arma vorágine", "+", "Salta el doble de veces"],
  ["2026-11-03", "chaman", "Mental Dexterity", "Destreza mental", "+", "Poder de ataque: 50/100/150% del intelecto"],
  ["2026-11-03", "chaman", "Flurry", "Ráfaga", "+", "Velocidad 5–25% → 6–30%"],
  ["2026-11-03", "chaman", "Earth Shock", "Choque de tierra", "+", "Un poco más de daño (rangos 1–6)", "spell_nature_earthshock"],
  ["2026-11-03", "chaman", "Flame Shock", "Choque de llamas", "+", "Un poco más de daño inicial (rangos 1–5)", "spell_fire_flameshock"],
  ["2026-11-03", "chaman", "Frost Shock", "Choque de escarcha", "+", "Un poco más de daño en todos los rangos", "spell_frost_frostshock"],
  ["2026-11-03", "chaman", "Call of Thunder", "Llamada del trueno", "=", "Sustituye a Ráfaga de lava (eliminada): +5% crítico a los relámpagos"],
  ["2026-11-03", "chaman", "Lightning Mastery", "Maestría del relámpago", "=", "Maestría elemental cambia de nombre e icono"],
  ["2026-11-03", "chaman", "Totemic Call", "Totemic Call", "=", "Los tótems vienen a ti. Espera 1 min → 30 s"],
  ["2026-11-03", "chaman", "Riptide", "Mareas vivas", "=", "Ahora solo cura con el tiempo, cuesta ~40% menos y espera 12 s", "spell_nature_riptide"],

  // ---------- Mago ----------
  ["2026-11-03", "mago", "Ignite", "Ignición", "+", "También salta con cada tick de Flamestrike"],
  ["2026-11-03", "mago", "Arcane Concentration", "Concentración arcana", "+", "Misiles arcanos vuelven a dar Estado de claridad"],
  ["2026-11-03", "mago", "Missile Barrage", "Tromba de misiles", "=", "Se gasta al empezar Misiles arcanos"],

  // ---------- Brujo ----------
  ["2026-11-03", "brujo", "Wrack", "Wrack", "+", "36 → 86 de daño por segundo a nivel 60"],
  ["2026-11-03", "brujo", "Shadow and Flame", "Sombra y llamas", "+", "Conflagrar y Quemadura de las Sombras: hasta 20% (antes 10%)"],
  ["2026-11-03", "brujo", "Amplify Curse", "Amplificar maldición", "+", "Ahora también vale para Agotamiento y Agonía"],
  ["2026-11-03", "brujo", "Demons", "Demonios", "-", "2 de vida por punto de aguante (antes 7,5)", "spell_shadow_summonfelhunter"],
  ["2026-11-03", "brujo", "Drain Soul", "Drenar alma", "-", "Da fragmentos de alma muchas menos veces (matando sigue dando)", "spell_shadow_haunting"],
  ["2026-11-03", "brujo", "Create Spellstone", "Crear piedra de hechizo", "-", "Solo sube Sombras (antes también Fuego)", "inv_misc_gem_sapphire_01"],

  // ---------- Druida ----------
  ["2026-11-03", "druida", "Starfire", "Fuego estelar", "+", "Un 40% más de daño", "spell_arcane_starfire"],
  ["2026-11-03", "druida", "Dire Bear Form", "Forma de oso temible", "+", "Amenaza +50% → +115%", "ability_racial_bearform"],
  ["2026-11-03", "druida", "Shred", "Triturar", "+", "155% → 200% del arma", "spell_shadow_vampiricaura"],
  ["2026-11-03", "druida", "Claw", "Garra", "+", "110% → 140% del arma", "ability_druid_rake"],
  ["2026-11-03", "druida", "Ravage", "Devastar", "+", "350% → 435% del arma", "ability_druid_ravage"],
  ["2026-11-03", "druida", "Rip", "Destripar", "+", "Destripar, Arañazo, Mordedura feroz y Abalanzarse: ~25% más", "ability_ghoulfrenzy"],
  ["2026-11-03", "druida", "Rend and Tear", "Rend and Tear", "+", "2–10% → 3–15% contra objetivos sangrando"],

  // ---------- General ----------
  ["2026-11-03", "general", "", "Más daño, bichos con más vida", "=", "Las clases pegan más y los bichos de nivel alto aguantan más", "inv_sword_04"],
  ["2026-11-03", "general", "", "Entrenar del 1 al 60", "=", "Cuesta unos 206 de oro en total", "inv_misc_coin_01"],
  ["2026-11-03", "general", "", "Raíces por talento", "-", "Ahora tienen rendimientos decrecientes (Mordedura de escarcha, Atrapar…)", "spell_frost_frostnova"],
  ["2026-11-03", "general", "", "Reaparición", "+", "Los bichos salen antes, sobre todo en zonas de inicio", "spell_holy_resurrection"],
  ["2026-11-03", "general", "", "Mando", "+", "Se puede jugar con mando", "inv_gizmo_02"],
  ["2026-11-03", "general", "", "Placas de nombre", "+", "Se ve si un bicho es élite", "inv_misc_head_dragon_01"],
  ["2026-11-03", "general", "", "Razas", "=", "Estadísticas base arregladas (ej.: Tauren guerrero +5 fuerza)", "achievement_character_tauren_male"],
  ["2026-11-03", "general", "", "No muertos", "+", "Canibalismo y Toque de la tumba funcionan bien", "achievement_character_undead_male"],
  ["2026-11-05", "general", "", "Correr por las llanuras (Tauren)", "-", "Ya no se acumula en la preparación del campo de batalla y se pierde al llevar la bandera", "achievement_character_tauren_male"],
  ["2026-11-05", "general", "", "Bolsas de oficios", "+", "Los vendedores de Zephras venden bolsas de aprendiz", "inv_misc_bag_10"],
  ["2026-11-05", "general", "", "Druidas en Zephras", "+", "Lotheluum Starbreeze ya entrena druidas", "classicon_druid"],
  ["2026-11-05", "general", "", "Misiones atascadas", "+", "Arreglados Yarrog, Pelluk, los múrlocs de Dustwallow y Erland", "inv_misc_note_01"],
  ["2026-11-05", "general", "", "Especias suaves", "-", "Se venden por 1 cobre (antes 2)", "inv_misc_food_wheat_01"]
];
