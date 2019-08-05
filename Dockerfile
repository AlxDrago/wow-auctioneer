# Dockerfile
FROM php:7.2-apache

RUN a2enmod rewrite
RUN service apache2 restart
