try {
    Copy-Item -Path .\dist\AdvancedCapture.js $env:Ndz\Chishiki\Scripts\QuickAdd\AdvancedCapture\AdvancedCapture.js -Force
    Write-Host -ForegroundColor Green 'Copied AdvancedCapture.js to Chishiki'
}
catch {
    Write-Host -ForegroundColor Red $_.ErrorDetails.Message
}
try {
    Copy-Item -Path .\dist\AdvancedCSVExport.js $env:Ndz\Chishiki\Scripts\QuickAdd\AdvancedCapture\AdvancedCSVExport.js -Force
    Write-Host -ForegroundColor Green 'Copied AdvancedCSVExport.js to Chishiki'
}
catch {
    Write-Host -ForegroundColor Red $_.ErrorDetails.Message
}
