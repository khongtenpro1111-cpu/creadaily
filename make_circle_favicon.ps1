[Reflection.Assembly]::LoadWithPartialName("System.Drawing") | Out-Null

$dir = Get-Location
$srcPath = Join-Path $dir.Path "img\logo\creadaily.png"
$dstPath = Join-Path $dir.Path "img\logo\favicon-round.png"

$srcImg = [System.Drawing.Bitmap]::FromFile($srcPath)
$size = [Math]::Min($srcImg.Width, $srcImg.Height)

$dstImg = New-Object System.Drawing.Bitmap($size, $size)
$g = [System.Drawing.Graphics]::FromImage($dstImg)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias

$path = New-Object System.Drawing.Drawing2D.GraphicsPath
$path.AddEllipse(0, 0, $size, $size)
$g.SetClip($path)

$srcRect = New-Object System.Drawing.Rectangle([int](($srcImg.Width - $size)/2), [int](($srcImg.Height - $size)/2), $size, $size)
$dstRect = New-Object System.Drawing.Rectangle(0, 0, $size, $size)

$g.DrawImage($srcImg, $dstRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)

$g.Dispose()
$srcImg.Dispose()

$dstImg.Save($dstPath, [System.Drawing.Imaging.ImageFormat]::Png)
$dstImg.Dispose()

Write-Host "Circular favicon created successfully!"
