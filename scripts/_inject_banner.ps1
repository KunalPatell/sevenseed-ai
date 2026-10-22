$templatePath = "e:\main\apps\sevenseed\sites\_banner_inject_template.txt"
$template = [System.IO.File]::ReadAllText($templatePath)

$ventures = @(
  [pscustomobject]@{ file = "e:\main\apps\sevenseed\sites\avpu\app\index.html"; url = "/avpu/api/health" },
  [pscustomobject]@{ file = "e:\main\apps\sevenseed\sites\decode-forest-pharmacy\app\index.html"; url = "/pharmacy/api/health" },
  [pscustomobject]@{ file = "e:\main\apps\sevenseed\sites\trust\app\index.html"; url = "/trust/api/health" },
  [pscustomobject]@{ file = "e:\main\apps\sevenseed\sites\comonk\app\index.html"; url = "/comonk-ai/api/health" },
  [pscustomobject]@{ file = "e:\main\apps\sevenseed\sites\sevenforce\app\index.html"; url = "/sevenforce/api/health" },
  [pscustomobject]@{ file = "e:\main\apps\sevenseed\sites\breakdown\app\index.html"; url = "/breakdown/api/health" },
  [pscustomobject]@{ file = "e:\main\apps\sevenseed\sites\avp-emart\app\index.html"; url = "/avp-emart/api/health" },
  [pscustomobject]@{ file = "e:\main\apps\sevenseed\sites\sevenseed\app\index.html"; url = "/api/health" }
)

foreach ($v in $ventures) {
  $banner = $template.Replace('{{URL}}', $v.url)
  $content = [System.IO.File]::ReadAllText($v.file)
  $bodyMatch = [System.Text.RegularExpressions.Regex]::Match($content, '<body[^>]*>')
  if (-not $bodyMatch.Success) {
    Write-Host "NO_BODY: $($v.file)"; continue
  }
  $insertAt = $bodyMatch.Index + $bodyMatch.Length
  $newContent = $content.Substring(0, $insertAt) + [System.Environment]::NewLine + $banner + [System.Environment]::NewLine + $content.Substring($insertAt)
  [System.IO.File]::WriteAllText($v.file, $newContent, [System.Text.UTF8Encoding]::new($false))
  Write-Host "DONE: $($v.file)"
}

Write-Host "All done."
