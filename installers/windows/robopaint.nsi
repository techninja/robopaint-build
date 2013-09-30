; Basic NSIS RoboPaint Installer for Windows
; Compile with: makensis robopaint.nsi

  SetCompressor lzma

; --------------------------------
; Include Modern UI & Windows version checker

  !include "MUI2.nsh"
  !include "WinVer.nsh"

; --------------------------------
; General

  ; Name and file
  Name "RoboPaint ${VERSION}"
  OutFile "..\..\out\Install_RoboPaint-${VERSION}.exe"

  ; Default installation folder
  InstallDir "$PROGRAMFILES\RoboPaint"

  ; Get installation folder from registry if available
  InstallDirRegKey HKCU "Software\RoboPaint" ""

  ; Request application privileges for Windows Vista
  RequestExecutionLevel admin

  BrandingText "RoboPaint Installer - Powered by Llamas"

; --------------------------------
; Interface Settings

  !define MUI_ABORTWARNING

; --------------------------------
; Pages

  !insertmacro MUI_PAGE_LICENSE "license.txt"
  !insertmacro MUI_PAGE_COMPONENTS
  !insertmacro MUI_PAGE_DIRECTORY
  !insertmacro MUI_PAGE_INSTFILES

  !insertmacro MUI_UNPAGE_CONFIRM
  !insertmacro MUI_UNPAGE_INSTFILES

; --------------------------------
; Languages

  !insertmacro MUI_LANGUAGE "English"

; --------------------------------
; Installer Sections

Section "RoboPaint" SecMain
  SetOutPath "$INSTDIR"

  File "..\..\out\windows\ffmpegsumo.dll"
  File "..\..\out\windows\icudt.dll"
  File "..\..\out\windows\libEGL.dll"
  File "..\..\out\windows\libGLESv2.dll"
  File "..\..\out\windows\nw.exe"
  File "..\..\out\windows\nw.pak"
  File "..\..\out\windows\ffmpegsumo.dll"

  ; Store installation folder
  WriteRegStr HKCU "Software\RoboPaint" "" $INSTDIR

  ; Desktop Shortcut!
  createShortCut "$DESKTOP\RoboPaint.lnk" "$INSTDIR\nw.exe"

  ; Create uninstaller
  WriteUninstaller "$INSTDIR\Uninstall.exe"
SectionEnd


Section "EBB Driver" SecDriver
  SetOutPath "$INSTDIR\Driver"

  File "EBB_inf\mchpcdc.cat"
  File "EBB_inf\mchpcdc.inf"

  ExecWait 'pnputil -i -a "$INSTDIR\Driver\mchpcdc.inf"'
SectionEnd


Section "Start Menu Group" SecSM
  CreateDirectory "$SMPROGRAMS\RoboPaint"

  createShortCut "$SMPROGRAMS\RoboPaint\Uninstall RoboPaint.lnk" "$INSTDIR\uninstall.exe"
  createShortCut "$SMPROGRAMS\RoboPaint\RoboPaint.lnk" "$INSTDIR\nw.exe"
SectionEnd

; --------------------------------
; Descriptions

  ; Language strings
  LangString DESC_SecMain ${LANG_ENGLISH} "Installs all the main files for RoboPaint and makes a desktop shortcut!"
  LangString DESC_SecDriver ${LANG_ENGLISH} "The driver file for the EBB board on the WaterColorBot."
  LangString DESC_SecSM ${LANG_ENGLISH} "Creates a Start Menu folder with handy shortcuts for Robopaint and Uninstall."

  ; Assign language strings to sections
  !insertmacro MUI_FUNCTION_DESCRIPTION_BEGIN
    !insertmacro MUI_DESCRIPTION_TEXT ${SecMain} $(DESC_SecMain)
    !insertmacro MUI_DESCRIPTION_TEXT ${SecDriver} $(DESC_SecDriver)
	!insertmacro MUI_DESCRIPTION_TEXT ${SecSM} $(DESC_SecSM)
  !insertmacro MUI_FUNCTION_DESCRIPTION_END

; --------------------------------
; Uninstaller Section

Section "Uninstall"
  Delete "$INSTDIR\Uninstall.exe"
  Delete "$INSTDIR\ffmpegsumo.dll"
  Delete "$INSTDIR\icudt.dll"
  Delete "$INSTDIR\libEGL.dll"
  Delete "$INSTDIR\libGLESv2.dll"
  Delete "$INSTDIR\nw.exe"
  Delete "$INSTDIR\nw.pak"
  Delete "$INSTDIR\ffmpegsumo.dll"

  Delete "$INSTDIR\Driver\mchpcdc.cat"
  Delete "$INSTDIR\Driver\mchpcdc.inf"
  RMDir "$INSTDIR\Driver"
  RMDir "$INSTDIR"

  Delete "$DESKTOP\RoboPaint.lnk"
  Delete "$SMPROGRAMS\RoboPaint\Uninstall RoboPaint.lnk"
  Delete "$SMPROGRAMS\RoboPaint\RoboPaint.lnk"
  RMDir "$SMPROGRAMS\RoboPaint"

  DeleteRegKey /ifempty HKCU "Software\RoboPaint"
SectionEnd

Function .onInit
  ${IfNot} ${AtLeastWinVista}
    MessageBox MB_OK "Sorry, Vista and above required!"
    Quit
  ${EndIf}
FunctionEnd
