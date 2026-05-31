{pkgs}: {
  deps = [
    pkgs.libffi
    pkgs.gdk-pixbuf
    pkgs.glib
    pkgs.harfbuzz
    pkgs.fontconfig
    pkgs.cairo
    pkgs.pango
  ];
}
