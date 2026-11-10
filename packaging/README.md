# packaging/ —— 三平台安装器与打包脚本

对应方案：[专题/分发与更新/默认安装目录规划方案.md](../专题/分发与更新/默认安装目录规划方案.md) —— 目录契约的落地实现。**每个脚本逐条实现契约**：解析链、预览门禁、注册表零写入、manifest 所写即所录、卸载净空。

## Windows（NSIS）

脚本：`windows/installer.nsi`（已在 NSIS 3.10 下编译验证）

```bash
# 1. Wails3 构建产物放入 build/windows/app/（exe 与前端资源）
# 2. 编译（本机或 CI 装 nsis）
makensis installer.nsi
# 产物：build/windows/软件名-<版本>-setup.exe
```

**实现的契约**：

| 方案要求 | NSI 落地 |
|---|---|
| 解析链（D:\ 优先 → 回退） | `ResolveDefaultInstallDir`（DriveSpace 校验 500MB）|
| 用户指定绝对遵从 | `.onVerifyInstDir` 仅拒系统保护区，不静默重定向 |
| **预览门禁** | 自定义 `PagePreview_Create` 页（页序强制，程序区/数据区/注册表状态全展示）|
| **注册表零写入** | 默认零写入；opt-in「登记系统卸载列表」勾选 = 唯一键（4 个值）|
| 数据模式二选一 | 聚合（`$INSTDIR\Data`）/ 契约（`%LOCALAPPDATA%`）单选，实时重算数据根 |
| **所写即所录** | `manifest.json`（递归枚举全部文件，正斜杠 JSON）+ `目录结构.txt` + `install-info.ini` |
| 自启动 opt-in | 启动目录 `.lnk` 文件（零注册表）|
| 一体化卸载器 | `uninstall.exe`：INI 原生读取模式 → 程序区结构性删除，**数据区默认保留**；opt-in 键存在才删 |

> NSIS 版本注意：`NSD_CreateRadioButton`（非 `NSD_CreateRadio`）；`StrFunc` 的 `${Using:StrFunc} StrRep` 声明必须在**文件顶层**（函数内声明不生效）。

## macOS（DMG）

脚本：`macos/make-dmg.sh`（仅 macOS 可运行，需 hdiutil）

```bash
APP_NAME=软件名 BUNDLE_ID=com.company.appname ./make-dmg.sh <构建产物目录>
# 产物：dist/软件名-<版本>.dmg
```

- 拖入 /Applications 安装（DMG 内置 Applications 快捷方式）
- 预生成 `~/Library` 契约数据目录（config/data/logs + Caches）
- 红线已写进脚本输出：`.app` 内运行期零写入；正式分发需 `codesign` 签名公证

## Linux

### install.sh（契约安装器：manifest 驱动安装与卸载）

```bash
./install.sh <产物目录>        # per-user 安装（~/.local/opt + XDG 数据根）
./install.sh --system <产物目录>  # /opt 安装（sudo）
./install.sh --uninstall       # manifest 反向执行，数据区默认保留
```

- 所写即所录：`manifest.txt` 逐文件记录，卸载反向执行
- XDG 契约：数据根 `~/.local/share/<app>/{config,data,logs}`、缓存外置 `~/.cache/<app>/`
- `.desktop` 应用菜单入口

### make-appimage.sh（便携单文件）

```bash
APP_ID=appname APP_VERSION=1.9.0 ./make-appimage.sh <产物目录>
# 产物：dist/appname-<版本>-x86_64.AppImage（聚合模式的 Linux 便携形态）
```

依赖 `appimagetool`。

## CI 集成

发布交付流水线的「出包」阶段调用（→《发布交付流水线方案》），产物进 GitHub Release 资产。三平台脚本共享同一目录契约——**契约变更只改方案与契约表，三平台脚本同步**。
