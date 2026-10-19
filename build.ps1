# Builds the two deliverables from src/, data/, fonts/ and art/:
#  - Clayface-Weekend-Report.html: one self-contained file. The report markup and the Creator Portal CSVs are
#    encrypted (PBKDF2-SHA256 -> AES-256-CBC + HMAC-SHA256) and open only with the agreed username and password.
#  - dist/dashboard/*.json: {text} documents for the dashboard artifact store (files/<name>); not encrypted, the
#    artifact's sharing controls gate it.
# Usage: .\build.ps1 -User <username> -Password <password> [-Sources <csv dir>]
param(
  [Parameter(Mandatory = $true)][string]$User,
  [Parameter(Mandatory = $true)][string]$Password,
  [string]$Sources = (Join-Path $PSScriptRoot 'data'),
  [string]$Out = (Join-Path $PSScriptRoot 'Clayface-Weekend-Report.html'),
  [int]$Iterations = 600000
)
$ErrorActionPreference = 'Stop'
$src = Join-Path $PSScriptRoot 'src'
$utf8 = New-Object System.Text.UTF8Encoding($false)
$read = { param($p) [IO.File]::ReadAllText($p, $utf8).TrimStart([char]0xFEFF) }
$b64 = { param($p) [Convert]::ToBase64String([IO.File]::ReadAllBytes($p)) }

$catalog = [ordered]@{ hh3_analytics = 'S1'; hh2_analytics = 'S2'; hh3_releases = 'S3'; hh2_releases = 'S4' }
$files = @{
  hh3_analytics = 'hh3_analytics_device.csv'; hh2_analytics = 'hh2_analytics_device.csv'
  hh3_releases = 'hh3_release_notes.csv'; hh2_releases = 'hh2_release_notes.csv'
}

$markup = & $read (Join-Path $src 'markup.html')
$csv = [ordered]@{}
foreach ($id in $catalog.Keys) {
  $path = Join-Path $Sources $files[$id]
  $markup = $markup.Replace("{{HASH_$($catalog[$id])}}", (Get-FileHash -Algorithm SHA256 $path).Hash.ToLower())
  $csv[$id] = & $read $path
}

$fonts = @"
@font-face { font-family: 'Archivo'; font-style: normal; font-weight: 100 900; font-stretch: 62% 125%; font-display: swap; src: url(data:font/woff2;base64,$(& $b64 (Join-Path $PSScriptRoot 'fonts\Archivo-latin.woff2'))) format('woff2'); }
@font-face { font-family: 'Big Shoulders Display'; font-style: normal; font-weight: 100 900; font-display: swap; src: url(data:font/woff2;base64,$(& $b64 (Join-Path $PSScriptRoot 'fonts\BigShouldersDisplay-latin.woff2'))) format('woff2'); }
"@
$art = @"
.ccb .art-hh3 { background-image: url(data:image/jpeg;base64,$(& $b64 (Join-Path $PSScriptRoot 'art\hh3_keyart.jpg'))); }
.ccb .art-hh2 { background-image: url(data:image/jpeg;base64,$(& $b64 (Join-Path $PSScriptRoot 'art\hh2_keyart.jpg'))); }
"@

# Encrypt-then-MAC. Key material is the lower-cased username and the password; gate.js derives the same keys.
$plain = $utf8.GetBytes((@{ markup = $markup; csv = $csv } | ConvertTo-Json -Compress -Depth 4))
$rng = [Security.Cryptography.RandomNumberGenerator]::Create()
$salt = New-Object byte[] 16; $rng.GetBytes($salt)
$iv = New-Object byte[] 16; $rng.GetBytes($iv)
$material = $utf8.GetBytes("$($User.Trim().ToLowerInvariant())`n$Password")
$keys = [Security.Cryptography.Rfc2898DeriveBytes]::new($material, $salt, $Iterations, [Security.Cryptography.HashAlgorithmName]::SHA256).GetBytes(64)
$aesKey = New-Object byte[] 32; [Array]::Copy($keys, 0, $aesKey, 0, 32)
$macKey = New-Object byte[] 32; [Array]::Copy($keys, 32, $macKey, 0, 32)
$aes = [Security.Cryptography.Aes]::Create()
$aes.Mode = 'CBC'; $aes.Padding = 'PKCS7'; $aes.Key = $aesKey; $aes.IV = $iv
$cipher = $aes.CreateEncryptor().TransformFinalBlock($plain, 0, $plain.Length)
$signed = New-Object byte[] ($iv.Length + $cipher.Length)
[Array]::Copy($iv, 0, $signed, 0, $iv.Length); [Array]::Copy($cipher, 0, $signed, $iv.Length, $cipher.Length)
$mac = [Security.Cryptography.HMACSHA256]::new($macKey).ComputeHash($signed)
$vault = "<script type=`"application/octet-stream`" id=`"vault`" data-iter=`"$Iterations`" data-salt=`"$([Convert]::ToBase64String($salt))`" data-iv=`"$([Convert]::ToBase64String($iv))`" data-mac=`"$([Convert]::ToBase64String($mac))`">$([Convert]::ToBase64String($cipher))</script>"

$html = @"
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Clayface Weekend Analytics</title>
<meta name="description" content="Clayface event results for Havoc Hotel 3 and Havoc Hotel 2. Sign-in required.">
<meta name="robots" content="noindex">
<style>
$fonts
html, body { margin: 0; background: #EEF0F2; }
$(& $read (Join-Path $src 'report.css'))
$(& $read (Join-Path $src 'gate.css'))
$art
</style>
</head>
<body>
$(& $read (Join-Path $src 'gate.html'))
$vault
<script>
$(& $read (Join-Path $src 'core.js'))
$(& $read (Join-Path $src 'gate.js'))
</script>
</body>
</html>
"@
[IO.File]::WriteAllText($Out, $html, $utf8)
"Wrote $Out ($([math]::Round((Get-Item $Out).Length / 1KB)) KB, encrypted payload $([math]::Round($cipher.Length / 1KB)) KB)"

# Dashboard artifact variant: same CSS, markup and calculations; data comes from dash.data().
$dash = Join-Path $PSScriptRoot 'dist\dashboard'
New-Item -ItemType Directory -Force $dash | Out-Null
$dashBoot = @"
for (const c of CALCS) dash.calc(c.id, { title: c.title, description: c.description, inputs: c.inputs, fn: c.fn });
const render = createReport(document.getElementById('report'), id => dash.data(id));
dash.onData(render);
let lastWidth = innerWidth;
addEventListener('resize', () => { if (innerWidth !== lastWidth) { lastWidth = innerWidth; render(); } });
"@
$page = @"
<link rel="stylesheet" href="fonts.css">
<link rel="stylesheet" href="art.css">
<style>
$(& $read (Join-Path $src 'report.css'))
</style>
$markup
<script>
$(& $read (Join-Path $src 'core.js'))
$dashBoot
</script>
"@
foreach ($pair in @(@('index.html', $page), @('fonts.css', $fonts), @('art.css', $art))) {
  $json = @{ text = $pair[1] } | ConvertTo-Json -Compress
  [IO.File]::WriteAllText((Join-Path $dash "$($pair[0]).json"), $json, $utf8)
  if ($json.Length -gt 256KB) { throw "$($pair[0]) exceeds 256 KB" }
}
"Wrote dashboard files to $dash"
