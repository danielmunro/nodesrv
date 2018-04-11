--
-- PostgreSQL database dump
--

-- Dumped from database version 10.3 (Debian 10.3-1.pgdg90+1)
-- Dumped by pg_dump version 10.3

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: affect; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.affect (
    id integer NOT NULL,
    "affectType" text NOT NULL,
    timeout integer NOT NULL,
    "mobId" integer,
    "attributesId" integer
);


ALTER TABLE public.affect OWNER TO postgres;

--
-- Name: affect_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.affect_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.affect_id_seq OWNER TO postgres;

--
-- Name: affect_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.affect_id_seq OWNED BY public.affect.id;


--
-- Name: attributes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.attributes (
    id integer NOT NULL,
    "mobId" integer,
    "hitrollId" integer,
    "vitalsId" integer,
    "statsId" integer
);


ALTER TABLE public.attributes OWNER TO postgres;

--
-- Name: attributes_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.attributes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.attributes_id_seq OWNER TO postgres;

--
-- Name: attributes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.attributes_id_seq OWNED BY public.attributes.id;


--
-- Name: equipped; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.equipped (
    id integer NOT NULL,
    "inventoryId" integer
);


ALTER TABLE public.equipped OWNER TO postgres;

--
-- Name: equipped_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.equipped_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.equipped_id_seq OWNER TO postgres;

--
-- Name: equipped_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.equipped_id_seq OWNED BY public.equipped.id;


--
-- Name: exit; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.exit (
    id integer NOT NULL,
    direction text NOT NULL,
    "sourceId" integer,
    "destinationId" integer
);


ALTER TABLE public.exit OWNER TO postgres;

--
-- Name: exit_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.exit_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.exit_id_seq OWNER TO postgres;

--
-- Name: exit_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.exit_id_seq OWNED BY public.exit.id;


--
-- Name: hitroll; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.hitroll (
    id integer NOT NULL,
    hit integer NOT NULL,
    dam integer NOT NULL
);


ALTER TABLE public.hitroll OWNER TO postgres;

--
-- Name: hitroll_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.hitroll_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.hitroll_id_seq OWNER TO postgres;

--
-- Name: hitroll_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.hitroll_id_seq OWNED BY public.hitroll.id;


--
-- Name: inventory; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.inventory (
    id integer NOT NULL
);


ALTER TABLE public.inventory OWNER TO postgres;

--
-- Name: inventory_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.inventory_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.inventory_id_seq OWNER TO postgres;

--
-- Name: inventory_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.inventory_id_seq OWNED BY public.inventory.id;


--
-- Name: item; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.item (
    id integer NOT NULL,
    name text NOT NULL,
    description text NOT NULL,
    equipment text NOT NULL,
    "inventoryId" integer
);


ALTER TABLE public.item OWNER TO postgres;

--
-- Name: item_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.item_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.item_id_seq OWNER TO postgres;

--
-- Name: item_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.item_id_seq OWNED BY public.item.id;


--
-- Name: mob; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.mob (
    id integer NOT NULL,
    uuid uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name text NOT NULL,
    description text NOT NULL,
    race text NOT NULL,
    level integer NOT NULL,
    "vitalsId" integer,
    "roomId" integer,
    "startRoomId" integer,
    "playerId" integer,
    "inventoryId" integer,
    "equippedId" integer
);


ALTER TABLE public.mob OWNER TO postgres;

--
-- Name: mob_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.mob_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.mob_id_seq OWNER TO postgres;

--
-- Name: mob_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.mob_id_seq OWNED BY public.mob.id;


--
-- Name: player; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.player (
    id integer NOT NULL,
    uuid uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name text NOT NULL
);


ALTER TABLE public.player OWNER TO postgres;

--
-- Name: player_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.player_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.player_id_seq OWNER TO postgres;

--
-- Name: player_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.player_id_seq OWNED BY public.player.id;


--
-- Name: room; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.room (
    id integer NOT NULL,
    uuid uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name text NOT NULL,
    description text NOT NULL,
    "inventoryId" integer
);


ALTER TABLE public.room OWNER TO postgres;

--
-- Name: room_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.room_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.room_id_seq OWNER TO postgres;

--
-- Name: room_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.room_id_seq OWNED BY public.room.id;


--
-- Name: skill; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.skill (
    id integer NOT NULL,
    "skillType" integer NOT NULL,
    level integer NOT NULL
);


ALTER TABLE public.skill OWNER TO postgres;

--
-- Name: skill_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.skill_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.skill_id_seq OWNER TO postgres;

--
-- Name: skill_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.skill_id_seq OWNED BY public.skill.id;


--
-- Name: spell; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.spell (
    id integer NOT NULL,
    "spellType" integer NOT NULL,
    level integer NOT NULL
);


ALTER TABLE public.spell OWNER TO postgres;

--
-- Name: spell_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.spell_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.spell_id_seq OWNER TO postgres;

--
-- Name: spell_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.spell_id_seq OWNED BY public.spell.id;


--
-- Name: stats; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.stats (
    id integer NOT NULL,
    str integer NOT NULL,
    "int" integer NOT NULL,
    wis integer NOT NULL,
    dex integer NOT NULL,
    con integer NOT NULL,
    sta integer NOT NULL
);


ALTER TABLE public.stats OWNER TO postgres;

--
-- Name: stats_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.stats_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.stats_id_seq OWNER TO postgres;

--
-- Name: stats_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.stats_id_seq OWNED BY public.stats.id;


--
-- Name: vitals; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.vitals (
    id integer NOT NULL,
    hp integer NOT NULL,
    mana integer NOT NULL,
    mv integer NOT NULL
);


ALTER TABLE public.vitals OWNER TO postgres;

--
-- Name: vitals_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.vitals_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.vitals_id_seq OWNER TO postgres;

--
-- Name: vitals_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.vitals_id_seq OWNED BY public.vitals.id;


--
-- Name: affect id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.affect ALTER COLUMN id SET DEFAULT nextval('public.affect_id_seq'::regclass);


--
-- Name: attributes id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attributes ALTER COLUMN id SET DEFAULT nextval('public.attributes_id_seq'::regclass);


--
-- Name: equipped id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.equipped ALTER COLUMN id SET DEFAULT nextval('public.equipped_id_seq'::regclass);


--
-- Name: exit id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.exit ALTER COLUMN id SET DEFAULT nextval('public.exit_id_seq'::regclass);


--
-- Name: hitroll id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hitroll ALTER COLUMN id SET DEFAULT nextval('public.hitroll_id_seq'::regclass);


--
-- Name: inventory id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory ALTER COLUMN id SET DEFAULT nextval('public.inventory_id_seq'::regclass);


--
-- Name: item id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.item ALTER COLUMN id SET DEFAULT nextval('public.item_id_seq'::regclass);


--
-- Name: mob id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mob ALTER COLUMN id SET DEFAULT nextval('public.mob_id_seq'::regclass);


--
-- Name: player id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.player ALTER COLUMN id SET DEFAULT nextval('public.player_id_seq'::regclass);


--
-- Name: room id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.room ALTER COLUMN id SET DEFAULT nextval('public.room_id_seq'::regclass);


--
-- Name: skill id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.skill ALTER COLUMN id SET DEFAULT nextval('public.skill_id_seq'::regclass);


--
-- Name: spell id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.spell ALTER COLUMN id SET DEFAULT nextval('public.spell_id_seq'::regclass);


--
-- Name: stats id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stats ALTER COLUMN id SET DEFAULT nextval('public.stats_id_seq'::regclass);


--
-- Name: vitals id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vitals ALTER COLUMN id SET DEFAULT nextval('public.vitals_id_seq'::regclass);


--
-- Data for Name: affect; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.affect (id, "affectType", timeout, "mobId", "attributesId") FROM stdin;
\.


--
-- Data for Name: attributes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.attributes (id, "mobId", "hitrollId", "vitalsId", "statsId") FROM stdin;
1	1	1	2	1
\.


--
-- Data for Name: equipped; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.equipped (id, "inventoryId") FROM stdin;
1	\N
\.


--
-- Data for Name: exit; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.exit (id, direction, "sourceId", "destinationId") FROM stdin;
1	west	1	2
2	east	1	3
3	east	2	1
4	south	5	1
5	north	1	5
6	north	4	1
7	south	1	4
8	west	3	1
9	east	4	9
10	west	9	4
11	east	7	8
12	west	10	9
13	west	7	6
14	east	9	10
15	east	6	7
16	west	6	10
17	east	10	6
18	west	8	7
19	south	11	12
20	north	11	4
21	north	12	11
22	south	4	11
23	east	13	14
24	east	12	13
25	west	13	12
26	west	14	13
\.


--
-- Data for Name: hitroll; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.hitroll (id, hit, dam) FROM stdin;
1	2	3
\.


--
-- Data for Name: inventory; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.inventory (id) FROM stdin;
1
\.


--
-- Data for Name: item; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.item (id, name, description, equipment, "inventoryId") FROM stdin;
\.


--
-- Data for Name: mob; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.mob (id, uuid, name, description, race, level, "vitalsId", "roomId", "startRoomId", "playerId", "inventoryId", "equippedId") FROM stdin;
1	b35386b5-20c1-4136-802e-9efcc7825d23	an old traveller	an old traveller sits at the bar, studying a small pamphlet	0	1	1	1	\N	\N	1	1
\.


--
-- Data for Name: player; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.player (id, uuid, name) FROM stdin;
\.


--
-- Data for Name: room; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.room (id, uuid, name, description, "inventoryId") FROM stdin;
1	1b8ad2ce-068f-4dcc-920c-e7360bd5e3e6	Inn at the lodge	Flickering torches provide the only light in the large main mess hall. The room is filled with the chatter of travellers preparing for the journey ahead.	\N
2	bc668a52-1593-471b-bf1f-552b679a35b5	A cozy room at the Inn	Something about a room in the inn.	\N
3	586d6686-b7c1-4ac6-aee4-7ee4b5fd8fb7	A cozy room at the Inn	Something about a room in the inn.	\N
4	6bde71af-6a49-442e-ab86-0dfccf61067d	A clearing in the woods	A small patch of land has been cleared of trees. On it sits a modest inn, tending to weary travellers.	\N
5	9ce9828a-7d07-4708-930d-deafd4359afc	A cozy room at the Inn	Something about a room in the inn.	\N
6	5deaf187-a4b6-495c-9dea-9086004a420a	A trail in the woods	Old growth trees line a narrow and meandering trail. Thick green moss hangs from massive branches, obscuring any potential view. A lazy fog hangs frozen in the canopy, leaving an eerie silence.	\N
7	a335e2c0-d2cb-4da3-a0d7-9d8eecd6ddf4	A trail in the woods	Old growth trees line a narrow and meandering trail. Thick green moss hangs from massive branches, obscuring any potential view. A lazy fog hangs frozen in the canopy, leaving an eerie silence.	\N
8	b26099b7-4de1-4405-aefc-ff8ad9b121b9	A trail in the woods	Old growth trees line a narrow and meandering trail. Thick green moss hangs from massive branches, obscuring any potential view. A lazy fog hangs frozen in the canopy, leaving an eerie silence.	\N
9	19d2974a-a248-40ee-a43b-16e583e5fdac	A trail in the woods	Old growth trees line a narrow and meandering trail. Thick green moss hangs from massive branches, obscuring any potential view. A lazy fog hangs frozen in the canopy, leaving an eerie silence.	\N
10	9f2be197-9536-4237-b0c9-85b27c37738e	A trail in the woods	Old growth trees line a narrow and meandering trail. Thick green moss hangs from massive branches, obscuring any potential view. A lazy fog hangs frozen in the canopy, leaving an eerie silence.	\N
11	52d451bf-ef46-4952-9023-3b48b1e08db2	A trail in the woods	Old growth trees line a narrow and meandering trail. Thick green moss hangs from massive branches, obscuring any potential view. A lazy fog hangs frozen in the canopy, leaving an eerie silence.	\N
12	fd571d22-8109-4cfa-9c8c-a2ef0973b82b	A trail in the woods	Old growth trees line a narrow and meandering trail. Thick green moss hangs from massive branches, obscuring any potential view. A lazy fog hangs frozen in the canopy, leaving an eerie silence.	\N
13	3f9d761a-3d20-4ad1-83f6-cd5147b0aa5a	A trail in the woods	Old growth trees line a narrow and meandering trail. Thick green moss hangs from massive branches, obscuring any potential view. A lazy fog hangs frozen in the canopy, leaving an eerie silence.	\N
14	1b641688-7d6e-4910-9c85-4be51649556d	A trail in the woods	Old growth trees line a narrow and meandering trail. Thick green moss hangs from massive branches, obscuring any potential view. A lazy fog hangs frozen in the canopy, leaving an eerie silence.	\N
\.


--
-- Data for Name: skill; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.skill (id, "skillType", level) FROM stdin;
\.


--
-- Data for Name: spell; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.spell (id, "spellType", level) FROM stdin;
\.


--
-- Data for Name: stats; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.stats (id, str, "int", wis, dex, con, sta) FROM stdin;
1	15	15	15	15	15	15
\.


--
-- Data for Name: vitals; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.vitals (id, hp, mana, mv) FROM stdin;
1	100	100	100
2	100	100	100
\.


--
-- Name: affect_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.affect_id_seq', 1, false);


--
-- Name: attributes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.attributes_id_seq', 1, true);


--
-- Name: equipped_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.equipped_id_seq', 1, true);


--
-- Name: exit_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.exit_id_seq', 26, true);


--
-- Name: hitroll_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.hitroll_id_seq', 1, true);


--
-- Name: inventory_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.inventory_id_seq', 1, true);


--
-- Name: item_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.item_id_seq', 1, false);


--
-- Name: mob_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.mob_id_seq', 1, true);


--
-- Name: player_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.player_id_seq', 1, false);


--
-- Name: room_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.room_id_seq', 14, true);


--
-- Name: skill_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.skill_id_seq', 1, false);


--
-- Name: spell_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.spell_id_seq', 1, false);


--
-- Name: stats_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.stats_id_seq', 1, true);


--
-- Name: vitals_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.vitals_id_seq', 2, true);


--
-- Name: affect affect_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.affect
    ADD CONSTRAINT affect_pkey PRIMARY KEY (id);


--
-- Name: attributes attributes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attributes
    ADD CONSTRAINT attributes_pkey PRIMARY KEY (id);


--
-- Name: equipped equipped_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.equipped
    ADD CONSTRAINT equipped_pkey PRIMARY KEY (id);


--
-- Name: exit exit_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.exit
    ADD CONSTRAINT exit_pkey PRIMARY KEY (id);


--
-- Name: hitroll hitroll_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hitroll
    ADD CONSTRAINT hitroll_pkey PRIMARY KEY (id);


--
-- Name: inventory inventory_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory
    ADD CONSTRAINT inventory_pkey PRIMARY KEY (id);


--
-- Name: item item_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.item
    ADD CONSTRAINT item_pkey PRIMARY KEY (id);


--
-- Name: mob mob_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mob
    ADD CONSTRAINT mob_pkey PRIMARY KEY (id);


--
-- Name: player player_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_pkey PRIMARY KEY (id);


--
-- Name: room room_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.room
    ADD CONSTRAINT room_pkey PRIMARY KEY (id);


--
-- Name: skill skill_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.skill
    ADD CONSTRAINT skill_pkey PRIMARY KEY (id);


--
-- Name: spell spell_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.spell
    ADD CONSTRAINT spell_pkey PRIMARY KEY (id);


--
-- Name: stats stats_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stats
    ADD CONSTRAINT stats_pkey PRIMARY KEY (id);


--
-- Name: vitals vitals_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vitals
    ADD CONSTRAINT vitals_pkey PRIMARY KEY (id);


--
-- Name: attributes fk_1052b365f35009a08007116aa60; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attributes
    ADD CONSTRAINT fk_1052b365f35009a08007116aa60 FOREIGN KEY ("hitrollId") REFERENCES public.hitroll(id);


--
-- Name: exit fk_1b2588cd9e114f0e7fce9c770fd; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.exit
    ADD CONSTRAINT fk_1b2588cd9e114f0e7fce9c770fd FOREIGN KEY ("destinationId") REFERENCES public.room(id);


--
-- Name: attributes fk_207d7b6efb518b12e4077a09a90; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attributes
    ADD CONSTRAINT fk_207d7b6efb518b12e4077a09a90 FOREIGN KEY ("vitalsId") REFERENCES public.vitals(id);


--
-- Name: attributes fk_2a8e9c7588843a7b15c2db3fa5c; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attributes
    ADD CONSTRAINT fk_2a8e9c7588843a7b15c2db3fa5c FOREIGN KEY ("mobId") REFERENCES public.mob(id);


--
-- Name: room fk_482ea45b1d111b5aa53bc3c9c5f; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.room
    ADD CONSTRAINT fk_482ea45b1d111b5aa53bc3c9c5f FOREIGN KEY ("inventoryId") REFERENCES public.inventory(id);


--
-- Name: equipped fk_51a1e455c407d84c7a86e46ea78; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.equipped
    ADD CONSTRAINT fk_51a1e455c407d84c7a86e46ea78 FOREIGN KEY ("inventoryId") REFERENCES public.inventory(id);


--
-- Name: item fk_642a87a4fb53435155c98dbb94d; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.item
    ADD CONSTRAINT fk_642a87a4fb53435155c98dbb94d FOREIGN KEY ("inventoryId") REFERENCES public.inventory(id);


--
-- Name: affect fk_65d9574265416544c7453b5d694; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.affect
    ADD CONSTRAINT fk_65d9574265416544c7453b5d694 FOREIGN KEY ("mobId") REFERENCES public.mob(id);


--
-- Name: mob fk_72ecc2fec3a01384ae0e45bf943; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mob
    ADD CONSTRAINT fk_72ecc2fec3a01384ae0e45bf943 FOREIGN KEY ("inventoryId") REFERENCES public.inventory(id);


--
-- Name: mob fk_8028d5db3403727e43d0678f650; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mob
    ADD CONSTRAINT fk_8028d5db3403727e43d0678f650 FOREIGN KEY ("startRoomId") REFERENCES public.room(id);


--
-- Name: mob fk_8df171626d1df7a50290a7ce022; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mob
    ADD CONSTRAINT fk_8df171626d1df7a50290a7ce022 FOREIGN KEY ("equippedId") REFERENCES public.equipped(id);


--
-- Name: attributes fk_97542ea3294773abff5f1100699; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attributes
    ADD CONSTRAINT fk_97542ea3294773abff5f1100699 FOREIGN KEY ("statsId") REFERENCES public.stats(id);


--
-- Name: mob fk_ab851cb4703e39e33fcc0d05b67; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mob
    ADD CONSTRAINT fk_ab851cb4703e39e33fcc0d05b67 FOREIGN KEY ("vitalsId") REFERENCES public.vitals(id);


--
-- Name: mob fk_c735bad6f3038530f44bfb705c0; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mob
    ADD CONSTRAINT fk_c735bad6f3038530f44bfb705c0 FOREIGN KEY ("playerId") REFERENCES public.player(id);


--
-- Name: mob fk_cc7d4cdd65e931d5bf05509b66c; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mob
    ADD CONSTRAINT fk_cc7d4cdd65e931d5bf05509b66c FOREIGN KEY ("roomId") REFERENCES public.room(id);


--
-- Name: affect fk_dbf757a12d01ba51e2a5c1b39f8; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.affect
    ADD CONSTRAINT fk_dbf757a12d01ba51e2a5c1b39f8 FOREIGN KEY ("attributesId") REFERENCES public.attributes(id);


--
-- Name: exit fk_f9f1875ff0a21e49d0a66844fb8; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.exit
    ADD CONSTRAINT fk_f9f1875ff0a21e49d0a66844fb8 FOREIGN KEY ("sourceId") REFERENCES public.room(id);


--
-- PostgreSQL database dump complete
--

