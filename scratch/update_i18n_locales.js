const fs = require('fs');

const enPath = './lib/i18n/locales/en.json';
const esPath = './lib/i18n/locales/es.json';

const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const es = JSON.parse(fs.readFileSync(esPath, 'utf8'));

const newEnKeys = {
  rewards_admin: {
    created_success: "Reward configuration created successfully!",
    updated_success: "Reward configuration updated successfully!",
    failed_save: "Failed to save reward configuration",
    add_new_reward: "Add New Reward",
    edit_reward: "Edit Reward",
    discount_percentage: "Discount Percentage (%)",
    attach_map_optional: "Attach Map (Optional)",
    user_chooses_map: "User chooses map",
    no_map_attached: "No map attached",
    attached_map_file: "Attached Map / File"
  },
  categories_admin: {
    category_name_placeholder: "e.g., Parks & Nature",
    browse_icons: "Browse Icons",
    upload_custom: "Upload Custom",
    more_icons: "More icons ▼",
    less_icons: "Less icons ▲",
    search_icons_placeholder: "Search icons... (e.g. tree, hospital, flag)",
    type_to_search_icons: "Type to search from 200,000+ icons",
    custom_icon_format_hint: "SVG, PNG, JPG, WEBP, GIF — max 5MB",
    custom: "Custom",
    update_category: "Update Category",
    replace: "Replace",
    remove: "Remove"
  },
  business_admin: {
    businesses_selected: "businesses selected"
  },
  offers_admin: {
    select_valid_image: "Please select a valid image file (PNG, JPG, etc.).",
    title_placeholder: "e.g., 20% off Coffee",
    search_by_name: "Search by name...",
    type_name_to_search: "Type a name to search...",
    description_placeholder: "Describe the offer...",
    freq_daily: "Daily (Once per 24 hours)",
    freq_weekly: "Weekly (Once per 7 days)",
    freq_monthly: "Monthly (Once per 30 days)",
    freq_once: "One-Time Only (Once per user)",
    freq_custom: "Custom Duration (Minutes)",
    duration_placeholder: "Duration in minutes (e.g., 60)",
    total_redemption_limit: "Total Redemption Limit (optional)",
    total_limit_hint: "Stops the offer once every customer together reaches this many redemptions",
    bogo_hint: "Customers will see this clearly, e.g. \"Buy 1 Get 1 Free\" or \"Buy 1 Get 1 · 50% off 2nd\".",
    pct_off_second: "% off second item",
    second_item_pct: "Second item has a % discount",
    rule_placeholder: "e.g., One per user per visit"
  },
  places_admin: {
    marker_drag_enabled: "Marker drag enabled. Move it now!",
    select_map_first: "Please select a map first!",
    location_extracted_success: "Location extracted successfully!",
    select_category_first: "Please select a category first!",
    choose_map_placeholder: "Choose a map...",
    select_map_before_adding: "Please select a map before adding a place.",
    cancel_adding_place: "Cancel Adding Place",
    add_place_drop_pin: "Add Place (Drop Pin)",
    upload_in_progress: "Upload in progress. Please wait until saving completes.",
    menu_file_type_error: "Please upload image or PDF files only for menus.",
    fill_required_fields: "Please fill in all required fields.",
    fill_required_fields_first: "Please fill in all required fields first.",
    place_name_placeholder: "e.g., Golden Gate Park",
    choose_business_category: "Choose a business category",
    choose_category: "Choose a category",
    short_desc_placeholder: "Brief description of this place...",
    flat_fee: "flat fee",
    access_desc_placeholder: "e.g., Take Metro Line 2 to Central Station. Exit B. Taxi cost approx $5 from downtown.",
    notes_optional: "Notes (optional)",
    accessibility_notes_placeholder: "Additional accessibility information...",
    tips_placeholder: "List recommended items to bring...",
    description_placeholder: "Write description...",
    features_placeholder: "Top rated, Hidden gems",
    tips_placeholder_map: "Write tips for this map...",
    create_map: "Create Map"
  },
  users_admin: {
    enter_email: "Please enter an email address.",
    invalid_email: "Please enter a valid email address.",
    select_role: "Please select a role.",
    not_allowed_role: "You are not allowed to invite this role.",
    assign_map_editor_error: "Assign at least one map for the Map Editor.",
    invitation_sent_success: "Invitation sent successfully!",
    send_invitation: "Send Invitation",
    user_deleted_success: "User deleted successfully!",
    cannot_change_role: "You cannot change this user's role.",
    not_allowed_assign_role: "You are not allowed to assign this role.",
    user_role_updated_success: "User role updated successfully!",
    user_role_updated_assignments_success: "User role updated with assignments successfully!",
    editor_access_updated_success: "Editor access updated successfully!",
    search_users_placeholder: "Search users...",
    selected: "selected"
  },
  subscriptions_admin: {
    plan_name_placeholder: "e.g. Pro Plan",
    description_placeholder: "Basic access to the platform with limited features.",
    feature_placeholder: "Feature",
    add_plan: "Add New Subscription Plan",
    create_plan: "Create Plan"
  },
  promos_admin: {
    select_target_map: "Please select a target Map.",
    enter_campaign_label: "Please enter a campaign label.",
    price_must_be_positive: "Price must be 0 or positive.",
    enter_recipient_email: "Please enter at least one recipient email.",
    no_valid_emails: "No valid emails found. Please check the format."
  },
  reports_admin: {
    all_time: "All Time",
    today: "Today",
    this_week: "This Week",
    this_month: "This Month",
    last_month: "Last Month"
  }
};

const newEsKeys = {
  rewards_admin: {
    created_success: "¡Configuración de recompensa creada con éxito!",
    updated_success: "¡Configuración de recompensa actualizada con éxito!",
    failed_save: "Error al guardar la configuración de recompensa",
    add_new_reward: "Agregar Nueva Recompensa",
    edit_reward: "Editar Recompensa",
    discount_percentage: "Porcentaje de Descuento (%)",
    attach_map_optional: "Adjuntar Mapa (Opcional)",
    user_chooses_map: "El usuario elige el mapa",
    no_map_attached: "Sin mapa adjunto",
    attached_map_file: "Mapa / Archivo Adjunto"
  },
  categories_admin: {
    category_name_placeholder: "ej., Parques y Naturaleza",
    browse_icons: "Explorar Iconos",
    upload_custom: "Subir Personalizado",
    more_icons: "Más iconos ▼",
    less_icons: "Menos iconos ▲",
    search_icons_placeholder: "Buscar iconos... (ej. árbol, hospital, bandera)",
    type_to_search_icons: "Escribe para buscar entre más de 200,000 iconos",
    custom_icon_format_hint: "SVG, PNG, JPG, WEBP, GIF — máx 5MB",
    custom: "Personalizado",
    update_category: "Actualizar Categoría",
    replace: "Reemplazar",
    remove: "Eliminar"
  },
  business_admin: {
    businesses_selected: "empresas seleccionadas"
  },
  offers_admin: {
    select_valid_image: "Por favor selecciona un archivo de imagen válido (PNG, JPG, etc.).",
    title_placeholder: "ej., 20% de descuento en Café",
    search_by_name: "Buscar por nombre...",
    type_name_to_search: "Escribe un nombre para buscar...",
    description_placeholder: "Describe la oferta...",
    freq_daily: "Diario (Una vez cada 24 horas)",
    freq_weekly: "Semanal (Una vez cada 7 días)",
    freq_monthly: "Mensual (Una vez cada 30 días)",
    freq_once: "Una sola vez (Una vez por usuario)",
    freq_custom: "Duración personalizada (Minutos)",
    duration_placeholder: "Duración en minutos (ej., 60)",
    total_redemption_limit: "Límite Total de Canjes (opcional)",
    total_limit_hint: "Detiene la oferta cuando todos los clientes alcancen esta cantidad de canjes",
    bogo_hint: "Los clientes verán esto claramente, ej. 'Compra 1 Llévate 1 Gratis' o 'Compra 1 Llévate 1 · 50% desc. en el 2º'.",
    pct_off_second: "% de desc. en el segundo artículo",
    second_item_pct: "El segundo artículo tiene un % de descuento",
    rule_placeholder: "ej., Uno por usuario por visita"
  },
  places_admin: {
    marker_drag_enabled: "Arrastre de marcador activado. ¡Muévelo ahora!",
    select_map_first: "¡Por favor selecciona un mapa primero!",
    location_extracted_success: "¡Ubicación extraída con éxito!",
    select_category_first: "¡Por favor selecciona una categoría primero!",
    choose_map_placeholder: "Elige un mapa...",
    select_map_before_adding: "Por favor selecciona un mapa antes de agregar un lugar.",
    cancel_adding_place: "Cancelar Agregar Lugar",
    add_place_drop_pin: "Agregar Lugar (Soltar Pin)",
    upload_in_progress: "Subida en progreso. Por favor espera a que se complete el guardado.",
    menu_file_type_error: "Por favor sube solo archivos de imagen o PDF para los menús.",
    fill_required_fields: "Por favor completa todos los campos requeridos.",
    fill_required_fields_first: "Por favor completa todos los campos requeridos primero.",
    place_name_placeholder: "ej., Parque del Retiro",
    choose_business_category: "Elige una categoría de empresa",
    choose_category: "Elige una categoría",
    short_desc_placeholder: "Breve descripción de este lugar...",
    flat_fee: "tarifa plana",
    access_desc_placeholder: "ej., Toma la Línea 2 del Metro a la Estación Central. Salida B. Taxi aprox $5 desde el centro.",
    notes_optional: "Notas (opcional)",
    accessibility_notes_placeholder: "Información adicional de accesibilidad...",
    tips_placeholder: "Lista de objetos recomendados para llevar...",
    description_placeholder: "Escribe la descripción...",
    features_placeholder: "Los más valorados, Joyas ocultas",
    tips_placeholder_map: "Escribe consejos para este mapa...",
    create_map: "Crear Mapa"
  },
  users_admin: {
    enter_email: "Por favor ingresa una dirección de correo electrónico.",
    invalid_email: "Por favor ingresa un correo electrónico válido.",
    select_role: "Por favor selecciona un rol.",
    not_allowed_role: "No tienes permiso para invitar a este rol.",
    assign_map_editor_error: "Asigna al menos un mapa para el Editor de Mapas.",
    invitation_sent_success: "¡Invitación enviada con éxito!",
    send_invitation: "Enviar Invitación",
    user_deleted_success: "¡Usuario eliminado con éxito!",
    cannot_change_role: "No puedes cambiar el rol de este usuario.",
    not_allowed_assign_role: "No tienes permiso para asignar este rol.",
    user_role_updated_success: "¡Rol de usuario actualizado con éxito!",
    user_role_updated_assignments_success: "¡Rol de usuario actualizado con asignaciones con éxito!",
    editor_access_updated_success: "¡Acceso de editor actualizado con éxito!",
    search_users_placeholder: "Buscar usuarios...",
    selected: "seleccionados"
  },
  subscriptions_admin: {
    plan_name_placeholder: "ej. Plan Pro",
    description_placeholder: "Acceso básico a la plataforma con funciones limitadas.",
    feature_placeholder: "Característica",
    add_plan: "Agregar Nuevo Plan de Suscripción",
    create_plan: "Crear Plan"
  },
  promos_admin: {
    select_target_map: "Por favor selecciona un mapa de destino.",
    enter_campaign_label: "Por favor ingresa una etiqueta de campaña.",
    price_must_be_positive: "El precio debe ser 0 o positivo.",
    enter_recipient_email: "Por favor ingresa al menos un correo de destinatario.",
    no_valid_emails: "No se encontraron correos válidos. Por favor revisa el formato."
  },
  reports_admin: {
    all_time: "Todo el tiempo",
    today: "Hoy",
    this_week: "Esta semana",
    this_month: "Este mes",
    last_month: "El mes pasado"
  }
};

function deepMerge(target, source) {
  for (let key in source) {
    if (typeof source[key] === 'object' && source[key] !== null) {
      if (!target[key]) target[key] = {};
      deepMerge(target[key], source[key]);
    } else {
      target[key] = source[key];
    }
  }
}

deepMerge(en, newEnKeys);
deepMerge(es, newEsKeys);

fs.writeFileSync(enPath, JSON.stringify(en, null, 2), 'utf8');
fs.writeFileSync(esPath, JSON.stringify(es, null, 2), 'utf8');

console.log('Successfully updated en.json and es.json!');
