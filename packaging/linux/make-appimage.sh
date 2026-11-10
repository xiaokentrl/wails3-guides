#!/bin/bash
# ============================================================
# 软件名 Linux AppImage 构建（便携单文件，双击即运行）
# 对应方案：目录契约「聚合模式」的 Linux 便携形态
#
# AppImage 天然满足聚合模式：全部文件在单一 AppImage 内，
# 运行时数据写到 $XDG_DATA_HOME 等（squashfs 只读，数据经 AppImage 的
# --appimage-extract-and-run 或桌面集成写用户目录）
#
# 用法：./make-appimage.sh <构建产物目录>
# 依赖：appimagetool（https://appimage.github.io/appimagetool/）
# ============================================================
set -euo pipefail

APP_ID="${APP_ID:-appname}"
APP_DISPLAY="${APP_DISPLAY:-软件名}"
APP_VERSION="${APP_VERSION:-1.9.0}"
SRC="${1:?用法: make-appimage.sh <构建产物目录>}"
OUT_DIR="dist"

command -v appimagetool >/dev/null 2>&1 || {
  echo "错误: 需要 appimagetool（下载: https://appimage.github.io/appimagetool/）"
  exit 1
}

APPDIR=$(mktemp -d)
trap 'rm -rf "$APPDIR"' EXIT

# AppDir 结构
mkdir -p "$APPDIR/usr/bin" "$APPDIR/usr/share/applications" "$APPDIR/usr/share/icons/hicolor/256x256/apps"
cp -r "$SRC"/. "$APPDIR/usr/bin/"

# .desktop 入口（AppImage 桌面集成）
cat > "$APPDIR/$APP_ID.desktop" <<EOF
[Desktop Entry]
Type=Application
Name=$APP_DISPLAY
Exec=$APP_ID
Categories=Utility;
EOF
cp "$APPDIR/$APP_ID.desktop" "$APPDIR/usr/share/applications/"

# AppRun（AppImage 入口脚本）
cat > "$APPDIR/AppRun" <<'EOF'
#!/bin/bash
HERE="$(dirname "$(readlink -f "${0}")")"
export PATH="$HERE/usr/bin:$PATH"
exec "$HERE/usr/bin/$(basename "$(ls "$HERE/usr/bin" | grep -v AppRun | head -1)")"
EOF
chmod +x "$APPDIR/AppRun"

# 打包
mkdir -p "$OUT_DIR"
appimagetool "$APPDIR" "$OUT_DIR/${APP_ID}-${APP_VERSION}-x86_64.AppImage"
echo "完成: $OUT_DIR/${APP_ID}-${APP_VERSION}-x86_64.AppImage"
