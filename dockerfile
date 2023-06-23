FROM hub.lumigame.com/base/nginx:brotli-1.20.2-zlib

## Add user permissions
RUN chown -R nginx:nginx /usr/share/nginx && chmod -R 755 /usr/share/nginx && \
    chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    chown -R nginx:nginx /etc/nginx/conf.d
RUN touch /var/run/nginx.pid && \
    chown -R nginx:nginx /var/run/nginx.pid

# Switch to non-root user
USER nginx

COPY ./src/.nginx/game.conf /etc/nginx/conf.d/default.conf
COPY ./src/build/web-mobile/ /usr/share/nginx/html
COPY ./src/remote /usr/share/nginx/html/remote