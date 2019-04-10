openssl req -new -newkey rsa:4096 -days 365 -nodes -x509 \
    -subj "/C=US/ST=Minnesota/L=Blaine/O=Crashtek/CN=unit.test.crashtek.com" \
    -keyout signing-test-private.pem -out signing-test-public.pem
