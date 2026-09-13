const fs = require('fs');
const path = require('path');

const enPath = path.join(__dirname, '../lib/i18n/locales/en.json');
const esPath = path.join(__dirname, '../lib/i18n/locales/es.json');

const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const es = JSON.parse(fs.readFileSync(esPath, 'utf8'));

const newKeysEN = {
  "offers_admin": {
    "offer_description": "Offer Description",
    "offer_description_placeholder": "Describe the offer...",
    "e_g_1": "e.g., 1",
    "redemptions_per_user_hint": "How many times one customer can use this offer",
    "redemption_frequency": "Redemption Frequency",
    "pct_off_second_item": "% off second item",
    "valid_from": "Valid From",
    "no_expiration": "No Expiration",
    "redemption_rules": "Redemption Rules",
    "redemption_rule_placeholder": "e.g., One per user per visit",
    "button_label": "Button Label",
    "update_offer": "Update Offer",
    "save_offer": "Save Offer"
  },
  "promos_admin": {
    "total_generated": "Total Generated",
    "customer_upgrades": "Customer Upgrades",
    "influencer_invites": "Influencer Invites",
    "link_type_tabs": "Link Type Tabs",
    "generate_links": "Generate Links",
    "send_pending_invites": "Send Pending Invites",
    "track_invitations": "Track Invitations",
    "search_promos_placeholder": "Search code, email, label...",
    "all_types": "All invitation types",
    "custom_offer": "Custom Offer",
    "all_statuses": "All statuses",
    "active_unused": "Active / Unused",
    "used_claimed": "Used / Claimed",
    "link_code": "Link / Code",
    "type": "Type",
    "target_map": "Target Map",
    "price": "Price",
    "label": "Label",
    "status": "Status",
    "invite": "Invite",
    "copy_claim_url": "Copy full claim URL",
    "copy_code": "Copy code",
    "delete_link": "Delete Invitation Link"
  },
  "rewards_admin": {
    "pts_placeholder": "e.g. 15",
    "title_placeholder": "e.g. PDF Travel Itinerary",
    "reward_desc_placeholder": "Describe what the user gets when unlocking this reward...",
    "pdf_preview": "Preview",
    "remove_pdf": "Remove PDF"
  },
  "reports_admin": {
    "total_sales": "Total Sales",
    "taxes_collected": "Taxes Collected",
    "net_revenue": "Net Revenue",
    "month": "Month",
    "taxes": "Taxes",
    "no_data": "No data",
    "usage_stats": "Platform Usage Statistics",
    "most_viewed_maps": "Most Viewed Maps",
    "map_name": "Map Name",
    "views": "Views",
    "most_opened_places": "Most Opened Places",
    "place_name": "Place Name",
    "opens": "Opens",
    "most_redeemed_offers": "Most Redeemed Offers",
    "offer_title": "Offer Title",
    "redemptions": "Redemptions"
  }
};

const newKeysES = {
  "offers_admin": {
    "offer_description": "Descripción de la oferta",
    "offer_description_placeholder": "Describe la oferta...",
    "e_g_1": "ej., 1",
    "redemptions_per_user_hint": "Cuántas veces un cliente puede usar esta oferta",
    "redemption_frequency": "Frecuencia de canje",
    "pct_off_second_item": "% de descuento en el segundo artículo",
    "valid_from": "Válido desde",
    "no_expiration": "Sin caducidad",
    "redemption_rules": "Reglas de canje",
    "redemption_rule_placeholder": "ej., Uno por usuario por visita",
    "button_label": "Etiqueta del botón",
    "update_offer": "Actualizar oferta",
    "save_offer": "Guardar oferta"
  },
  "promos_admin": {
    "total_generated": "Total generados",
    "customer_upgrades": "Actualizaciones de clientes",
    "influencer_invites": "Invitaciones de influencers",
    "link_type_tabs": "Pestañas de tipo de enlace",
    "generate_links": "Generar enlaces",
    "send_pending_invites": "Enviar invitaciones pendientes",
    "track_invitations": "Rastrear invitaciones",
    "search_promos_placeholder": "Buscar código, correo, etiqueta...",
    "all_types": "Todos los tipos de invitación",
    "custom_offer": "Oferta personalizada",
    "all_statuses": "Todos los estados",
    "active_unused": "Activo / Sin usar",
    "used_claimed": "Usado / Reclamado",
    "link_code": "Enlace / Código",
    "type": "Tipo",
    "target_map": "Mapa de destino",
    "price": "Precio",
    "label": "Etiqueta",
    "status": "Estado",
    "invite": "Invitar",
    "copy_claim_url": "Copiar URL completa de reclamo",
    "copy_code": "Copiar código",
    "delete_link": "Eliminar enlace de invitación"
  },
  "rewards_admin": {
    "pts_placeholder": "ej. 15",
    "title_placeholder": "ej. Itinerario de viaje en PDF",
    "reward_desc_placeholder": "Describe lo que obtiene el usuario al desbloquear esta recompensa...",
    "pdf_preview": "Vista previa",
    "remove_pdf": "Eliminar PDF"
  },
  "reports_admin": {
    "total_sales": "Ventas totales",
    "taxes_collected": "Impuestos recaudados",
    "net_revenue": "Ingresos netos",
    "month": "Mes",
    "taxes": "Impuestos",
    "no_data": "Sin datos",
    "usage_stats": "Estadísticas de uso de la plataforma",
    "most_viewed_maps": "Mapas más vistos",
    "map_name": "Nombre del mapa",
    "views": "Vistas",
    "most_opened_places": "Lugares más abiertos",
    "place_name": "Nombre del lugar",
    "opens": "Aperturas",
    "most_redeemed_offers": "Ofertas más canjeadas",
    "offer_title": "Título de la oferta",
    "redemptions": "Canjes"
  }
};

function deepMerge(target, source) {
  for (const key of Object.keys(source)) {
    if (source[key] instanceof Object && key in target) {
      Object.assign(source[key], deepMerge(target[key], source[key]));
    }
  }
  Object.assign(target || {}, source);
  return target;
}

deepMerge(en, newKeysEN);
deepMerge(es, newKeysES);

fs.writeFileSync(enPath, JSON.stringify(en, null, 2), 'utf8');
fs.writeFileSync(esPath, JSON.stringify(es, null, 2), 'utf8');

console.log('Locales updated successfully!');
