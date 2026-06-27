#!/bin/bash
echo "=== Starting database readiness check ==="

DB_CONNECTION="${DB_CONNECTION:-pgsql}"
DB_PORT="${DB_PORT:-5432}"
DB_READY=0

for i in {1..30}; do
    if php -r "
    try {
        \$driver = getenv('DB_CONNECTION') ?: 'pgsql';
        \$host = getenv('DB_HOST');
        \$port = getenv('DB_PORT') ?: (\$driver === 'mysql' ? '3306' : '5432');
        \$database = getenv('DB_DATABASE');
        \$dsn = \$driver === 'mysql'
            ? 'mysql:host=' . \$host . ';port=' . \$port . ';dbname=' . \$database
            : 'pgsql:host=' . \$host . ';port=' . \$port . ';dbname=' . \$database;
        \$pdo = new PDO(
            \$dsn,
            getenv('DB_USERNAME'),
            getenv('DB_PASSWORD'),
            [PDO::ATTR_TIMEOUT => 2]
        );
        exit(0);
    } catch (Exception \$e) {
        exit(1);
    }
    "; then
        echo "=== Database is online and accepting connections! ==="
        DB_READY=1
        break
    fi
    echo "Waiting for database to respond (attempt $i)..."
    sleep 3
done

if [ "$DB_READY" != "1" ]; then
    echo "=== Database did not become ready in time ==="
    exit 1
fi

echo "=== Clearing Laravel caches ==="
php /app/artisan optimize:clear
echo "=== Laravel caches cleared ==="

echo "=== Running migrations ==="
php /app/artisan migrate --force
echo "=== Migrations completed! ==="

echo "=== Seeding demo data ==="
php /app/artisan db:seed --force
echo "=== Seeding completed! ==="
