FROM surrealdb/surrealdb:v2.6.0

USER root
RUN apk add --no-cache su-exec && mkdir -p /data

COPY docker/surrealdb-entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
CMD ["start", "--log", "warn", "surrealkv:/data/database"]
