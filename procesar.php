<?php
/**
 * Procesador de formularios — Los Martes No Hay Luna
 * Sustituye SECRET_KEY por tu clave secreta de Google reCAPTCHA v3
 * Email de destino: losmartesnohayluna@gmail.com
 */

// ── CONFIGURACIÓN ──────────────────────────────────────
define('RECAPTCHA_SECRET', 'SECRET_KEY');  // ← Pon aquí tu clave secreta
define('EMAIL_DESTINO',    'losmartesnohayluna@gmail.com');
define('EMAIL_ASUNTO',     'Nuevo mensaje desde losmartesnohayluna.com');
define('URL_GRACIAS',      '/gracias/');
define('RECAPTCHA_MIN_SCORE', 0.5);

// ── SEGURIDAD: Solo POST ────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: /');
    exit;
}

// ── HONEYPOT: Si el bot ha rellenado el campo oculto ───
if (!empty($_POST['website'])) {
    // Bot detectado — silenciosamente redirigir a gracias sin enviar
    header('Location: ' . URL_GRACIAS);
    exit;
}

// ── RECAPTCHA v3 VERIFICACIÓN ──────────────────────────
$recaptcha_token = $_POST['g-recaptcha-response'] ?? '';

if (empty($recaptcha_token)) {
    die('Error de seguridad: token reCAPTCHA no recibido.');
}

$recaptcha_response = file_get_contents(
    'https://www.google.com/recaptcha/api/siteverify?secret=' .
    RECAPTCHA_SECRET . '&response=' . urlencode($recaptcha_token)
);

$recaptcha_data = json_decode($recaptcha_response, true);

if (!$recaptcha_data['success'] || $recaptcha_data['score'] < RECAPTCHA_MIN_SCORE) {
    die('Verificación de seguridad fallida. Por favor, inténtalo de nuevo.');
}

// ── RECOGIDA Y SANITIZACIÓN DE CAMPOS ──────────────────
function limpiar($campo) {
    return htmlspecialchars(strip_tags(trim($campo)), ENT_QUOTES, 'UTF-8');
}

$nombre  = limpiar($_POST['nombre']  ?? '');
$email   = filter_var(trim($_POST['email'] ?? ''), FILTER_SANITIZE_EMAIL);
$telefono= limpiar($_POST['telefono'] ?? '');
$empresa = limpiar($_POST['empresa']  ?? '');
$mensaje = limpiar($_POST['mensaje']  ?? '');
$servicio= limpiar($_POST['servicio'] ?? '');
$contacto= limpiar($_POST['contacto'] ?? '');

// ── VALIDACIONES BÁSICAS ────────────────────────────────
if (empty($nombre) || empty($email) || empty($mensaje)) {
    die('Por favor, completa todos los campos obligatorios.');
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    die('El email introducido no es válido.');
}

// ── COMPOSICIÓN DEL EMAIL ──────────────────────────────
$cuerpo = "
=================================================
NUEVO MENSAJE DESDE LOSMARTESNOHAYLUNA.COM
=================================================

NOMBRE:    {$nombre}
EMAIL:     {$email}
TELÉFONO:  {$telefono}
EMPRESA:   {$empresa}
SERVICIO:  {$servicio}
CONTACTO:  {$contacto}

MENSAJE:
-------------------------------------------------
{$mensaje}
-------------------------------------------------

Fecha: " . date('d/m/Y H:i:s') . "
IP: " . ($_SERVER['REMOTE_ADDR'] ?? 'N/A') . "
=================================================
";

$headers = [
    'From: noreply@losmartesnohayluna.com',
    'Reply-To: ' . $email,
    'Content-Type: text/plain; charset=UTF-8',
    'MIME-Version: 1.0',
    'X-Mailer: PHP/' . phpversion(),
];

// ── ENVÍO ───────────────────────────────────────────────
$enviado = mail(
    EMAIL_DESTINO,
    '=?UTF-8?B?' . base64_encode(EMAIL_ASUNTO) . '?=',
    $cuerpo,
    implode("\r\n", $headers)
);

// ── REDIRECCIÓN ─────────────────────────────────────────
if ($enviado) {
    header('Location: ' . URL_GRACIAS);
    exit;
} else {
    die('Error al enviar el mensaje. Por favor, contacta directamente a hola@losmartesnohayluna.com');
}
