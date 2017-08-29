#!/usr/bin/env sh

COMMAND=$1

case "$COMMAND" in
  build)
    (cd ./src && npm run --silent build)
    ;;

  clean)
    (cd ./src && npm run --silent clean)
    ;;

  config)
    shift 1
    (cd ./src && npm run --silent config "$@")
    ;;

  install)
    (cd ./src && npm install)
    ;;

  start)
    (cd ./src && npm run --silent start)
    ;;

  update)
    (cd ./src && npm run --silent update)
    ;;

  watch)
    (cd ./src && npm run --silent watch)
    ;;

  *)
    echo "Usage:"
    echo "  $(basename "$0") build"
    echo "  $(basename "$0") clean"
    echo "  $(basename "$0") config"
    echo "  $(basename "$0") install"
    echo "  $(basename "$0") start"
    echo "  $(basename "$0") update"
    echo "  $(basename "$0") watch"
    exit 1
esac
