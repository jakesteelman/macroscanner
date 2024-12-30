:: Relevant docs
:: https://supabase.com/docs/guides/database/tables?queryGroups=database-method&database-method=dashboard&queryGroups=language&language=sql#bulk-data-loading
psql -h 127.0.0.1 -p 54322 -d postgres -U postgres -c "\COPY usda_foods FROM '~/Downloads/usda_foods_rows.csv' WITH DELIMITER ',' CSV HEADER"