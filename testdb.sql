--
-- PostgreSQL database dump
--

-- Dumped from database version 11.3 (Debian 11.3-1.pgdg90+1)
-- Dumped by pg_dump version 11.2

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
-- Name: affect_entity; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.affect_entity (
    id integer NOT NULL,
    "affectType" text NOT NULL,
    timeout double precision NOT NULL,
    level double precision NOT NULL,
    "mobId" integer,
    "itemId" integer,
    "attributesId" integer,
    "immuneId" integer,
    "resistId" integer,
    "vulnerableId" integer
);


ALTER TABLE public.affect_entity OWNER TO postgres;

--
-- Name: affect_entity_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.affect_entity_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.affect_entity_id_seq OWNER TO postgres;

--
-- Name: affect_entity_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.affect_entity_id_seq OWNED BY public.affect_entity.id;


--
-- Name: attributes_entity; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.attributes_entity (
    id integer NOT NULL,
    hit double precision DEFAULT 0 NOT NULL,
    dam double precision DEFAULT 0 NOT NULL,
    hp double precision DEFAULT 0 NOT NULL,
    mana double precision DEFAULT 0 NOT NULL,
    mv double precision DEFAULT 0 NOT NULL,
    str double precision DEFAULT 0 NOT NULL,
    "int" double precision DEFAULT 0 NOT NULL,
    wis double precision DEFAULT 0 NOT NULL,
    dex double precision DEFAULT 0 NOT NULL,
    con double precision DEFAULT 0 NOT NULL,
    sta double precision DEFAULT 0 NOT NULL,
    "acPierce" double precision DEFAULT 0 NOT NULL,
    "acBash" double precision DEFAULT 0 NOT NULL,
    "acSlash" double precision DEFAULT 0 NOT NULL,
    "acMagic" double precision DEFAULT 0 NOT NULL,
    "mobId" integer
);


ALTER TABLE public.attributes_entity OWNER TO postgres;

--
-- Name: attributes_entity_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.attributes_entity_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.attributes_entity_id_seq OWNER TO postgres;

--
-- Name: attributes_entity_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.attributes_entity_id_seq OWNED BY public.attributes_entity.id;


--
-- Name: container_entity; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.container_entity (
    id integer NOT NULL,
    uuid uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "isOpen" boolean NOT NULL,
    "isCloseable" boolean,
    "weightCapacity" integer NOT NULL,
    "itemCapacity" integer NOT NULL,
    "maxWeightForItem" integer NOT NULL,
    "inventoryId" integer
);


ALTER TABLE public.container_entity OWNER TO postgres;

--
-- Name: container_entity_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.container_entity_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.container_entity_id_seq OWNER TO postgres;

--
-- Name: container_entity_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.container_entity_id_seq OWNED BY public.container_entity.id;


--
-- Name: damage_source_entity; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.damage_source_entity (
    id integer NOT NULL,
    uuid uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    summon boolean DEFAULT false NOT NULL,
    charm boolean DEFAULT false NOT NULL,
    magic boolean DEFAULT false NOT NULL,
    weapon boolean DEFAULT false NOT NULL,
    bash boolean DEFAULT false NOT NULL,
    slash boolean DEFAULT false NOT NULL,
    pierce boolean DEFAULT false NOT NULL,
    fire boolean DEFAULT false NOT NULL,
    cold boolean DEFAULT false NOT NULL,
    lightning boolean DEFAULT false NOT NULL,
    acid boolean DEFAULT false NOT NULL,
    poison boolean DEFAULT false NOT NULL,
    negative boolean DEFAULT false NOT NULL,
    holy boolean DEFAULT false NOT NULL,
    energy boolean DEFAULT false NOT NULL,
    mental boolean DEFAULT false NOT NULL,
    disease boolean DEFAULT false NOT NULL,
    drowning boolean DEFAULT false NOT NULL,
    light boolean DEFAULT false NOT NULL,
    sound boolean DEFAULT false NOT NULL,
    wood boolean DEFAULT false NOT NULL,
    silver boolean DEFAULT false NOT NULL,
    iron boolean DEFAULT false NOT NULL,
    distraction boolean DEFAULT false NOT NULL
);


ALTER TABLE public.damage_source_entity OWNER TO postgres;

--
-- Name: damage_source_entity_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.damage_source_entity_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.damage_source_entity_id_seq OWNER TO postgres;

--
-- Name: damage_source_entity_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.damage_source_entity_id_seq OWNED BY public.damage_source_entity.id;


--
-- Name: door_entity; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.door_entity (
    id integer NOT NULL,
    "canonicalId" integer NOT NULL,
    name character varying NOT NULL,
    "unlockedByCanonicalId" integer NOT NULL,
    "isClosed" boolean NOT NULL,
    "isLocked" boolean NOT NULL,
    "isPickproof" boolean NOT NULL,
    "lockpickDifficulty" integer NOT NULL,
    "noClose" boolean NOT NULL,
    "noLock" boolean NOT NULL,
    "isConcealed" boolean NOT NULL
);


ALTER TABLE public.door_entity OWNER TO postgres;

--
-- Name: door_entity_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.door_entity_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.door_entity_id_seq OWNER TO postgres;

--
-- Name: door_entity_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.door_entity_id_seq OWNED BY public.door_entity.id;


--
-- Name: drink_entity; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.drink_entity (
    id integer NOT NULL,
    uuid uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    liquid text DEFAULT 'water'::text NOT NULL,
    capacity integer,
    "drinkAmount" integer NOT NULL,
    "foodAmount" integer NOT NULL
);


ALTER TABLE public.drink_entity OWNER TO postgres;

--
-- Name: drink_entity_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.drink_entity_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.drink_entity_id_seq OWNER TO postgres;

--
-- Name: drink_entity_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.drink_entity_id_seq OWNED BY public.drink_entity.id;


--
-- Name: equipped_entity; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.equipped_entity (
    id integer NOT NULL,
    "inventoryId" integer
);


ALTER TABLE public.equipped_entity OWNER TO postgres;

--
-- Name: equipped_entity_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.equipped_entity_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.equipped_entity_id_seq OWNER TO postgres;

--
-- Name: equipped_entity_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.equipped_entity_id_seq OWNED BY public.equipped_entity.id;


--
-- Name: exit_entity; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.exit_entity (
    id integer NOT NULL,
    direction text NOT NULL,
    "sourceId" integer,
    "destinationId" integer,
    "doorId" integer
);


ALTER TABLE public.exit_entity OWNER TO postgres;

--
-- Name: exit_entity_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.exit_entity_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.exit_entity_id_seq OWNER TO postgres;

--
-- Name: exit_entity_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.exit_entity_id_seq OWNED BY public.exit_entity.id;


--
-- Name: food_entity; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.food_entity (
    id integer NOT NULL,
    uuid uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "foodAmount" integer NOT NULL,
    "drinkAmount" integer NOT NULL
);


ALTER TABLE public.food_entity OWNER TO postgres;

--
-- Name: food_entity_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.food_entity_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.food_entity_id_seq OWNER TO postgres;

--
-- Name: food_entity_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.food_entity_id_seq OWNED BY public.food_entity.id;


--
-- Name: forge_entity; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.forge_entity (
    id integer NOT NULL,
    uuid uuid DEFAULT public.uuid_generate_v4() NOT NULL
);


ALTER TABLE public.forge_entity OWNER TO postgres;

--
-- Name: forge_entity_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.forge_entity_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.forge_entity_id_seq OWNER TO postgres;

--
-- Name: forge_entity_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.forge_entity_id_seq OWNED BY public.forge_entity.id;


--
-- Name: inventory_entity; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.inventory_entity (
    id integer NOT NULL,
    uuid uuid DEFAULT public.uuid_generate_v4() NOT NULL
);


ALTER TABLE public.inventory_entity OWNER TO postgres;

--
-- Name: inventory_entity_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.inventory_entity_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.inventory_entity_id_seq OWNER TO postgres;

--
-- Name: inventory_entity_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.inventory_entity_id_seq OWNED BY public.inventory_entity.id;


--
-- Name: item_container_reset_entity; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.item_container_reset_entity (
    id integer NOT NULL,
    uuid uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "equipmentPosition" text,
    "maxQuantity" integer NOT NULL,
    "maxPerRoom" integer,
    "itemId" integer,
    "itemDestinationId" integer
);


ALTER TABLE public.item_container_reset_entity OWNER TO postgres;

--
-- Name: item_container_reset_entity_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.item_container_reset_entity_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.item_container_reset_entity_id_seq OWNER TO postgres;

--
-- Name: item_container_reset_entity_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.item_container_reset_entity_id_seq OWNED BY public.item_container_reset_entity.id;


--
-- Name: item_entity; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.item_entity (
    id integer NOT NULL,
    uuid uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "canonicalId" character varying,
    "canonicalIdentifier" character varying,
    name character varying NOT NULL,
    brief character varying NOT NULL,
    description character varying NOT NULL,
    equipment text,
    "itemType" integer NOT NULL,
    value integer DEFAULT 0 NOT NULL,
    hunger integer,
    "isTransferable" boolean DEFAULT true NOT NULL,
    level integer DEFAULT 1 NOT NULL,
    weight integer DEFAULT 0 NOT NULL,
    material text NOT NULL,
    condition integer DEFAULT 100 NOT NULL,
    identified boolean DEFAULT true NOT NULL,
    capacity integer,
    "wearTimer" integer,
    "weaponType" text,
    "damageType" text,
    "weaponEffects" text,
    "attackVerb" text,
    "maxCharges" integer,
    "currentCharges" integer,
    "spellType" text,
    "castLevel" integer,
    "inventoryId" integer,
    "attributesId" integer,
    "containerId" integer,
    "foodId" integer,
    "drinkId" integer,
    "forgeId" integer
);


ALTER TABLE public.item_entity OWNER TO postgres;

--
-- Name: item_entity_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.item_entity_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.item_entity_id_seq OWNER TO postgres;

--
-- Name: item_entity_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.item_entity_id_seq OWNED BY public.item_entity.id;


--
-- Name: item_mob_reset_entity; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.item_mob_reset_entity (
    id integer NOT NULL,
    uuid uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "equipmentPosition" text,
    "maxQuantity" integer NOT NULL,
    "maxPerRoom" integer,
    "itemId" integer,
    "mobId" integer
);


ALTER TABLE public.item_mob_reset_entity OWNER TO postgres;

--
-- Name: item_mob_reset_entity_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.item_mob_reset_entity_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.item_mob_reset_entity_id_seq OWNER TO postgres;

--
-- Name: item_mob_reset_entity_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.item_mob_reset_entity_id_seq OWNED BY public.item_mob_reset_entity.id;


--
-- Name: item_reset_entity; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.item_reset_entity (
    id integer NOT NULL,
    uuid uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "equipmentPosition" text,
    "maxQuantity" integer NOT NULL,
    "maxPerRoom" integer,
    "itemId" integer
);


ALTER TABLE public.item_reset_entity OWNER TO postgres;

--
-- Name: item_reset_entity_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.item_reset_entity_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.item_reset_entity_id_seq OWNER TO postgres;

--
-- Name: item_reset_entity_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.item_reset_entity_id_seq OWNED BY public.item_reset_entity.id;


--
-- Name: item_room_reset_entity; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.item_room_reset_entity (
    id integer NOT NULL,
    uuid uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "equipmentPosition" text,
    "maxQuantity" integer NOT NULL,
    "maxPerRoom" integer,
    "itemId" integer,
    "roomId" integer
);


ALTER TABLE public.item_room_reset_entity OWNER TO postgres;

--
-- Name: item_room_reset_entity_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.item_room_reset_entity_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.item_room_reset_entity_id_seq OWNER TO postgres;

--
-- Name: item_room_reset_entity_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.item_room_reset_entity_id_seq OWNED BY public.item_room_reset_entity.id;


--
-- Name: mob_entity; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.mob_entity (
    id integer NOT NULL,
    uuid uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "canonicalId" character varying,
    name character varying NOT NULL,
    description character varying,
    brief character varying,
    "raceType" text NOT NULL,
    "specializationType" text,
    level integer DEFAULT 1 NOT NULL,
    gold integer DEFAULT 0 NOT NULL,
    gender text DEFAULT 'its'::text NOT NULL,
    disposition text DEFAULT 'standing'::text NOT NULL,
    "importId" character varying,
    alignment integer DEFAULT 0 NOT NULL,
    hp double precision NOT NULL,
    mana double precision NOT NULL,
    mv double precision NOT NULL,
    "immuneId" integer,
    "resistId" integer,
    "vulnerableId" integer,
    "traitsId" integer,
    "offensiveTraitsId" integer,
    "shopId" integer,
    "playerId" integer,
    "inventoryId" integer,
    "equippedId" integer
);


ALTER TABLE public.mob_entity OWNER TO postgres;

--
-- Name: mob_entity_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.mob_entity_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.mob_entity_id_seq OWNER TO postgres;

--
-- Name: mob_entity_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.mob_entity_id_seq OWNED BY public.mob_entity.id;


--
-- Name: mob_equip_reset_entity; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.mob_equip_reset_entity (
    id integer NOT NULL,
    uuid uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "equipmentPosition" text,
    "maxQuantity" integer NOT NULL,
    "maxPerRoom" integer,
    "itemId" integer,
    "mobId" integer
);


ALTER TABLE public.mob_equip_reset_entity OWNER TO postgres;

--
-- Name: mob_equip_reset_entity_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.mob_equip_reset_entity_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.mob_equip_reset_entity_id_seq OWNER TO postgres;

--
-- Name: mob_equip_reset_entity_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.mob_equip_reset_entity_id_seq OWNED BY public.mob_equip_reset_entity.id;


--
-- Name: mob_location_entity; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.mob_location_entity (
    id integer NOT NULL,
    uuid uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "roomId" integer
);


ALTER TABLE public.mob_location_entity OWNER TO postgres;

--
-- Name: mob_location_entity_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.mob_location_entity_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.mob_location_entity_id_seq OWNER TO postgres;

--
-- Name: mob_location_entity_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.mob_location_entity_id_seq OWNED BY public.mob_location_entity.id;


--
-- Name: mob_reset_entity; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.mob_reset_entity (
    id integer NOT NULL,
    uuid uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    disposition text,
    "maxQuantity" integer NOT NULL,
    "maxPerRoom" integer,
    "mobId" integer,
    "roomId" integer
);


ALTER TABLE public.mob_reset_entity OWNER TO postgres;

--
-- Name: mob_reset_entity_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.mob_reset_entity_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.mob_reset_entity_id_seq OWNER TO postgres;

--
-- Name: mob_reset_entity_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.mob_reset_entity_id_seq OWNED BY public.mob_reset_entity.id;


--
-- Name: mob_traits_entity; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.mob_traits_entity (
    id integer NOT NULL,
    uuid uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "isNpc" boolean NOT NULL,
    wanders boolean NOT NULL,
    scavenger boolean NOT NULL,
    aggressive boolean NOT NULL,
    "stayArea" boolean NOT NULL,
    wimpy boolean NOT NULL,
    "isPet" boolean NOT NULL,
    trainer boolean NOT NULL,
    practice boolean NOT NULL,
    undead boolean NOT NULL,
    weaponsmith boolean NOT NULL,
    armorer boolean NOT NULL,
    cleric boolean NOT NULL,
    mage boolean NOT NULL,
    ranger boolean NOT NULL,
    warrior boolean NOT NULL,
    "noAlign" boolean NOT NULL,
    "noPurge" boolean NOT NULL,
    outdoors boolean NOT NULL,
    indoors boolean NOT NULL,
    mount boolean NOT NULL,
    healer boolean NOT NULL,
    gain boolean NOT NULL,
    changer boolean NOT NULL,
    "noTrans" boolean NOT NULL
);


ALTER TABLE public.mob_traits_entity OWNER TO postgres;

--
-- Name: mob_traits_entity_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.mob_traits_entity_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.mob_traits_entity_id_seq OWNER TO postgres;

--
-- Name: mob_traits_entity_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.mob_traits_entity_id_seq OWNED BY public.mob_traits_entity.id;


--
-- Name: offensive_traits_entity; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.offensive_traits_entity (
    id integer NOT NULL,
    uuid uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "areaAttack" boolean DEFAULT false NOT NULL,
    backstab boolean DEFAULT false NOT NULL,
    bash boolean DEFAULT false NOT NULL,
    berserk boolean DEFAULT false NOT NULL,
    disarm boolean DEFAULT false NOT NULL,
    dodge boolean DEFAULT false NOT NULL,
    fade boolean DEFAULT false NOT NULL,
    fast boolean DEFAULT false NOT NULL,
    kick boolean DEFAULT false NOT NULL,
    "kickDirt" boolean DEFAULT false NOT NULL,
    parry boolean DEFAULT false NOT NULL,
    rescue boolean DEFAULT false NOT NULL,
    tail boolean DEFAULT false NOT NULL,
    trip boolean DEFAULT false NOT NULL,
    crush boolean DEFAULT false NOT NULL,
    "assistAll" boolean DEFAULT false NOT NULL,
    "assistAlign" boolean DEFAULT false NOT NULL,
    "assistRace" boolean DEFAULT false NOT NULL,
    "assistPlayers" boolean DEFAULT false NOT NULL,
    "assistGuard" boolean DEFAULT false NOT NULL,
    "assistVnum" boolean DEFAULT false NOT NULL,
    "offCharge" boolean DEFAULT false NOT NULL,
    "assistElement" boolean DEFAULT false NOT NULL
);


ALTER TABLE public.offensive_traits_entity OWNER TO postgres;

--
-- Name: offensive_traits_entity_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.offensive_traits_entity_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.offensive_traits_entity_id_seq OWNER TO postgres;

--
-- Name: offensive_traits_entity_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.offensive_traits_entity_id_seq OWNED BY public.offensive_traits_entity.id;


--
-- Name: payment_method_entity; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payment_method_entity (
    id integer NOT NULL,
    uuid uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    created timestamp without time zone DEFAULT now() NOT NULL,
    "stripePaymentMethodId" character varying NOT NULL,
    nickname character varying NOT NULL,
    "playerId" integer
);


ALTER TABLE public.payment_method_entity OWNER TO postgres;

--
-- Name: payment_method_entity_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.payment_method_entity_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.payment_method_entity_id_seq OWNER TO postgres;

--
-- Name: payment_method_entity_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.payment_method_entity_id_seq OWNED BY public.payment_method_entity.id;


--
-- Name: player_entity; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.player_entity (
    id integer NOT NULL,
    uuid uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying,
    email character varying NOT NULL,
    password character varying NOT NULL,
    "lastLogin" timestamp without time zone,
    kills integer DEFAULT 0 NOT NULL,
    deaths integer DEFAULT 0 NOT NULL,
    "stripeCustomerId" character varying,
    "stripeSubscriptionId" character varying
);


ALTER TABLE public.player_entity OWNER TO postgres;

--
-- Name: player_entity_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.player_entity_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.player_entity_id_seq OWNER TO postgres;

--
-- Name: player_entity_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.player_entity_id_seq OWNED BY public.player_entity.id;


--
-- Name: player_mob_entity; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.player_mob_entity (
    id integer NOT NULL,
    uuid uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    trains integer DEFAULT 0 NOT NULL,
    practices integer DEFAULT 0 NOT NULL,
    hunger integer DEFAULT 0 NOT NULL,
    appetite integer DEFAULT 0 NOT NULL,
    experience integer DEFAULT 0 NOT NULL,
    "experienceToLevel" integer DEFAULT 0 NOT NULL,
    "experiencePerLevel" integer DEFAULT 0 NOT NULL,
    standing text NOT NULL,
    "authorizationLevel" integer NOT NULL,
    bounty integer DEFAULT 0 NOT NULL,
    title character varying DEFAULT 'the acolyte'::character varying NOT NULL,
    "mobId" integer,
    "trainedAttributesId" integer
);


ALTER TABLE public.player_mob_entity OWNER TO postgres;

--
-- Name: player_mob_entity_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.player_mob_entity_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.player_mob_entity_id_seq OWNER TO postgres;

--
-- Name: player_mob_entity_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.player_mob_entity_id_seq OWNED BY public.player_mob_entity.id;


--
-- Name: recipe_entity; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.recipe_entity (
    id integer NOT NULL,
    uuid uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "importId" character varying NOT NULL,
    "spellType" integer NOT NULL,
    difficulty integer NOT NULL,
    "forgeId" integer
);


ALTER TABLE public.recipe_entity OWNER TO postgres;

--
-- Name: recipe_entity_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.recipe_entity_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.recipe_entity_id_seq OWNER TO postgres;

--
-- Name: recipe_entity_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.recipe_entity_id_seq OWNED BY public.recipe_entity.id;


--
-- Name: region_entity; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.region_entity (
    id integer NOT NULL,
    uuid uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying,
    terrain integer NOT NULL
);


ALTER TABLE public.region_entity OWNER TO postgres;

--
-- Name: region_entity_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.region_entity_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.region_entity_id_seq OWNER TO postgres;

--
-- Name: region_entity_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.region_entity_id_seq OWNED BY public.region_entity.id;


--
-- Name: room_entity; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.room_entity (
    id integer NOT NULL,
    uuid uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "canonicalId" integer,
    name character varying NOT NULL,
    description character varying NOT NULL,
    area character varying NOT NULL,
    "inventoryId" integer,
    "regionId" integer
);


ALTER TABLE public.room_entity OWNER TO postgres;

--
-- Name: room_entity_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.room_entity_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.room_entity_id_seq OWNER TO postgres;

--
-- Name: room_entity_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.room_entity_id_seq OWNED BY public.room_entity.id;


--
-- Name: shop_entity; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.shop_entity (
    id integer NOT NULL,
    uuid uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "buyModifier" integer NOT NULL,
    "sellModifier" integer NOT NULL,
    "openHour" integer NOT NULL,
    "closeHour" integer NOT NULL
);


ALTER TABLE public.shop_entity OWNER TO postgres;

--
-- Name: shop_entity_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.shop_entity_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.shop_entity_id_seq OWNER TO postgres;

--
-- Name: shop_entity_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.shop_entity_id_seq OWNED BY public.shop_entity.id;


--
-- Name: skill_entity; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.skill_entity (
    id integer NOT NULL,
    "skillType" text NOT NULL,
    level integer DEFAULT 1 NOT NULL,
    "levelObtained" integer NOT NULL,
    "mobId" integer
);


ALTER TABLE public.skill_entity OWNER TO postgres;

--
-- Name: skill_entity_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.skill_entity_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.skill_entity_id_seq OWNER TO postgres;

--
-- Name: skill_entity_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.skill_entity_id_seq OWNED BY public.skill_entity.id;


--
-- Name: spell_entity; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.spell_entity (
    id integer NOT NULL,
    "spellType" text NOT NULL,
    level integer DEFAULT 1 NOT NULL,
    "levelObtained" integer NOT NULL,
    "mobId" integer
);


ALTER TABLE public.spell_entity OWNER TO postgres;

--
-- Name: spell_entity_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.spell_entity_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.spell_entity_id_seq OWNER TO postgres;

--
-- Name: spell_entity_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.spell_entity_id_seq OWNED BY public.spell_entity.id;


--
-- Name: tick_entity; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tick_entity (
    id integer NOT NULL,
    uuid uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    created timestamp without time zone DEFAULT now() NOT NULL,
    "numberOfMobs" integer NOT NULL,
    "numberOfPlayers" integer NOT NULL,
    "timeOfDay" integer NOT NULL
);


ALTER TABLE public.tick_entity OWNER TO postgres;

--
-- Name: tick_entity_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tick_entity_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tick_entity_id_seq OWNER TO postgres;

--
-- Name: tick_entity_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tick_entity_id_seq OWNED BY public.tick_entity.id;


--
-- Name: affect_entity id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.affect_entity ALTER COLUMN id SET DEFAULT nextval('public.affect_entity_id_seq'::regclass);


--
-- Name: attributes_entity id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attributes_entity ALTER COLUMN id SET DEFAULT nextval('public.attributes_entity_id_seq'::regclass);


--
-- Name: container_entity id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.container_entity ALTER COLUMN id SET DEFAULT nextval('public.container_entity_id_seq'::regclass);


--
-- Name: damage_source_entity id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.damage_source_entity ALTER COLUMN id SET DEFAULT nextval('public.damage_source_entity_id_seq'::regclass);


--
-- Name: door_entity id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.door_entity ALTER COLUMN id SET DEFAULT nextval('public.door_entity_id_seq'::regclass);


--
-- Name: drink_entity id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.drink_entity ALTER COLUMN id SET DEFAULT nextval('public.drink_entity_id_seq'::regclass);


--
-- Name: equipped_entity id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.equipped_entity ALTER COLUMN id SET DEFAULT nextval('public.equipped_entity_id_seq'::regclass);


--
-- Name: exit_entity id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.exit_entity ALTER COLUMN id SET DEFAULT nextval('public.exit_entity_id_seq'::regclass);


--
-- Name: food_entity id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.food_entity ALTER COLUMN id SET DEFAULT nextval('public.food_entity_id_seq'::regclass);


--
-- Name: forge_entity id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.forge_entity ALTER COLUMN id SET DEFAULT nextval('public.forge_entity_id_seq'::regclass);


--
-- Name: inventory_entity id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory_entity ALTER COLUMN id SET DEFAULT nextval('public.inventory_entity_id_seq'::regclass);


--
-- Name: item_container_reset_entity id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.item_container_reset_entity ALTER COLUMN id SET DEFAULT nextval('public.item_container_reset_entity_id_seq'::regclass);


--
-- Name: item_entity id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.item_entity ALTER COLUMN id SET DEFAULT nextval('public.item_entity_id_seq'::regclass);


--
-- Name: item_mob_reset_entity id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.item_mob_reset_entity ALTER COLUMN id SET DEFAULT nextval('public.item_mob_reset_entity_id_seq'::regclass);


--
-- Name: item_reset_entity id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.item_reset_entity ALTER COLUMN id SET DEFAULT nextval('public.item_reset_entity_id_seq'::regclass);


--
-- Name: item_room_reset_entity id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.item_room_reset_entity ALTER COLUMN id SET DEFAULT nextval('public.item_room_reset_entity_id_seq'::regclass);


--
-- Name: mob_entity id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mob_entity ALTER COLUMN id SET DEFAULT nextval('public.mob_entity_id_seq'::regclass);


--
-- Name: mob_equip_reset_entity id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mob_equip_reset_entity ALTER COLUMN id SET DEFAULT nextval('public.mob_equip_reset_entity_id_seq'::regclass);


--
-- Name: mob_location_entity id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mob_location_entity ALTER COLUMN id SET DEFAULT nextval('public.mob_location_entity_id_seq'::regclass);


--
-- Name: mob_reset_entity id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mob_reset_entity ALTER COLUMN id SET DEFAULT nextval('public.mob_reset_entity_id_seq'::regclass);


--
-- Name: mob_traits_entity id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mob_traits_entity ALTER COLUMN id SET DEFAULT nextval('public.mob_traits_entity_id_seq'::regclass);


--
-- Name: offensive_traits_entity id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.offensive_traits_entity ALTER COLUMN id SET DEFAULT nextval('public.offensive_traits_entity_id_seq'::regclass);


--
-- Name: payment_method_entity id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment_method_entity ALTER COLUMN id SET DEFAULT nextval('public.payment_method_entity_id_seq'::regclass);


--
-- Name: player_entity id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.player_entity ALTER COLUMN id SET DEFAULT nextval('public.player_entity_id_seq'::regclass);


--
-- Name: player_mob_entity id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.player_mob_entity ALTER COLUMN id SET DEFAULT nextval('public.player_mob_entity_id_seq'::regclass);


--
-- Name: recipe_entity id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recipe_entity ALTER COLUMN id SET DEFAULT nextval('public.recipe_entity_id_seq'::regclass);


--
-- Name: region_entity id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.region_entity ALTER COLUMN id SET DEFAULT nextval('public.region_entity_id_seq'::regclass);


--
-- Name: room_entity id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.room_entity ALTER COLUMN id SET DEFAULT nextval('public.room_entity_id_seq'::regclass);


--
-- Name: shop_entity id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shop_entity ALTER COLUMN id SET DEFAULT nextval('public.shop_entity_id_seq'::regclass);


--
-- Name: skill_entity id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.skill_entity ALTER COLUMN id SET DEFAULT nextval('public.skill_entity_id_seq'::regclass);


--
-- Name: spell_entity id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.spell_entity ALTER COLUMN id SET DEFAULT nextval('public.spell_entity_id_seq'::regclass);


--
-- Name: tick_entity id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tick_entity ALTER COLUMN id SET DEFAULT nextval('public.tick_entity_id_seq'::regclass);


--
-- Data for Name: affect_entity; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.affect_entity (id, "affectType", timeout, level, "mobId", "itemId", "attributesId", "immuneId", "resistId", "vulnerableId") FROM stdin;
\.


--
-- Data for Name: attributes_entity; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.attributes_entity (id, hit, dam, hp, mana, mv, str, "int", wis, dex, con, sta, "acPierce", "acBash", "acSlash", "acMagic", "mobId") FROM stdin;
\.


--
-- Data for Name: container_entity; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.container_entity (id, uuid, "isOpen", "isCloseable", "weightCapacity", "itemCapacity", "maxWeightForItem", "inventoryId") FROM stdin;
\.


--
-- Data for Name: damage_source_entity; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.damage_source_entity (id, uuid, summon, charm, magic, weapon, bash, slash, pierce, fire, cold, lightning, acid, poison, negative, holy, energy, mental, disease, drowning, light, sound, wood, silver, iron, distraction) FROM stdin;
\.


--
-- Data for Name: door_entity; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.door_entity (id, "canonicalId", name, "unlockedByCanonicalId", "isClosed", "isLocked", "isPickproof", "lockpickDifficulty", "noClose", "noLock", "isConcealed") FROM stdin;
\.


--
-- Data for Name: drink_entity; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.drink_entity (id, uuid, liquid, capacity, "drinkAmount", "foodAmount") FROM stdin;
\.


--
-- Data for Name: equipped_entity; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.equipped_entity (id, "inventoryId") FROM stdin;
\.


--
-- Data for Name: exit_entity; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.exit_entity (id, direction, "sourceId", "destinationId", "doorId") FROM stdin;
\.


--
-- Data for Name: food_entity; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.food_entity (id, uuid, "foodAmount", "drinkAmount") FROM stdin;
\.


--
-- Data for Name: forge_entity; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.forge_entity (id, uuid) FROM stdin;
\.


--
-- Data for Name: inventory_entity; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.inventory_entity (id, uuid) FROM stdin;
\.


--
-- Data for Name: item_container_reset_entity; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.item_container_reset_entity (id, uuid, "equipmentPosition", "maxQuantity", "maxPerRoom", "itemId", "itemDestinationId") FROM stdin;
\.


--
-- Data for Name: item_entity; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.item_entity (id, uuid, "canonicalId", "canonicalIdentifier", name, brief, description, equipment, "itemType", value, hunger, "isTransferable", level, weight, material, condition, identified, capacity, "wearTimer", "weaponType", "damageType", "weaponEffects", "attackVerb", "maxCharges", "currentCharges", "spellType", "castLevel", "inventoryId", "attributesId", "containerId", "foodId", "drinkId", "forgeId") FROM stdin;
\.


--
-- Data for Name: item_mob_reset_entity; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.item_mob_reset_entity (id, uuid, "equipmentPosition", "maxQuantity", "maxPerRoom", "itemId", "mobId") FROM stdin;
\.


--
-- Data for Name: item_reset_entity; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.item_reset_entity (id, uuid, "equipmentPosition", "maxQuantity", "maxPerRoom", "itemId") FROM stdin;
\.


--
-- Data for Name: item_room_reset_entity; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.item_room_reset_entity (id, uuid, "equipmentPosition", "maxQuantity", "maxPerRoom", "itemId", "roomId") FROM stdin;
\.


--
-- Data for Name: mob_entity; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.mob_entity (id, uuid, "canonicalId", name, description, brief, "raceType", "specializationType", level, gold, gender, disposition, "importId", alignment, hp, mana, mv, "immuneId", "resistId", "vulnerableId", "traitsId", "offensiveTraitsId", "shopId", "playerId", "inventoryId", "equippedId") FROM stdin;
\.


--
-- Data for Name: mob_equip_reset_entity; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.mob_equip_reset_entity (id, uuid, "equipmentPosition", "maxQuantity", "maxPerRoom", "itemId", "mobId") FROM stdin;
\.


--
-- Data for Name: mob_location_entity; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.mob_location_entity (id, uuid, "roomId") FROM stdin;
\.


--
-- Data for Name: mob_reset_entity; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.mob_reset_entity (id, uuid, disposition, "maxQuantity", "maxPerRoom", "mobId", "roomId") FROM stdin;
\.


--
-- Data for Name: mob_traits_entity; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.mob_traits_entity (id, uuid, "isNpc", wanders, scavenger, aggressive, "stayArea", wimpy, "isPet", trainer, practice, undead, weaponsmith, armorer, cleric, mage, ranger, warrior, "noAlign", "noPurge", outdoors, indoors, mount, healer, gain, changer, "noTrans") FROM stdin;
\.


--
-- Data for Name: offensive_traits_entity; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.offensive_traits_entity (id, uuid, "areaAttack", backstab, bash, berserk, disarm, dodge, fade, fast, kick, "kickDirt", parry, rescue, tail, trip, crush, "assistAll", "assistAlign", "assistRace", "assistPlayers", "assistGuard", "assistVnum", "offCharge", "assistElement") FROM stdin;
\.


--
-- Data for Name: payment_method_entity; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.payment_method_entity (id, uuid, created, "stripePaymentMethodId", nickname, "playerId") FROM stdin;
\.


--
-- Data for Name: player_entity; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.player_entity (id, uuid, name, email, password, "lastLogin", kills, deaths, "stripeCustomerId", "stripeSubscriptionId") FROM stdin;
\.


--
-- Data for Name: player_mob_entity; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.player_mob_entity (id, uuid, trains, practices, hunger, appetite, experience, "experienceToLevel", "experiencePerLevel", standing, "authorizationLevel", bounty, title, "mobId", "trainedAttributesId") FROM stdin;
\.


--
-- Data for Name: recipe_entity; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.recipe_entity (id, uuid, "importId", "spellType", difficulty, "forgeId") FROM stdin;
\.


--
-- Data for Name: region_entity; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.region_entity (id, uuid, name, terrain) FROM stdin;
\.


--
-- Data for Name: room_entity; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.room_entity (id, uuid, "canonicalId", name, description, area, "inventoryId", "regionId") FROM stdin;
\.


--
-- Data for Name: shop_entity; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.shop_entity (id, uuid, "buyModifier", "sellModifier", "openHour", "closeHour") FROM stdin;
\.


--
-- Data for Name: skill_entity; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.skill_entity (id, "skillType", level, "levelObtained", "mobId") FROM stdin;
\.


--
-- Data for Name: spell_entity; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.spell_entity (id, "spellType", level, "levelObtained", "mobId") FROM stdin;
\.


--
-- Data for Name: tick_entity; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tick_entity (id, uuid, created, "numberOfMobs", "numberOfPlayers", "timeOfDay") FROM stdin;
\.


--
-- Name: affect_entity_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.affect_entity_id_seq', 1, false);


--
-- Name: attributes_entity_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.attributes_entity_id_seq', 1, false);


--
-- Name: container_entity_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.container_entity_id_seq', 1, false);


--
-- Name: damage_source_entity_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.damage_source_entity_id_seq', 1, false);


--
-- Name: door_entity_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.door_entity_id_seq', 1, false);


--
-- Name: drink_entity_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.drink_entity_id_seq', 1, false);


--
-- Name: equipped_entity_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.equipped_entity_id_seq', 1, false);


--
-- Name: exit_entity_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.exit_entity_id_seq', 1, false);


--
-- Name: food_entity_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.food_entity_id_seq', 1, false);


--
-- Name: forge_entity_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.forge_entity_id_seq', 1, false);


--
-- Name: inventory_entity_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.inventory_entity_id_seq', 1, false);


--
-- Name: item_container_reset_entity_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.item_container_reset_entity_id_seq', 1, false);


--
-- Name: item_entity_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.item_entity_id_seq', 1, false);


--
-- Name: item_mob_reset_entity_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.item_mob_reset_entity_id_seq', 1, false);


--
-- Name: item_reset_entity_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.item_reset_entity_id_seq', 1, false);


--
-- Name: item_room_reset_entity_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.item_room_reset_entity_id_seq', 1, false);


--
-- Name: mob_entity_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.mob_entity_id_seq', 1, false);


--
-- Name: mob_equip_reset_entity_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.mob_equip_reset_entity_id_seq', 1, false);


--
-- Name: mob_location_entity_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.mob_location_entity_id_seq', 1, false);


--
-- Name: mob_reset_entity_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.mob_reset_entity_id_seq', 1, false);


--
-- Name: mob_traits_entity_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.mob_traits_entity_id_seq', 1, false);


--
-- Name: offensive_traits_entity_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.offensive_traits_entity_id_seq', 1, false);


--
-- Name: payment_method_entity_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.payment_method_entity_id_seq', 1, false);


--
-- Name: player_entity_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.player_entity_id_seq', 1, false);


--
-- Name: player_mob_entity_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.player_mob_entity_id_seq', 1, false);


--
-- Name: recipe_entity_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.recipe_entity_id_seq', 1, false);


--
-- Name: region_entity_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.region_entity_id_seq', 1, false);


--
-- Name: room_entity_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.room_entity_id_seq', 1, false);


--
-- Name: shop_entity_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.shop_entity_id_seq', 1, false);


--
-- Name: skill_entity_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.skill_entity_id_seq', 1, false);


--
-- Name: spell_entity_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.spell_entity_id_seq', 1, false);


--
-- Name: tick_entity_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tick_entity_id_seq', 1, false);


--
-- Name: forge_entity PK_056aadfdac7800fb6ddd9b87956; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.forge_entity
    ADD CONSTRAINT "PK_056aadfdac7800fb6ddd9b87956" PRIMARY KEY (id);


--
-- Name: mob_entity PK_0c65ddf49525373a837d4a8132e; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mob_entity
    ADD CONSTRAINT "PK_0c65ddf49525373a837d4a8132e" PRIMARY KEY (id);


--
-- Name: item_room_reset_entity PK_0cbf181cc4edabb90665e265c67; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.item_room_reset_entity
    ADD CONSTRAINT "PK_0cbf181cc4edabb90665e265c67" PRIMARY KEY (id);


--
-- Name: container_entity PK_0ea3a2f74453d6ce8d86ec78e39; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.container_entity
    ADD CONSTRAINT "PK_0ea3a2f74453d6ce8d86ec78e39" PRIMARY KEY (id);


--
-- Name: player_mob_entity PK_269214d35dd64708c459fedb5d3; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.player_mob_entity
    ADD CONSTRAINT "PK_269214d35dd64708c459fedb5d3" PRIMARY KEY (id);


--
-- Name: offensive_traits_entity PK_330238b3ee33a459c38cc0b4ab9; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.offensive_traits_entity
    ADD CONSTRAINT "PK_330238b3ee33a459c38cc0b4ab9" PRIMARY KEY (id);


--
-- Name: region_entity PK_387f37fbb418e96eddc9c95c83a; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.region_entity
    ADD CONSTRAINT "PK_387f37fbb418e96eddc9c95c83a" PRIMARY KEY (id);


--
-- Name: item_container_reset_entity PK_38f50c3a407580ba3ac11d9da4d; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.item_container_reset_entity
    ADD CONSTRAINT "PK_38f50c3a407580ba3ac11d9da4d" PRIMARY KEY (id);


--
-- Name: mob_equip_reset_entity PK_3b091b6e0212695cba2b95befbb; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mob_equip_reset_entity
    ADD CONSTRAINT "PK_3b091b6e0212695cba2b95befbb" PRIMARY KEY (id);


--
-- Name: exit_entity PK_4de44e8fa45fa2b44a85306d16b; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.exit_entity
    ADD CONSTRAINT "PK_4de44e8fa45fa2b44a85306d16b" PRIMARY KEY (id);


--
-- Name: shop_entity PK_71ee9725083bac8f639a212d78c; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shop_entity
    ADD CONSTRAINT "PK_71ee9725083bac8f639a212d78c" PRIMARY KEY (id);


--
-- Name: food_entity PK_7a42d197fa2c45973b61ee7bfb4; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.food_entity
    ADD CONSTRAINT "PK_7a42d197fa2c45973b61ee7bfb4" PRIMARY KEY (id);


--
-- Name: inventory_entity PK_7c4147480da3e3ccea8c3168d5f; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory_entity
    ADD CONSTRAINT "PK_7c4147480da3e3ccea8c3168d5f" PRIMARY KEY (id);


--
-- Name: door_entity PK_81d831fac15f7dcbc1d6e93c36b; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.door_entity
    ADD CONSTRAINT "PK_81d831fac15f7dcbc1d6e93c36b" PRIMARY KEY (id);


--
-- Name: payment_method_entity PK_95d1c38191cd0b8714198d8151b; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment_method_entity
    ADD CONSTRAINT "PK_95d1c38191cd0b8714198d8151b" PRIMARY KEY (id);


--
-- Name: equipped_entity PK_aabf9a8610049c8edb72484baed; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.equipped_entity
    ADD CONSTRAINT "PK_aabf9a8610049c8edb72484baed" PRIMARY KEY (id);


--
-- Name: item_mob_reset_entity PK_afd2834de465b7fe707786080ea; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.item_mob_reset_entity
    ADD CONSTRAINT "PK_afd2834de465b7fe707786080ea" PRIMARY KEY (id);


--
-- Name: damage_source_entity PK_b7f2aef06b023f5a5818f23c7ca; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.damage_source_entity
    ADD CONSTRAINT "PK_b7f2aef06b023f5a5818f23c7ca" PRIMARY KEY (id);


--
-- Name: mob_location_entity PK_b951cd242ecd9b80054d25b0e2e; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mob_location_entity
    ADD CONSTRAINT "PK_b951cd242ecd9b80054d25b0e2e" PRIMARY KEY (id);


--
-- Name: tick_entity PK_c426279bf6cb1348a134bcb8245; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tick_entity
    ADD CONSTRAINT "PK_c426279bf6cb1348a134bcb8245" PRIMARY KEY (id);


--
-- Name: player_entity PK_db4a0b692e54fd8ee0247f40d0d; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.player_entity
    ADD CONSTRAINT "PK_db4a0b692e54fd8ee0247f40d0d" PRIMARY KEY (id);


--
-- Name: recipe_entity PK_dff5f6e950c25a6342d6181fe60; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recipe_entity
    ADD CONSTRAINT "PK_dff5f6e950c25a6342d6181fe60" PRIMARY KEY (id);


--
-- Name: attributes_entity PK_e8ffbe7af393d91964680e5e7d4; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attributes_entity
    ADD CONSTRAINT "PK_e8ffbe7af393d91964680e5e7d4" PRIMARY KEY (id);


--
-- Name: skill_entity PK_f15d4d9999e79c842fdef236ecc; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.skill_entity
    ADD CONSTRAINT "PK_f15d4d9999e79c842fdef236ecc" PRIMARY KEY (id);


--
-- Name: affect_entity PK_f443f87ea21ae5e36be4cb04db6; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.affect_entity
    ADD CONSTRAINT "PK_f443f87ea21ae5e36be4cb04db6" PRIMARY KEY (id);


--
-- Name: mob_traits_entity PK_f5dc89d6b5b44e544a350e1b13f; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mob_traits_entity
    ADD CONSTRAINT "PK_f5dc89d6b5b44e544a350e1b13f" PRIMARY KEY (id);


--
-- Name: mob_reset_entity PK_f7ddf019e288041442171e33d81; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mob_reset_entity
    ADD CONSTRAINT "PK_f7ddf019e288041442171e33d81" PRIMARY KEY (id);


--
-- Name: item_reset_entity PK_f8a1b7c47215ea5403990b0250c; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.item_reset_entity
    ADD CONSTRAINT "PK_f8a1b7c47215ea5403990b0250c" PRIMARY KEY (id);


--
-- Name: item_entity PK_f8a329b22f66835df041692589d; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.item_entity
    ADD CONSTRAINT "PK_f8a329b22f66835df041692589d" PRIMARY KEY (id);


--
-- Name: room_entity PK_fc9fe8e7b09bbbeea55ba770e1a; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.room_entity
    ADD CONSTRAINT "PK_fc9fe8e7b09bbbeea55ba770e1a" PRIMARY KEY (id);


--
-- Name: drink_entity PK_fd8bdcc796dc7975cb1b0447369; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.drink_entity
    ADD CONSTRAINT "PK_fd8bdcc796dc7975cb1b0447369" PRIMARY KEY (id);


--
-- Name: spell_entity PK_fee6fd29b831c043df5e6ef4fb1; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.spell_entity
    ADD CONSTRAINT "PK_fee6fd29b831c043df5e6ef4fb1" PRIMARY KEY (id);


--
-- Name: mob_entity REL_0d5cc0f944376cf9dbf6a6df52; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mob_entity
    ADD CONSTRAINT "REL_0d5cc0f944376cf9dbf6a6df52" UNIQUE ("resistId");


--
-- Name: container_entity REL_2a027b80474c58219bcc133e5e; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.container_entity
    ADD CONSTRAINT "REL_2a027b80474c58219bcc133e5e" UNIQUE ("inventoryId");


--
-- Name: item_entity REL_2d9b347411eff6b8c40da7e090; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.item_entity
    ADD CONSTRAINT "REL_2d9b347411eff6b8c40da7e090" UNIQUE ("attributesId");


--
-- Name: mob_entity REL_411d3a8fc3fe9bae60bfaf2dad; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mob_entity
    ADD CONSTRAINT "REL_411d3a8fc3fe9bae60bfaf2dad" UNIQUE ("offensiveTraitsId");


--
-- Name: affect_entity REL_4a667324c83e7412914b5abe5b; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.affect_entity
    ADD CONSTRAINT "REL_4a667324c83e7412914b5abe5b" UNIQUE ("vulnerableId");


--
-- Name: mob_entity REL_5035afd08e1e9c48cddf8e4c5b; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mob_entity
    ADD CONSTRAINT "REL_5035afd08e1e9c48cddf8e4c5b" UNIQUE ("equippedId");


--
-- Name: affect_entity REL_53ae73a7bc0707f4a31dfcfcf5; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.affect_entity
    ADD CONSTRAINT "REL_53ae73a7bc0707f4a31dfcfcf5" UNIQUE ("resistId");


--
-- Name: exit_entity REL_6432da59626d476a0c746f840b; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.exit_entity
    ADD CONSTRAINT "REL_6432da59626d476a0c746f840b" UNIQUE ("doorId");


--
-- Name: item_entity REL_7594d22ab9776f1f53224e399d; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.item_entity
    ADD CONSTRAINT "REL_7594d22ab9776f1f53224e399d" UNIQUE ("forgeId");


--
-- Name: equipped_entity REL_7729e1a58eb28f22378fca5d38; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.equipped_entity
    ADD CONSTRAINT "REL_7729e1a58eb28f22378fca5d38" UNIQUE ("inventoryId");


--
-- Name: item_entity REL_79fa0cf9bc9c513a5bd6a7b2b7; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.item_entity
    ADD CONSTRAINT "REL_79fa0cf9bc9c513a5bd6a7b2b7" UNIQUE ("drinkId");


--
-- Name: mob_entity REL_864b969cbc0748e8a9607375f2; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mob_entity
    ADD CONSTRAINT "REL_864b969cbc0748e8a9607375f2" UNIQUE ("shopId");


--
-- Name: player_mob_entity REL_9352e9835159b06f7411bec8ad; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.player_mob_entity
    ADD CONSTRAINT "REL_9352e9835159b06f7411bec8ad" UNIQUE ("mobId");


--
-- Name: affect_entity REL_9b7bc50bd786efe105e3cad244; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.affect_entity
    ADD CONSTRAINT "REL_9b7bc50bd786efe105e3cad244" UNIQUE ("immuneId");


--
-- Name: item_entity REL_9bcb4b5e6f4bad7330e79bfcf9; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.item_entity
    ADD CONSTRAINT "REL_9bcb4b5e6f4bad7330e79bfcf9" UNIQUE ("foodId");


--
-- Name: room_entity REL_9d275801d12be1a10f563e4a44; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.room_entity
    ADD CONSTRAINT "REL_9d275801d12be1a10f563e4a44" UNIQUE ("inventoryId");


--
-- Name: mob_entity REL_abf1d7df683e52dde234e283de; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mob_entity
    ADD CONSTRAINT "REL_abf1d7df683e52dde234e283de" UNIQUE ("immuneId");


--
-- Name: affect_entity REL_ac1133a804fdae02905f4ca624; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.affect_entity
    ADD CONSTRAINT "REL_ac1133a804fdae02905f4ca624" UNIQUE ("attributesId");


--
-- Name: item_entity REL_adeae7c71bd311c808ab40cc9e; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.item_entity
    ADD CONSTRAINT "REL_adeae7c71bd311c808ab40cc9e" UNIQUE ("containerId");


--
-- Name: player_mob_entity REL_b9e2a367e4f09c61dffe29bd28; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.player_mob_entity
    ADD CONSTRAINT "REL_b9e2a367e4f09c61dffe29bd28" UNIQUE ("trainedAttributesId");


--
-- Name: mob_entity REL_cc42e3149672473264d3598660; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mob_entity
    ADD CONSTRAINT "REL_cc42e3149672473264d3598660" UNIQUE ("vulnerableId");


--
-- Name: mob_entity REL_d05532f31078ad2766a53d37ea; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mob_entity
    ADD CONSTRAINT "REL_d05532f31078ad2766a53d37ea" UNIQUE ("inventoryId");


--
-- Name: mob_entity REL_d58c06b09a2e3054e7b4fc355b; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mob_entity
    ADD CONSTRAINT "REL_d58c06b09a2e3054e7b4fc355b" UNIQUE ("traitsId");


--
-- Name: player_entity UQ_55b66b9090d15a4af623afb4275; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.player_entity
    ADD CONSTRAINT "UQ_55b66b9090d15a4af623afb4275" UNIQUE (email);


--
-- Name: room_entity FK_0314bd381c4492d9d2a5557e798; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.room_entity
    ADD CONSTRAINT "FK_0314bd381c4492d9d2a5557e798" FOREIGN KEY ("regionId") REFERENCES public.region_entity(id);


--
-- Name: affect_entity FK_04a2ea95944071d9b74f239791b; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.affect_entity
    ADD CONSTRAINT "FK_04a2ea95944071d9b74f239791b" FOREIGN KEY ("mobId") REFERENCES public.mob_entity(id);


--
-- Name: mob_entity FK_0d5cc0f944376cf9dbf6a6df52d; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mob_entity
    ADD CONSTRAINT "FK_0d5cc0f944376cf9dbf6a6df52d" FOREIGN KEY ("resistId") REFERENCES public.damage_source_entity(id);


--
-- Name: affect_entity FK_0d96430a496870f1c731c6f80cd; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.affect_entity
    ADD CONSTRAINT "FK_0d96430a496870f1c731c6f80cd" FOREIGN KEY ("itemId") REFERENCES public.item_entity(id);


--
-- Name: mob_location_entity FK_178bbce36d3c1c55d18961f2f6f; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mob_location_entity
    ADD CONSTRAINT "FK_178bbce36d3c1c55d18961f2f6f" FOREIGN KEY ("roomId") REFERENCES public.room_entity(id);


--
-- Name: mob_equip_reset_entity FK_1d0ab4a6d2c9a851e38deda9f61; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mob_equip_reset_entity
    ADD CONSTRAINT "FK_1d0ab4a6d2c9a851e38deda9f61" FOREIGN KEY ("mobId") REFERENCES public.mob_entity(id);


--
-- Name: item_room_reset_entity FK_272917024812bbb6b8151fa9c45; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.item_room_reset_entity
    ADD CONSTRAINT "FK_272917024812bbb6b8151fa9c45" FOREIGN KEY ("itemId") REFERENCES public.item_entity(id);


--
-- Name: container_entity FK_2a027b80474c58219bcc133e5e8; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.container_entity
    ADD CONSTRAINT "FK_2a027b80474c58219bcc133e5e8" FOREIGN KEY ("inventoryId") REFERENCES public.inventory_entity(id);


--
-- Name: item_entity FK_2d9b347411eff6b8c40da7e090d; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.item_entity
    ADD CONSTRAINT "FK_2d9b347411eff6b8c40da7e090d" FOREIGN KEY ("attributesId") REFERENCES public.attributes_entity(id);


--
-- Name: item_mob_reset_entity FK_373ed503bfdf2ac24ba5b534e6f; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.item_mob_reset_entity
    ADD CONSTRAINT "FK_373ed503bfdf2ac24ba5b534e6f" FOREIGN KEY ("itemId") REFERENCES public.item_entity(id);


--
-- Name: mob_equip_reset_entity FK_3a2016cd09e22221b71d3417967; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mob_equip_reset_entity
    ADD CONSTRAINT "FK_3a2016cd09e22221b71d3417967" FOREIGN KEY ("itemId") REFERENCES public.item_entity(id);


--
-- Name: item_room_reset_entity FK_3c30f81cf68fb56ebab26cff1d1; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.item_room_reset_entity
    ADD CONSTRAINT "FK_3c30f81cf68fb56ebab26cff1d1" FOREIGN KEY ("roomId") REFERENCES public.room_entity(id);


--
-- Name: mob_entity FK_411d3a8fc3fe9bae60bfaf2dadf; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mob_entity
    ADD CONSTRAINT "FK_411d3a8fc3fe9bae60bfaf2dadf" FOREIGN KEY ("offensiveTraitsId") REFERENCES public.offensive_traits_entity(id);


--
-- Name: mob_entity FK_46df03a17f449af2a8641ebbf52; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mob_entity
    ADD CONSTRAINT "FK_46df03a17f449af2a8641ebbf52" FOREIGN KEY ("playerId") REFERENCES public.player_entity(id);


--
-- Name: affect_entity FK_4a667324c83e7412914b5abe5b6; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.affect_entity
    ADD CONSTRAINT "FK_4a667324c83e7412914b5abe5b6" FOREIGN KEY ("vulnerableId") REFERENCES public.damage_source_entity(id);


--
-- Name: mob_entity FK_5035afd08e1e9c48cddf8e4c5bf; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mob_entity
    ADD CONSTRAINT "FK_5035afd08e1e9c48cddf8e4c5bf" FOREIGN KEY ("equippedId") REFERENCES public.inventory_entity(id);


--
-- Name: affect_entity FK_53ae73a7bc0707f4a31dfcfcf58; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.affect_entity
    ADD CONSTRAINT "FK_53ae73a7bc0707f4a31dfcfcf58" FOREIGN KEY ("resistId") REFERENCES public.damage_source_entity(id);


--
-- Name: item_entity FK_58a280a63a28f91e977713677f3; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.item_entity
    ADD CONSTRAINT "FK_58a280a63a28f91e977713677f3" FOREIGN KEY ("inventoryId") REFERENCES public.inventory_entity(id);


--
-- Name: recipe_entity FK_5d24307cb3784f155683514a3f2; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recipe_entity
    ADD CONSTRAINT "FK_5d24307cb3784f155683514a3f2" FOREIGN KEY ("forgeId") REFERENCES public.forge_entity(id);


--
-- Name: mob_reset_entity FK_5fe7e61fbb0f99f4caffda7de80; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mob_reset_entity
    ADD CONSTRAINT "FK_5fe7e61fbb0f99f4caffda7de80" FOREIGN KEY ("mobId") REFERENCES public.mob_entity(id);


--
-- Name: skill_entity FK_62930362d7cbe09c00a6819329a; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.skill_entity
    ADD CONSTRAINT "FK_62930362d7cbe09c00a6819329a" FOREIGN KEY ("mobId") REFERENCES public.mob_entity(id);


--
-- Name: exit_entity FK_6432da59626d476a0c746f840ba; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.exit_entity
    ADD CONSTRAINT "FK_6432da59626d476a0c746f840ba" FOREIGN KEY ("doorId") REFERENCES public.door_entity(id);


--
-- Name: exit_entity FK_64fe2e0a1766331fc90780a69df; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.exit_entity
    ADD CONSTRAINT "FK_64fe2e0a1766331fc90780a69df" FOREIGN KEY ("destinationId") REFERENCES public.room_entity(id);


--
-- Name: item_mob_reset_entity FK_748094c8f29055aee9c56a0469d; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.item_mob_reset_entity
    ADD CONSTRAINT "FK_748094c8f29055aee9c56a0469d" FOREIGN KEY ("mobId") REFERENCES public.mob_entity(id);


--
-- Name: item_entity FK_7594d22ab9776f1f53224e399d5; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.item_entity
    ADD CONSTRAINT "FK_7594d22ab9776f1f53224e399d5" FOREIGN KEY ("forgeId") REFERENCES public.forge_entity(id);


--
-- Name: equipped_entity FK_7729e1a58eb28f22378fca5d38e; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.equipped_entity
    ADD CONSTRAINT "FK_7729e1a58eb28f22378fca5d38e" FOREIGN KEY ("inventoryId") REFERENCES public.inventory_entity(id);


--
-- Name: item_entity FK_79fa0cf9bc9c513a5bd6a7b2b78; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.item_entity
    ADD CONSTRAINT "FK_79fa0cf9bc9c513a5bd6a7b2b78" FOREIGN KEY ("drinkId") REFERENCES public.drink_entity(id);


--
-- Name: exit_entity FK_8056a4fa745d5bbad09344435fc; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.exit_entity
    ADD CONSTRAINT "FK_8056a4fa745d5bbad09344435fc" FOREIGN KEY ("sourceId") REFERENCES public.room_entity(id);


--
-- Name: mob_reset_entity FK_81157e9d96d71ca25300a47ae5b; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mob_reset_entity
    ADD CONSTRAINT "FK_81157e9d96d71ca25300a47ae5b" FOREIGN KEY ("roomId") REFERENCES public.room_entity(id);


--
-- Name: mob_entity FK_864b969cbc0748e8a9607375f2c; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mob_entity
    ADD CONSTRAINT "FK_864b969cbc0748e8a9607375f2c" FOREIGN KEY ("shopId") REFERENCES public.shop_entity(id);


--
-- Name: item_container_reset_entity FK_8d4af313535f320f1a1a51977b8; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.item_container_reset_entity
    ADD CONSTRAINT "FK_8d4af313535f320f1a1a51977b8" FOREIGN KEY ("itemDestinationId") REFERENCES public.item_entity(id);


--
-- Name: player_mob_entity FK_9352e9835159b06f7411bec8ad7; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.player_mob_entity
    ADD CONSTRAINT "FK_9352e9835159b06f7411bec8ad7" FOREIGN KEY ("mobId") REFERENCES public.mob_entity(id);


--
-- Name: spell_entity FK_964029ce8be8472bf4101596214; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.spell_entity
    ADD CONSTRAINT "FK_964029ce8be8472bf4101596214" FOREIGN KEY ("mobId") REFERENCES public.mob_entity(id);


--
-- Name: affect_entity FK_9b7bc50bd786efe105e3cad2442; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.affect_entity
    ADD CONSTRAINT "FK_9b7bc50bd786efe105e3cad2442" FOREIGN KEY ("immuneId") REFERENCES public.damage_source_entity(id);


--
-- Name: item_entity FK_9bcb4b5e6f4bad7330e79bfcf9e; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.item_entity
    ADD CONSTRAINT "FK_9bcb4b5e6f4bad7330e79bfcf9e" FOREIGN KEY ("foodId") REFERENCES public.food_entity(id);


--
-- Name: room_entity FK_9d275801d12be1a10f563e4a448; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.room_entity
    ADD CONSTRAINT "FK_9d275801d12be1a10f563e4a448" FOREIGN KEY ("inventoryId") REFERENCES public.inventory_entity(id);


--
-- Name: item_container_reset_entity FK_a9d10218524bcd021316e1f8fb9; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.item_container_reset_entity
    ADD CONSTRAINT "FK_a9d10218524bcd021316e1f8fb9" FOREIGN KEY ("itemId") REFERENCES public.item_entity(id);


--
-- Name: mob_entity FK_abf1d7df683e52dde234e283dea; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mob_entity
    ADD CONSTRAINT "FK_abf1d7df683e52dde234e283dea" FOREIGN KEY ("immuneId") REFERENCES public.damage_source_entity(id);


--
-- Name: affect_entity FK_ac1133a804fdae02905f4ca624f; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.affect_entity
    ADD CONSTRAINT "FK_ac1133a804fdae02905f4ca624f" FOREIGN KEY ("attributesId") REFERENCES public.attributes_entity(id);


--
-- Name: item_entity FK_adeae7c71bd311c808ab40cc9e6; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.item_entity
    ADD CONSTRAINT "FK_adeae7c71bd311c808ab40cc9e6" FOREIGN KEY ("containerId") REFERENCES public.container_entity(id);


--
-- Name: player_mob_entity FK_b9e2a367e4f09c61dffe29bd289; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.player_mob_entity
    ADD CONSTRAINT "FK_b9e2a367e4f09c61dffe29bd289" FOREIGN KEY ("trainedAttributesId") REFERENCES public.attributes_entity(id);


--
-- Name: mob_entity FK_cc42e3149672473264d35986607; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mob_entity
    ADD CONSTRAINT "FK_cc42e3149672473264d35986607" FOREIGN KEY ("vulnerableId") REFERENCES public.damage_source_entity(id);


--
-- Name: mob_entity FK_d05532f31078ad2766a53d37ea9; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mob_entity
    ADD CONSTRAINT "FK_d05532f31078ad2766a53d37ea9" FOREIGN KEY ("inventoryId") REFERENCES public.inventory_entity(id);


--
-- Name: mob_entity FK_d58c06b09a2e3054e7b4fc355ba; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mob_entity
    ADD CONSTRAINT "FK_d58c06b09a2e3054e7b4fc355ba" FOREIGN KEY ("traitsId") REFERENCES public.mob_traits_entity(id);


--
-- Name: attributes_entity FK_d77b3da983c5250e493a3781c69; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attributes_entity
    ADD CONSTRAINT "FK_d77b3da983c5250e493a3781c69" FOREIGN KEY ("mobId") REFERENCES public.mob_entity(id);


--
-- Name: item_reset_entity FK_dd4d5640bdef3598e48751cc998; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.item_reset_entity
    ADD CONSTRAINT "FK_dd4d5640bdef3598e48751cc998" FOREIGN KEY ("itemId") REFERENCES public.item_entity(id);


--
-- Name: payment_method_entity FK_e202ddca21d5642f621063a9da8; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment_method_entity
    ADD CONSTRAINT "FK_e202ddca21d5642f621063a9da8" FOREIGN KEY ("playerId") REFERENCES public.player_entity(id);


--
-- PostgreSQL database dump complete
--

