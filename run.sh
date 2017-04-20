#!/usr/bin/env sh

COMMAND=$1

case "$COMMAND" in
  config)
    "${EDITOR:-vi}" ${NAUTILUS_API_CONFIG:-./config/app.json}
    ;;

  install)
    (cd ./src && npm install)
    ;;

  build)
    (cd ./src && npm run build)
    ;;

  clean)
    (cd ./src && npm run clean)
    ;;

  update)
    (cd ./src && npm run update)
    ;;

  start)
    (cd ./src && npm run start)
    ;;

  watch)
    (cd ./src && npm run watch)
    ;;

  *)
    echo "Usage:"
    echo "  $(basename "$0") config"
    echo "  $(basename "$0") install"
    echo "  $(basename "$0") build"
    echo "  $(basename "$0") clean"
    echo "  $(basename "$0") update"
    echo "  $(basename "$0") start"
    echo "  $(basename "$0") watch"
    exit 1
esac
