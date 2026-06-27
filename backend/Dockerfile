FROM webdevops/php-apache:8.3

# Set working directory
WORKDIR /app

# Update Apache document root to Laravel public directory
ENV WEB_DOCUMENT_ROOT=/app/public

# Copy project files
COPY . /app

# Install application dependencies (Composer is pre-installed in this image)
RUN composer install --no-interaction --no-dev --optimize-autoloader

# Set permissions for storage and bootstrap cache
RUN chown -R application:application /app/storage /app/bootstrap/cache \
    && chmod -R 775 /app/storage /app/bootstrap/cache

# Run migrations and start apache (default entrypoint handles apache start)
CMD php artisan migrate --force && supervisord
