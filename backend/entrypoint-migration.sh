#!/bin/bash
echo "=== Starting database readiness check ==="

# Simple loop to wait for MySQL port to open
for i in {1..30}; do
    php -r "
    try {
        \$pdo = new PDO(
            'mysql:host=' . getenv('DB_HOST') . ';port=' . getenv('DB_PORT') . ';dbname=' . getenv('DB_DATABASE'),
            getenv('DB_USERNAME'),
            getenv('DB_PASSWORD'),
            [PDO::ATTR_TIMEOUT => 2]
        );
        exit(0);
    } catch (Exception \$e) {
        exit(1);
    }
    "
    if [ $? -eq 0 ]; then
        echo "=== Database is online and accepting connections! ==="
        break
    fi
    echo "Waiting for database to respond (attempt $i)..."
    sleep 3
done

echo "=== Running migrations ==="
php /app/artisan migrate --force
echo "=== Migrations completed! ==="
