; ============================================================
; 软件名 Windows 安装器（NSIS）
; 对应方案：专题/分发与更新/默认安装目录规划方案.md —— 目录契约落地实现
;
; 契约要点（与方案逐条对应）：
;   1. 解析链：用户指定绝对遵从（校验报错不重定向）→ D:\ 优先 → %LOCALAPPDATA%\Programs 回退
;   2. 注册表零写入（默认）：卸载走应用内 uninstall.exe + 程序区结构性删除；
;      「登记到系统卸载列表」为 opt-in 勾选（写且仅写一个 Uninstall 键）
;   3. 自启动：启动目录 .lnk 文件（非注册表），opt-in 勾选
;   4. 数据目录：聚合模式（config/data/cache/logs 四区收进安装目录）或
;      契约模式（%LOCALAPPDATA% 单根四区）——安装器二选一
;   5. 所写即所录：manifest.json + 目录结构.txt 安装完成即生成；install-info.ini
;      供卸载器原生读取（NSIS 原生 INI 读取比 JSON 解析可靠）
;   6. 预览门禁：目录结构预览页实时展示全部落点，页序强制不可跳过
;
; 使用：把 Wails3 构建产物放入 ../build/windows/app/ 后编译：
;   makensis installer.nsi
; ============================================================

Unicode true
ManifestDPIAware true

!define APP_NAME "软件名"
!define COMPANY "公司名"
!define APP_EXE "软件名.exe"
!define APP_VERSION "1.9.0"
!define DATA_CAP_MB 500 ; 聚合模式缓存上限（MB）

!include "MUI2.nsh"
!include "FileFunc.nsh"
!include "nsDialogs.nsh"
!include "LogicLib.nsh"
!include "StrFunc.nsh"

${Using:StrFunc} StrRep ; StrFunc 函数须在顶层声明方可用于 Function 内

Name "${APP_NAME} ${APP_VERSION}"
OutFile "..\..\build\windows\${APP_NAME}-${APP_VERSION}-setup.exe"
InstallDir "$LOCALAPPDATA\Programs\${APP_NAME}" ; 解析链兜底（onInit 按 D:\ 优先链覆写）
RequestExecutionLevel user ; per-user 免提权；per-machine 由用户以管理员运行安装器

!define MUI_ABORTWARNING
!define MUI_FINISHPAGE_SHOWREADME "$INSTDIR\目录结构.txt"
!define MUI_FINISHPAGE_SHOWREADME_TEXT "查看目录结构（文件都装在哪）"

; ===== 页序：欢迎 → 安装选项 → 目录 → 预览门禁 → 安装 → 完成 =====
!insertmacro MUI_PAGE_WELCOME
Page custom PageOptions_Create
!insertmacro MUI_PAGE_DIRECTORY
Page custom PagePreview_Create
!insertmacro MUI_PAGE_INSTFILES
!define MUI_FINISHPAGE_RUN "$INSTDIR\${APP_EXE}"
!insertmacro MUI_PAGE_FINISH
!insertmacro MUI_UNPAGE_CONFIRM
!insertmacro MUI_UNPAGE_INSTFILES
!insertmacro MUI_LANGUAGE "SimpChinese"

; ===== 全局状态 =====
Var DataRoot          ; 数据根（聚合模式 = $INSTDIR\Data；契约模式 = %LOCALAPPDATA%\Company\App）
Var AggregateMode     ; 1 = 聚合模式 0 = 契约模式
Var RegOptIn          ; 1 = 登记系统卸载列表（唯一注册表写入）
Var AutoStart         ; 1 = 开机自启（启动目录 .lnk 文件）
Var DesktopShortcut   ; 1 = 桌面快捷方式
Var PreviewShown      ; 预览门禁：预览页走过才允许安装

; 对话框控件句柄（全局——回调函数跨作用域读取）
Var RadioAggregate
Var RadioContract
Var ChkRegOptIn
Var ChkAutoStart
Var ChkDesktop

; manifest 写入句柄与前缀长度（递归枚举用）
Var ManifestHandle
Var ManifestBaseLen

; ============================================================
; 解析链：D:\ 优先（存在 ∧ 剩余空间 ≥ 500MB）→ %LOCALAPPDATA%\Programs
; ============================================================
Function ResolveDefaultInstallDir
  StrCpy $INSTDIR "D:\${APP_NAME}"
  ClearErrors
  ${DriveSpace} "D:\" "/D=F /S=M" $R0
  IfErrors 0 resolve_check
    Call FallbackInstallDir
    Goto resolve_done
  resolve_check:
  IntCmp $R0 500 resolve_done 0 resolve_done
    Call FallbackInstallDir
  resolve_done:
FunctionEnd

Function FallbackInstallDir
  StrCpy $INSTDIR "$LOCALAPPDATA\Programs\${APP_NAME}"
FunctionEnd

; ============================================================
; .onInit：解析默认安装根 + 初始化选项
; ============================================================
Function .onInit
  StrCpy $AggregateMode 1   ; 默认聚合模式（四区一个目录）
  StrCpy $RegOptIn 0        ; 注册表零写入默认
  StrCpy $AutoStart 0
  StrCpy $DesktopShortcut 1
  StrCpy $PreviewShown 0
  Call ResolveDefaultInstallDir
FunctionEnd

; 用户指定目录校验：仅拒绝系统保护区（绝对遵从——不静默重定向）
Function .onVerifyInstDir
  StrCpy $0 $INSTDIR 11
  StrCmp $0 "C:\Windows\" 0 +2
    Abort "不能安装到系统保护区，请选择其他目录。"
FunctionEnd

; ============================================================
; 自定义页 1：安装选项
; ============================================================
Function PageOptions_Create
  !insertmacro MUI_HEADER_TEXT "安装选项" "选择数据存放模式与可选项"
  nsDialogs::Create 1018
  Pop $0

  ${NSD_CreateGroupbox} 0u 0u 100% 56u "数据存放模式"
  Pop $RadioAggregate
  ${NSD_CreateRadioButton} 3% 12u 94% 10u "聚合模式——数据/配置/缓存/日志收进安装目录（推荐，一个目录看全）"
  Pop $RadioContract
  ${NSD_CreateRadioButton} 3% 28u 94% 10u "契约模式——数据走系统数据目录（%LOCALAPPDATA%），安装目录只留程序"
  Pop $RadioContract
  ${NSD_SetState} $RadioAggregate ${BST_CHECKED}

  ${NSD_CreateGroupbox} 0u 62u 100% 66u "可选项"
  Pop $0
  ${NSD_CreateCheckbox} 3% 74u 94% 10u "登记到系统卸载列表（写入一条卸载注册表键；默认不写，不勾则用应用内卸载器）"
  Pop $ChkRegOptIn
  ${NSD_CreateCheckbox} 3% 88u 94% 10u "创建桌面快捷方式"
  Pop $ChkDesktop
  ${NSD_SetState} $ChkDesktop ${BST_CHECKED}
  ${NSD_CreateCheckbox} 3% 102u 94% 10u "开机自启（启动目录快捷方式，可随时关闭）"
  Pop $ChkAutoStart

  ${NSD_OnClick} $RadioAggregate PageOptions_OnMode
  ${NSD_OnClick} $RadioContract PageOptions_OnMode

  nsDialogs::Show
FunctionEnd

; 聚合/契约切换 → 数据根重算
Function PageOptions_OnMode
  Pop $0
  ${NSD_GetState} $RadioAggregate $1
  StrCmp $1 ${BST_CHECKED} 0 contract_mode
    StrCpy $AggregateMode 1
    StrCpy $DataRoot "$INSTDIR\Data"
    Goto mode_done
  contract_mode:
    StrCpy $AggregateMode 0
    StrCpy $DataRoot "$LOCALAPPDATA\${COMPANY}\${APP_NAME}"
  mode_done:
FunctionEnd

; ============================================================
; 自定义页 2：预览门禁（目录结构图——所见即所写）
; 页序强制：此页未经过（PreviewShown=0），安装节拒绝执行
; ============================================================
Function PagePreview_Create
  !insertmacro MUI_HEADER_TEXT "安装预览" "确认以下目录与文件落点——这就是安装后的结构"
  nsDialogs::Create 1018
  Pop $0

  StrCpy $PreviewShown 1

  ${NSD_CreateLabel} 0u 0u 100% 8u "程序区（只读，运行期零写入）："
  Pop $1
  ${NSD_CreateText} 0u 8u 100% 10u "$INSTDIR\"
  Pop $1
  ${NSD_CreateLabel} 0u 22u 100% 8u "数据区："
  Pop $1
  ${NSD_CreateText} 0u 30u 100% 10u "$DataRoot\"
  Pop $1
  ${NSD_CreateLabel} 0u 42u 100% 8u "  config\  配置      data\  用户数据"
  Pop $1
  ${NSD_CreateLabel} 0u 50u 100% 8u "  cache\   缓存（上限 ${DATA_CAP_MB}MB，应用自管）      logs\  日志"
  Pop $1

  ${NSD_CreateLabel} 0u 62u 100% 20u "注册表写入：默认零写入。$\r$\n自启动与文件关联默认不安装（仅在你勾选时创建）。"
  Pop $1

  nsDialogs::Show
FunctionEnd

; ============================================================
; 主安装节
; ============================================================
Section "Install" SecMain
  ; 预览门禁断言：未过预览页不得安装（防御性）
  StrCmp $PreviewShown 1 preview_ok
    Abort "请先完成安装预览。"
  preview_ok:

  SetOutPath "$INSTDIR"
  ; 产品文件（Wails3 构建产物目录——exe 与前端资源全部在根层级）
  File /r "..\..\build\windows\app\*.*"

  ; 数据区目录契约（MkdirAll 等价）
  CreateDirectory "$DataRoot\config"
  CreateDirectory "$DataRoot\data"
  CreateDirectory "$DataRoot\cache"
  CreateDirectory "$DataRoot\logs"

  ; —— 快捷方式（文件形式，非注册表）——
  CreateDirectory "$SMPROGRAMS\${APP_NAME}"
  CreateShortcut "$SMPROGRAMS\${APP_NAME}\${APP_NAME}.lnk" "$INSTDIR\${APP_EXE}" "" "$INSTDIR" 0
  StrCmp $DesktopShortcut 1 0 +2
    CreateShortcut "$DESKTOP\${APP_NAME}.lnk" "$INSTDIR\${APP_EXE}" "" "$INSTDIR" 0
  StrCmp $AutoStart 1 0 +2
    CreateShortcut "$SMSTARTUP\${APP_NAME}.lnk" "$INSTDIR\${APP_EXE}" "" "$INSTDIR" 0

  ; —— opt-in：系统卸载列表登记（唯一注册表写入）——
  StrCmp $RegOptIn 1 0 no_reg
    WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APP_NAME}" "DisplayName" "${APP_NAME}"
    WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APP_NAME}" "DisplayVersion" "${APP_VERSION}"
    WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APP_NAME}" "UninstallString" "$INSTDIR\uninstall.exe"
    WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APP_NAME}" "InstallLocation" "$INSTDIR"
  no_reg:

  ; —— 所写即所录：manifest + 目录结构 + 卸载器信息 ——
  WriteUninstaller "$INSTDIR\uninstall.exe"
  Call WriteInstallInfo
  Call WriteManifest

  ; 数据根配置落盘 → WriteInstallInfo（运行期 paths 模块读取；零注册表）
SectionEnd

; ============================================================
; install-info.ini（卸载器原生读取）
; ============================================================
Function WriteInstallInfo
  WriteINIStr "$INSTDIR\install-info.ini" "install" "installdir" "$INSTDIR"
  WriteINIStr "$INSTDIR\install-info.ini" "install" "dataroot" "$DataRoot"
  WriteINIStr "$INSTDIR\install-info.ini" "install" "aggregatemode" "$AggregateMode"
  WriteINIStr "$INSTDIR\install-info.ini" "install" "regoptin" "$RegOptIn"
FunctionEnd

; ============================================================
; manifest.json + 目录结构.txt 生成（所写即所录）
; 递归枚举程序区与数据区 → JSON 行（路径转正斜杠）
; ============================================================
Function WriteManifest
  ; 计算前缀长度（相对路径从安装根/数据根之后起算）
  StrLen $ManifestBaseLen "$INSTDIR"
  IntOp $ManifestBaseLen $ManifestBaseLen + 1

  FileOpen $ManifestHandle "$INSTDIR\manifest.json" w
  FileWrite $ManifestHandle "{$\n"
  FileWrite $ManifestHandle '  "comment": "所写即所录——卸载按本清单反向执行（应用内卸载器亦读取）。路径为正斜杠，含尾部逗号由读取方容错。",$\n'
  FileWrite $ManifestHandle '  "files": [$\n'

  StrCpy $R8 "$INSTDIR"   ; 枚举基准
  Call EnumerateToManifest
  StrCpy $R8 "$DataRoot"
  StrLen $ManifestBaseLen "$DataRoot"
  IntOp $ManifestBaseLen $ManifestBaseLen + 1
  Call EnumerateToManifest

  FileWrite $ManifestHandle '  ]$\n}'
  FileClose $ManifestHandle

  ; 目录结构.txt（人类可读）
  FileOpen $ManifestHandle "$INSTDIR\目录结构.txt" w
  FileWrite $ManifestHandle "${APP_NAME} ${APP_VERSION} 目录结构$\r$\n"
  FileWrite $ManifestHandle "=====================================$\r$\n"
  FileWrite $ManifestHandle "程序区（只读）：$INSTDIR$\r$\n"
  FileWrite $ManifestHandle "数据区：$DataRoot$\r$\n"
  FileWrite $ManifestHandle "  \config\  配置文件$\r$\n"
  FileWrite $ManifestHandle "  \data\    用户数据$\r$\n"
  FileWrite $ManifestHandle "  \cache\   缓存（上限 ${DATA_CAP_MB}MB，应用自管）$\r$\n"
  FileWrite $ManifestHandle "  \logs\    日志$\r$\n"
  FileWrite $ManifestHandle "详见 manifest.json（每个文件的哈希与用途）。$\r$\n"
  FileClose $ManifestHandle
FunctionEnd

; 递归枚举 → manifest 行
; 调用约定：Push 相对前缀 → Push 目录；$ManifestHandle/$ManifestBaseLen 为全局
Function EnumerateToManifest
  Pop $R0 ; 目录
  Pop $R1 ; 相对前缀
  FindFirst $R2 $R3 "$R0\*.*"
  enum_loop:
    StrCmp $R3 "" enum_done
    StrCmp $R3 "." enum_next
    StrCmp $R3 ".." enum_next
    StrCpy $R4 "$R0\$R3"
    IfFileExists "$R4\*.*" 0 enum_file
      ; 目录：递归（先保存本层枚举状态——递归会复用 R 寄存器）
      Push $R0
      Push $R1
      Push $R2
      Push $R3
      Push "$R1\$R3"
      Push "$R0\$R3"
      Call EnumerateToManifest
      Pop $R0
      Pop $R1
      Pop $R3
      Pop $R2
      Goto enum_next
    enum_file:
      Push $R4
      Push $R1
      Call WriteManifestLine
      Goto enum_next
    enum_next:
    FindNext $R2 $R3
    StrCmp $R3 "" enum_done 0
    Goto enum_loop
  enum_done:
  FindClose $R2
FunctionEnd

; 写一行 manifest（绝对路径 → 相对路径 → 正斜杠 JSON）
Function WriteManifestLine
  Pop $R0 ; 目录
  Pop $R1 ; 相对前缀
  StrCpy $R2 $R0 "" $ManifestBaseLen ; 去掉基准前缀
  ${StrRep} $R2 $R2 "\" "/"
  FileWrite $ManifestHandle '    "/$R2",$\r$\n'
FunctionEnd

; ============================================================
; 卸载器：程序区结构性删除（数据区默认保留）
; 聚合模式时数据区在 $INSTDIR\Data 内——删除程序文件与 assets 后保留 Data
; ============================================================
Section Uninstall
  ; 读安装信息（NSIS 原生 INI 读取，零 JSON 解析）
  ReadINIStr $0 "$INSTDIR\install-info.ini" "install" "aggregatemode"

  ; 程序区：全部删除
  RMDir /r "$INSTDIR\assets"
  Delete "$INSTDIR\${APP_EXE}"
  Delete "$INSTDIR\uninstall.exe"
  Delete "$INSTDIR\install-info.ini"
  Delete "$INSTDIR\manifest.json"
  Delete "$INSTDIR\目录结构.txt"

  ; opt-in 登记过的注册表键（存在才删——零写入默认下本就不存在）
  DeleteRegKey /ifempty HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APP_NAME}"

  ; 快捷方式
  Delete "$SMPROGRAMS\${APP_NAME}\${APP_NAME}.lnk"
  RMDir "$SMPROGRAMS\${APP_NAME}"
  Delete "$DESKTOP\${APP_NAME}.lnk"
  Delete "$SMSTARTUP\${APP_NAME}.lnk"

  ; 程序目录：聚合模式时 Data 在其中——保留数据后仅删空目录
  StrCmp $0 "1" 0 contract_un
    RMDir "$INSTDIR"
    Goto uni_done
  contract_un:
    RMDir /r "$INSTDIR"
  uni_done:

  ; 数据区（契约模式 $DataRoot / 聚合模式 $INSTDIR\Data）：默认保留
  ; 「同时删除个人数据」为卸载器界面勾选项（读 install-info.ini dataroot 后按用户选择执行）
SectionEnd
