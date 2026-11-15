# Run ONLY against disposable BT3 test Compose project. Do not upload tokens.
$ErrorActionPreference = 'Stop'
$base = 'http://localhost:3002'
$compose = @('-p','smartcrm_bt3_clean','-f','compose.yaml','-f','compose.clean-test.yaml')
$adminUser = Read-Host 'Existing admin username (e.g. admin)'
$adminSecure = Read-Host 'Existing admin password' -AsSecureString
$ptr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($adminSecure)
try { $adminPass = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($ptr) }
finally { [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($ptr) }
$secondUser = 'a01_tester'
# Generate a temporary strong password, never print or save it.
$bytes = New-Object byte[] 32
[Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($bytes)
$secondPass = [Convert]::ToBase64String($bytes)
try {
  $loginA = Invoke-RestMethod -Uri "$base/api/auth/login" -Method POST -ContentType 'application/json' -Body (@{username=$adminUser;password=$adminPass}|ConvertTo-Json)
  $headerA = @{Authorization="Bearer $($loginA.token)"}
  $surveys = Invoke-RestMethod -Uri "$base/api/survey-responses" -Headers $headerA
  if (@($surveys).Count -lt 1) { throw 'No owned seed survey visible to admin; check bootstrap.' }
  $id = @($surveys)[0].response_id
  $owned = Invoke-WebRequest -Uri "$base/api/survey-responses/$id" -Headers $headerA -UseBasicParsing
  $env:ADMIN_USERNAME = $secondUser
  $env:ADMIN_PASSWORD = $secondPass
  & docker compose @compose run --rm -e ADMIN_USERNAME -e ADMIN_PASSWORD app node scripts/create-admin.js
  if ($LASTEXITCODE -ne 0) { throw 'Failed to create second test account' }
  $loginB = Invoke-RestMethod -Uri "$base/api/auth/login" -Method POST -ContentType 'application/json' -Body (@{username=$secondUser;password=$secondPass}|ConvertTo-Json)
  $headerB = @{Authorization="Bearer $($loginB.token)"}
  $otherStatus = 0
  try { Invoke-WebRequest -Uri "$base/api/survey-responses/$id" -Headers $headerB -UseBasicParsing -ErrorAction Stop | Out-Null; $otherStatus = 200 }
  catch { if ($_.Exception.Response) { $otherStatus = [int]$_.Exception.Response.StatusCode } else { throw } }
  Write-Host "TC11 | Owner HTTP $([int]$owned.StatusCode) | Other user HTTP $otherStatus | Survey ID $id"
  if ([int]$owned.StatusCode -ne 200 -or $otherStatus -ne 404) { throw 'TC11 FAIL: owner-scope API check' }
  Write-Host 'TC11 PASS - capture this terminal as docs/screenshots/TC11-owner-access.png'
}
finally {
  Remove-Item Env:\ADMIN_PASSWORD -ErrorAction SilentlyContinue
  Remove-Item Env:\ADMIN_USERNAME -ErrorAction SilentlyContinue
  $adminPass = $null; $secondPass = $null
}
