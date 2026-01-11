#!/bin/sh

VARS="
BACKEND_URL
AIO_PROXY_URL
TMDB_READ_API_KEY
GA_ID
APP_DOMAIN
OPENSEARCH_ENABLED
NORMAL_ROUTER
HAS_ONBOARDING
HIDE_PROXY_ONBOARDING
ALLOW_AUTOPLAY
ALLOW_DEBRID_KEY
ALLOW_FEBBOX_KEY
"

echo "window.__CONFIG__ = {" > /usr/share/nginx/html/config.js

for VAR_NAME in $VARS; do
  VALUE=$(eval echo \$$VAR_NAME)

  if [ -n "$VALUE" ]; then
    echo "  \"VITE_$VAR_NAME\": \"$VALUE\"," >> /usr/share/nginx/html/config.js
  fi
done

echo "};" >> /usr/share/nginx/html/config.js

if ! grep -q "config.js" /usr/share/nginx/html/index.html; then
  sed -i '/<head>/a \    <script src="/config.js"></script>' /usr/share/nginx/html/index.html
fi
