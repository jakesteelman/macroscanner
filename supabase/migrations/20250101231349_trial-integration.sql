set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.search_usda_foods(query_embedding vector, match_threshold double precision, match_count integer, require_density boolean)
 RETURNS TABLE(fdc_id bigint, name text, similarity double precision)
 LANGUAGE sql
 STABLE
AS $function$
  select
    f.fdc_id as fdc_id,
    f.name as name,
    1 - (f.embedding <=> query_embedding) as similarity
  from usda_foods f
  where f.embedding <=> query_embedding < 1 - match_threshold
  and f.data_type not ilike 'sub_sample_food' -- these are partial foods
  and (not require_density or f.density is not null)
  order by f.embedding <=> query_embedding
  limit match_count;
$function$
;


