@echo off
echo Updating source files...
echo.
set SOURCE_DIR=C:\Users\Sam\Desktop\Side Projects\_System Files\_Source-Files
set /a TOTAL_FILES=0

echo Copying .cursor folder...
if exist "%SOURCE_DIR%\.cursor" (
    xcopy "%SOURCE_DIR%\.cursor" ".\.cursor\" /E /I /Y >nul
    echo [OK] .cursor folder updated successfully!
    echo.
    set /a TOTAL_FILES+=4
) else (
    echo [ERROR] .cursor folder not found in source directory
    echo.
)

echo Copying Troubleshooting folder...
if exist "%SOURCE_DIR%\Troubleshooting" (
    xcopy "%SOURCE_DIR%\Troubleshooting" ".\Troubleshooting\" /E /I /Y >nul
    echo [OK] Troubleshooting folder updated successfully!
    echo.
    set /a TOTAL_FILES+=2
) else (
    echo [ERROR] Troubleshooting folder not found in source directory
    echo.
)

if exist "%SOURCE_DIR%\diagnostic.md" (
    copy "%SOURCE_DIR%\diagnostic.md" ".\diagnostic.md" /Y >nul
    echo [OK] diagnostic.md updated
    set /a TOTAL_FILES+=1
)

if exist "%SOURCE_DIR%\.cursorrules" (
    copy "%SOURCE_DIR%\.cursorrules" ".\.cursorrules" /Y >nul
    echo [OK] .cursorrules updated
    set /a TOTAL_FILES+=1
)

echo Copying Design Docs folder (excluding TDD.md)...
if exist "%SOURCE_DIR%\Design Docs" (
    xcopy "%SOURCE_DIR%\Design Docs" ".\Design Docs\" /E /I /Y >nul
    if exist ".\Design Docs\TDD.md" del ".\Design Docs\TDD.md" /Q >nul
    echo [OK] Design Docs folder updated (TDD.md excluded)
    echo.
    set /a TOTAL_FILES+=2
)

echo Copying Always.mdc to CLAUDE.md...
if exist "%SOURCE_DIR%\.cursor\rules\Always.mdc" (
    copy "%SOURCE_DIR%\.cursor\rules\Always.mdc" ".\CLAUDE.md" /Y >nul
    echo [OK] CLAUDE.md updated with Always.mdc content
    echo.
    set /a TOTAL_FILES+=1
) else (
    echo [ERROR] Always.mdc not found in source directory
    echo.
)

echo.
echo Source files update completed!
echo Updated on %date% at %time%
echo.
pause
