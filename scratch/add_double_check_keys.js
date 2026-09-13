const fs = require('fs');

const enPath = 'lib/i18n/locales/en.json';
const esPath = 'lib/i18n/locales/es.json';

const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const es = JSON.parse(fs.readFileSync(esPath, 'utf8'));

const newKeys = {
  // Common / General
  "common.target_map": { en: "Target Map", es: "Mapa de destino" },
  "common.view_all": { en: "View All", es: "Ver todo" },
  "common.loading": { en: "Loading...", es: "Cargando..." },
  "common.next_level": { en: "NEXT LEVEL", es: "SIGUIENTE NIVEL" },
  "common.close": { en: "Close", es: "Cerrar" },
  "common.next_slide": { en: "Next slide", es: "Siguiente diapositiva" },
  "common.search_maps": { en: "Search maps...", es: "Buscar mapas..." },

  // Auth toasts
  "auth.logged_out_invite": { en: "Logged out. Please log in with your invited email.", es: "Sesión cerrada. Inicie sesión con su correo electrónico invitado." },
  "auth.no_email_provided": { en: "No email provided", es: "No se proporcionó correo electrónico" },
  "auth.enter_valid_otp": { en: "Please enter a valid 6-digit OTP", es: "Ingrese un OTP válido de 6 dígitos" },
  "auth.registration_failed_no_email": { en: "User registration failed. No email returned.", es: "El registro de usuario falló. No se devolvió correo." },
  "auth.invalid_reset_token": { en: "Invalid or missing reset token.", es: "Token de restablecimiento no válido o faltante." },

  // Explorer & View location
  "explorer.loading_profile": { en: "Loading explorer profile...", es: "Cargando perfil de explorador..." },
  "explorer.profile_unavailable": { en: "Profile unavailable", es: "Perfil no disponible" },
  "location.invalid_coordinates": { en: "Invalid coordinates provided.", es: "Coordenadas proporcionadas no válidas." },

  // Payment
  "payment.verified_redirecting": { en: "Payment verified successfully! Redirecting to your purchased maps...", es: "¡Pago verificado con éxito! Redirigiendo a sus mapas comprados..." },
  "payment.failed": { en: "Payment verification failed.", es: "Error en la verificación del pago." },
  "payment.do_not_close": { en: "Please do not close or refresh this page.", es: "Por favor no cierre ni actualice esta página." },
  "payment.checkout_session_failed": { en: "Failed to initiate checkout session", es: "Error al iniciar la sesión de pago" },
  "payment.checkout_url_failed": { en: "Failed to retrieve checkout URL.", es: "Error al obtener la URL de pago." },

  // Business
  "business.deleted_success": { en: "Business deleted successfully!", es: "¡Empresa eliminada con éxito!" },
  "business.update_status_failed": { en: "Failed to update business status.", es: "Error al actualizar el estado de la empresa." },
  "business.verify_location_failed": { en: "Could not verify this location. Please try another pin.", es: "No se pudo verificar esta ubicación. Pruebe con otro pin." },
  "business.location_cleared": { en: "Location cleared. You can set a new pin.", es: "Ubicación borrada. Puede colocar un nuevo pin." },
  "business.select_country_first": { en: "Please select a Country/Map in Step 1 first.", es: "Por favor seleccione un País/Mapa en el Paso 1 primero." },
  "business.exclusive_offer": { en: "EXCLUSIVE OFFER", es: "OFERTA EXCLUSIVA" },
  "business.invalid_coords": { en: "Invalid coordinates", es: "Coordenadas no válidas" },

  // Promos
  "promos.email_queue_failed": { en: "Links generated, but automatic email invitations failed to queue.", es: "Enlaces generados, pero las invitaciones por correo fallaron al encolarse." },
  "promos.claim_link_copied": { en: "Promo Claim Link copied to clipboard!", es: "¡Enlace de reclamo copiado al portapapeles!" },
  "promos.code_copied": { en: "Promo Code copied!", es: "¡Código de promoción copiado!" },
  "promos.invite_email_sent": { en: "Invitation email sent successfully!", es: "¡Correo de invitación enviado con éxito!" },
  "promos.invite_link_deleted": { en: "Promo invitation link deleted successfully!", es: "¡Enlace de invitación eliminado con éxito!" },
  "promos.no_pending_emails": { en: "No pending links with unsent recipient emails found.", es: "No se encontraron enlaces pendientes con correos sin enviar." },
  "promos.no_links_export": { en: "No links available to export.", es: "No hay enlaces disponibles para exportar." },
  "promos.exported_csv_success": { en: "Promo links exported to CSV successfully!", es: "¡Enlaces exportados a CSV con éxito!" },
  "promos.guest_passes_in_system": { en: "free guest passes in system", es: "pases de invitado gratuitos en el sistema" },

  // Reports
  "reports.total_sales": { en: "Total Sales", es: "Ventas Totales" },
  "reports.map_name": { en: "Map Name", es: "Nombre del Mapa" },
  "reports.place_name": { en: "Place Name", es: "Nombre del Lugar" },
  "reports.offer_title": { en: "Offer Title", es: "Título de la Oferta" },
  "reports.failed_load": { en: "Failed to load reports data.", es: "Error al cargar los datos de los informes." },

  // Maps / Claims / Reviews
  "maps.free_map_claimed": { en: "Free map claimed! Opening your map...", es: "¡Mapa gratuito reclamado! Abriendo su mapa..." },
  "maps.already_redeemed_free": { en: "You have already redeemed your free map.", es: "Ya ha canjeado su mapa gratuito." },
  "maps.unlock_free_first": { en: "Unlock the Free Map award first, then claim a map.", es: "Desbloquee el premio de Mapa Gratuito primero, luego reclame un mapa." },
  "maps.loading_locations": { en: "Loading locations...", es: "Cargando ubicaciones..." },
  "maps.loading_categories": { en: "Loading categories...", es: "Cargando categorías..." },
  "maps.select_map": { en: "Select map", es: "Seleccionar mapa" },
  "maps.missing_location_id": { en: "Location ID is missing", es: "Falta el ID de ubicación" },
  "maps.select_rating": { en: "Please select a rating", es: "Por favor seleccione una calificación" },
  "maps.write_review": { en: "Please write a review", es: "Por favor escriba una reseña" },

  // Places
  "places.geolocation_not_supported": { en: "Geolocation is not supported by your browser", es: "La geolocalización no es compatible con su navegador" },
  "places.allow_location_access": { en: "Allow location access to use Near me", es: "Permita el acceso a la ubicación para usar Cerca de mí" },
  "places.removed_from_favorites": { en: "Removed from favourites", es: "Eliminado de favoritos" },
  "places.upload_in_progress": { en: "Upload in progress. Please wait until saving completes.", es: "Carga en progreso. Por favor espere hasta que se complete el guardado." },
  "places.fill_required_first": { en: "Please fill in all required fields first.", es: "Por favor complete todos los campos requeridos primero." },
  "places.search_places": { en: "Search places...", es: "Buscar lugares..." },

  // Offers
  "offers.fill_required_fields": { en: "Please fill in title, description, and discount type.", es: "Complete el título, la descripción y el tipo de descuento." },
  "offers.add_photo": { en: "Please add a photo for this offer.", es: "Añada una foto para esta oferta." },
  "offers.choose_second_item_type": { en: "Choose whether the second item is free or has a % discount.", es: "Elija si el segundo artículo es gratis o tiene un % de descuento." },
  "offers.valid_discount_value": { en: "Please enter a valid discount value.", es: "Ingrese un valor de descuento válido." },
  "offers.second_discount_range": { en: "Second-item discount must be between 1 and 100.", es: "El descuento del segundo artículo debe estar entre 1 y 100." },
  "offers.duration_minutes_req": { en: "Please enter redemption duration in minutes.", es: "Ingrese la duración del canje en minutos." },
  "offers.redemptions_user_req": { en: "Please enter how many redemptions each user gets.", es: "Ingrese cuántos canjes obtiene cada usuario." },
  "offers.valid_from_req": { en: "Please select a valid from date.", es: "Seleccione una fecha de inicio válida." },
  "offers.valid_until_req": { en: "Select a valid until date, or check No Expiration.", es: "Seleccione una fecha de vencimiento válida o marque Sin Vencimiento." },
  "offers.updated_success": { en: "Offer updated successfully.", es: "Oferta actualizada con éxito." },
  "offers.created_success": { en: "Offer created successfully.", es: "Oferta creada con éxito." },
  "offers.upload_image_file": { en: "Please upload an image file.", es: "Cargue un archivo de imagen." },
  "offers.describe_offer_placeholder": { en: "Describe the offer...", es: "Describa la oferta..." },
  "offers.second_item_free": { en: "Second item is free", es: "El segundo artículo es gratis" },
  "offers.one_time_only": { en: "One-Time Only", es: "Una sola vez" },

  // Profile modal toasts
  "profile.upload_valid_format": { en: "Please upload a JPEG, PNG, or WebP image.", es: "Cargue una imagen JPEG, PNG o WebP." },
  "profile.image_max_size": { en: "Image must be smaller than 5MB.", es: "La imagen debe ser menor a 5 MB." },
  "profile.name_required": { en: "Name is required.", es: "El nombre es obligatorio." },

  // Categories
  "categories.updated_success": { en: "Category updated successfully", es: "Categoría actualizada con éxito" },
  "categories.created_success": { en: "Category created successfully", es: "Categoría creada con éxito" }
};

let addedCount = 0;
for (const [key, val] of Object.entries(newKeys)) {
  if (!en[key]) {
    en[key] = val.en;
    es[key] = val.es;
    addedCount++;
  }
}

fs.writeFileSync(enPath, JSON.stringify(en, null, 2), 'utf8');
fs.writeFileSync(esPath, JSON.stringify(es, null, 2), 'utf8');

console.log(`Added ${addedCount} new synchronized translation keys to en.json and es.json.`);
