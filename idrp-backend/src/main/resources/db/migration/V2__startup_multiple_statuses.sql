-- A startup can now hold several portfolio stages at once (e.g. Incubated and Funded).
CREATE TABLE public.startup_statuses (
    startup_id bigint NOT NULL,
    status character varying(30),
    CONSTRAINT startup_statuses_status_check CHECK (((status)::text = ANY ((ARRAY['PRE_INCUBATED'::character varying, 'INCUBATED'::character varying, 'FUNDED'::character varying])::text[])))
);

ALTER TABLE ONLY public.startup_statuses
    ADD CONSTRAINT fk_startup_statuses_startup FOREIGN KEY (startup_id) REFERENCES public.startups(id);

INSERT INTO public.startup_statuses (startup_id, status)
SELECT id, status FROM public.startups WHERE status IS NOT NULL;

ALTER TABLE public.startups DROP COLUMN status;

-- NEXR, Cipherion and Aatrangi are both incubated and funded.
INSERT INTO public.startup_statuses (startup_id, status)
SELECT s.id, v.status
FROM public.startups s
CROSS JOIN (VALUES ('INCUBATED'), ('FUNDED')) AS v(status)
WHERE s.name IN ('NEXR Technology Private Limited', 'Cipherion', 'Aatrangi')
  AND NOT EXISTS (
      SELECT 1 FROM public.startup_statuses x WHERE x.startup_id = s.id AND x.status = v.status
  );
