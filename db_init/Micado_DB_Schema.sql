--
-- PostgreSQL database dump
--

-- Dumped from database version 11.14
-- Dumped by pg_dump version 11.14


SET default_with_oids = false;
SET search_path TO micadoapp;

--
-- Name: features_flags; Type: TABLE; Schema: micadoapp; Owner: -
--

CREATE TABLE features_flags (
    id smallint NOT NULL,
    flag_key text,
    enabled boolean DEFAULT false NOT NULL
);


--
-- Name: active_features; Type: VIEW; Schema: micadoapp; Owner: -
--

CREATE VIEW active_features AS
 SELECT json_agg(features_flags.flag_key) AS features
   FROM features_flags
  WHERE (features_flags.enabled = true);


--
-- Name: board_id_seq; Type: SEQUENCE; Schema: micadoapp; Owner: -
--

CREATE SEQUENCE board_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 32767
    CACHE 1;


--
-- Name: board; Type: TABLE; Schema: micadoapp; Owner: -
--

CREATE TABLE board (
    id smallint DEFAULT nextval('board_id_seq'::regclass) NOT NULL,
    name text,
    picture text
);


--
-- Name: charts_id_seq; Type: SEQUENCE; Schema: micadoapp; Owner: -
--

CREATE SEQUENCE charts_id_seq
    AS smallint
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: charts; Type: TABLE; Schema: micadoapp; Owner: -
--

CREATE TABLE charts (
    id smallint DEFAULT nextval('charts_id_seq'::regclass) NOT NULL,
    title text NOT NULL,
    content character varying NOT NULL,
    description character varying,
    category text,
    format text,
    type text,
    xistime boolean,
    x text,
    y text,
    board text,
    provider character varying(100),
    updated date,
    link text,
    function text
);


--
-- Name: comment_translation_prod_id_seq; Type: SEQUENCE; Schema: micadoapp; Owner: -
--

CREATE SEQUENCE comment_translation_prod_id_seq
    AS smallint
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: comment_translation_prod; Type: TABLE; Schema: micadoapp; Owner: -
--

CREATE TABLE comment_translation_prod (
    lang character varying(10) NOT NULL,
    comment text,
    translation_date date,
    id smallint DEFAULT nextval('comment_translation_prod_id_seq'::regclass) NOT NULL
);


--
-- Name: comments; Type: TABLE; Schema: micadoapp; Owner: -
--

CREATE TABLE comments (
    id smallint NOT NULL,
    tenant_id integer NOT NULL,
    published boolean DEFAULT false,
    published_date date
);


--
-- Name: comments_id_seq; Type: SEQUENCE; Schema: micadoapp; Owner: -
--

CREATE SEQUENCE comments_id_seq
    AS smallint
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: comments_id_seq; Type: SEQUENCE OWNED BY; Schema: micadoapp; Owner: -
--

ALTER SEQUENCE comments_id_seq OWNED BY comments.id;


--
-- Name: comments_translation; Type: TABLE; Schema: micadoapp; Owner: -
--

CREATE TABLE comments_translation (
    id smallint NOT NULL,
    lang character varying(10) NOT NULL,
    comment text,
    translation_date date,
    "translationState" integer DEFAULT 0 NOT NULL,
    translated boolean DEFAULT false NOT NULL
);


--
-- Name: completed_intervention_document; Type: TABLE; Schema: micadoapp; Owner: -
--

CREATE TABLE completed_intervention_document (
    id_document smallint NOT NULL,
    id_intervention smallint NOT NULL
);


--
-- Name: document; Type: TABLE; Schema: micadoapp; Owner: -
--

CREATE TABLE document (
    id smallint NOT NULL,
    document_type smallint NOT NULL,
    user_tenant integer,
    ask_validate_by_tenant smallint,
    validated boolean DEFAULT false NOT NULL,
    validation_date timestamp without time zone,
    validated_by_tenant integer,
    validated_by_user integer,
    uploaded_by_me boolean DEFAULT false NOT NULL,
    expiration_date timestamp without time zone,
    shareable boolean DEFAULT false NOT NULL,
    user_id uuid
);


--
-- Name: COLUMN document.ask_validate_by_tenant; Type: COMMENT; Schema: micadoapp; Owner: -
--

COMMENT ON COLUMN document.ask_validate_by_tenant IS 'if the document is of a type that is validable here is where the owner can ask a potential validator to validate it';


--
-- Name: COLUMN document.uploaded_by_me; Type: COMMENT; Schema: micadoapp; Owner: -
--

COMMENT ON COLUMN document.uploaded_by_me IS 'this is used to uinderstand if is uploaded by the owner so that he can edit';


--
-- Name: COLUMN document.expiration_date; Type: COMMENT; Schema: micadoapp; Owner: -
--

COMMENT ON COLUMN document.expiration_date IS 'this will be inserted by hand';


--
-- Name: document_document_type_seq; Type: SEQUENCE; Schema: micadoapp; Owner: -
--

CREATE SEQUENCE document_document_type_seq
    AS smallint
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: document_document_type_seq; Type: SEQUENCE OWNED BY; Schema: micadoapp; Owner: -
--

ALTER SEQUENCE document_document_type_seq OWNED BY document.document_type;


--
-- Name: document_id_seq; Type: SEQUENCE; Schema: micadoapp; Owner: -
--

CREATE SEQUENCE document_id_seq
    AS smallint
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: document_id_seq; Type: SEQUENCE OWNED BY; Schema: micadoapp; Owner: -
--

ALTER SEQUENCE document_id_seq OWNED BY document.id;


--
-- Name: document_pictures_id_seq; Type: SEQUENCE; Schema: micadoapp; Owner: -
--

CREATE SEQUENCE document_pictures_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 32767
    CACHE 1;


--
-- Name: document_pictures; Type: TABLE; Schema: micadoapp; Owner: -
--

CREATE TABLE document_pictures (
    id smallint DEFAULT nextval('document_pictures_id_seq'::regclass) NOT NULL,
    picture text,
    doc_id smallint NOT NULL,
    "order" smallint
);


--
-- Name: document_type; Type: TABLE; Schema: micadoapp; Owner: -
--

CREATE TABLE document_type (
    id smallint NOT NULL,
    icon text,
    issuer character varying(20),
    model text,
    validable boolean DEFAULT false NOT NULL,
    validity_duration smallint,
    model_is_present boolean DEFAULT false,
    published boolean DEFAULT false
);


--
-- Name: COLUMN document_type.issuer; Type: COMMENT; Schema: micadoapp; Owner: -
--

COMMENT ON COLUMN document_type.issuer IS 'free text since not all issuers will have a tenant in MICADO';


--
-- Name: COLUMN document_type.validable; Type: COMMENT; Schema: micadoapp; Owner: -
--

COMMENT ON COLUMN document_type.validable IS 'if trhis document can be validated';


--
-- Name: COLUMN document_type.validity_duration; Type: COMMENT; Schema: micadoapp; Owner: -
--

COMMENT ON COLUMN document_type.validity_duration IS 'the duration of the document in days';


--
-- Name: document_type_id_seq; Type: SEQUENCE; Schema: micadoapp; Owner: -
--

CREATE SEQUENCE document_type_id_seq
    AS smallint
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: document_type_id_seq; Type: SEQUENCE OWNED BY; Schema: micadoapp; Owner: -
--

ALTER SEQUENCE document_type_id_seq OWNED BY document_type.id;


--
-- Name: document_type_picture; Type: TABLE; Schema: micadoapp; Owner: -
--

CREATE TABLE document_type_picture (
    id smallint NOT NULL,
    image text,
    document_type_id smallint NOT NULL,
    "order" integer
);


--
-- Name: document_type_picture_id_seq; Type: SEQUENCE; Schema: micadoapp; Owner: -
--

CREATE SEQUENCE document_type_picture_id_seq
    AS smallint
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: document_type_picture_id_seq; Type: SEQUENCE OWNED BY; Schema: micadoapp; Owner: -
--

ALTER SEQUENCE document_type_picture_id_seq OWNED BY document_type_picture.id;


--
-- Name: document_type_translation; Type: TABLE; Schema: micadoapp; Owner: -
--

CREATE TABLE document_type_translation (
    id smallint NOT NULL,
    lang character varying(10) NOT NULL,
    document character varying(250),
    description text,
    translation_date timestamp without time zone,
    "translationState" integer DEFAULT 0 NOT NULL,
    translated boolean DEFAULT false NOT NULL
);


--
-- Name: document_type_translation_prod; Type: TABLE; Schema: micadoapp; Owner: -
--

CREATE TABLE document_type_translation_prod (
    id smallint NOT NULL,
    lang character varying(10) NOT NULL,
    document character varying(250),
    description text,
    translation_date timestamp without time zone
);


--
-- Name: document_type_validator; Type: TABLE; Schema: micadoapp; Owner: -
--

CREATE TABLE document_type_validator (
    document_type_id smallint NOT NULL,
    validable_by_tenant integer
);


--
-- Name: TABLE document_type_validator; Type: COMMENT; Schema: micadoapp; Owner: -
--

COMMENT ON TABLE document_type_validator IS 'this table map all the organizations that are eligible to validate that tenant';


--
-- Name: event; Type: TABLE; Schema: micadoapp; Owner: -
--

CREATE TABLE event (
    id smallint NOT NULL,
    link character varying(70),
    category smallint,
    start_date timestamp without time zone,
    end_date timestamp without time zone,
    published boolean DEFAULT false,
    location text,
    cost text,
    published_date date,
    username text,
    realm text
);


--
-- Name: event_category; Type: TABLE; Schema: micadoapp; Owner: -
--

CREATE TABLE event_category (
    id smallint NOT NULL,
    icon text,
    link_integration_plan boolean,
    published boolean DEFAULT false
);


--
-- Name: information_category; Type: TABLE; Schema: micadoapp; Owner: -
--

CREATE TABLE information_category (
    id smallint NOT NULL,
    icon text,
    link_integration_plan boolean,
    published boolean DEFAULT false
);


--
-- Name: event_category_id_seq; Type: SEQUENCE; Schema: micadoapp; Owner: -
--

CREATE SEQUENCE event_category_id_seq
    AS smallint
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: event_category_id_seq; Type: SEQUENCE OWNED BY; Schema: micadoapp; Owner: -
--

ALTER SEQUENCE event_category_id_seq OWNED BY information_category.id;


--
-- Name: event_category_id_seq1; Type: SEQUENCE; Schema: micadoapp; Owner: -
--

CREATE SEQUENCE event_category_id_seq1
    AS smallint
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: event_category_id_seq1; Type: SEQUENCE OWNED BY; Schema: micadoapp; Owner: -
--

ALTER SEQUENCE event_category_id_seq1 OWNED BY event_category.id;


--
-- Name: event_category_translation; Type: TABLE; Schema: micadoapp; Owner: -
--

CREATE TABLE event_category_translation (
    id smallint NOT NULL,
    lang character varying(10) NOT NULL,
    event_category text,
    translation_date timestamp without time zone,
    "translationState" integer DEFAULT 0 NOT NULL,
    translated boolean DEFAULT false NOT NULL
);


--
-- Name: event_category_translation_prod; Type: TABLE; Schema: micadoapp; Owner: -
--

CREATE TABLE event_category_translation_prod (
    id smallint NOT NULL,
    lang character varying(10) NOT NULL,
    event_category text,
    translation_date timestamp without time zone
);


--
-- Name: information_category_translation_prod; Type: TABLE; Schema: micadoapp; Owner: -
--

CREATE TABLE information_category_translation_prod (
    id smallint NOT NULL,
    lang character varying(10) NOT NULL,
    information_category text,
    translation_date timestamp without time zone
);


--
-- Name: event_category_translation_prod_id_seq; Type: SEQUENCE; Schema: micadoapp; Owner: -
--

CREATE SEQUENCE event_category_translation_prod_id_seq
    AS smallint
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: event_category_translation_prod_id_seq; Type: SEQUENCE OWNED BY; Schema: micadoapp; Owner: -
--

ALTER SEQUENCE event_category_translation_prod_id_seq OWNED BY information_category_translation_prod.id;


--
-- Name: event_category_translation_prod_id_seq1; Type: SEQUENCE; Schema: micadoapp; Owner: -
--

CREATE SEQUENCE event_category_translation_prod_id_seq1
    AS smallint
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: event_category_translation_prod_id_seq1; Type: SEQUENCE OWNED BY; Schema: micadoapp; Owner: -
--

ALTER SEQUENCE event_category_translation_prod_id_seq1 OWNED BY event_category_translation_prod.id;


--
-- Name: information; Type: TABLE; Schema: micadoapp; Owner: -
--

CREATE TABLE information (
    id smallint NOT NULL,
    link character varying(70),
    category smallint,
    published boolean DEFAULT false,
    published_date date,
    username text,
    realm text
);


--
-- Name: TABLE information; Type: COMMENT; Schema: micadoapp; Owner: -
--

COMMENT ON TABLE information IS 'this is the generic event table for courses, news,  etc that each organization wants to publish';


--
-- Name: event_id_seq; Type: SEQUENCE; Schema: micadoapp; Owner: -
--

CREATE SEQUENCE event_id_seq
    AS smallint
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: event_id_seq; Type: SEQUENCE OWNED BY; Schema: micadoapp; Owner: -
--

ALTER SEQUENCE event_id_seq OWNED BY information.id;


--
-- Name: event_id_seq1; Type: SEQUENCE; Schema: micadoapp; Owner: -
--

CREATE SEQUENCE event_id_seq1
    AS smallint
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: event_id_seq1; Type: SEQUENCE OWNED BY; Schema: micadoapp; Owner: -
--

ALTER SEQUENCE event_id_seq1 OWNED BY event.id;


--
-- Name: event_tags; Type: TABLE; Schema: micadoapp; Owner: -
--

CREATE TABLE event_tags (
    id smallint NOT NULL,
    event_id smallint NOT NULL,
    published boolean DEFAULT false
);


--
-- Name: event_tags_id_seq; Type: SEQUENCE; Schema: micadoapp; Owner: -
--

CREATE SEQUENCE event_tags_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: information_tags; Type: TABLE; Schema: micadoapp; Owner: -
--

CREATE TABLE information_tags (
    id smallint NOT NULL,
    information_id smallint NOT NULL,
    published boolean DEFAULT false
);


--
-- Name: event_tags_id_seq1; Type: SEQUENCE; Schema: micadoapp; Owner: -
--

CREATE SEQUENCE event_tags_id_seq1
    AS smallint
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: event_tags_id_seq1; Type: SEQUENCE OWNED BY; Schema: micadoapp; Owner: -
--

ALTER SEQUENCE event_tags_id_seq1 OWNED BY information_tags.id;


--
-- Name: event_tags_id_seq2; Type: SEQUENCE; Schema: micadoapp; Owner: -
--

CREATE SEQUENCE event_tags_id_seq2
    AS smallint
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: event_tags_id_seq2; Type: SEQUENCE OWNED BY; Schema: micadoapp; Owner: -
--

ALTER SEQUENCE event_tags_id_seq2 OWNED BY event_tags.id;


--
-- Name: event_tags_translation; Type: TABLE; Schema: micadoapp; Owner: -
--

CREATE TABLE event_tags_translation (
    id smallint NOT NULL,
    lang character varying(10) NOT NULL,
    tag character varying NOT NULL,
    translation_date timestamp without time zone,
    "translationState" integer DEFAULT 0 NOT NULL,
    translated boolean DEFAULT false NOT NULL
);


--
-- Name: event_tags_translation_prod; Type: TABLE; Schema: micadoapp; Owner: -
--

CREATE TABLE event_tags_translation_prod (
    id smallint NOT NULL,
    lang character varying(10) NOT NULL,
    tag character varying NOT NULL,
    translation_date timestamp without time zone
);


--
-- Name: event_topic; Type: TABLE; Schema: micadoapp; Owner: -
--

CREATE TABLE event_topic (
    id_event smallint NOT NULL,
    id_topic smallint NOT NULL
);


--
-- Name: information_topic; Type: TABLE; Schema: micadoapp; Owner: -
--

CREATE TABLE information_topic (
    id_information smallint NOT NULL,
    id_topic smallint NOT NULL
);


--
-- Name: event_topic_id_event_seq; Type: SEQUENCE; Schema: micadoapp; Owner: -
--

CREATE SEQUENCE event_topic_id_event_seq
    AS smallint
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: event_topic_id_event_seq; Type: SEQUENCE OWNED BY; Schema: micadoapp; Owner: -
--

ALTER SEQUENCE event_topic_id_event_seq OWNED BY information_topic.id_information;


--
-- Name: event_topic_id_event_seq1; Type: SEQUENCE; Schema: micadoapp; Owner: -
--

CREATE SEQUENCE event_topic_id_event_seq1
    AS smallint
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: event_topic_id_event_seq1; Type: SEQUENCE OWNED BY; Schema: micadoapp; Owner: -
--

ALTER SEQUENCE event_topic_id_event_seq1 OWNED BY event_topic.id_event;


--
-- Name: event_topic_id_topic_seq; Type: SEQUENCE; Schema: micadoapp; Owner: -
--

CREATE SEQUENCE event_topic_id_topic_seq
    AS smallint
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: event_topic_id_topic_seq; Type: SEQUENCE OWNED BY; Schema: micadoapp; Owner: -
--

ALTER SEQUENCE event_topic_id_topic_seq OWNED BY information_topic.id_topic;


--
-- Name: event_topic_id_topic_seq1; Type: SEQUENCE; Schema: micadoapp; Owner: -
--

CREATE SEQUENCE event_topic_id_topic_seq1
    AS smallint
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: event_topic_id_topic_seq1; Type: SEQUENCE OWNED BY; Schema: micadoapp; Owner: -
--

ALTER SEQUENCE event_topic_id_topic_seq1 OWNED BY event_topic.id_topic;


--
-- Name: event_translation; Type: TABLE; Schema: micadoapp; Owner: -
--

CREATE TABLE event_translation (
    id smallint NOT NULL,
    lang character varying(10) NOT NULL,
    event text,
    description text,
    translation_date timestamp without time zone,
    "translationState" integer DEFAULT 0 NOT NULL,
    translated boolean DEFAULT false NOT NULL
);


--
-- Name: event_translation_prod; Type: TABLE; Schema: micadoapp; Owner: -
--

CREATE TABLE event_translation_prod (
    id smallint NOT NULL,
    lang character varying(10) NOT NULL,
    event text,
    description text,
    translation_date timestamp without time zone
);


--
-- Name: information_translation_prod; Type: TABLE; Schema: micadoapp; Owner: -
--

CREATE TABLE information_translation_prod (
    id smallint NOT NULL,
    lang character varying(10) NOT NULL,
    information text,
    description text,
    translation_date timestamp without time zone
);


--
-- Name: event_translation_prod_id_seq; Type: SEQUENCE; Schema: micadoapp; Owner: -
--

CREATE SEQUENCE event_translation_prod_id_seq
    AS smallint
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: event_translation_prod_id_seq; Type: SEQUENCE OWNED BY; Schema: micadoapp; Owner: -
--

ALTER SEQUENCE event_translation_prod_id_seq OWNED BY information_translation_prod.id;


--
-- Name: event_translation_prod_id_seq1; Type: SEQUENCE; Schema: micadoapp; Owner: -
--

CREATE SEQUENCE event_translation_prod_id_seq1
    AS smallint
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: event_translation_prod_id_seq1; Type: SEQUENCE OWNED BY; Schema: micadoapp; Owner: -
--

ALTER SEQUENCE event_translation_prod_id_seq1 OWNED BY event_translation_prod.id;


--
-- Name: event_user_types; Type: TABLE; Schema: micadoapp; Owner: -
--

CREATE TABLE event_user_types (
    id_event smallint NOT NULL,
    id_user_types smallint NOT NULL
);


--
-- Name: information_user_types; Type: TABLE; Schema: micadoapp; Owner: -
--

CREATE TABLE information_user_types (
    id_information smallint NOT NULL,
    id_user_types smallint NOT NULL
);


--
-- Name: event_user_types_id_event_seq; Type: SEQUENCE; Schema: micadoapp; Owner: -
--

CREATE SEQUENCE event_user_types_id_event_seq
    AS smallint
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: event_user_types_id_event_seq; Type: SEQUENCE OWNED BY; Schema: micadoapp; Owner: -
--

ALTER SEQUENCE event_user_types_id_event_seq OWNED BY information_user_types.id_information;


--
-- Name: event_user_types_id_event_seq1; Type: SEQUENCE; Schema: micadoapp; Owner: -
--

CREATE SEQUENCE event_user_types_id_event_seq1
    AS smallint
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: event_user_types_id_event_seq1; Type: SEQUENCE OWNED BY; Schema: micadoapp; Owner: -
--

ALTER SEQUENCE event_user_types_id_event_seq1 OWNED BY event_user_types.id_event;


--
-- Name: event_user_types_id_user_types_seq; Type: SEQUENCE; Schema: micadoapp; Owner: -
--

CREATE SEQUENCE event_user_types_id_user_types_seq
    AS smallint
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: event_user_types_id_user_types_seq; Type: SEQUENCE OWNED BY; Schema: micadoapp; Owner: -
--

ALTER SEQUENCE event_user_types_id_user_types_seq OWNED BY information_user_types.id_user_types;


--
-- Name: event_user_types_id_user_types_seq1; Type: SEQUENCE; Schema: micadoapp; Owner: -
--

CREATE SEQUENCE event_user_types_id_user_types_seq1
    AS smallint
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: event_user_types_id_user_types_seq1; Type: SEQUENCE OWNED BY; Schema: micadoapp; Owner: -
--

ALTER SEQUENCE event_user_types_id_user_types_seq1 OWNED BY event_user_types.id_user_types;


--
-- Name: features_flags_id_seq; Type: SEQUENCE; Schema: micadoapp; Owner: -
--

CREATE SEQUENCE features_flags_id_seq
    AS smallint
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: features_flags_id_seq; Type: SEQUENCE OWNED BY; Schema: micadoapp; Owner: -
--

ALTER SEQUENCE features_flags_id_seq OWNED BY features_flags.id;


--
-- Name: features_flags_translation; Type: TABLE; Schema: micadoapp; Owner: -
--

CREATE TABLE features_flags_translation (
    id smallint NOT NULL,
    lang character varying(10) NOT NULL,
    feature character varying(250),
    translation_date timestamp without time zone,
    "translationState" integer DEFAULT 0 NOT NULL,
    translated boolean DEFAULT false NOT NULL
);


--
-- Name: features_flags_translation_prod; Type: TABLE; Schema: micadoapp; Owner: -
--

CREATE TABLE features_flags_translation_prod (
    id smallint NOT NULL,
    lang character varying(10) NOT NULL,
    feature character varying(250),
    translation_date timestamp without time zone
);


--
-- Name: feedback; Type: TABLE; Schema: micadoapp; Owner: -
--

CREATE TABLE feedback (
    id integer NOT NULL,
    feedback text,
    url text,
    feedback_date date
);


--
-- Name: feedback_id_seq; Type: SEQUENCE; Schema: micadoapp; Owner: -
--

CREATE SEQUENCE feedback_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: feedback_id_seq; Type: SEQUENCE OWNED BY; Schema: micadoapp; Owner: -
--

ALTER SEQUENCE feedback_id_seq OWNED BY feedback.id;


--
-- Name: glossary; Type: TABLE; Schema: micadoapp; Owner: -
--

CREATE TABLE glossary (
    id smallint NOT NULL,
    published boolean DEFAULT false,
    published_date date,
    username text,
    realm text
);


--
-- Name: glossary_id_seq; Type: SEQUENCE; Schema: micadoapp; Owner: -
--

CREATE SEQUENCE glossary_id_seq
    AS smallint
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: glossary_id_seq; Type: SEQUENCE OWNED BY; Schema: micadoapp; Owner: -
--

ALTER SEQUENCE glossary_id_seq OWNED BY glossary.id;


--
-- Name: glossary_translation; Type: TABLE; Schema: micadoapp; Owner: -
--

CREATE TABLE glossary_translation (
    id smallint NOT NULL,
    lang character varying(10) NOT NULL,
    title text,
    description text,
    translation_date timestamp without time zone,
    "translationState" integer DEFAULT 0 NOT NULL,
    translated boolean DEFAULT false NOT NULL
);


--
-- Name: glossary_translation_prod; Type: TABLE; Schema: micadoapp; Owner: -
--

CREATE TABLE glossary_translation_prod (
    id smallint NOT NULL,
    lang character varying(10) NOT NULL,
    title text,
    description text,
    translation_date timestamp without time zone
);


--
-- Name: individual_intervention_plan; Type: TABLE; Schema: micadoapp; Owner: -
--

CREATE TABLE individual_intervention_plan (
    id smallint NOT NULL,
    title character varying(100),
    creation_date timestamp without time zone,
    end_date timestamp without time zone,
    case_manager character varying(30),
    user_tenant integer,
    completed boolean DEFAULT false NOT NULL,
    external_id character varying(100),
    user_id uuid
);


--
-- Name: individual_intervention_plan_id_seq; Type: SEQUENCE; Schema: micadoapp; Owner: -
--

CREATE SEQUENCE individual_intervention_plan_id_seq
    AS smallint
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: individual_intervention_plan_id_seq; Type: SEQUENCE OWNED BY; Schema: micadoapp; Owner: -
--

ALTER SEQUENCE individual_intervention_plan_id_seq OWNED BY individual_intervention_plan.id;


--
-- Name: individual_intervention_plan_interventions; Type: TABLE; Schema: micadoapp; Owner: -
--

CREATE TABLE individual_intervention_plan_interventions (
    list_id smallint NOT NULL,
    intervention_type smallint NOT NULL,
    validation_date timestamp without time zone,
    completed boolean,
    validating_user_tenant integer,
    assignment_date timestamp without time zone,
    id smallint NOT NULL,
    validationrequestdate date,
    title character varying(100),
    description text,
    external_id character varying(100),
    validating_user_id uuid
);


--
-- Name: individual_intervention_plan_intervention_intervention_type_seq; Type: SEQUENCE; Schema: micadoapp; Owner: -
--

CREATE SEQUENCE individual_intervention_plan_intervention_intervention_type_seq
    AS smallint
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: individual_intervention_plan_intervention_intervention_type_seq; Type: SEQUENCE OWNED BY; Schema: micadoapp; Owner: -
--

ALTER SEQUENCE individual_intervention_plan_intervention_intervention_type_seq OWNED BY individual_intervention_plan_interventions.intervention_type;


--
-- Name: individual_intervention_plan_interventions_id_seq; Type: SEQUENCE; Schema: micadoapp; Owner: -
--

CREATE SEQUENCE individual_intervention_plan_interventions_id_seq
    AS smallint
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: individual_intervention_plan_interventions_id_seq; Type: SEQUENCE OWNED BY; Schema: micadoapp; Owner: -
--

ALTER SEQUENCE individual_intervention_plan_interventions_id_seq OWNED BY individual_intervention_plan_interventions.id;


--
-- Name: individual_intervention_plan_interventions_list_id_seq; Type: SEQUENCE; Schema: micadoapp; Owner: -
--

CREATE SEQUENCE individual_intervention_plan_interventions_list_id_seq
    AS smallint
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: individual_intervention_plan_interventions_list_id_seq; Type: SEQUENCE OWNED BY; Schema: micadoapp; Owner: -
--

ALTER SEQUENCE individual_intervention_plan_interventions_list_id_seq OWNED BY individual_intervention_plan_interventions.list_id;


--
-- Name: information_category_translation; Type: TABLE; Schema: micadoapp; Owner: -
--

CREATE TABLE information_category_translation (
    id smallint NOT NULL,
    lang character varying(10) NOT NULL,
    information_category text,
    translation_date timestamp without time zone,
    "translationState" integer DEFAULT 0 NOT NULL,
    translated boolean DEFAULT false NOT NULL
);


--
-- Name: information_tags_translation; Type: TABLE; Schema: micadoapp; Owner: -
--

CREATE TABLE information_tags_translation (
    id smallint NOT NULL,
    lang character varying(10) NOT NULL,
    tag character varying NOT NULL,
    translation_date timestamp without time zone,
    "translationState" integer DEFAULT 0 NOT NULL,
    translated boolean DEFAULT false NOT NULL
);


--
-- Name: information_tags_translation_prod; Type: TABLE; Schema: micadoapp; Owner: -
--

CREATE TABLE information_tags_translation_prod (
    id smallint NOT NULL,
    lang character varying(10) NOT NULL,
    tag character varying NOT NULL,
    translation_date timestamp without time zone
);


--
-- Name: information_translation; Type: TABLE; Schema: micadoapp; Owner: -
--

CREATE TABLE information_translation (
    id smallint NOT NULL,
    lang character varying(10) NOT NULL,
    information text,
    description text,
    translation_date timestamp without time zone,
    "translationState" integer DEFAULT 0 NOT NULL,
    translated boolean DEFAULT false NOT NULL
);


--
-- Name: intervention_category; Type: TABLE; Schema: micadoapp; Owner: -
--

CREATE TABLE intervention_category (
    id smallint NOT NULL,
    external_id character varying(100),
    published boolean DEFAULT false
);


--
-- Name: intervention_category_id_seq; Type: SEQUENCE; Schema: micadoapp; Owner: -
--

CREATE SEQUENCE intervention_category_id_seq
    AS smallint
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: intervention_category_id_seq; Type: SEQUENCE OWNED BY; Schema: micadoapp; Owner: -
--

ALTER SEQUENCE intervention_category_id_seq OWNED BY intervention_category.id;


--
-- Name: intervention_category_translation; Type: TABLE; Schema: micadoapp; Owner: -
--

CREATE TABLE intervention_category_translation (
    id smallint NOT NULL,
    lang character varying(10) NOT NULL,
    title character varying(250),
    translation_date timestamp without time zone,
    "translationState" integer DEFAULT 0 NOT NULL,
    translated boolean DEFAULT false NOT NULL
);


--
-- Name: intervention_category_translation_prod; Type: TABLE; Schema: micadoapp; Owner: -
--

CREATE TABLE intervention_category_translation_prod (
    id smallint NOT NULL,
    lang character varying(10) NOT NULL,
    title character varying(250),
    translation_date timestamp without time zone
);


--
-- Name: intervention_processes; Type: TABLE; Schema: micadoapp; Owner: -
--

CREATE TABLE intervention_processes (
    intervention_type smallint NOT NULL,
    process_id smallint NOT NULL
);


--
-- Name: intervention_processes_intervention_type_seq; Type: SEQUENCE; Schema: micadoapp; Owner: -
--

CREATE SEQUENCE intervention_processes_intervention_type_seq
    AS smallint
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: intervention_processes_intervention_type_seq; Type: SEQUENCE OWNED BY; Schema: micadoapp; Owner: -
--

ALTER SEQUENCE intervention_processes_intervention_type_seq OWNED BY intervention_processes.intervention_type;


--
-- Name: intervention_processes_process_id_seq; Type: SEQUENCE; Schema: micadoapp; Owner: -
--

CREATE SEQUENCE intervention_processes_process_id_seq
    AS smallint
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: intervention_processes_process_id_seq; Type: SEQUENCE OWNED BY; Schema: micadoapp; Owner: -
--

ALTER SEQUENCE intervention_processes_process_id_seq OWNED BY intervention_processes.process_id;


--
-- Name: intervention_type_validator; Type: TABLE; Schema: micadoapp; Owner: -
--

CREATE TABLE intervention_type_validator (
    tenant_id integer NOT NULL,
    intervention_type_id smallint NOT NULL
);


--
-- Name: intervention_types; Type: TABLE; Schema: micadoapp; Owner: -
--

CREATE TABLE intervention_types (
    id smallint NOT NULL,
    category_type smallint,
    external_id character varying(100),
    published boolean DEFAULT false
);


--
-- Name: intervention_types_id_seq; Type: SEQUENCE; Schema: micadoapp; Owner: -
--

CREATE SEQUENCE intervention_types_id_seq
    AS smallint
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: intervention_types_id_seq; Type: SEQUENCE OWNED BY; Schema: micadoapp; Owner: -
--

ALTER SEQUENCE intervention_types_id_seq OWNED BY intervention_types.id;


--
-- Name: intervention_types_translation; Type: TABLE; Schema: micadoapp; Owner: -
--

CREATE TABLE intervention_types_translation (
    id smallint NOT NULL,
    lang character varying(10) NOT NULL,
    intervention_title character varying(250),
    description text,
    translation_date timestamp without time zone,
    "translationState" integer DEFAULT 0 NOT NULL,
    translated boolean DEFAULT false NOT NULL
);


--
-- Name: intervention_types_translation_prod; Type: TABLE; Schema: micadoapp; Owner: -
--

CREATE TABLE intervention_types_translation_prod (
    id smallint NOT NULL,
    lang character varying(10) NOT NULL,
    intervention_title character varying(250),
    description text,
    translation_date timestamp without time zone
);


--
-- Name: languages; Type: TABLE; Schema: micadoapp; Owner: -
--

CREATE TABLE languages (
    lang character varying(10) NOT NULL,
    iso_code character varying(10),
    name character varying(25),
    active boolean DEFAULT false NOT NULL,
    is_default boolean DEFAULT false NOT NULL,
    voice_string character varying(50),
    voice_active boolean DEFAULT false
);


--
-- Name: migrant_app_config; Type: TABLE; Schema: micadoapp; Owner: -
--

CREATE TABLE migrant_app_config (
    id integer NOT NULL,
    features json
);


--
-- Name: mixed_icons; Type: TABLE; Schema: micadoapp; Owner: -
--

CREATE TABLE mixed_icons (
    id integer NOT NULL,
    icon text,
    related_entity integer
);


--
-- Name: picture_hotspot; Type: TABLE; Schema: micadoapp; Owner: -
--

CREATE TABLE picture_hotspot (
    id smallint NOT NULL,
    x smallint,
    y smallint,
    picture_id smallint
);


--
-- Name: picture_hotspot_id_seq; Type: SEQUENCE; Schema: micadoapp; Owner: -
--

CREATE SEQUENCE picture_hotspot_id_seq
    AS smallint
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: picture_hotspot_id_seq; Type: SEQUENCE OWNED BY; Schema: micadoapp; Owner: -
--

ALTER SEQUENCE picture_hotspot_id_seq OWNED BY picture_hotspot.id;


--
-- Name: picture_hotspot_translation; Type: TABLE; Schema: micadoapp; Owner: -
--

CREATE TABLE picture_hotspot_translation (
    pht_id smallint NOT NULL,
    lang character varying(10) NOT NULL,
    title character varying(250),
    message text,
    "translationState" integer DEFAULT 0 NOT NULL,
    translated boolean DEFAULT false NOT NULL,
    translation_date timestamp without time zone
);


--
-- Name: picture_hotspot_translation_prod; Type: TABLE; Schema: micadoapp; Owner: -
--

CREATE TABLE picture_hotspot_translation_prod (
    pht_id smallint NOT NULL,
    lang character varying(10) NOT NULL,
    title character varying(250),
    message text
);


--
-- Name: process; Type: TABLE; Schema: micadoapp; Owner: -
--

CREATE TABLE process (
    id smallint NOT NULL,
    link character varying(70),
    published boolean DEFAULT false,
    published_date date
);


--
-- Name: process_comments; Type: TABLE; Schema: micadoapp; Owner: -
--

CREATE TABLE process_comments (
    idcomment smallint NOT NULL,
    idprocess smallint NOT NULL
);


--
-- Name: process_id_seq; Type: SEQUENCE; Schema: micadoapp; Owner: -
--

CREATE SEQUENCE process_id_seq
    AS smallint
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: process_id_seq; Type: SEQUENCE OWNED BY; Schema: micadoapp; Owner: -
--

ALTER SEQUENCE process_id_seq OWNED BY process.id;


--
-- Name: process_produced_documents; Type: TABLE; Schema: micadoapp; Owner: -
--

CREATE TABLE process_produced_documents (
    id_process smallint NOT NULL,
    id_document smallint NOT NULL
);


--
-- Name: process_topic; Type: TABLE; Schema: micadoapp; Owner: -
--

CREATE TABLE process_topic (
    id_process smallint NOT NULL,
    id_topic smallint NOT NULL
);


--
-- Name: process_topic_id_process_seq; Type: SEQUENCE; Schema: micadoapp; Owner: -
--

CREATE SEQUENCE process_topic_id_process_seq
    AS smallint
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: process_topic_id_process_seq; Type: SEQUENCE OWNED BY; Schema: micadoapp; Owner: -
--

ALTER SEQUENCE process_topic_id_process_seq OWNED BY process_topic.id_process;


--
-- Name: process_topic_id_topic_seq; Type: SEQUENCE; Schema: micadoapp; Owner: -
--

CREATE SEQUENCE process_topic_id_topic_seq
    AS smallint
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: process_topic_id_topic_seq; Type: SEQUENCE OWNED BY; Schema: micadoapp; Owner: -
--

ALTER SEQUENCE process_topic_id_topic_seq OWNED BY process_topic.id_topic;


--
-- Name: process_translation; Type: TABLE; Schema: micadoapp; Owner: -
--

CREATE TABLE process_translation (
    id smallint NOT NULL,
    lang character varying(10) NOT NULL,
    process text,
    description text,
    translation_date timestamp without time zone,
    "translationState" integer DEFAULT 0 NOT NULL,
    translated boolean DEFAULT false NOT NULL
);


--
-- Name: process_translation_id_seq; Type: SEQUENCE; Schema: micadoapp; Owner: -
--

CREATE SEQUENCE process_translation_id_seq
    AS smallint
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: process_translation_id_seq; Type: SEQUENCE OWNED BY; Schema: micadoapp; Owner: -
--

ALTER SEQUENCE process_translation_id_seq OWNED BY process_translation.id;


--
-- Name: process_translation_prod; Type: TABLE; Schema: micadoapp; Owner: -
--

CREATE TABLE process_translation_prod (
    id smallint NOT NULL,
    lang character varying(10) NOT NULL,
    process text,
    description text,
    translation_date timestamp without time zone
);


--
-- Name: process_translation_prod_id_seq; Type: SEQUENCE; Schema: micadoapp; Owner: -
--

CREATE SEQUENCE process_translation_prod_id_seq
    AS smallint
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: process_translation_prod_id_seq; Type: SEQUENCE OWNED BY; Schema: micadoapp; Owner: -
--

ALTER SEQUENCE process_translation_prod_id_seq OWNED BY process_translation_prod.id;


--
-- Name: process_users; Type: TABLE; Schema: micadoapp; Owner: -
--

CREATE TABLE process_users (
    id_process smallint NOT NULL,
    id_user_types smallint NOT NULL
);


--
-- Name: process_users_id_process_seq; Type: SEQUENCE; Schema: micadoapp; Owner: -
--

CREATE SEQUENCE process_users_id_process_seq
    AS smallint
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: process_users_id_process_seq; Type: SEQUENCE OWNED BY; Schema: micadoapp; Owner: -
--

ALTER SEQUENCE process_users_id_process_seq OWNED BY process_users.id_process;


--
-- Name: process_users_id_user_types_seq; Type: SEQUENCE; Schema: micadoapp; Owner: -
--

CREATE SEQUENCE process_users_id_user_types_seq
    AS smallint
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: process_users_id_user_types_seq; Type: SEQUENCE OWNED BY; Schema: micadoapp; Owner: -
--

ALTER SEQUENCE process_users_id_user_types_seq OWNED BY process_users.id_user_types;


--
-- Name: rasa; Type: TABLE; Schema: micadoapp; Owner: -
--

CREATE TABLE rasa (
    id integer NOT NULL,
    file character(70),
    active boolean,
    traindata date,
    trainresult integer,
    trainmessage text,
    lang character(10)
);


--
-- Name: rasa_id_seq; Type: SEQUENCE; Schema: micadoapp; Owner: -
--

CREATE SEQUENCE rasa_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: rasa_id_seq; Type: SEQUENCE OWNED BY; Schema: micadoapp; Owner: -
--

ALTER SEQUENCE rasa_id_seq OWNED BY rasa.id;


--
-- Name: ratings; Type: TABLE; Schema: micadoapp; Owner: -
--

CREATE TABLE ratings (
    user_tenant integer,
    content_id smallint NOT NULL,
    content_type integer,
    value integer,
    id smallint NOT NULL,
    date date DEFAULT CURRENT_DATE,
    user_id uuid
);


--
-- Name: ratings_content_id_seq; Type: SEQUENCE; Schema: micadoapp; Owner: -
--

CREATE SEQUENCE ratings_content_id_seq
    AS smallint
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: ratings_content_id_seq; Type: SEQUENCE OWNED BY; Schema: micadoapp; Owner: -
--

ALTER SEQUENCE ratings_content_id_seq OWNED BY ratings.content_id;


--
-- Name: ratings_id_seq; Type: SEQUENCE; Schema: micadoapp; Owner: -
--

CREATE SEQUENCE ratings_id_seq
    AS smallint
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: ratings_id_seq; Type: SEQUENCE OWNED BY; Schema: micadoapp; Owner: -
--

ALTER SEQUENCE ratings_id_seq OWNED BY ratings.id;


--
-- Name: settings; Type: TABLE; Schema: micadoapp; Owner: -
--

CREATE TABLE settings (
    key character varying NOT NULL,
    value text
);


--
-- Name: step; Type: TABLE; Schema: micadoapp; Owner: -
--

CREATE TABLE step (
    id uuid NOT NULL,
    cost real,
    location_specific boolean,
    location character varying(100),
    location_lon real,
    location_lat real,
    id_process smallint NOT NULL,
    link text,
    step_icon integer
);


--
-- Name: step_document; Type: TABLE; Schema: micadoapp; Owner: -
--

CREATE TABLE step_document (
    id_document smallint NOT NULL,
    is_out boolean NOT NULL,
    id_step uuid NOT NULL,
    cost numeric DEFAULT 0
);


--
-- Name: step_link; Type: TABLE; Schema: micadoapp; Owner: -
--

CREATE TABLE step_link (
    id uuid NOT NULL,
    from_step uuid NOT NULL,
    to_step uuid NOT NULL,
    id_process smallint NOT NULL
);


--
-- Name: step_link_translation; Type: TABLE; Schema: micadoapp; Owner: -
--

CREATE TABLE step_link_translation (
    lang character varying(10) NOT NULL,
    description character varying(250),
    id uuid NOT NULL,
    "translationState" integer DEFAULT 0 NOT NULL,
    translated boolean DEFAULT false NOT NULL,
    translation_date timestamp without time zone
);


--
-- Name: step_link_translation_prod; Type: TABLE; Schema: micadoapp; Owner: -
--

CREATE TABLE step_link_translation_prod (
    lang character varying(10) NOT NULL,
    description character varying(250),
    id uuid NOT NULL
);


--
-- Name: step_translation; Type: TABLE; Schema: micadoapp; Owner: -
--

CREATE TABLE step_translation (
    lang character varying(10) NOT NULL,
    step character varying(250),
    description text,
    translation_date timestamp without time zone,
    id uuid NOT NULL,
    "translationState" integer DEFAULT 0 NOT NULL,
    translated boolean DEFAULT false NOT NULL
);


--
-- Name: step_translation_prod; Type: TABLE; Schema: micadoapp; Owner: -
--

CREATE TABLE step_translation_prod (
    lang character varying(10) NOT NULL,
    step character varying(250),
    description text,
    translation_date timestamp without time zone,
    id uuid NOT NULL
);


--
-- Name: survey_id_seq; Type: SEQUENCE; Schema: micadoapp; Owner: -
--

CREATE SEQUENCE survey_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 32767
    CACHE 1;


--
-- Name: survey; Type: TABLE; Schema: micadoapp; Owner: -
--

CREATE TABLE survey (
    id integer DEFAULT nextval('survey_id_seq'::regclass) NOT NULL,
    survey text,
    active boolean,
    activation_date date,
    expiry_date date,
    title text,
    destination_app integer
);


--
-- Name: survey_answer_seq_id; Type: SEQUENCE; Schema: micadoapp; Owner: -
--

CREATE SEQUENCE survey_answer_seq_id
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 32767
    CACHE 1;


--
-- Name: survey_answers; Type: TABLE; Schema: micadoapp; Owner: -
--

CREATE TABLE survey_answers (
    id_answer integer DEFAULT nextval('survey_answer_seq_id'::regclass) NOT NULL,
    id_survey integer,
    answer jsonb,
    answer_date date,
    id_user uuid
);


--
-- Name: t_settings_id_seq; Type: SEQUENCE; Schema: micadoapp; Owner: -
--

CREATE SEQUENCE t_settings_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 32767
    CACHE 1;


--
-- Name: t_settings; Type: TABLE; Schema: micadoapp; Owner: -
--

CREATE TABLE t_settings (
    id integer DEFAULT nextval('t_settings_id_seq'::regclass) NOT NULL,
    key text,
    published boolean
);


--
-- Name: t_settings_translation; Type: TABLE; Schema: micadoapp; Owner: -
--

CREATE TABLE t_settings_translation (
    id integer NOT NULL,
    value text,
    "translationState" integer,
    lang character varying(10) NOT NULL,
    translated boolean DEFAULT false NOT NULL,
    translation_date timestamp without time zone
);


--
-- Name: t_settings_translation_prod; Type: TABLE; Schema: micadoapp; Owner: -
--

CREATE TABLE t_settings_translation_prod (
    id integer NOT NULL,
    lang character varying(10) NOT NULL,
    value text
);


--
-- Name: tenant_id_seq; Type: SEQUENCE; Schema: micadoapp; Owner: -
--

CREATE SEQUENCE tenant_id_seq
    START WITH 6
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 32767
    CACHE 1;


--
-- Name: tenant; Type: TABLE; Schema: micadoapp; Owner: -
--

CREATE TABLE tenant (
    id smallint DEFAULT nextval('tenant_id_seq'::regclass) NOT NULL,
    name character varying(50),
    link character varying(70),
    email character varying(100),
    address character varying(100),
    realm text
);


--
-- Name: topic; Type: TABLE; Schema: micadoapp; Owner: -
--

CREATE TABLE topic (
    id smallint NOT NULL,
    icon text,
    published boolean DEFAULT false,
    father integer
);


--
-- Name: topic_id_seq; Type: SEQUENCE; Schema: micadoapp; Owner: -
--

CREATE SEQUENCE topic_id_seq
    AS smallint
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: topic_id_seq; Type: SEQUENCE OWNED BY; Schema: micadoapp; Owner: -
--

ALTER SEQUENCE topic_id_seq OWNED BY topic.id;


--
-- Name: topic_translation; Type: TABLE; Schema: micadoapp; Owner: -
--

CREATE TABLE topic_translation (
    id smallint NOT NULL,
    lang character varying(10) NOT NULL,
    topic character varying(250),
    translation_date timestamp without time zone,
    "translationState" integer DEFAULT 0 NOT NULL,
    translated boolean DEFAULT false NOT NULL,
    description text
);


--
-- Name: topic_translation_id_seq; Type: SEQUENCE; Schema: micadoapp; Owner: -
--

CREATE SEQUENCE topic_translation_id_seq
    AS smallint
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: topic_translation_id_seq; Type: SEQUENCE OWNED BY; Schema: micadoapp; Owner: -
--

ALTER SEQUENCE topic_translation_id_seq OWNED BY topic_translation.id;


--
-- Name: topic_translation_prod; Type: TABLE; Schema: micadoapp; Owner: -
--

CREATE TABLE topic_translation_prod (
    id smallint NOT NULL,
    lang character varying(10) NOT NULL,
    topic character varying(250),
    translation_date timestamp without time zone,
    description text
);


--
-- Name: topic_translation_prod_id_seq; Type: SEQUENCE; Schema: micadoapp; Owner: -
--

CREATE SEQUENCE topic_translation_prod_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 32767
    CACHE 1;


--
-- Name: topic_translation_prod_id_seq; Type: SEQUENCE OWNED BY; Schema: micadoapp; Owner: -
--

ALTER SEQUENCE topic_translation_prod_id_seq OWNED BY topic_translation_prod.id;


--
-- Name: user; Type: TABLE; Schema: micadoapp; Owner: -
--

CREATE TABLE "user" (
    id uuid NOT NULL,
    realm text,
    "group" text
);


--
-- Name: user_consent; Type: TABLE; Schema: micadoapp; Owner: -
--

CREATE TABLE user_consent (
    consent text,
    id_user uuid NOT NULL
);


--
-- Name: user_pic_id_seq; Type: SEQUENCE; Schema: micadoapp; Owner: -
--

CREATE SEQUENCE user_pic_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 32767
    CACHE 1;


--
-- Name: user_pictures; Type: TABLE; Schema: micadoapp; Owner: -
--

CREATE TABLE user_pictures (
    id smallint DEFAULT nextval('user_pic_id_seq'::regclass) NOT NULL,
    picture text,
    tenant_id integer,
    user_id uuid
);


--
-- Name: user_preferences; Type: TABLE; Schema: micadoapp; Owner: -
--

CREATE TABLE user_preferences (
    id_user_type smallint NOT NULL,
    id_user uuid NOT NULL
);


--
-- Name: user_type_translation_prod_id_seq; Type: SEQUENCE; Schema: micadoapp; Owner: -
--

CREATE SEQUENCE user_type_translation_prod_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: user_types; Type: TABLE; Schema: micadoapp; Owner: -
--

CREATE TABLE user_types (
    id smallint NOT NULL,
    icon text,
    published boolean DEFAULT false
);


--
-- Name: user_types_id_seq; Type: SEQUENCE; Schema: micadoapp; Owner: -
--

CREATE SEQUENCE user_types_id_seq
    AS smallint
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: user_types_id_seq; Type: SEQUENCE OWNED BY; Schema: micadoapp; Owner: -
--

ALTER SEQUENCE user_types_id_seq OWNED BY user_types.id;


--
-- Name: user_types_translation; Type: TABLE; Schema: micadoapp; Owner: -
--

CREATE TABLE user_types_translation (
    id smallint NOT NULL,
    lang character varying(10) NOT NULL,
    user_type character varying(250),
    description text,
    translation_date timestamp without time zone,
    "translationState" integer DEFAULT 0 NOT NULL,
    translated boolean DEFAULT false NOT NULL
);


--
-- Name: user_types_translation_id_seq; Type: SEQUENCE; Schema: micadoapp; Owner: -
--

CREATE SEQUENCE user_types_translation_id_seq
    AS smallint
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: user_types_translation_id_seq; Type: SEQUENCE OWNED BY; Schema: micadoapp; Owner: -
--

ALTER SEQUENCE user_types_translation_id_seq OWNED BY user_types_translation.id;


--
-- Name: user_types_translation_prod; Type: TABLE; Schema: micadoapp; Owner: -
--

CREATE TABLE user_types_translation_prod (
    id smallint NOT NULL,
    lang character varying(10) NOT NULL,
    user_type character varying(250),
    description text,
    translation_date timestamp without time zone
);


--
-- Name: user_types_translation_prod_id_seq; Type: SEQUENCE; Schema: micadoapp; Owner: -
--

CREATE SEQUENCE user_types_translation_prod_id_seq
    AS smallint
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: user_types_translation_prod_id_seq; Type: SEQUENCE OWNED BY; Schema: micadoapp; Owner: -
--

ALTER SEQUENCE user_types_translation_prod_id_seq OWNED BY user_types_translation_prod.id;


--
-- Name: comments id; Type: DEFAULT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY comments ALTER COLUMN id SET DEFAULT nextval('comments_id_seq'::regclass);


--
-- Name: document id; Type: DEFAULT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY document ALTER COLUMN id SET DEFAULT nextval('document_id_seq'::regclass);


--
-- Name: document document_type; Type: DEFAULT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY document ALTER COLUMN document_type SET DEFAULT nextval('document_document_type_seq'::regclass);


--
-- Name: document_type id; Type: DEFAULT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY document_type ALTER COLUMN id SET DEFAULT nextval('document_type_id_seq'::regclass);


--
-- Name: document_type_picture id; Type: DEFAULT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY document_type_picture ALTER COLUMN id SET DEFAULT nextval('document_type_picture_id_seq'::regclass);


--
-- Name: event id; Type: DEFAULT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY event ALTER COLUMN id SET DEFAULT nextval('event_id_seq1'::regclass);


--
-- Name: event_category id; Type: DEFAULT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY event_category ALTER COLUMN id SET DEFAULT nextval('event_category_id_seq1'::regclass);


--
-- Name: event_tags id; Type: DEFAULT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY event_tags ALTER COLUMN id SET DEFAULT nextval('event_tags_id_seq2'::regclass);


--
-- Name: event_translation_prod id; Type: DEFAULT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY event_translation_prod ALTER COLUMN id SET DEFAULT nextval('event_translation_prod_id_seq1'::regclass);


--
-- Name: features_flags id; Type: DEFAULT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY features_flags ALTER COLUMN id SET DEFAULT nextval('features_flags_id_seq'::regclass);


--
-- Name: feedback id; Type: DEFAULT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY feedback ALTER COLUMN id SET DEFAULT nextval('feedback_id_seq'::regclass);


--
-- Name: glossary id; Type: DEFAULT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY glossary ALTER COLUMN id SET DEFAULT nextval('glossary_id_seq'::regclass);


--
-- Name: individual_intervention_plan id; Type: DEFAULT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY individual_intervention_plan ALTER COLUMN id SET DEFAULT nextval('individual_intervention_plan_id_seq'::regclass);


--
-- Name: individual_intervention_plan_interventions list_id; Type: DEFAULT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY individual_intervention_plan_interventions ALTER COLUMN list_id SET DEFAULT nextval('individual_intervention_plan_interventions_list_id_seq'::regclass);


--
-- Name: individual_intervention_plan_interventions intervention_type; Type: DEFAULT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY individual_intervention_plan_interventions ALTER COLUMN intervention_type SET DEFAULT nextval('individual_intervention_plan_intervention_intervention_type_seq'::regclass);


--
-- Name: individual_intervention_plan_interventions id; Type: DEFAULT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY individual_intervention_plan_interventions ALTER COLUMN id SET DEFAULT nextval('individual_intervention_plan_interventions_id_seq'::regclass);


--
-- Name: information id; Type: DEFAULT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY information ALTER COLUMN id SET DEFAULT nextval('event_id_seq'::regclass);


--
-- Name: information_category id; Type: DEFAULT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY information_category ALTER COLUMN id SET DEFAULT nextval('event_category_id_seq'::regclass);


--
-- Name: information_tags id; Type: DEFAULT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY information_tags ALTER COLUMN id SET DEFAULT nextval('event_tags_id_seq1'::regclass);


--
-- Name: intervention_category id; Type: DEFAULT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY intervention_category ALTER COLUMN id SET DEFAULT nextval('intervention_category_id_seq'::regclass);


--
-- Name: intervention_processes intervention_type; Type: DEFAULT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY intervention_processes ALTER COLUMN intervention_type SET DEFAULT nextval('intervention_processes_intervention_type_seq'::regclass);


--
-- Name: intervention_processes process_id; Type: DEFAULT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY intervention_processes ALTER COLUMN process_id SET DEFAULT nextval('intervention_processes_process_id_seq'::regclass);


--
-- Name: intervention_types id; Type: DEFAULT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY intervention_types ALTER COLUMN id SET DEFAULT nextval('intervention_types_id_seq'::regclass);


--
-- Name: picture_hotspot id; Type: DEFAULT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY picture_hotspot ALTER COLUMN id SET DEFAULT nextval('picture_hotspot_id_seq'::regclass);


--
-- Name: process id; Type: DEFAULT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY process ALTER COLUMN id SET DEFAULT nextval('process_id_seq'::regclass);


--
-- Name: process_topic id_process; Type: DEFAULT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY process_topic ALTER COLUMN id_process SET DEFAULT nextval('process_topic_id_process_seq'::regclass);


--
-- Name: process_topic id_topic; Type: DEFAULT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY process_topic ALTER COLUMN id_topic SET DEFAULT nextval('process_topic_id_topic_seq'::regclass);


--
-- Name: process_translation id; Type: DEFAULT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY process_translation ALTER COLUMN id SET DEFAULT nextval('process_translation_id_seq'::regclass);


--
-- Name: process_translation_prod id; Type: DEFAULT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY process_translation_prod ALTER COLUMN id SET DEFAULT nextval('process_translation_prod_id_seq'::regclass);


--
-- Name: process_users id_process; Type: DEFAULT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY process_users ALTER COLUMN id_process SET DEFAULT nextval('process_users_id_process_seq'::regclass);


--
-- Name: process_users id_user_types; Type: DEFAULT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY process_users ALTER COLUMN id_user_types SET DEFAULT nextval('process_users_id_user_types_seq'::regclass);


--
-- Name: rasa id; Type: DEFAULT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY rasa ALTER COLUMN id SET DEFAULT nextval('rasa_id_seq'::regclass);


--
-- Name: ratings content_id; Type: DEFAULT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY ratings ALTER COLUMN content_id SET DEFAULT nextval('ratings_content_id_seq'::regclass);


--
-- Name: ratings id; Type: DEFAULT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY ratings ALTER COLUMN id SET DEFAULT nextval('ratings_id_seq'::regclass);


--
-- Name: topic id; Type: DEFAULT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY topic ALTER COLUMN id SET DEFAULT nextval('topic_id_seq'::regclass);


--
-- Name: topic_translation id; Type: DEFAULT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY topic_translation ALTER COLUMN id SET DEFAULT nextval('topic_translation_id_seq'::regclass);


--
-- Name: topic_translation_prod id; Type: DEFAULT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY topic_translation_prod ALTER COLUMN id SET DEFAULT nextval('topic_translation_prod_id_seq'::regclass);


--
-- Name: user_types id; Type: DEFAULT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY user_types ALTER COLUMN id SET DEFAULT nextval('user_types_id_seq'::regclass);


--
-- Name: user_types_translation id; Type: DEFAULT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY user_types_translation ALTER COLUMN id SET DEFAULT nextval('user_types_translation_id_seq'::regclass);


--
-- Name: user_types_translation_prod id; Type: DEFAULT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY user_types_translation_prod ALTER COLUMN id SET DEFAULT nextval('user_types_translation_prod_id_seq'::regclass);


--
-- Data for Name: board; Type: TABLE DATA; Schema: micadoapp; Owner: -
--



--
-- Data for Name: charts; Type: TABLE DATA; Schema: micadoapp; Owner: -
--



--
-- Data for Name: comment_translation_prod; Type: TABLE DATA; Schema: micadoapp; Owner: -
--



--
-- Data for Name: comments; Type: TABLE DATA; Schema: micadoapp; Owner: -
--



--
-- Data for Name: comments_translation; Type: TABLE DATA; Schema: micadoapp; Owner: -
--



--
-- Data for Name: completed_intervention_document; Type: TABLE DATA; Schema: micadoapp; Owner: -
--



--
-- Data for Name: document; Type: TABLE DATA; Schema: micadoapp; Owner: -
--



--
-- Data for Name: document_pictures; Type: TABLE DATA; Schema: micadoapp; Owner: -
--



--
-- Data for Name: document_type; Type: TABLE DATA; Schema: micadoapp; Owner: -
--



--
-- Data for Name: document_type_picture; Type: TABLE DATA; Schema: micadoapp; Owner: -
--



--
-- Data for Name: document_type_translation; Type: TABLE DATA; Schema: micadoapp; Owner: -
--



--
-- Data for Name: document_type_translation_prod; Type: TABLE DATA; Schema: micadoapp; Owner: -
--



--
-- Data for Name: document_type_validator; Type: TABLE DATA; Schema: micadoapp; Owner: -
--



--
-- Data for Name: event; Type: TABLE DATA; Schema: micadoapp; Owner: -
--



--
-- Data for Name: event_category; Type: TABLE DATA; Schema: micadoapp; Owner: -
--



--
-- Data for Name: event_category_translation; Type: TABLE DATA; Schema: micadoapp; Owner: -
--



--
-- Data for Name: event_category_translation_prod; Type: TABLE DATA; Schema: micadoapp; Owner: -
--



--
-- Data for Name: event_tags; Type: TABLE DATA; Schema: micadoapp; Owner: -
--



--
-- Data for Name: event_tags_translation; Type: TABLE DATA; Schema: micadoapp; Owner: -
--



--
-- Data for Name: event_tags_translation_prod; Type: TABLE DATA; Schema: micadoapp; Owner: -
--



--
-- Data for Name: event_topic; Type: TABLE DATA; Schema: micadoapp; Owner: -
--



--
-- Data for Name: event_translation; Type: TABLE DATA; Schema: micadoapp; Owner: -
--



--
-- Data for Name: event_translation_prod; Type: TABLE DATA; Schema: micadoapp; Owner: -
--



--
-- Data for Name: event_user_types; Type: TABLE DATA; Schema: micadoapp; Owner: -
--



--
-- Data for Name: features_flags; Type: TABLE DATA; Schema: micadoapp; Owner: -
--

INSERT INTO features_flags VALUES (1, 'FEAT_DOCUMENTS', true);
INSERT INTO features_flags VALUES (3, 'FEAT_ASSISTANT', true);
INSERT INTO features_flags VALUES (2, 'FEAT_GLOSSARY', true);
INSERT INTO features_flags VALUES (4, 'FEAT_PROCESSES', true);
INSERT INTO features_flags VALUES (6, 'FEAT_EVENTS', true);
INSERT INTO features_flags VALUES (9, 'FEAT_INFO', true);
INSERT INTO features_flags VALUES (7, 'FEAT_GEOPORTAL', true);
INSERT INTO features_flags VALUES (10, 'FEAT_MIGRANT_LOGIN', true);
INSERT INTO features_flags VALUES (8, 'FEAT_DEFAULT', true);
INSERT INTO features_flags VALUES (5, 'FEAT_TASKS', true);


--
-- Data for Name: features_flags_translation; Type: TABLE DATA; Schema: micadoapp; Owner: -
--

INSERT INTO features_flags_translation VALUES (1, 'it', 'Portafoglio documenti', '2020-04-14 17:54:28.436', 0, false);
INSERT INTO features_flags_translation VALUES (1, 'en', 'Document wallet', '2020-04-14 17:54:28.436', 0, false);
INSERT INTO features_flags_translation VALUES (2, 'en', 'Glossary', NULL, 0, true);
INSERT INTO features_flags_translation VALUES (2, 'it', 'Glossario', NULL, 0, true);
INSERT INTO features_flags_translation VALUES (3, 'en', 'Chatbot assistant', NULL, 0, true);
INSERT INTO features_flags_translation VALUES (4, 'it', 'Gestione processi', NULL, 0, false);
INSERT INTO features_flags_translation VALUES (5, 'it', 'Piano individuale integrazione', NULL, 0, false);
INSERT INTO features_flags_translation VALUES (6, 'it', 'Gestione eventi', NULL, 0, true);
INSERT INTO features_flags_translation VALUES (7, 'it', 'GeoPortale', NULL, 0, true);
INSERT INTO features_flags_translation VALUES (4, 'en', 'Process management', NULL, 0, true);
INSERT INTO features_flags_translation VALUES (5, 'en', 'Individual integration plan', NULL, 0, true);
INSERT INTO features_flags_translation VALUES (6, 'en', 'Event management', NULL, 0, true);
INSERT INTO features_flags_translation VALUES (7, 'en', 'GeoPortal', NULL, 0, true);
INSERT INTO features_flags_translation VALUES (8, 'it', 'Funzionalità standard', NULL, 0, true);
INSERT INTO features_flags_translation VALUES (8, 'en', 'Core features', NULL, 0, true);
INSERT INTO features_flags_translation VALUES (9, 'en', 'Information portal', NULL, 0, true);
INSERT INTO features_flags_translation VALUES (9, 'it', 'Area notizie', NULL, 0, false);
INSERT INTO features_flags_translation VALUES (10, 'it', 'Il migrante può fare login', NULL, 0, true);
INSERT INTO features_flags_translation VALUES (10, 'en', 'Migrant can login', NULL, 0, false);


--
-- Data for Name: features_flags_translation_prod; Type: TABLE DATA; Schema: micadoapp; Owner: -
--



--
-- Data for Name: feedback; Type: TABLE DATA; Schema: micadoapp; Owner: -
--



--
-- Data for Name: glossary; Type: TABLE DATA; Schema: micadoapp; Owner: -
--



--
-- Data for Name: glossary_translation; Type: TABLE DATA; Schema: micadoapp; Owner: -
--



--
-- Data for Name: glossary_translation_prod; Type: TABLE DATA; Schema: micadoapp; Owner: -
--



--
-- Data for Name: individual_intervention_plan; Type: TABLE DATA; Schema: micadoapp; Owner: -
--



--
-- Data for Name: individual_intervention_plan_interventions; Type: TABLE DATA; Schema: micadoapp; Owner: -
--



--
-- Data for Name: information; Type: TABLE DATA; Schema: micadoapp; Owner: -
--



--
-- Data for Name: information_category; Type: TABLE DATA; Schema: micadoapp; Owner: -
--



--
-- Data for Name: information_category_translation; Type: TABLE DATA; Schema: micadoapp; Owner: -
--



--
-- Data for Name: information_category_translation_prod; Type: TABLE DATA; Schema: micadoapp; Owner: -
--



--
-- Data for Name: information_tags; Type: TABLE DATA; Schema: micadoapp; Owner: -
--



--
-- Data for Name: information_tags_translation; Type: TABLE DATA; Schema: micadoapp; Owner: -
--



--
-- Data for Name: information_tags_translation_prod; Type: TABLE DATA; Schema: micadoapp; Owner: -
--



--
-- Data for Name: information_topic; Type: TABLE DATA; Schema: micadoapp; Owner: -
--



--
-- Data for Name: information_translation; Type: TABLE DATA; Schema: micadoapp; Owner: -
--



--
-- Data for Name: information_translation_prod; Type: TABLE DATA; Schema: micadoapp; Owner: -
--



--
-- Data for Name: information_user_types; Type: TABLE DATA; Schema: micadoapp; Owner: -
--



--
-- Data for Name: intervention_category; Type: TABLE DATA; Schema: micadoapp; Owner: -
--



--
-- Data for Name: intervention_category_translation; Type: TABLE DATA; Schema: micadoapp; Owner: -
--



--
-- Data for Name: intervention_category_translation_prod; Type: TABLE DATA; Schema: micadoapp; Owner: -
--



--
-- Data for Name: intervention_processes; Type: TABLE DATA; Schema: micadoapp; Owner: -
--



--
-- Data for Name: intervention_type_validator; Type: TABLE DATA; Schema: micadoapp; Owner: -
--



--
-- Data for Name: intervention_types; Type: TABLE DATA; Schema: micadoapp; Owner: -
--



--
-- Data for Name: intervention_types_translation; Type: TABLE DATA; Schema: micadoapp; Owner: -
--



--
-- Data for Name: intervention_types_translation_prod; Type: TABLE DATA; Schema: micadoapp; Owner: -
--



--
-- Data for Name: languages; Type: TABLE DATA; Schema: micadoapp; Owner: -
--

INSERT INTO languages VALUES ('es', 'es', 'español', true, false, 'Spanish Female', true);
INSERT INTO languages VALUES ('it', 'it', 'italiano', true, false, 'Italian Female', true);
INSERT INTO languages VALUES ('en', 'en-us', 'english', true, true, 'UK English Female', true);
INSERT INTO languages VALUES ('nl', 'nl', 'nederlands', true, false, 'Dutch Female', true);
INSERT INTO languages VALUES ('fa_IR', 'fa-IR', 'Darii', true, false, NULL, false);
INSERT INTO languages VALUES ('ur', 'he', 'urdu', true, false, NULL, false);
INSERT INTO languages VALUES ('uk', 'uk', 'ukrainian', true, false, NULL, false);
INSERT INTO languages VALUES ('ru', 'ru', 'russian', true, false, NULL, false);
INSERT INTO languages VALUES ('de', 'de', 'deutsch', true, false, 'Deutsch Female', true);


--
-- Data for Name: migrant_app_config; Type: TABLE DATA; Schema: micadoapp; Owner: -
--

INSERT INTO migrant_app_config VALUES (1, '["FEAT_DOCUMENTS","FEAT_GLOSSARY","FEAT_ASSISTANT","FEAT_SERVICES","FEAT_TASKS","FEAT_DEFAULT"]');


--
-- Data for Name: mixed_icons; Type: TABLE DATA; Schema: micadoapp; Owner: -
--

INSERT INTO mixed_icons VALUES (1, 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAlgAAAJYCAYAAAC+ZpjcAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAKFtJREFUeNrs3dF120a6B3DsPXm3OxC3Amnf+GaiAmErEFNBtBUYrmClCkJVsHQFkt70tlIHcgU3rsAXsxrvVRInlsgBOR/4+53Dg5wkokYDEvxj5uPMX758+dIAAFDO/+gCAAABCwBAwAIAELAAABCwAAAELAAAAQsAAAELAEDAAgAQsAAAELAAAAQsAAABCwBAwAIAQMACABCwAAAELAAABCwAAAELAEDAAgBAwAIAELAAAAQsAAAELAAAAQsAQMACABCwAAAQsAAABCwAAAELAAABCwBAwAIAELAAABCwAAAELAAAAQsAAAELAEDAAgAQsAAABCwAAAQsAAABCwBAwAIAQMACABCwAAAELAAABCwAAAELAEDAAgDgB13A2OZtt8j/+HZ4nBx4d5zkfvjql+Fx71UCf+gmHx/vrtePuoMo/vLlyxe9QMkgdZIfs+HxTq8AhX1KYSsHr3S8H4KXmxQELCYTptIozOLZ41ivAHvyOQeu/zwELgQsooWq2XDocqA61SNApdIo1zqHrbXuQMCixlD1NoeqZWPKD4gbti7UcCFgUUOwmg2HPoerN3oEmIDb4bEagtZKVyBgsetgtcjBymgVMFVpVOsih61fdAcCFoIVQDmpOD5NHfa6AgGL0sHqJN/JCVbAoUojWr2pQwQsSgSrtzlYnekNgP9INVrnlnlAwGLTcHXePE0HKl4H+L3L5mlES30WAhYvClaz4bBqTAcCfE+aNlwOIetGV7AJmz0fTrhaNk973glXAN93NDyuh2tnryvYhBGs6QcrtVYA20m1WZ0pQwQsvoar9A3BVWOfQIBtpSUdFgrgeSlThNMNV2kF9hvhCqCI9KWgf+dyCxCwDjRcpQvAvxrfEgQo7Wd1WbyEKcLphatVo94KYGxXd9frpW5AwBKu9uGhefrm4mPzNF3Z+Moz8Ipr2mw4PH8s8vFIyELA4pDCVQpU6xSmBClg5OC1yI9Ub7rPcgghCwFLuBotVKXfvx4uMo/OBrCHa2D6xvT5HsOWkIWAJVwVkb6unEaqeqEKqOyamIJOeux6UeUPw/WwdwYQsKZxIUlv5vc7DlZp0dILC+4BlV8fF83Tnqu7DFo/DtfGld5HwIp/l/azYAVQVdD6m8VIEbDiXjBSvcG/d/TrrobHuWAFBL9udvlGcexvIKYb0plrJhYajXeRSHsL3uzgV6Wd5NtUuOlCAUQ3XMdS3Wi6Ob0c+Ve92dE1GgGLwm6a8b8lky5AJ5ZaACYWsn4ZHunbhm2+iRzL8XAzfKHHD5spwkB2UNSehraX+U4PYMrX0zQbsBoepyP+mtaNqoBF/ReDxXC4HvFXPORwpTgTcONaRholO1FmcZhMEca60xozXC2EK+DQ5LWrfhzp6VNBfa+XBSzq1TfjffPlKocrd1jAoYasdAP7t+apTKK0n/IMBAfGFGHlRl6SwfYOAL++3t405b9I9DBca0/08GExglW/lXAFML5cJrFoyo9kHefFoTkgRrDqvptKb8gxVmt3NwXwx9feFLJKf6nIAqQHxghWvW/wVNjejxGu8h0aAN+Ql1YoXfieph3P9a6Axf6lN2Lpwvav61y5gwL485C1asqv+n6eb54RsNiH/AYc407HOlcALw9Z6Tp8W/ApjWIdkB90QZXOm/LfYrm0QjvAq6VNoh8LXpPTKNbFIc4k5MGDk/x4PpKXbvwfpzYAoMi9zhdhejOXnB5U1A6w+TU5hax/FXzKH/MU5CH0XfrsWeag+r3PtVTGcjM81lPoHwGrvhdjeiGW/ubg30wNAmx1bU4zAKX2Lfw0XJNnE++vRfP0Ra13Gz5FClsXeaV9AYsiL8oUhI4LPuVlriMAYPNrc5rSemzKTRVOciPo3E8Xw+OsVBhtnuqHw/WVIve6XpgnhcPV58Y+WABbyzVTJa+ny4l+ht0XDFdJmla8zptyC1hsrPRI07klGQCKhaw0MvOp0NN1U1qy4dk2Q2Ptm/t++B0rAYuN33AFn+vToRRRAuxQX+h53hS+5tcQrt6M/KvOIoUsAaueF2hX+MXZ61WAsvKNa7FRrAl8dr3dUbh6HrKWAhb7eqMZvQIYT6kb2NMJ9MVqh+Hqq4shZM0ELPYRsIQrgJHkG9jPJZ4rz16ElNu+j5D4JsLnnIBVx4v0pPAdwIVeBRhVqQ/4ReA+2Odnzbu81paAxZ8qeQfz0TcHAcKEi5ABKy+bcLTnZlS9xqOAVYeSb7CV7gQY13Aj+zgcHgo81XG05Rpy/VMN4ea05losAasO7wo9z2cbOgPsTKkb2kWwvzuN3r2ppC3V9p2Atf87gZKbMN/oUYCdKXVDexLlD851TzV9+1HAYidvLKNXADuSpwlLrIm1CPRn1/YlqmrDqYA1rRfHje4E2KkS190QI1jztkt1V8eVNeu41v4SsKYTsD7luykAYgWsN7X/kbkQv3e6BaxDdK8LAEIGrI8B/s6aCtsFLAQsgCkrNHNQ9XpO+ctYZ862gOUuCoBdut3iZz8EKO+wO4iAddCs3g6wH5sGpE+1h5d52y2bcms1juGh1oYJWBMx3AGZIgSIFbDOa97aLBe21z56Ve1nn4AFANvZJCTdBth5I9WG1V7YfiNgMaYHXQCwN5uMotRe2D4bDu8D9H21IVXAOty7JwD24zJAWccqQD9e1TzFKmABwO58bipfsHPedl1Td2H7V1X3o4AFALtTdWF7FmFZhqval7cQsABgNx6GULCquYHztuuHw1Hl/ZhGAc9rP9kCFgDsRoTC9vMA/XgRYBRQwAKAHUhTWje1B5em/mUZPg392Ec44QIWAIyr+imtedsthsNpgL5cRjnpAhYAjOtCYXsRHwOMAgpYALAD1U9pzdsuja4dB+jL80gnXsACgPEsKw9Xab/BPkA/fqh9WQYBCwB246PC9iI+NTGmMAUsANiB2gvbT4bDWYR+jLAsg4AFAOOLMKUVYVTodujHdcQXgIAFAGVVP6U1b7tlE2O/wfOoLwIBCwAKh4Kap7RyYXuE0avLoR/vBSwAIMKUVhoVqr2wPS3O2kd+IQhYAFA2vFQr7zf4PkI/RixsF7AAoLwIU1qrAP34MPTjKvqLQcACgO1VP6U1b7uuUdguYAFAIOf2GyziKtJ+g3/mB+8JANhchEAwb7t+OBxV3sw0Cng+ldeFESwAmLBc2B4huFxEL2wXsADgcITYb3AIV/2UOl3AAoCJmrfdYjicBmjqcmp9L2ABwHRFKGz/OJXCdgELACZu3nap7uo4QFPPp9j/AhYATC9cpf0G+wBN/XB3vX4UsACACEIUtjcxpjAFLAA4dPO2OxkOZwGaej6lZRkELACYtgijQrdDuFpP+SQIWAAwEfO2Wzb2GxSwAIBi4SoVtkcYvbq8u17fC1gAQARpVKj2wva032B/CCdDwAKA4PJ+g+8jhMApF7YLWAAwLasAbXwYwtXqUE6IgAUAgc3brmsUtgtYAEBREQrbr6a436CABQATNG+7fjgcVd7MVNh+fmjnRsACgJjhahYkuFwcSmG7gAUA8YXYb3AIV/0hnhwBCwCCmbfdYjicBmjq8lDPkYAFAPFEKGz/eGiF7QIWAAQ1b7tUd3UcoKnnh3yeBCwAiBOu0n6DfYCmfri7Xj8KWABABCEK25sYU5gCFgAcunnbnQyHswBNPT/EZRkELACIKcKo0O0QrtZOlYAFANWbt92ysd+ggAUAFAtXqbA9wujV5d31+t4ZE7AAIII0KlR7YXvab7B3qgQsAKhe3m/wfYQQqLBdwAKAKFYB2vgwhKuVUyVgAUD15m3XNQrbBSwAoKgIhe1Xh7zfoIAFAIHM264fDkeVNzMVthu9ErAAIES4mgUJLhcK2wUsAIgixH6DQ7jqnSoBCwCqN2+7xXA4DdDUpbP1537QBQS68Lhbgnju7U33KhEK2z8qbBewmE64SrvIv9cTEM7t8BCwXnadS3VXxwGaqrD9BUwREsWJLoCQ3umCF4WrtN9gH6CpH+6u14/OmIDFdMx0ATBhIQrbmxhTmAIWABy6XAJxFqCp9hsUsAAgjAijQre+rCBgMU33ugBC+qwL/ti87ZaN/QYFLNijR10Abo4mFq5SYXuE0avLu+u18/hKlmkghPTmHi5GrZ4AN0cTkkaFai9sTyOQvVMlYDHtkHWjF4ApyPsNRljbT2H7hkwRAsDurQK08WEIVyunSsACgOrN265rFLYLWABAUREK26+UZQhYABBC3rT+qPJmpsJ2o1cCFgCECFezIMHlQmG7gAUAUYTYb3AIV71TJWABQPXmbbcYDqcBmrp0tgQsAIgiQmH7R4XtAhYAhDBvu1R3dRygqQrbBSwACBGu0n6DfYCmfri7Xj86YwIWAEQQorC9iTGFKWABwKGbt93JcDgL0FT7DQpYABBGhFGh2yFcrZ0qAQsAqjdvu2Vjv0EBCwAoFq5SYXuE0avLu+v1vTMmYAFABGlUqPbC9rTfYO9UCVgAUL283+D7CCFQYbuABQBRrAK08WEIVyunSsACgOrN265rFLYjYAFAUREK26/sNyhgAUAI87brh8NR5c1Mhe1GrwQsAAgRrmZBgsuFwnYBCwCiCLHf4BCueqdKwAKA6s3bbjEcTgM0delsCVgAEEWEwvaPCtsFLAAIYd52qe7qOEBTFbYLWAAQIlyl/Qb7AE39cHe9fnTGBCwAiCBEYXsTYwpTwAKAQzdvu5PhcBagqfYbFLAAIIwIo0K3Q7haO1UCFgBUb952y8Z+gwhYAFAsXKXC9gijV5d31+t7Z0zAAoAI0qhQ7YXtab/B3qkSsACgenm/wfcRQqDCdgELAKJYBWjjwxCuVk6VgAUA1Zu3XdcobEfAAoCiIhS2X9lvUMACgBDmbdcPh6PKm5kK241eCVgAECJczYIElwuF7QIWAEQRYr/BIVz1TpWABQDVm7fdYjicBmjq0tkSsAAgigiF7R8VtgtYABDCvO1S3dVxgKYqbBewACBEuEr7DfYBmvrh7nr96IwJWAAQQYjC9ibGFKaABQCHbt52J8PhLEBT7TcYwA+6gCAXvjRs/796Aoq5HT6kF7rhVy6CnLe1U1U/I1hEcaILoCgF0r++iVs29htEwOIAudOGctK+dfe64b/hKo2QRxi9unTeBCwA6mTfut9L/fEmwHnrnSoBC4A69Qqk/1/eb/B9hBDovAlYMAYXFtjew/Ah7ev9v7YKct5WTpWABWNQdwDbMzX4zLztukZhOwIWAhawBfvW/V6E0bwr5y0m62ARQq49+IueAEqYt10/HI4qb6YvJARmBAuAQwtXsyDB5UJhu4AFAFGE2G9wCFe9UyVgAUD15m23GA6nAZq6dLYELACIIkJhuy8kCFgAEMO87VLd1XGApipsF7AAIES4SvsN9gGa+uHuev3ojAlYABBBiML2JsYUJgIWAIdu3nYnw+EsQFPtNyhgAUAYEUaFbodwtXaqBCwAqN687ZaN/QYRsACgWLhKhe0RRq8u767X9lsVsAAghDQqVHthe9pvsHeqBCwAqF7eb/B9hBCosF3AAoAoVgHa+DCEq5VTJWABQPXmbdc1CtsRsACgqAiF7Vf2GxSwACCEedv1w+Go8mamwnajVwIWAIQIV7MgweVCYbuABQBRhNhvcAhXvVMlYAFA9eZttxgOpwGaunS2BCwAiCJCYftHhe0CFgCEMG+7VHd1HKCpCtsFLAAIEa7SfoN9gKZ+uLtePzpjAhYARBCisL2JMYWJgAXAoZu33clwOAvQVPsNClgAEEaEUaHbIVytnSoBCwCqN2+7ZWO/QQQsACgWrlJhe4TRq8u76/W9MyZgAUAEaVSo9sL2tN9g71QJWABQvbzf4PsIIVBhu4AFAFGsArTxYQhXK6dKwAKA6s3brmsUtiNgAUBREQrbr+w3iIAFQAjztuuHw1HlzUyF7UavELAACBGuZkGCy4XCdgQsAKIIsd/gEK56pwoBC4DqzdtuMRxOAzR16WwhYAEQRYTC9o8K2xGwAAhh3nap7uo4QFMVtiNgARAiXKX9BvsATf1wd71+dMYQsACIIERhexNjChMBC4BDN2+7k+FwFqCp9htEwAIgjAijQrdDuFo7VQhYAFRv3nbLxn6DCFgAUCxcpcL2CKNXl3fX63tnDAELgAjSqFDthe1pv8HeqULAAqB6eb/B9xFCoMJ2BCwAolgFaOPDEK5WThUCFgDVm7dd1yhsR8ACgKIiFLZf2W8QAQuAEOZt1w+Ho8qbmQrbjV4hYAEQIlzNggSXC4XtCFgARBFiv8EhXPVOFQIWANWbt91iOJwGaOrS2ULAAiCKCIXtHxW2I2ABEMK87VLd1XGApipsR8ACIES4SvsN9gGa+uHuev3ojCFgARBBiML2JsYUJgIWAIdu3nYnw+EsQFPtN4iABUAYEUaFbodwtXaqELAAqN687ZaN/QYRsACgWLhKhe0RRq8u767X984YAhYAEaRRodoL29N+g71ThYAFQPXyfoPvI4RAhe0IWABEsQrQxochXK2cKgQsAKo3b7uuUdiOgAUARUUobL+y3yACFgAhzNuuHw5HlTczFbYbvULAAiBEuJoFCS4XCtsRsACIIsR+g0O46p0qBCwAqjdvu8VwOA3Q1KWzhYAFQBRR9hu8caoQsACo3rztUt3VcYCmLp0tBCwAIoSrtN9gH6CpH+6u14/OGAIWABGEKGxvYkxhImABcOjmbXcyHM4CNLW3LAMCFgBRRClsXzlVCFgAVG/edsvGfoMgYAFQLFylwvYIo1eXd9fre2cMAQuACNKoUO2F7Wm/wd6pQsACoHp5v8H3AZqqsB0BC4AwVgHa+DCEK8syIGABUL9523WNwnYQsAAoKsKo0JX9BhGwAAhh3nb9cDiqvJkK2xGwAAgTrmZNjGm3C/sNImABEEWI/QaHcNU7VQhYAFRv3naL4XAaoKlLZwsBC4Aoouw3eONUIWABUL1526W6q+MATV06WwhYAEQIV2m/wT5AUz8obEfAAiCKEIXtTYwpTAQsAA7dvO1OhsNZgKbabxABC4AwohS2r5wqBCwAqjdvu2Vjv0EQsAAoFq5SYXuE0avLu+v1vTOGgAVABGlUqPbC9sntN5iDLQIWAFOT9xt8H6Cpkypsz5ton3gFClgATNMqQBsfhnA1mWUZAm2ijYAFwAYf9F2jsH0f+qb+KVkELAA2FGFU6GpK+w3mTbTPvPQELAAmKNcAHVXezMkVtjdWoBewAJhsuJo1MabdLqa032Bea+zYK1DAAmCaQuw3OISrfkLhKspaYwhYAGzwQb8YDqcBmrqcWNf3jcJ2AQuAyYqy3+DNhEJtWu/qJy89AQuACRo+6FPdVYQaoKVQi4AFQIRwlWqA+gBN/TCxwvYoa40hYAGwgRCF7c2ERnsUtgtYAExYrgGKsLjlpPYbbJ6WwjjyChSwAJimKIXtqwmF2lkTYxNtBCwANvigt9+gUIuABcABftBf3l2v7ycUahdNjLXGELAA2OCDPkIN0BT3G1x59QlYAEwzXEVZlmFShe1BNtFGwAJgQ2n0qvZlGR6GcDW1ZRnOvfQELAAmKNAH/RQL2+03KGABMFERPuivJrbf4KKJsdYYAhYAG3zQzwJ80E+xsN2yDAIWABMWIbhcTGy/wWUTYxNtBCwANvignzX1j159GsJVP6E+t98gAhbAxEUILssJ9rnCdgQsgCkKMnp1O7HC9tTnP3n1IWABTFcfoI3LifX5yssOAQtgooKMXn2YWGF7lE20EbAA2FBfefs+NRMqBFfYjoAFMHFBRq/Op7Tf4OCksd8gAhbApPWVty8Vtq+dJgQsAEIIMnq1dKYQsACIpPbwMqnCdhCwACYuF1qfV9zESRW2g4AFcBhSuKp5BfHlxArbQcACOADLitv2cUortoOABXAA5m2XwlWtywR8bhS2I2ABEFBfcdtMDSJgARDLvO0WTb2jV9a8QsACIKRavzloahABC4B48sKip5U2r7fmFQIWABHVOnqVpgateYWABUAseWHRZYVNMzUIAhZAWF1T58Ki56YGQcACiKrG6cG0oOjKqQEBCyCcvDTDcWXNMjUIAhZAaDUGmc6CovD/ftAF8MfySEGaiknHr/Uut8MjLZ648oHCHl6Tqbj9rLJmXdprEH7NCBb88QfZajhcN0/rDD0vJn43PP45PO6H/+dET7Fjy8ra89DUvVUPCFhQWbj63ihB2p7kRshix2oqbv9P3ZWRXBCw4CXhqmtePgWTRrbstcauXpsnTV37DqbV2u+dGRCw4EUfGq/8/4+GD76lbmMHahq9+mi1dhCw4KUjBKmAeJOvvy/0Hjt4bXaVNOdTY0kGELBgB0FppusYWU0rt1uSAQQs2EnAgl0ErBr8Q90VCFjwWpt+I/BR1zGWedvNmqflQvZN3RUIWLCRdwIWFaph9Cqtd7V0KkDAglfZcj2rGz3IiPYdbKx3BQIWbGybgKUmhTGD/743dj5XdwUCFuw6YH1yZ8+Ilnv+/WmfwZXTAAIW7DpgubNnTPusv7odwtW5UwACFmxj0wJ3AYtR7HlrnE9NPUtDgIAFQT/IZlv8+I0eZCTLPf3eVNRuMVEQsGBrCtyp0b5GkBS1g4AFew1Yn93lM4Y9Tg9+UNQOAhaUstjw59zlM5blHn7n1RCuel0PAhaUMtvw5250HSPZ9fRgWqndNwZBwIIy5m33ttl8KsYIFmO8Jnc9PZiK2hemu0HAgpK2KXB/1H2MYJejV8IVCFhQV8DyTSsmELA6r2MQsKCmgHWr6ygtr8m2q70HfxzC1Y1eBwELagpYj7qOESx29HssxwACFoxq09EC0yqMYRfTg5ZjAAELxjNvu8UWPy5gMYbTkZ//4xCulroZBCwYky1yqCnwjz16lda6Eq5AwIJqA5YtchjDYuRwZTkGELCg6oBl9IpIAUu4AgELdkqBO1UYcXmGtJDoUrgCAQt29YG22OLHH/UghS1GeM6vq7S7IQABC3ZGgTtTDljCFQhYEO4DzYcWNQcs4QoELNibbfYgVM9CMbn+6ki4AgELDvkDzR6ElLYQrkDAginYpv7K6BU1BizhCgQsCP2B5gOM2gKWcAWV+UEX4APt1R531cg8ldnn9n6d0rzNIe9i+EB93EfnDe162zyNAj7uqw1Tkftym/or4QoELKjmA22bBR0fd9TO8+Hwz2/8p3f5sUz/z/DButph3y1z4Dt69u/S4SoHPh/yuw37whVUyhQhPtBeb/QPsz8JV8+9GR4/59AzeigdHunv/rn59mjL2fD49y7aMkEb74cpXIGABZMJWGMv0ZCnBf/5ih+5yD8zppvmZaN+KfB1XmKjvx6FKxCwYFIB62EH7etf+f+nkazzEQNf37xuSnWVp2F5mZMNXoMz4QoELKhGgfqrXSzRsMkI0GLE9rw2vL3Z8G84xNfjLPfXa8LVwkK3IGBBbbb94H8c+QN38coP3K+OR2rPyYbtWXipvchrRq9uhSuIw7cIOTTbfvA/jty+2kZ+Ni3AnnmpFe3fqyFYLXUXxGEEi0PTTbR9Y9WGnXjJ7D3wfxCuIB4jWByMLaa7nrsfuX2bLjh5s8cAsNN+mpjZd/77j7tc5wwQsGATJUYBfqm0fcUD1pZfCBCwXuaPArVlGCA4U4QckqlOD6a1udYjtGexxc8+erl9N8D+0fRrmu49Ea5AwIIIH2azZrv93r76ZaT2bTM9+HGkbts4YA3h4Mar7rtm3/h3acuhhf0dIT5ThByKIgtxjjiqsNziZ8cKM7UV3E/Nb0ew1FuBgAXh1D49WFXA2nLE79HL7VU+pdenKUGYFlOETN6W02+7aF8KV5t+u/HzSB/M2wRSQeFlFs3T9K56K5ggI1gcgvPK27dNmLkZqU3LLX720UvuZX2s1gqmywgWk5aXGugqbt9sOJxu8RT3I7Vpm613hIYXEK5AwILQowTN9ouLjmnb0bWbCtsEIGDpAiau2rCQR9eWlYZSAAQs+GaASUHhqPBzLgqHv61G10qvN7VlwT0AmSJ3pqyvvH1Lffaq4Jdq6d4++9dp9frVEDJ/8VIHBCzY3QfyGEszpCUfbgq077ypbOmIgn32tmCbUn+vmm8X3b9LgTD1pQU6gdqYImSK4Sp9wF+M9PSzQu3rC/2ti4J/W1/oeU4Khqub5s+/0ZimM3/O4RBAwIIR9c14dUQlAs15wfbNSjxJ4RG1rkB7UghdvaKffs7LSwAIWFBaHtH5acRfcZw//DdtXxqVeV9T4MvBpC/cR9uGndSe4w1+BkDAgsLhKgWf9Q5+1XKLn10VbsvZNmHmWZ+9qaWP8nTfJiG58y4ABCwoH65umt0sMXC+YRtTuDoeoT0XW/7sGG16v0nwyyN8m/49b0wTAgIWlA9Xxzv6lUfD7+xf2cblcDgbqT2nmxR558B3NmI/rV8znZqnd7cNyW+9IwABC7YPV7Mdh6uv3r801OQC8p9Hbs/PLw19qc+Gx/3I4arJ5+TmJSErt/262X7h1XvvCqAG1sEicrhKwaVv9rfy+M95Sqv/1mKXOfyl6a7THbXna+hLfbL+bZtye1KfLXfYZylk3ad2/XbV+dyeLrepxDcYH7wrAAELNgtVpT+Ut5WKsZdDu1Kh+OPwSKEmjdic7DBYPZf65Occ/j7lNiWzPfZX+r3XQ3tun/27Mdpz4R0CCFjw8kC1bJ6WI9hnSPgzaTTorMJ2HVXWX+9GfO5bq7kDAha8LFz1Tdk1o5imz02d+zoCB0yRO7WGq9UOwlX6YG7zkbhSfdejbgAELPjzcJVqrMaeckuhapELrxdCVliXwzlc6wZAwILv63fwOxZfv9Kfj0vd/l23lbXnajh3504LIGDBd+Si9rHXtPrxt+sl5VGQf1TSDZcpPFR2alKfLSpqV1qSQbgCBCx4odkOgsLqW/9h+PcXFQSI1L7z4bFM/1zB+UhTp3//2me5XR8qCFeLb609BiBgwe6Dwo/f+yp/DhD7Clm/al/+5783+6sP+1qntv5NH/V7DH9XwhUgYEE94Wrx0nWScsj6x47b136rfTncLJrdr1Keft/JH209k9u6629gfkjnRrgCBCx4pfytvpIf2qkwe/baPerydOHfhsenHQWZmz9py/3wSCvD72pqLn0z7+R7Sx/kNp804xe/f8oBtPcOAQQs2FyJLU++TgluPJ2Ug80sB5vSIzXp+T68JMg8a08KGH9txpvCTEHpb6/5Zl5qey5+/7EZZzTr8nsBFEDAgpcHrE2nxD7nQDQrtXVKDjYlg9ZVDg39Bm15zFOYf83tKTHC9rF5GiFavHak71m7ViP00V9zwb8pQSCcv3z58kUv7NG87dKd+bZ7tN3mUYQp9UvaMDn1zUuXbEhBI33IX4z9gZwXQk2P1Ocv3evvIbdvVbp9Q3tOnrXnJa+lz7lv02M9xiroQ5uWuU2v2fA6Bb11bpNQRaTrVXrvXRd4qtZo7XTYi5Aq5Q/Yk7wf4fIPgszts5Bwv8O2rXMQ+Lpu1yyHm99Kf0Nq1/2YgSH/7ffPLvZf29Q8O34NUY+72FYmj2itnn34pBD49hv/62Nukw8VYFKMYO3/zuemMYL1kn56HhrujXAAFV2f0vXXCBa/YgSLEPKoy6OeACACRe4AAAIWAICABQAgYAEAIGABAAhYAAACFgAAAhYAgIAFACBgAQAgYAEACFgAAAIWAICABQCAgAUAIGABAAhYAAAIWAAAAhYAgIAFAICABQAgYAEACFgAAAhYVXks8BxvdSMACFiUDVjHuhFgbxYlnuTuen2jKwUsAAAErGmbt92JXgDYi5kuQMCqz02h51GHBRA3YD3oRgGLOi10AcBevCvwHL/oRgGLggoWNZoiBNixedvNCj3Vvd4UsCjvs4AFENKi0PM86koBi/JK3LkcFbyTAmC3AcsIloBFpQGr5BsdAAELAUvAyjpdCbAbedbgqMBTfbq7XityF7AYwU1ld1IA7O6m1uiVgMUYhjuXx3QHU+Cp3gx3VEaxAHZjWdlNNgIWI77BlroSYFx5erDUPrACloBFgIB1OrzxreoOMK7zQs/z+e56bYpQwCJAwCr5xgfg25aFnmetKwUsRpTrsB4qe+MD8BvztkvX2DcCFgJWHKtCz3OULwAAlNcXvLkWsAQsdmBd4wUAgCf55vWo0NNd6VEBix0oPE1oFAugvJI3r0avBCx26KLkc/lGIUAZw/U0fYGo1OjVZ9ODAha7ld5wnws915vGVCFAiXD1tvD19EKvCljsUN6PquRdzU/DheFEzwJsZdWU++bg1+dDwGLH+sLP540MsKG8Bdlpwae8yjW3CFjsUn7jfSz4lMfDBcJwNMDrw9XbEW5S3fQKWOxR6UD0k42gAV4tlWyUnBq8HW6ib3SrgMWe5Dfgbem7JvVYAC+TR/7fFX7aXs8KWOxf6T0F3+SQZekGgD8PV8vh8FPhpzV6JWBRg7zDeumVfo+bshtLA0wtXC2Gw88jPPVS7wpY1KNvyq2L9d+QNVxAVroW4HfhKpVRjLEAqG8OCljUJL8hx/gG4JmQBfC7cHXTlC1qb/JN8rkePix/+fLli16I8cZP04XHY9xVpTd+XuAUQLgq78fhGuuG9sAYwYpjrLufs3RRUfgOHHC4Wg6Hf48Urm6FKwGLiuVvnlyO9PTHOWRZwgE4tHDVN+MUtCdpanCplw+TKcJ4F4Oxpgr/ezGwwztwANfSryu0n474a0wNHjAjWPEsm/LfKvwqDY//KxW/mzIEJhyuFsPhfuRwdSVcCVgEktfGGvvbKKku6z5fhACmEqze5tXZr4fH0Yi/6qHxrcGDZ4ow7oVilYPQ2HzLEJjCNTPtxXoxcrBK0gzDIt8MI2AR9IJx05TfJ+uPLhjpwnQhaAHBrpOL5mnB5nc7+pV/V8eKgBX/wpHqpFLIOt7RrxS0AMHqjylqR8Ca0EVk1jwVa77Z4a9NQSvdofW2fgAquyYum6cvA73b8a9ORe1LZwABa1oXlDFXIP6eVMyZ7tjWwhawp2vgIoeqbk/XQeEKAUvIGj1spZGtm7wwKsAY17vZcFjkx75ClXCFgCVk7TVwpenLx9yuRvACXhmknj9SoDqp6BonXCFgCVkACFfsioVGJyavvZLu9B70BsAo/iFcIWAdZshKSygshset3gAoJn2DOi3FcKEr+B5ThBOXt4X4SU8AbOXT8Ois0I6AxfOQlb5ls2rUZQFs4jaHKwssI2Dxu5A1a56WUDjWGwAv9mEIVr1uQMDie0ErXSje6wmAP5W+KLQ0JYiAxWtCVlrKYdUYzQL4FqNWCFhsFbTOm6fNUNVmATzVWi1t+4WARYmQ9TaHLN80BA5V+obg+RCs1roCAYvSQWuWg9aZ3gAOKFj1Q7Ba6QoELAQtAMEKAYugQStNHaYareXwONIjwAR8HB4rU4EIWNQStroctE71BhBMGq1a5WD1qDsQsKgxaKVRrS4/hC2g5lC1zqHKOlYIWIQLXCloLfLDmlrAvqRNmG/yY22kCgGLqQWuFLRO8mOWj9bYAkpKo1OPOUyl0al7gQoBi0MOXsnbHLoAXuKXHKKSR0EKAQsA4ID9jy4AABCwAAAELAAAAQsAAAELAEDAAgAQsAAAELAAAAQsAAABCwAAAQsAQMACABCwAAAELAAABCwAAAELAEDAAgBAwAIAELAAAAQsAAAELAAAAQsAQMACAEDAAgAQsAAABCwAAAELAAABCwBAwAIAELAAABCwAAAELAAAAQsAAAELAEDAAgAQsAAAELAAAAQsAAABCwBAwAIAQMACABCwAAAELAAABCwAAAELAEDAAgBAwAIAELAAAAQsAAD+T4ABAOih9wtfJ+UaAAAAAElFTkSuQmCC', 1);
INSERT INTO mixed_icons VALUES (2, 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTIxLjkgMTcuMjk5OUMyMiAxNi44OTk5IDIyLjEgMTYuNDk5OSAyMi4xIDE2LjA5OTlWNy43OTk5M0MyMi4xIDYuMDk5OTMgMjAuOCA0Ljc5OTkzIDE5LjIgNC43OTk5M0g0LjgwMDAyQzQuNDAwMDIgNC43OTk5MyA0LjAwMDAyIDQuODk5OTMgMy42MDAwMiA1LjA5OTkzQzMuMzAwMDIgNS4xOTk5MyAzLjAwMDAyIDUuMzk5OTMgMi43MDAwMiA1LjY5OTkzQzIuMjAwMDIgNi4yOTk5MyAxLjkwMDAyIDYuOTk5OTMgMS45MDAwMiA3Ljc5OTkzVjE2LjA5OTlDMS45MDAwMiAxNi40OTk5IDIuMDAwMDIgMTYuODk5OSAyLjEwMDAyIDE3LjI5OTlDMi4yMDAwMiAxNy42OTk5IDIuNDAwMDIgMTcuOTk5OSAyLjcwMDAyIDE4LjI5OTlDMy4wMDAwMiAxOC41OTk5IDMuMzAwMDIgMTguNzk5OSAzLjYwMDAyIDE4Ljg5OTlDNC4wMDAwMiAxOS4wOTk5IDQuMzAwMDIgMTkuMDk5OSA0LjcwMDAyIDE5LjA5OTlIMTkuMkMxOS42IDE5LjA5OTkgMjAgMTguOTk5OSAyMC4zIDE4Ljg5OTlDMjAuNiAxOC42OTk5IDIwLjkgMTguNDk5OSAyMS4yIDE4LjI5OTlDMjEuNSAxNy45OTk5IDIxLjcgMTcuNjk5OSAyMS45IDE3LjI5OTlaTTE5LjIgMTguNTk5OUg0LjgwMDAyQzMuNTAwMDIgMTguNTk5OSAyLjUwMDAyIDE3LjQ5OTkgMi41MDAwMiAxNi4xOTk5VjcuNzk5OTNDMi41MDAwMiA2LjM5OTkzIDMuNTAwMDIgNS4zOTk5MyA0LjgwMDAyIDUuMzk5OTNIMTkuM0MyMC42IDUuMzk5OTMgMjEuNiA2LjQ5OTkzIDIxLjYgNy43OTk5M1YxNi4wOTk5QzIxLjYgMTcuNDk5OSAyMC41IDE4LjU5OTkgMTkuMiAxOC41OTk5WiIgZmlsbD0iIzM3NDA0RiIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTE2LjMgMTUuOEMxNS44IDE1LjggMTUuNCAxNS42IDE1IDE1LjNDMTQuOCAxNS4xIDE0LjYgMTQuOCAxNC41IDE0LjVWMTQuNEwxNC40IDE0LjNIOC45MDAwMlYxNC40QzguODAwMDIgMTQuOCA4LjYwMDAyIDE1LjEgOC40MDAwMiAxNS4zQzguMTAwMDIgMTUuNiA3LjYwMDAyIDE1LjggNy4xMDAwMiAxNS44QzYuNjAwMDIgMTUuOCA2LjIwMDAyIDE1LjYgNS44MDAwMiAxNS4zQzUuNjAwMDIgMTUuMSA1LjQwMDAyIDE0LjggNS4zMDAwMiAxNC41VjE0LjRMNS4yMDAwMiAxNC4zSDQuNDAwMDJDNC40MDAwMiAxNC4yIDQuNDAwMDIgMTMuMSA0LjYwMDAyIDEyLjFDNC43MDAwMiAxMS40IDQuOTAwMDIgMTEuMiA0LjkwMDAyIDExLjJINi4wMDAwMkw2LjMwMDAyIDEwLjJDNi40MDAwMiA5LjY5OTk3IDYuODAwMDIgOC41OTk5NyA2LjkwMDAyIDguMTk5OTdDNi45MDAwMiA4LjA5OTk4IDcuMDAwMDIgOC4wOTk5OCA3LjEwMDAyIDguMDk5OThIMTEuOUMxMi4xIDguMDk5OTggMTIuMyA4LjE5OTk4IDEyLjQgOC4yOTk5OEMxMyA4LjY5OTk4IDEzLjQgOS4xOTk5OCAxMy44IDkuNzk5OThDMTQuMSAxMC4yIDE0LjQgMTAuNyAxNC42IDExLjJWMTEuM0wxNC43IDExLjRIMTcuOEMxOC43IDExLjQgMTkuNCAxMi4xIDE5LjQgMTNWMTQuNEgxOFYxNC41QzE3LjkgMTQuOSAxNy43IDE1LjIgMTcuNSAxNS40QzE3LjIgMTUuNyAxNi43IDE1LjggMTYuMyAxNS44Wk0xNi4zIDEyLjlDMTYgMTIuOSAxNS43IDEzIDE1LjUgMTMuMkMxNS4zIDEzLjQgMTUuMiAxMy43IDE1LjIgMTRDMTUuMiAxNC4zIDE1LjMgMTQuNiAxNS41IDE0LjhDMTUuNyAxNSAxNiAxNS4xIDE2LjMgMTUuMUMxNi42IDE1LjEgMTYuOSAxNSAxNy4xIDE0LjhDMTcuMyAxNC42IDE3LjQgMTQuMyAxNy40IDE0QzE3LjQgMTMuNyAxNy4zIDEzLjQgMTcuMSAxMy4yQzE2LjggMTMgMTYuNiAxMi45IDE2LjMgMTIuOVpNNy4xMDAwMiAxMi45QzYuODAwMDIgMTIuOSA2LjUwMDAyIDEzIDYuMzAwMDIgMTMuMkM2LjEwMDAyIDEzLjQgNi4wMDAwMiAxMy43IDYuMDAwMDIgMTRDNi4wMDAwMiAxNC4zIDYuMTAwMDIgMTQuNiA2LjMwMDAyIDE0LjhDNi41MDAwMiAxNSA2LjgwMDAyIDE1LjEgNy4xMDAwMiAxNS4xQzcuNDAwMDIgMTUuMSA3LjcwMDAyIDE1IDcuOTAwMDIgMTQuOEM4LjEwMDAyIDE0LjYgOC4yMDAwMiAxNC4zIDguMjAwMDIgMTRDOC4yMDAwMiAxMy43IDguMTAwMDIgMTMuNCA3LjkwMDAyIDEzLjJDNy42MDAwMiAxMyA3LjQwMDAyIDEyLjkgNy4xMDAwMiAxMi45Wk03LjUwMDAyIDguOTk5OThDNy40MDAwMiA4Ljk5OTk4IDcuMDAwMDIgMTAuNiA2LjkwMDAyIDExLjFDNi45MDAwMiAxMS4yIDYuOTAwMDIgMTEuMiA3LjAwMDAyIDExLjJIMTMuOEwxMy42IDExQzEzLjUgMTAuOCAxMy4zIDEwLjUgMTMuMSAxMC4zQzEyLjggOS44OTk5OCAxMi40IDkuNDk5OTggMTEuOSA5LjA5OTk4QzExLjkgOC45OTk5OCAxMS44IDguOTk5OTggMTEuNyA4Ljk5OTk4SDcuNTAwMDJaIiBmaWxsPSIjMzc0MDRGIi8+Cjwvc3ZnPgo=', 1);
INSERT INTO mixed_icons VALUES (3, 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTQuMSAxNi43SDEuNVY2LjY5OTk1SDQuMUg2LjVWMS42OTk5NUgxMy41VjguNjk5OTVIMTQuNVYyLjE5OTk1QzE0LjUgMS4zOTk5NSAxMy44IDAuNjk5OTUxIDEzIDAuNjk5OTUxSDYuMkwwLjUgNi4zOTk5NVYxNi4yQzAuNSAxNyAxLjIgMTcuNyAyIDE3LjdINC4xVjE2LjdaIiBmaWxsPSIjMzc0MDRGIi8+CjxwYXRoIGQ9Ik0xMy41IDE0LjZDMTQuMDUyMyAxNC42IDE0LjUgMTQuMTUyMyAxNC41IDEzLjZDMTQuNSAxMy4wNDc3IDE0LjA1MjMgMTIuNiAxMy41IDEyLjZDMTIuOTQ3NyAxMi42IDEyLjUgMTMuMDQ3NyAxMi41IDEzLjZDMTIuNSAxNC4xNTIzIDEyLjk0NzcgMTQuNiAxMy41IDE0LjZaIiBmaWxsPSIjMzc0MDRGIi8+CjxwYXRoIGQ9Ik04LjMgMTEuN0M5LjAxNzk3IDExLjcgOS42IDExLjExNzkgOS42IDEwLjRDOS42IDkuNjgyIDkuMDE3OTcgOS4wOTk5OCA4LjMgOS4wOTk5OEM3LjU4MjAzIDkuMDk5OTggNyA5LjY4MiA3IDEwLjRDNyAxMS4xMTc5IDcuNTgyMDMgMTEuNyA4LjMgMTEuN1oiIGZpbGw9IiMzNzQwNEYiLz4KPHBhdGggZD0iTTE4LjYgMTEuN0MxOS4zMTggMTEuNyAxOS45IDExLjExNzkgMTkuOSAxMC40QzE5LjkgOS42ODIgMTkuMzE4IDkuMDk5OTggMTguNiA5LjA5OTk4QzE3Ljg4MiA5LjA5OTk4IDE3LjMgOS42ODIgMTcuMyAxMC40QzE3LjMgMTEuMTE3OSAxNy44ODIgMTEuNyAxOC42IDExLjdaIiBmaWxsPSIjMzc0MDRGIi8+CjxwYXRoIGQ9Ik0xNC4yIDE1LjVIMTIuN0MxMi4yIDE1LjUgMTEuNyAxNiAxMS43IDE2LjVWMTkuM0gxMi40SDEyLjVWMjEuOUgxNC4yVjE5LjNIMTQuM0gxNVYxNi41QzE1LjIgMTYgMTQuNyAxNS41IDE0LjIgMTUuNVoiIGZpbGw9IiMzNzQwNEYiLz4KPHBhdGggZD0iTTkuNCAxMi43SDcuM0M2LjYgMTIuNyA2IDEzLjMgNiAxNFYxOC4zSDdINy4yVjIxLjlIOS42VjE4LjNIOS44SDEwLjlWMTRDMTAuOCAxMy4zIDEwLjIgMTIuNyA5LjQgMTIuN1oiIGZpbGw9IiMzNzQwNEYiLz4KPHBhdGggZD0iTTE5LjcgMTIuN0gxNy41QzE2LjggMTIuNyAxNi4yIDEzLjMgMTYuMiAxNFYxOC4zSDE3LjNIMTcuNVYyMS45SDE5LjlWMTguM0gyMC4xSDIxVjE0QzIxIDEzLjMgMjAuNCAxMi43IDE5LjcgMTIuN1oiIGZpbGw9IiMzNzQwNEYiLz4KPC9zdmc+Cg==', 1);
INSERT INTO mixed_icons VALUES (4, 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTYuOTk5OTkgMTdIMi43OTk5OVY3SDUuMzk5OTlINy43OTk5OVYySDE0LjhWOEgxNS44VjIuNUMxNS44IDEuNyAxNS4xIDEgMTQuMyAxSDcuNDk5OTlMMS43OTk5OSA2LjdWMTYuNUMxLjc5OTk5IDE3LjMgMi40OTk5OSAxOCAzLjI5OTk5IDE4SDYuOTk5OTlWMTdaIiBmaWxsPSIjMzc0MDRGIi8+CjxwYXRoIGQ9Ik0xNS41IDIyLjRDMTUuNCAyMi40IDE1LjMgMjIuNCAxNS4yIDIyLjNDMTIuNSAyMC40IDEwLjYgMTguNSA5LjUgMTYuN0gxMS43QzExLjkgMTYuNyAxMi4yIDE2LjYgMTIuMiAxNi4zTDEyLjggMTQuNkwxMy44IDE4LjhDMTMuOSAxOSAxNC4xIDE5LjIgMTQuMyAxOS4yQzE0LjMgMTkuMiAxNC4zIDE5LjIgMTQuNCAxOS4yQzE0LjYgMTkuMiAxNC44IDE5LjEgMTQuOSAxOC45TDE2LjEgMTYuNkgxOC40QzE4LjYgMTYuNiAxOC43IDE2LjUgMTguOCAxNi40QzE4LjkgMTYuMyAxOSAxNi4xIDE5IDE2QzE5IDE1LjcgMTguNyAxNS40IDE4LjQgMTUuNEgxNS44QzE1LjYgMTUuNCAxNS40IDE1LjUgMTUuMyAxNS43TDE0LjYgMTdMMTMuNSAxMi41QzEzLjQgMTIuMyAxMy4zIDEyLjEgMTMgMTIuMUgxMi45QzEyLjcgMTIuMSAxMi40IDEyLjIgMTIuNCAxMi41TDExLjIgMTUuNUg4LjhDOC4yIDEzLjkgOC4yIDEyLjQgOSAxMS4yQzkuNyAxMC4yIDEwLjkgOS41IDEyLjIgOS41QzEzLjMgOS41IDE0LjQgOS45IDE1LjMgMTAuOEwxNS40IDEwLjlMMTUuNSAxMC44QzE2LjQgMTAgMTcuNSA5LjUgMTguNiA5LjVDMjAuMyA5LjUgMjEuOCAxMC42IDIyLjMgMTIuMUMyMy4yIDE1IDIwLjcgMTguOCAxNS43IDIyLjJDMTUuNyAyMi4zIDE1LjYgMjIuNCAxNS41IDIyLjRaIiBmaWxsPSIjMzc0MDRGIi8+Cjwvc3ZnPgo=', 1);
INSERT INTO mixed_icons VALUES (5, 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTIxLjkgMTcuMjk5OUMyMiAxNi44OTk5IDIyLjEgMTYuNDk5OSAyMi4xIDE2LjA5OTlWNy43OTk5M0MyMi4xIDYuMDk5OTMgMjAuOCA0Ljc5OTkzIDE5LjIgNC43OTk5M0g0LjgwMDAyQzQuNDAwMDIgNC43OTk5MyA0LjAwMDAyIDQuODk5OTMgMy42MDAwMiA1LjA5OTkzQzMuMzAwMDIgNS4xOTk5MyAzLjAwMDAyIDUuMzk5OTMgMi43MDAwMiA1LjY5OTkzQzIuMjAwMDIgNi4yOTk5MyAxLjkwMDAyIDYuOTk5OTMgMS45MDAwMiA3Ljc5OTkzVjE2LjA5OTlDMS45MDAwMiAxNi40OTk5IDIuMDAwMDIgMTYuODk5OSAyLjEwMDAyIDE3LjI5OTlDMi4yMDAwMiAxNy42OTk5IDIuNDAwMDIgMTcuOTk5OSAyLjcwMDAyIDE4LjI5OTlDMy4wMDAwMiAxOC41OTk5IDMuMzAwMDIgMTguNzk5OSAzLjYwMDAyIDE4Ljg5OTlDNC4wMDAwMiAxOS4wOTk5IDQuMzAwMDIgMTkuMDk5OSA0LjcwMDAyIDE5LjA5OTlIMTkuMkMxOS42IDE5LjA5OTkgMjAgMTguOTk5OSAyMC4zIDE4Ljg5OTlDMjAuNiAxOC42OTk5IDIwLjkgMTguNDk5OSAyMS4yIDE4LjI5OTlDMjEuNSAxNy45OTk5IDIxLjcgMTcuNjk5OSAyMS45IDE3LjI5OTlaTTE5LjIgMTguNTk5OUg0LjgwMDAyQzMuNTAwMDIgMTguNTk5OSAyLjUwMDAyIDE3LjQ5OTkgMi41MDAwMiAxNi4xOTk5VjcuNzk5OTNDMi41MDAwMiA2LjM5OTkzIDMuNTAwMDIgNS4zOTk5MyA0LjgwMDAyIDUuMzk5OTNIMTkuM0MyMC42IDUuMzk5OTMgMjEuNiA2LjQ5OTkzIDIxLjYgNy43OTk5M1YxNi4wOTk5QzIxLjYgMTcuNDk5OSAyMC41IDE4LjU5OTkgMTkuMiAxOC41OTk5WiIgZmlsbD0iIzM3NDA0RiIvPgo8cGF0aCBkPSJNMTQuMSA4LjcwMDAzSDE4LjJDMTguNCA4LjcwMDAzIDE4LjYgOC41MDAwMyAxOC42IDguMzAwMDNDMTguNiA4LjEwMDAyIDE4LjQgNy45MDAwMiAxOC4yIDcuOTAwMDJIMTQuMUMxMy45IDcuOTAwMDIgMTMuNyA4LjEwMDAyIDEzLjcgOC4zMDAwM0MxMy43IDguNTAwMDMgMTMuOSA4LjcwMDAzIDE0LjEgOC43MDAwM1oiIGZpbGw9IiMzNzQwNEYiLz4KPHBhdGggZD0iTTE4LjIgMTEuNkgxNC4xQzEzLjkgMTEuNiAxMy43IDExLjggMTMuNyAxMkMxMy43IDEyLjIgMTMuOSAxMi40IDE0LjEgMTIuNEgxOC4yQzE4LjQgMTIuNCAxOC42IDEyLjIgMTguNiAxMkMxOC42IDExLjggMTguNSAxMS42IDE4LjIgMTEuNloiIGZpbGw9IiMzNzQwNEYiLz4KPHBhdGggZD0iTTE4LjIgMTUuMjk5OUgxNC4xQzEzLjkgMTUuMjk5OSAxMy43IDE1LjQ5OTkgMTMuNyAxNS42OTk5QzEzLjcgMTUuODk5OSAxMy45IDE2LjA5OTkgMTQuMSAxNi4wOTk5SDE4LjJDMTguNCAxNi4wOTk5IDE4LjYgMTUuODk5OSAxOC42IDE1LjY5OTlDMTguNiAxNS40OTk5IDE4LjUgMTUuMjk5OSAxOC4yIDE1LjI5OTlaIiBmaWxsPSIjMzc0MDRGIi8+CjxwYXRoIGQ9Ik05IDEyLjRDOCAxMy4xIDYuNyAxMy4xIDUuNyAxMi40QzQuNyAxMi44IDQgMTMuOSA0IDE1VjE1LjRDNCAxNS42IDQuMSAxNS43IDQuMiAxNS43QzYuMyAxNi40IDguNCAxNi40IDEwLjUgMTUuN0MxMC42IDE1LjcgMTAuNyAxNS41IDEwLjcgMTUuNFYxNUMxMC44IDEzLjkgMTAuMSAxMi44IDkgMTIuNFoiIGZpbGw9IiMzNzQwNEYiLz4KPHBhdGggZD0iTTcuNDAwMDIgMTEuNzAwMUM4LjUwNDU5IDExLjcwMDEgOS40MDAwMiAxMC44MDQ2IDkuNDAwMDIgOS43MDAwN0M5LjQwMDAyIDguNTk1NSA4LjUwNDU5IDcuNzAwMDcgNy40MDAwMiA3LjcwMDA3QzYuMjk1NDUgNy43MDAwNyA1LjQwMDAyIDguNTk1NSA1LjQwMDAyIDkuNzAwMDdDNS40MDAwMiAxMC44MDQ2IDYuMjk1NDUgMTEuNzAwMSA3LjQwMDAyIDExLjcwMDFaIiBmaWxsPSIjMzc0MDRGIi8+Cjwvc3ZnPgo=', 1);
INSERT INTO mixed_icons VALUES (6, 'data:image/png;base64,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', 1);
INSERT INTO mixed_icons VALUES (7, 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTE4LjkgMjEuMTk5OUg1LjA5OTk1QzQuODk5OTUgMjEuMTk5OSA0LjY5OTk1IDIwLjk5OTkgNC42OTk5NSAyMC43OTk5QzQuNjk5OTUgMjAuNTk5OSA0Ljg5OTk1IDIwLjM5OTkgNS4wOTk5NSAyMC4zOTk5SDE4LjlDMTkuMSAyMC4zOTk5IDE5LjMgMjAuNTk5OSAxOS4zIDIwLjc5OTlDMTkuMyAyMC45OTk5IDE5LjEgMjEuMTk5OSAxOC45IDIxLjE5OTlaIiBmaWxsPSIjMzc0MDRGIi8+CjxwYXRoIGQ9Ik0xOC45IDEzLjc5OTlIMTguN0gxN0gxNC4zQzE0IDEzLjQ5OTkgMTMuOCAxMy4xOTk5IDEzLjcgMTIuODk5OUMxMy40IDExLjk5OTkgMTMuOCA5Ljk5OTkzIDE0LjYgOS4zOTk5M0MxNS43IDguNTk5OTMgMTYuMSA2LjY5OTkzIDE1LjYgNS4xOTk5M0MxNSAzLjY5OTkzIDEzLjcgMi43OTk5MyAxMiAyLjc5OTkzQzEwLjMgMi43OTk5MyA4Ljk5OTk1IDMuNjk5OTMgOC40OTk5NSA1LjE5OTkzQzcuOTk5OTUgNi42OTk5MyA4LjM5OTk1IDguNTk5OTMgOS40OTk5NSA5LjM5OTkzQzEwLjQgMTAuMDk5OSAxMC43IDExLjk5OTkgMTAuNCAxMi44OTk5QzEwLjMgMTMuMTk5OSAxMC4xIDEzLjQ5OTkgOS43OTk5NSAxMy43OTk5SDkuNDk5OTVINy4wOTk5NUg1LjM5OTk1SDUuMDk5OTVDNC44OTk5NSAxMy43OTk5IDQuNjk5OTUgMTMuOTk5OSA0LjY5OTk1IDE0LjE5OTlWMTcuNTk5OUM0LjY5OTk1IDE3Ljc5OTkgNC44OTk5NSAxNy45OTk5IDUuMDk5OTUgMTcuOTk5OUgxOC45QzE5LjEgMTcuOTk5OSAxOS4zIDE3Ljc5OTkgMTkuMyAxNy41OTk5VjE0LjE5OTlDMTkuMyAxMy45OTk5IDE5LjEgMTMuNzk5OSAxOC45IDEzLjc5OTlaTTkuOTk5OTUgOC42OTk5M0M5LjE5OTk1IDguMDk5OTMgOC44OTk5NSA2LjY5OTkzIDkuMjk5OTUgNS40OTk5M0M5LjQ5OTk1IDQuNzk5OTMgMTAuMiAzLjY5OTkzIDEyIDMuNjk5OTNDMTMuOCAzLjY5OTkzIDE0LjUgNC43OTk5MyAxNC43IDUuNDk5OTNDMTUuMSA2LjY5OTkzIDE0LjggOC4wOTk5MyAxNCA4LjY5OTkzQzEyLjggOS41OTk5MyAxMi4zIDExLjk5OTkgMTIuOCAxMy4xOTk5QzEyLjkgMTMuMzk5OSAxMyAxMy41OTk5IDEzLjEgMTMuNzk5OUgxMUMxMS4xIDEzLjU5OTkgMTEuMiAxMy4zOTk5IDExLjMgMTMuMTk5OUMxMS43IDExLjg5OTkgMTEuMiA5LjU5OTkzIDkuOTk5OTUgOC42OTk5M1pNMTguNSAxNy4yOTk5SDUuNDk5OTVWMTQuNjk5OUg5LjQ5OTk1SDkuODk5OTVIMTguNVYxNy4yOTk5WiIgZmlsbD0iIzM3NDA0RiIvPgo8L3N2Zz4K', 1);
INSERT INTO mixed_icons VALUES (8, 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTYuNjAwMDIgMTdIMi40MDAwMlY3SDUuMDAwMDJINy40MDAwMlYySDE0LjRWOEgxNS40VjIuNUMxNS40IDEuNyAxNC43IDEgMTMuOSAxSDcuMjAwMDJMMS40MDAwMiA2LjdWMTYuNUMxLjQwMDAyIDE3LjMgMi4xMDAwMiAxOCAyLjkwMDAyIDE4SDYuNjAwMDJWMTdaIiBmaWxsPSIjMzc0MDRGIi8+CjxwYXRoIGQ9Ik03LjIwMDAxIDEzLjdMMTQuOSA5LjVMMjIuNiAxMy43VjE4LjNDMjIuNiAxOC41IDIyLjUgMTguNiAyMi4zIDE4LjZIMjEuNUMyMS4zIDE4LjYgMjEuMiAxOC41IDIxLjIgMTguM1YxNC45QzIxLjIgMTQuNyAyMSAxNC42IDIwLjggMTQuN0wyMCAxNS4xQzE5LjkgMTUuMSAxOS45IDE1LjIgMTkuOSAxNS4zVjE5LjNMMTQuOSAyMkwxMCAxOS40VjE1LjJMNy4yMDAwMSAxMy43Wk0xNC45IDIwLjRMMTguNCAxOC41VjE1LjlMMTQuOSAxNy44TDExLjQgMTUuOVYxOC41TDE0LjkgMjAuNFoiIGZpbGw9IiMzNzQwNEYiLz4KPC9zdmc+Cg==', 1);
INSERT INTO mixed_icons VALUES (9, 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTYuOTk5OTkgMTdIMi43OTk5OVY3SDUuMzk5OTlINy43OTk5OVYySDE0LjhWOEgxNS44VjIuNUMxNS44IDEuNyAxNS4xIDEgMTQuMyAxSDcuNDk5OTlMMS43OTk5OSA2LjdWMTYuNUMxLjc5OTk5IDE3LjMgMi40OTk5OSAxOCAzLjI5OTk5IDE4SDYuOTk5OTlWMTdaIiBmaWxsPSIjMzc0MDRGIi8+CjxwYXRoIGQ9Ik0yMS4zIDEyLjdIMTguOFYxMS43QzE4LjggMTAuNCAxNy44IDkuNDAwMDIgMTYuNSA5LjQwMDAySDE0LjVDMTMuMiA5LjQwMDAyIDEyLjIgMTAuNCAxMi4yIDExLjdWMTIuN0g5Ljg5OTk5QzguOTk5OTkgMTIuNyA4LjI5OTk5IDEzLjQgOC4yOTk5OSAxNC4zVjE1LjJWMTYuNlYyMC44QzguMjk5OTkgMjEuNyA4Ljk5OTk5IDIyLjQgOS44OTk5OSAyMi40SDIxLjNDMjIuMiAyMi40IDIyLjkgMjEuNyAyMi45IDIwLjhWMTYuNlYxNS4yVjE0LjNDMjIuOSAxMy40IDIyLjIgMTIuNyAyMS4zIDEyLjdaTTEzLjYgMTEuNkMxMy42IDExLjEgMTQgMTAuNiAxNC42IDEwLjZIMTYuNkMxNy4xIDEwLjYgMTcuNiAxMSAxNy42IDExLjZWMTIuNkgxMy42VjExLjZWMTEuNloiIGZpbGw9IiMzNzQwNEYiLz4KPC9zdmc+Cg==', 1);
INSERT INTO mixed_icons VALUES (10, 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTE4LjEgMjIuMjk5OUg1Ljg5OTk4QzUuMTk5OTggMjIuMjk5OSA0LjU5OTk4IDIxLjcgNC41OTk5OCAyMVYzLjk5OTk1QzQuNTk5OTggMy4yOTk5NSA1LjE5OTk4IDIuNjk5OTUgNS44OTk5OCAyLjY5OTk1SDE4LjFDMTguOCAyLjY5OTk1IDE5LjQgMy4yOTk5NSAxOS40IDMuOTk5OTVWMjFDMTkuNCAyMS43IDE4LjggMjIuMjk5OSAxOC4xIDIyLjI5OTlaTTUuODk5OTggMy4zOTk5NUM1LjU5OTk4IDMuMzk5OTUgNS4yOTk5OCAzLjY5OTk1IDUuMjk5OTggMy45OTk5NVYyMUM1LjI5OTk4IDIxLjI5OTkgNS41OTk5OCAyMS42IDUuODk5OTggMjEuNkgxOC4xQzE4LjQgMjEuNiAxOC43IDIxLjI5OTkgMTguNyAyMVYzLjk5OTk1QzE4LjcgMy42OTk5NSAxOC40IDMuMzk5OTUgMTguMSAzLjM5OTk1SDUuODk5OThaIiBmaWxsPSIjMzc0MDRGIi8+CjxwYXRoIGQ9Ik0xNi4yIDE3LjZINy44QzcuNiAxNy42IDcuNSAxNy40MDAxIDcuNSAxNy4yMDAxQzcuNSAxNy4wMDAxIDcuNyAxNi44IDcuOCAxNi44SDE2LjNDMTYuNSAxNi44IDE2LjYgMTcuMDAwMSAxNi42IDE3LjIwMDFDMTYuNiAxNy40MDAxIDE2LjQgMTcuNiAxNi4yIDE3LjZaIiBmaWxsPSIjMzc0MDRGIi8+CjxwYXRoIGQ9Ik0xNS4zIDE5LjVIOC43MDAwMkM4LjUwMDAyIDE5LjUgOC40MDAwMiAxOS4zIDguNDAwMDIgMTkuMUM4LjQwMDAyIDE4LjkgOC42MDAwMiAxOC43IDguNzAwMDIgMTguN0gxNS4zQzE1LjUgMTguNyAxNS42IDE4LjkgMTUuNiAxOS4xQzE1LjYgMTkuMyAxNS41IDE5LjUgMTUuMyAxOS41WiIgZmlsbD0iIzM3NDA0RiIvPgo8cGF0aCBkPSJNMTQgMTMuNkMxMy43IDEzLjcgMTMuMyAxMy43IDEyLjkgMTMuN0MxMi4zIDEzLjcgMTEuOCAxMy42IDExLjQgMTMuM0MxMSAxMyAxMC42IDEyLjUgMTAuNSAxMS44SDE0LjJWMTAuOUgxMC40QzEwLjQgMTAuOCAxMC40IDEwLjYgMTAuNCAxMC41VjEwLjJWOS45OTk5OEgxNC4zVjkuMTk5OThIMTAuNkMxMC43IDguNzk5OTggMTAuOCA4LjQ5OTk4IDEwLjkgOC4xOTk5OEMxMC44IDcuOTk5OTggMTEgNy42OTk5OCAxMS4zIDcuNTk5OThDMTEuNSA3LjM5OTk4IDExLjggNy4yOTk5OCAxMi4xIDcuMTk5OThDMTIuMyA3LjA5OTk4IDEyLjYgNi45OTk5OCAxMi45IDYuOTk5OThDMTMuMyA2Ljk5OTk4IDEzLjYgNi45OTk5OCAxMy45IDcuMDk5OThDMTQuMiA3LjE5OTk4IDE0LjUgNy4yOTk5OCAxNC44IDcuNDk5OThMMTUuMiA2LjE5OTk4QzE0LjkgNi4wOTk5OCAxNC42IDUuODk5OTggMTQuMiA1Ljc5OTk4QzEzLjggNS42OTk5OCAxMy4zIDUuNTk5OTggMTIuNyA1LjU5OTk4QzExLjUgNS41OTk5OCAxMC41IDUuODk5OTggOS44MDAwMiA2LjQ5OTk4QzkuMTAwMDIgNy4xOTk5OCA4LjYwMDAyIDguMDk5OTggOC40MDAwMiA5LjE5OTk4SDcuNDAwMDJWMTAuMUg4LjMwMDAyVjEwLjNWMTAuNkM4LjMwMDAyIDEwLjcgOC4zMDAwMiAxMC44IDguMzAwMDIgMTAuOUg3LjQwMDAyVjExLjhIOC41MDAwMkM4LjYwMDAyIDEyLjMgOC44MDAwMiAxMi44IDkuMTAwMDIgMTMuMkM5LjQwMDAyIDEzLjYgOS43MDAwMiAxNCAxMCAxNC4yQzEwLjQgMTQuNSAxMC44IDE0LjcgMTEuMiAxNC44QzExLjcgMTQuOSAxMi4yIDE1IDEyLjcgMTVDMTMuMyAxNSAxMy44IDE1IDE0LjIgMTQuOUMxNC42IDE0LjggMTQuOSAxNC43IDE1LjIgMTQuNUwxNC44IDEzLjJDMTQuNiAxMy40IDE0LjMgMTMuNSAxNCAxMy42WiIgZmlsbD0iIzM3NDA0RiIvPgo8L3N2Zz4K', 1);
INSERT INTO mixed_icons VALUES (11, 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTE4LjEgMjIuMjk5OUg1Ljg5OTk4QzUuMTk5OTggMjIuMjk5OSA0LjU5OTk4IDIxLjcgNC41OTk5OCAyMVYzLjk5OTk1QzQuNTk5OTggMy4yOTk5NSA1LjE5OTk4IDIuNjk5OTUgNS44OTk5OCAyLjY5OTk1SDE4LjFDMTguOCAyLjY5OTk1IDE5LjQgMy4yOTk5NSAxOS40IDMuOTk5OTVWMjFDMTkuNCAyMS43IDE4LjggMjIuMjk5OSAxOC4xIDIyLjI5OTlaTTUuODk5OTggMy4zOTk5NUM1LjU5OTk4IDMuMzk5OTUgNS4yOTk5OCAzLjY5OTk1IDUuMjk5OTggMy45OTk5NVYyMUM1LjI5OTk4IDIxLjI5OTkgNS41OTk5OCAyMS42IDUuODk5OTggMjEuNkgxOC4xQzE4LjQgMjEuNiAxOC43IDIxLjI5OTkgMTguNyAyMVYzLjk5OTk1QzE4LjcgMy42OTk5NSAxOC40IDMuMzk5OTUgMTguMSAzLjM5OTk1SDUuODk5OThaIiBmaWxsPSIjMzc0MDRGIi8+CjxwYXRoIGQ9Ik0xNi4yIDE3LjZINy44QzcuNiAxNy42IDcuNSAxNy40MDAxIDcuNSAxNy4yMDAxQzcuNSAxNy4wMDAxIDcuNyAxNi44IDcuOCAxNi44SDE2LjNDMTYuNSAxNi44IDE2LjYgMTcuMDAwMSAxNi42IDE3LjIwMDFDMTYuNiAxNy40MDAxIDE2LjQgMTcuNiAxNi4yIDE3LjZaIiBmaWxsPSIjMzc0MDRGIi8+CjxwYXRoIGQ9Ik0xNS4zIDE5LjVIOC43MDAwMkM4LjUwMDAyIDE5LjUgOC40MDAwMiAxOS4zIDguNDAwMDIgMTkuMUM4LjQwMDAyIDE4LjkgOC42MDAwMiAxOC43IDguNzAwMDIgMTguN0gxNS4zQzE1LjUgMTguNyAxNS42IDE4LjkgMTUuNiAxOS4xQzE1LjYgMTkuMyAxNS41IDE5LjUgMTUuMyAxOS41WiIgZmlsbD0iIzM3NDA0RiIvPgo8cGF0aCBkPSJNMTQgMTMuNkMxMy43IDEzLjcgMTMuMyAxMy43IDEyLjkgMTMuN0MxMi4zIDEzLjcgMTEuOCAxMy42IDExLjQgMTMuM0MxMSAxMyAxMC42IDEyLjUgMTAuNSAxMS44SDE0LjJWMTAuOUgxMC40QzEwLjQgMTAuOCAxMC40IDEwLjYgMTAuNCAxMC41VjEwLjJWOS45OTk5OEgxNC4zVjkuMTk5OThIMTAuNkMxMC43IDguNzk5OTggMTAuOCA4LjQ5OTk4IDEwLjkgOC4xOTk5OEMxMC44IDcuOTk5OTggMTEgNy42OTk5OCAxMS4zIDcuNTk5OThDMTEuNSA3LjM5OTk4IDExLjggNy4yOTk5OCAxMi4xIDcuMTk5OThDMTIuMyA3LjA5OTk4IDEyLjYgNi45OTk5OCAxMi45IDYuOTk5OThDMTMuMyA2Ljk5OTk4IDEzLjYgNi45OTk5OCAxMy45IDcuMDk5OThDMTQuMiA3LjE5OTk4IDE0LjUgNy4yOTk5OCAxNC44IDcuNDk5OThMMTUuMiA2LjE5OTk4QzE0LjkgNi4wOTk5OCAxNC42IDUuODk5OTggMTQuMiA1Ljc5OTk4QzEzLjggNS42OTk5OCAxMy4zIDUuNTk5OTggMTIuNyA1LjU5OTk4QzExLjUgNS41OTk5OCAxMC41IDUuODk5OTggOS44MDAwMiA2LjQ5OTk4QzkuMTAwMDIgNy4xOTk5OCA4LjYwMDAyIDguMDk5OTggOC40MDAwMiA5LjE5OTk4SDcuNDAwMDJWMTAuMUg4LjMwMDAyVjEwLjNWMTAuNkM4LjMwMDAyIDEwLjcgOC4zMDAwMiAxMC44IDguMzAwMDIgMTAuOUg3LjQwMDAyVjExLjhIOC41MDAwMkM4LjYwMDAyIDEyLjMgOC44MDAwMiAxMi44IDkuMTAwMDIgMTMuMkM5LjQwMDAyIDEzLjYgOS43MDAwMiAxNCAxMCAxNC4yQzEwLjQgMTQuNSAxMC44IDE0LjcgMTEuMiAxNC44QzExLjcgMTQuOSAxMi4yIDE1IDEyLjcgMTVDMTMuMyAxNSAxMy44IDE1IDE0LjIgMTQuOUMxNC42IDE0LjggMTQuOSAxNC43IDE1LjIgMTQuNUwxNC44IDEzLjJDMTQuNiAxMy40IDE0LjMgMTMuNSAxNCAxMy42WiIgZmlsbD0iIzM3NDA0RiIvPgo8L3N2Zz4K', 2);


--
-- Data for Name: picture_hotspot; Type: TABLE DATA; Schema: micadoapp; Owner: -
--



--
-- Data for Name: picture_hotspot_translation; Type: TABLE DATA; Schema: micadoapp; Owner: -
--



--
-- Data for Name: picture_hotspot_translation_prod; Type: TABLE DATA; Schema: micadoapp; Owner: -
--



--
-- Data for Name: process; Type: TABLE DATA; Schema: micadoapp; Owner: -
--



--
-- Data for Name: process_comments; Type: TABLE DATA; Schema: micadoapp; Owner: -
--



--
-- Data for Name: process_produced_documents; Type: TABLE DATA; Schema: micadoapp; Owner: -
--



--
-- Data for Name: process_topic; Type: TABLE DATA; Schema: micadoapp; Owner: -
--



--
-- Data for Name: process_translation; Type: TABLE DATA; Schema: micadoapp; Owner: -
--



--
-- Data for Name: process_translation_prod; Type: TABLE DATA; Schema: micadoapp; Owner: -
--



--
-- Data for Name: process_users; Type: TABLE DATA; Schema: micadoapp; Owner: -
--



--
-- Data for Name: rasa; Type: TABLE DATA; Schema: micadoapp; Owner: -
--



--
-- Data for Name: ratings; Type: TABLE DATA; Schema: micadoapp; Owner: -
--



--
-- Data for Name: settings; Type: TABLE DATA; Schema: micadoapp; Owner: -
--

INSERT INTO settings VALUES ('pa_tenant', '1');
INSERT INTO settings VALUES ('api_token', 'eyJ4NXQiOiJaalJtWVRNd05USmpPV1U1TW1Jek1qZ3pOREkzWTJJeU1tSXlZMkV6TWpkaFpqVmlNamMwWmc9PSIsImtpZCI6ImdhdGV3YXlfY2VydGlmaWNhdGVfYWxpYXMiLCJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsImFwcGxpY2F0aW9uIjp7Im93bmVyIjoiYWRtaW4iLCJ0aWVyIjoiVW5saW1pdGVkIiwibmFtZSI6IkRlZmF1bHRBcHBsaWNhdGlvbiIsImlkIjoxLCJ1dWlkIjoiYWMwYWQxNmQtMWRiNy00NzhiLWFhNjAtZjE3YjIwM2JhMWRiIn0sInRpZXJJbmZvIjp7IlNpbHZlciI6eyJzdG9wT25RdW90YVJlYWNoIjp0cnVlLCJzcGlrZUFycmVzdExpbWl0IjowLCJzcGlrZUFycmVzdFVuaXQiOm51bGx9fSwia2V5dHlwZSI6IlBST0RVQ1RJT04iLCJzdWJzY3JpYmVkQVBJcyI6W3sic3Vic2NyaWJlclRlbmFudERvbWFpbiI6ImNhcmJvbi5zdXBlciIsIm5hbWUiOiJiYWNrZW5kIiwiY29udGV4dCI6IlwvYmFja2VuZFwvMS4wLjAiLCJwdWJsaXNoZXIiOiJhZG1pbiIsInZlcnNpb24iOiIxLjAuMCIsInN1YnNjcmlwdGlvblRpZXIiOiJTaWx2ZXIifV0sImlhdCI6MTYwMTI3NDc4NiwianRpIjoiODMwNmI2MTAtZDNiZi00MTU1LTk1ZTgtNGFlMDc1NWZhZmE1In0=.OrP14B2bqfsLKjrtCAjfqkuUXLpQCd8qooU3suDOEPsCGW1k4H7OPBFB2gTzkubbhBD6XaS164qSuNlMxzE7nyfse0vglJJBLPszVTo4v0swx7dI2Eu3eoK9_AnQca_VELdMJOSlLda-xIKQR20cFNfc6U3qm5En_m6t63OA9MXUDk2--kmApyHdJI56KVZh-vEmFkE7ms2chYUJuYvWlaxeAF8YDjyHMZbt-FtrDu8CueMrMFPL3ENvXQMMrSVt8cX6PMfOl2S0HSmsNs-mMlUGar4K4vZCgtWkVFkfl5vQsaHP0wuFQEUx4Us0NeHbFrSj2X2ERUbcUQ6vNWpc6g==');
INSERT INTO settings VALUES ('migrant_tenant', '-1234
');
INSERT INTO settings VALUES ('translationState', '[{"value":0,"translation":[{"lang":"en", "state":"Editing"}, {"lang":"it", "state":"Modifica"}, {"lang":"es", "state":"Edición"}, {"lang":"de", "state":"Bearbeitung"}, {"lang":"nl", "state":"Bewerken"}]},{"value":1,"translation":[{"lang":"en", "state":"Translatable"}, {"lang":"it", "state":"Traducibile"}, {"lang":"es", "state":"Traducible"}, {"lang":"de", "state":"Übersetzbar"}, {"lang":"nl", "state":"Vertaalbaar"}]},{"value":2,"translation":[{"lang":"en", "state":"Translating"}, {"lang":"it", "state":"In traduzione"}, {"lang":"es", "state":"Traductorio"}, {"lang":"de", "state":"Übersetzen"}, {"lang":"nl", "state":"Vertalen"}]},{"value":3,"translation":[{"lang":"en", "state":"Translated"}, {"lang":"it", "state":"Tradotto"}, {"lang":"es", "state":"Traducido"}, {"lang":"de", "state":"Übersetzt"}, {"lang":"nl", "state":"Vertaald"}]}]');
INSERT INTO settings VALUES ('default_language', 'en');
INSERT INTO settings VALUES ('duration_of_new', '1');
INSERT INTO settings VALUES ('internal_survey', 'false');
INSERT INTO settings VALUES ('migrant_domain_name', 'carbon.super');


--
-- Data for Name: step; Type: TABLE DATA; Schema: micadoapp; Owner: -
--



--
-- Data for Name: step_document; Type: TABLE DATA; Schema: micadoapp; Owner: -
--



--
-- Data for Name: step_link; Type: TABLE DATA; Schema: micadoapp; Owner: -
--



--
-- Data for Name: step_link_translation; Type: TABLE DATA; Schema: micadoapp; Owner: -
--



--
-- Data for Name: step_link_translation_prod; Type: TABLE DATA; Schema: micadoapp; Owner: -
--



--
-- Data for Name: step_translation; Type: TABLE DATA; Schema: micadoapp; Owner: -
--



--
-- Data for Name: step_translation_prod; Type: TABLE DATA; Schema: micadoapp; Owner: -
--



--
-- Data for Name: survey; Type: TABLE DATA; Schema: micadoapp; Owner: -
--



--
-- Data for Name: survey_answers; Type: TABLE DATA; Schema: micadoapp; Owner: -
--



--
-- Data for Name: t_settings; Type: TABLE DATA; Schema: micadoapp; Owner: -
--



--
-- Data for Name: t_settings_translation; Type: TABLE DATA; Schema: micadoapp; Owner: -
--



--
-- Data for Name: t_settings_translation_prod; Type: TABLE DATA; Schema: micadoapp; Owner: -
--



--
-- Data for Name: tenant; Type: TABLE DATA; Schema: micadoapp; Owner: -
--



--
-- Data for Name: topic; Type: TABLE DATA; Schema: micadoapp; Owner: -
--

INSERT INTO topic VALUES (57, '', false, NULL);
INSERT INTO topic VALUES (13, 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xMiAyMkMxNy41MjI4IDIyIDIyIDE3LjUyMjggMjIgMTJDMjIgNi40NzcxNSAxNy41MjI4IDIgMTIgMkM2LjQ3NzE1IDIgMiA2LjQ3NzE1IDIgMTJDMiAxNy41MjI4IDYuNDc3MTUgMjIgMTIgMjJaTTE0LjA1MjQgMTYuMTE1OEMxMy42NjAyIDE2LjIxNTEgMTMuMTkyMSAxNi4yNjQ4IDEyLjY0ODIgMTYuMjY0OEMxMS45MjcxIDE2LjI2NDggMTEuMjc1NiAxNi4wODQ3IDEwLjY5MzcgMTUuNzI0N0MxMC4xMjQ1IDE1LjM1MjIgOS43MzIzMSAxNC43MzE0IDkuNTE3MjUgMTMuODYyM0gxNC4xODUyVjEyLjcyNjNIOS4yODk1NUM5LjI3NjkgMTIuNTQwMSA5LjI3MDU3IDEyLjM5MTEgOS4yNzA1NyAxMi4yNzkzVjExLjkyNTVWMTEuNzAySDE0LjE4NTJWMTAuNTY2SDkuNDIyMzhDOS40OTgyOCAxMC4wNjkzIDkuNjM3NDMgOS42NDcyMSA5LjgzOTgzIDkuMjk5NTdDMTAuMDU0OSA4LjkzOTUyIDEwLjMwNzkgOC42NDc3NSAxMC41OTg4IDguNDI0MjdDMTAuOTAyNSA4LjE4ODM3IDExLjIzMTQgOC4wMTQ1NSAxMS41ODU2IDcuOTAyODFDMTEuOTUyNCA3Ljc5MTA3IDEyLjMzMTkgNy43MzUyIDEyLjcyNDEgNy43MzUyQzEzLjE5MjEgNy43MzUyIDEzLjYxNTkgNy43OTEwNyAxMy45OTU0IDcuOTAyODFDMTQuMzg3NiA4LjAxNDU1IDE0Ljc3MzQgOC4xNjM1NCAxNS4xNTI5IDguMzQ5NzhMMTUuNjg0MiA2LjYzNjQyQzE1LjMxNzQgNi40NTAxOCAxNC44ODczIDYuMjg4NzggMTQuMzkzOSA2LjE1MjIxQzEzLjkxMzIgNi4wMTU2MyAxMy4yNjggNS45NDczNSAxMi40NTg0IDUuOTQ3MzVDMTAuOTQwNCA1Ljk0NzM1IDkuNzEzMzMgNi4zNTA4NiA4Ljc3NzIxIDcuMTU3ODdDNy44NDExIDcuOTY0ODkgNy4yNDY1NCA5LjEwMDkyIDYuOTkzNTMgMTAuNTY2SDUuNjg0MjNWMTEuNzAySDYuODQxNzNWMTEuOTgxNFYxMi4zMTY2QzYuODQxNzMgMTIuNDE1OSA2Ljg0ODA1IDEyLjU1MjUgNi44NjA3MSAxMi43MjYzSDUuNjg0MjNWMTMuODYyM0g3LjAzMTQ4QzcuMTgzMjkgMTQuNTU3NiA3LjQxNzMyIDE1LjE2NiA3LjczMzU3IDE1LjY4NzRDOC4wNjI0OCAxNi4yMDg5IDguNDYwOTYgMTYuNjQzNCA4LjkyOTAyIDE2Ljk5MTFDOS4zOTcwOCAxNy4zMzg3IDkuOTIyMDYgMTcuNjA1NiAxMC41MDQgMTcuNzkxOUMxMS4wOTg1IDE3Ljk2NTcgMTEuNzMxIDE4LjA1MjYgMTIuNDAxNSAxOC4wNTI2QzEzLjE4NTggMTguMDUyNiAxMy44MzEgMTcuOTkwNSAxNC4zMzcgMTcuODY2NEMxNC44NTU2IDE3Ljc0MjIgMTUuMjkyMSAxNy41OTMyIDE1LjY0NjMgMTcuNDE5NEwxNS4xNTI5IDE1LjcwNjFDMTQuODI0IDE1Ljg3OTkgMTQuNDU3MiAxNi4wMTY0IDE0LjA1MjQgMTYuMTE1OFoiIGZpbGw9IiM1QzgxQTIiLz4KPC9zdmc+Cg==', true, 7);
INSERT INTO topic VALUES (1, 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTE3LjA0ODggMTFWM0g3VjdIM1YyMUgxMVYxN0gxM1YyMUgyMVYxMUgxNy4wNDg4Wk03IDE5LjA0ODhINVYxNy4wNDg4SDdWMTkuMDQ4OFpNNyAxNS4wNDg4SDVWMTMuMDQ4OEg3VjE1LjA0ODhaTTcgMTFINVY5SDdWMTFaTTExIDE1LjA0ODhIOVYxMy4wNDg4SDExVjE1LjA0ODhaTTExIDExSDlWOUgxMVYxMVpNMTEgN0g5VjVIMTFWN1pNMTUuMDQ4OCAxNS4wNDg4SDEzLjA0ODhWMTMuMDQ4OEgxNS4wNDg4VjE1LjA0ODhaTTE1LjA0ODggMTFIMTMuMDQ4OFY5SDE1LjA0ODhWMTFaTTE1LjA0ODggN0gxMy4wNDg4VjVIMTUuMDQ4OFY3Wk0xOS4wNDg4IDE5LjA0ODhIMTcuMDQ4OFYxNy4wNDg4SDE5LjA0ODhWMTkuMDQ4OFpNMTkuMDQ4OCAxNS4wNDg4SDE3LjA0ODhWMTMuMDQ4OEgxOS4wNDg4VjE1LjA0ODhaIiBmaWxsPSIjNUM4MUEyIi8+Cjwvc3ZnPgo=', true, 13);
INSERT INTO topic VALUES (58, '', true, NULL);
INSERT INTO topic VALUES (2, 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyLjU2NDIgMTQuOTI4NkgxMS4yNzQ2QzEwLjYyOTkgMTQuOTI4NiAxMC4xNDYzIDE0LjQ0NSAxMC4wOTI1IDEzLjg1MzlMMyAxMi43NzkzVjE4LjM2NzRDMyAxOS40OTU3IDMuOTEzNDMgMjAuMzU1NCA0Ljk4ODA2IDIwLjM1NTRIMTguOTU4MkMyMC4wODY2IDIwLjM1NTQgMjAuOTQ2MyAxOS40NDIgMjAuOTQ2MyAxOC4zNjc0VjEyLjc3OTNMMTMuNzQ2MyAxMy44NTM5QzEzLjY5MjUgMTQuNDk4NyAxMy4yMDkgMTQuOTI4NiAxMi41NjQyIDE0LjkyODZaIiBmaWxsPSIjNUM4MUEyIi8+CjxwYXRoIGQ9Ik0xOC45NTgyIDcuMDgzNThIMTUuOTQ5M1Y1Ljc5NDAzQzE1Ljk0OTMgNC4yMzU4MiAxNC43MTM0IDMgMTMuMTU1MiAzSDEwLjczNzNDOS4xNzkxMSAzIDcuOTQzMjggNC4yMzU4MiA3Ljk0MzI4IDUuNzk0MDNWNy4wODM1OEg0Ljk4ODA2QzMuODU5NyA3LjA4MzU4IDMgNy45OTcwMiAzIDkuMDcxNjRWMTEuOTczMUwxMC4zMDc1IDEzLjA0NzhDMTAuNTIyNCAxMi43MjU0IDEwLjg5ODUgMTIuNTEwNCAxMS4zMjg0IDEyLjUxMDRIMTIuNjE3OUMxMy4wNDc4IDEyLjUxMDQgMTMuNDIzOSAxMi43MjU0IDEzLjYzODggMTMuMTAxNUwyMSAxMS45NzMxVjkuMDcxNjRDMjAuOTQ2MyA3Ljk5NzAyIDIwLjAzMjggNy4wODM1OCAxOC45NTgyIDcuMDgzNThaTTkuNTAxNDkgNS43OTQwM0M5LjUwMTQ5IDUuMTQ5MjUgMTAuMDM4OCA0LjYxMTk0IDEwLjY4MzYgNC42MTE5NEgxMy4xMDE1QzEzLjc0NjMgNC42MTE5NCAxNC4yODM2IDUuMTQ5MjUgMTQuMjgzNiA1Ljc5NDAzVjcuMDgzNThIOS40NDc3NlY1Ljc5NDAzSDkuNTAxNDlaIiBmaWxsPSIjNUM4MUEyIi8+Cjwvc3ZnPgo=', true, NULL);
INSERT INTO topic VALUES (3, 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDIwLjczNjFDMTEuODA4IDIwLjczNjEgMTEuNjY0IDIwLjY4ODEgMTEuNTIgMjAuNTkyMUM3LjgyNDA1IDE4LjA0ODEgNS4xODQwNSAxNS40NTYxIDMuNjk2MDUgMTIuOTEyMUg2LjcyMDA1QzcuMDU2MDUgMTIuOTEyMSA3LjM0NDA1IDEyLjcyMDEgNy40NDAwNSAxMi40MzIxTDguMzA0MDUgMTAuMTc2MUw5Ljc0NDA1IDE1Ljg4ODFDOS44NDAwNSAxNi4yMjQxIDEwLjA4IDE2LjQ2NDEgMTAuNDE2IDE2LjQ2NDFDMTAuNDY0IDE2LjQ2NDEgMTAuNDY0IDE2LjQ2NDEgMTAuNTEyIDE2LjQ2NDFDMTAuOCAxNi40NjQxIDExLjA4OCAxNi4zMjAxIDExLjIzMiAxNi4wMzIxTDEyLjgxNiAxMi45MTIxSDE1Ljg4OEMxNi4wOCAxMi45MTIxIDE2LjMyIDEyLjgxNjEgMTYuNDY0IDEyLjY3MjFDMTYuNjA4IDEyLjUyODEgMTYuNzA0IDEyLjMzNjEgMTYuNzA0IDEyLjA5NjFDMTYuNzA0IDExLjY2NDEgMTYuMzIgMTEuMzI4MSAxNS44ODggMTEuMzI4MUgxMi4zMzZDMTIuMDQ4IDExLjMyODEgMTEuNzYgMTEuNDcyMSAxMS42MTYgMTEuNzYwMUwxMC43NTIgMTMuNDQwMUw5LjI2NDA1IDcuMzkyMDdDOS4xNjgwNSA3LjEwNDA2IDguOTI4MDUgNi44NjQwNyA4LjY0MDA1IDYuNzY4MDdDOC41OTIwNSA2Ljc2ODA3IDguNTQ0MDUgNi43NjgwNyA4LjQ5NjA1IDYuNzY4MDdDOC4xNjAwNSA2Ljc2ODA3IDcuODcyMDUgNi45NjAwNyA3Ljc3NjA1IDcuMjQ4MDdMNi4xOTIwNSAxMS4zMjgxSDIuOTI4MDVDMi4wNjQwNSA5LjEyMDA3IDIuMTYwMDUgNy4wNTYwNyAzLjIxNjA1IDUuNDcyMDZDNC4xNzYwNSA0LjAzMjA2IDUuODA4MDUgMy4yMTYwNiA3LjYzMjA1IDMuMjE2MDZDOS4xNjgwNSAzLjIxNjA2IDEwLjY1NiAzLjg0MDA2IDExLjg1NiA0Ljk0NDA2TDEyLjA0OCA1LjA4ODA3TDEyLjI0IDQuOTQ0MDZDMTMuMzkyIDMuODQwMDYgMTQuODggMy4yNjQwNiAxNi40MTYgMy4yNjQwNkMxOC43NjggMy4yNjQwNiAyMC43ODQgNC43MDQwNiAyMS40MDggNi44MTYwN0MyMi42NTYgMTAuODAwMSAxOS4yOTYgMTUuOTM2MSAxMi40OCAyMC41OTIxQzEyLjMzNiAyMC42ODgxIDEyLjE5MiAyMC43MzYxIDEyIDIwLjczNjFaIiBmaWxsPSIjNUM4MUEyIi8+Cjwvc3ZnPgo=', true, 25);
INSERT INTO topic VALUES (7, 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTIxLjg3MjYgMTAuNDQ1OUMyMS4zMjQxIDEwLjUzNzMgMjAuNjg0MiAxMC41MzczIDIwLjEzNTcgMTAuNTM3M0MxOC45NDc0IDEwLjUzNzMgMTcuNjY3NiAxMC40NDU5IDE2LjM4NzggMTAuMjYzMUMxNS42NTY1IDEzLjQ2MjUgMTMuNzM2OSAxNi4wMjIxIDExLjA4NTkgMTYuOTM2MkMxMC43MjAyIDE3LjAyNzYgMTAuMzU0NiAxNy4xMTkgOS45ODg5MiAxNy4yMTA0QzkuODA2MSAxNy4yMTA0IDkuNzE0NjkgMTcuMjEwNCA5LjUzMTg2IDE3LjIxMDRDMTAuMjYzMiAxOS41ODcyIDExLjkwODYgMjEuNDE1NCAxNC4wMTExIDIxLjc4MTFDMTQuMjg1MyAyMS43ODExIDE0LjU1OTYgMjEuODcyNSAxNC44MzM4IDIxLjg3MjVDMTguMDMzMyAyMS44NzI1IDIxLjA0OTkgMTguNTgxNiAyMS43ODEyIDE0LjI4NTJDMjIuMDU1NCAxMy4wMDU0IDIyLjA1NTQgMTEuNjM0MyAyMS44NzI2IDEwLjQ0NTlaTTE3LjQ4NDggMjAuMjI3MUMxNy40ODQ4IDIwLjIyNzEgMTYuNzUzNSAxOS4wMzg3IDE1LjEwOCAxOC43NjQ1QzEzLjczNjkgMTguNDkwMiAxMy4yNzk4IDE4Ljc2NDUgMTIuMjc0MiAxOS4xMzAxQzEyLjI3NDIgMTkuMTMwMSAxMi4xODI4IDE2LjkzNjIgMTQuNjUxIDE2Ljg0NDhDMTYuOTM2MyAxNi44NDQ4IDE4LjMwNzUgMTguOTQ3MyAxNy40ODQ4IDIwLjIyNzFaTTE4LjEyNDcgMTUuNzQ3OEMxNy4zMDIgMTUuNzQ3OCAxNi42NjIxIDE1LjEwNzkgMTYuNjYyMSAxNC4yODUyQzE2LjY2MjEgMTMuNDYyNSAxNy4zMDIgMTIuODIyNiAxOC4xMjQ3IDEyLjgyMjZDMTguOTQ3NCAxMi44MjI2IDE5LjU4NzMgMTMuNDYyNSAxOS41ODczIDE0LjI4NTJDMTkuNTg3MyAxNS4xMDc5IDE4Ljk0NzQgMTUuNzQ3OCAxOC4xMjQ3IDE1Ljc0NzhaIiBmaWxsPSIjNUM4MUEyIi8+CjxwYXRoIGQ9Ik0xNC43NDI0IDUuNzgzODNDMTQuNTU5NiA0LjUwNDA1IDE0LjEwMjUgMy4yMjQyNyAxMy42NDU0IDIuMTI3MzJDMTMuMDk3IDIuMzEwMTUgMTIuNTQ4NSAyLjU4NDM4IDEyIDIuNzY3MjFDMTAuNzIwMiAzLjIyNDI3IDkuNDQwNDUgMy40OTg1MSA3Ljk3Nzg0IDMuNjgxMzRDNS45NjY3NiA0LjA0Njk5IDMuOTU1NjggNC4xMzg0IDIuMjE4ODMgMy44NjQxNkMxLjk0NDU5IDUuMTQzOTQgMS45NDQ1OSA2LjQyMzcyIDIuMTI3NDIgNy43MDM1QzIuODU4NzIgMTIuNDU3IDYuMjQxIDE1LjgzOTIgOS43MTQ2OCAxNS4yOTA4QzkuOTg4OTIgMTUuMjkwOCAxMC4yNjMyIDE1LjE5OTQgMTAuNTM3NCAxNS4xMDc5QzEzLjU1NCAxNC4xMDI0IDE1LjM4MjMgMTAuMDgwMiAxNC43NDI0IDUuNzgzODNaTTQuNTk1NTcgNy43OTQ5MkM0LjMyMTMzIDcuMDYzNjEgNC43NzgzOSA2LjE0OTQ4IDUuNTA5NjkgNS45NjY2NkM2LjI0MSA1LjY5MjQyIDcuMTU1MTIgNi4xNDk0OCA3LjMzNzk1IDYuODgwNzlDNy42MTIxOSA3LjYxMjA5IDcuMTU1MTIgOC41MjYyMiA2LjQyMzgyIDguNzA5MDRDNS42OTI1MiA5LjA3NDcgNC44Njk4IDguNjE3NjMgNC41OTU1NyA3Ljc5NDkyWk0xMC4yNjMyIDEyLjkxNEM3Ljk3Nzg0IDEzLjczNjggNi4wNTgxNyAxMi4wOTEzIDYuNDIzODIgMTAuNjI4N0M2LjQyMzgyIDEwLjYyODcgNy43MDM2IDExLjI2ODYgOS4yNTc2MiAxMS4wODU4QzEwLjA4MDMgMTAuOTk0NCAxMC45MDMxIDEwLjcyMDEgMTEuODE3MiAxMC4wODAyQzExLjcyNTggMTAuMDgwMiAxMi41NDg1IDEyLjA5MTMgMTAuMjYzMiAxMi45MTRaTTExLjM2MDEgOC4zNDMzOUMxMC42Mjg4IDguNjE3NjMgOS43MTQ2OCA4LjE2MDU3IDkuNTMxODYgNy40MjkyNkM5LjI1NzYyIDYuNjk3OTYgOS43MTQ2OCA1Ljc4MzgzIDEwLjQ0NiA1LjYwMTAxQzExLjE3NzMgNS4zMjY3NyAxMi4wOTE0IDUuNzgzODMgMTIuMjc0MiA2LjUxNTE0QzEyLjU0ODUgNy4yNDY0NCAxMi4wOTE0IDguMDY5MTUgMTEuMzYwMSA4LjM0MzM5WiIgZmlsbD0iIzVDODFBMiIvPgo8L3N2Zz4K', true, 25);
INSERT INTO topic VALUES (4, 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xLjIwODU4IDkuMjk1NDRDMC45MzA1MjggOS4xNDM5IDAuOTMwNDU4IDguNzQ0NyAxLjIwODQ2IDguNTkzMDZMMTEuMzcyOSAzLjA0ODg0QzExLjQ5MjMgMi45ODM3MiAxMS42MzY2IDIuOTgzNzIgMTEuNzU1OSAzLjA0ODg0TDIyLjM1NTkgOC44MzA2NkMyMi40ODQ0IDguOTAwNzUgMjIuNTY0NCA5LjAzNTQ0IDIyLjU2NDQgOS4xODE4MlYxNi41NDQ0QzIyLjU2NDQgMTYuNzY1MyAyMi4zODUzIDE2Ljk0NDQgMjIuMTY0NCAxNi45NDQ0SDIwLjk2NDRDMjAuNzQzNSAxNi45NDQ0IDIwLjU2NDQgMTYuNzY1MyAyMC41NjQ0IDE2LjU0NDRWMTAuNzA3OUMyMC41NjQ0IDEwLjQwNDQgMjAuMjM5NSAxMC4yMTE0IDE5Ljk3MyAxMC4zNTY3TDE4Ljc3MyAxMS4wMTA3QzE4LjY0NDQgMTEuMDgwOCAxOC41NjQ0IDExLjIxNTUgMTguNTY0NCAxMS4zNjE5VjE2Ljg4N0MxOC41NjQ0IDE3LjAzMzMgMTguNDg0NSAxNy4xNjggMTguMzU2IDE3LjIzODFMMTEuNzU2IDIwLjgzOThDMTEuNjM2NiAyMC45MDUgMTEuNDkyMiAyMC45MDUgMTEuMzcyOCAyMC44Mzk4TDQuNzcyNzkgMTcuMjM4MUM0LjY0NDMyIDE3LjE2OCA0LjU2NDQgMTcuMDMzMyA0LjU2NDQgMTYuODg3VjExLjM2MTlDNC41NjQ0IDExLjIxNTUgNC40ODQzOSAxMS4wODA4IDQuMzU1ODIgMTEuMDEwN0wxLjIwODU4IDkuMjk1NDRaTTExLjM3MjcgMTguNTU5N0MxMS40OTIyIDE4LjYyNDkgMTEuNjM2NiAxOC42MjQ5IDExLjc1NjEgMTguNTU5N0wxNi4zNTYxIDE2LjA0ODFDMTYuNDg0NSAxNS45NzggMTYuNTY0NCAxNS44NDMzIDE2LjU2NDQgMTUuNjk3VjEyLjg4ODVDMTYuNTY0NCAxMi41ODQ4IDE2LjIzOTMgMTIuMzkxOSAxNS45NzI3IDEyLjUzNzRMMTEuNzU2MSAxNC44Mzk3QzExLjYzNjYgMTQuOTA0OSAxMS40OTIyIDE0LjkwNDkgMTEuMzcyNyAxNC44Mzk3TDcuMTU2MDkgMTIuNTM3NEM2Ljg4OTU0IDEyLjM5MTkgNi41NjQ0IDEyLjU4NDggNi41NjQ0IDEyLjg4ODVWMTUuNjk3QzYuNTY0NCAxNS44NDMzIDYuNjQ0MjkgMTUuOTc4IDYuNzcyNzEgMTYuMDQ4MUwxMS4zNzI3IDE4LjU1OTdaIiBmaWxsPSIjNUM4MUEyIi8+Cjwvc3ZnPgo=', true, 25);
INSERT INTO topic VALUES (25, 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTkuODAwMDUgMTYuM0M5LjYwMDA1IDEyLjYgMTIuNiA5LjQgMTYuMiA5LjJDMTcuMyA5LjIgMTguMyA5LjQgMTkuMiA5LjhWNC42QzE5LjIgMy4yIDE4IDIgMTYuNiAySDYuMzAwMDVDNC45MDAwNSAyIDMuODAwMDUgMy4yIDMuODAwMDUgNC42VjE5LjRDMy44MDAwNSAyMC44IDUuMDAwMDUgMjIgNi40MDAwNSAyMkgxMy41QzExLjQgMjAuOSA5LjkwMDA1IDE4LjggOS44MDAwNSAxNi4zWiIgZmlsbD0iIzVDODFBMiIvPgo8cGF0aCBkPSJNNi41IDUuOTAwMDJIMTYuOCIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+CjxwYXRoIGQ9Ik02LjUgMTBIMTYuOCIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+CjxwYXRoIGQ9Ik02LjUgMTRIMTYuOCIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+CjxwYXRoIGQ9Ik0yMC45OTk5IDExLjdDMjAuODk5OSAxMS43IDIwLjg5OTkgMTEuNyAyMC44OTk5IDExLjhMMTYuNjk5OSAxNkwxNi41OTk5IDE2LjFDMTYuNDk5OSAxNi4xIDE2LjQ5OTkgMTYuMSAxNi40OTk5IDE2TDE1LjE5OTkgMTQuN0wxNS4wOTk5IDE0LjZDMTUuMDk5OSAxNC42IDE0Ljk5OTkgMTQuNiAxNC45OTk5IDE0LjdMMTMuOTk5OSAxNS41QzEzLjg5OTkgMTUuNiAxMy44OTk5IDE1LjcgMTMuOTk5OSAxNS44TDE1LjM5OTkgMTcuMkwxNi4yOTk5IDE4LjFMMTYuMzk5OSAxOC4yQzE2LjQ5OTkgMTguMiAxNi40OTk5IDE4LjIgMTYuNDk5OSAxOC4xTDIwLjA5OTkgMTQuNUwyMC43OTk5IDEzLjhMMjEuNzk5OSAxMi44QzIxLjg5OTkgMTIuNyAyMS44OTk5IDEyLjYgMjEuNzk5OSAxMi41TDIwLjk5OTkgMTEuN0MyMC45OTk5IDExLjcgMjEuMDk5OSAxMS43IDIwLjk5OTkgMTEuN1oiIGZpbGw9IiM1QzgxQTIiLz4KPHBhdGggZD0iTTIxLjIgMTUuNEwyMC42IDE2QzIwLjYgMTguMiAxOC44IDIwIDE2LjYgMjBDMTQuNCAyMCAxMi42IDE4LjIgMTIuNiAxNkMxMi42IDEzLjggMTQuNCAxMiAxNi42IDEyQzE3LjMgMTIgMTcuOSAxMi4yIDE4LjQgMTIuNEwxOS4xIDExLjdDMTguNCAxMS4zIDE3LjUgMTEgMTYuNiAxMUMxNS4zIDExIDE0IDExLjUgMTMuMSAxMi40QzEyLjIgMTMuMyAxMS43IDE0LjYgMTEuNyAxNS45QzExLjcgMTcuMiAxMi4yIDE4LjUgMTMuMSAxOS40QzE0IDIwLjMgMTUuMyAyMC44IDE2LjYgMjAuOEMxNy45IDIwLjggMTkuMiAyMC4zIDIwLjEgMTkuNEMyMSAxOC41IDIxLjUgMTcuMiAyMS41IDE1LjlDMjEuNSAxNS42IDIxLjUgMTUuNCAyMS40IDE1LjFMMjEuMiAxNS40WiIgZmlsbD0iIzVDODFBMiIvPgo8L3N2Zz4K', true, NULL);
INSERT INTO topic VALUES (56, 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik01My44NjgxIDg5LjA2NjRDNTIuODAxNCA4OS4wNjY0IDUxLjczNDggODguNTMzMSA1MC42NjgxIDg3Ljk5OTdMMzQuMTM0OCA3MS40NjY0QzMyLjAwMTQgNjkuMzMzMSAzMi4wMDE0IDY2LjY2NjQgMzMuNjAxNCA2NS4wNjY0QzM1LjIwMTQgNjMuNDY2NCAzNy44NjgxIDYzLjQ2NjQgNDAuMDAxNCA2NS4wNjY0TDUzLjMzNDggNzguMzk5N0w4Ny40NjgxIDQ0LjI2NjRDODkuMDY4MSA0Mi42NjY0IDkxLjczNDggNDIuNjY2NCA5My44NjgxIDQ0LjI2NjRDOTUuNDY4MSA0NS44NjY0IDk1LjQ2ODEgNDguNTMzMSA5My44NjgxIDUwLjY2NjRMNTYuNTM0OCA4Ny45OTk3QzU2LjAwMTQgODguNTMzMSA1NC45MzQ4IDg5LjA2NjQgNTMuODY4MSA4OS4wNjY0WiIgZmlsbD0iIzBCOTFDRSIvPgo8cGF0aCBkPSJNNjQuMDAwOCAxMTUuMkMzNS43MzQxIDExNS4yIDEyLjgwMDggOTIuMjY2NSAxMi44MDA4IDYzLjk5OThDMTIuODAwOCAzNS43MzMxIDM1LjczNDEgMTIuNzk5OCA2NC4wMDA4IDEyLjc5OThDOTIuMjY3NCAxMi43OTk4IDExNS4yMDEgMzUuNzMzMSAxMTUuMjAxIDYzLjk5OThDMTE1LjIwMSA5Mi4yNjY1IDkyLjI2NzQgMTE1LjIgNjQuMDAwOCAxMTUuMlpNNjQuMDAwOCAxOC42NjY1QzQxLjA2NzQgMTguNjY2NSAxOC42NjczIDQxLjU5OTggMTguNjY3MyA2My45OTk4QzE4LjY2NzMgODYuMzk5OCA0MS42MDA4IDEwOS4zMzMgNjQuMDAwOCAxMDkuMzMzQzg2LjkzNDEgMTA5LjMzMyAxMDkuMzM0IDg2LjM5OTggMTA5LjMzNCA2My45OTk4QzEwOS4zMzQgNDEuNTk5OCA4Ni45MzQxIDE4LjY2NjUgNjQuMDAwOCAxOC42NjY1WiIgZmlsbD0iIzBCOTFDRSIvPgo8L3N2Zz4K', false, NULL);


--
-- Data for Name: topic_translation; Type: TABLE DATA; Schema: micadoapp; Owner: -
--

INSERT INTO topic_translation VALUES (7, 'en', 'Cultural', '2022-06-23 15:28:01.761078', 1, false, NULL);
INSERT INTO topic_translation VALUES (13, 'en', 'Finance', '2022-06-23 15:28:01.761078', 1, false, NULL);
INSERT INTO topic_translation VALUES (1, 'en', 'House', '2022-06-23 15:28:01.761078', 1, false, NULL);
INSERT INTO topic_translation VALUES (4, 'en', 'Education', '2022-06-23 15:28:01.761078', 1, false, NULL);
INSERT INTO topic_translation VALUES (3, 'en', 'Health', '2022-06-23 15:28:01.761078', 1, false, NULL);
INSERT INTO topic_translation VALUES (2, 'en', 'Employment', '2022-06-23 15:28:01.761078', 1, false, NULL);
INSERT INTO topic_translation VALUES (25, 'en', 'Administration', '2022-06-23 15:28:01.761078', 1, false, NULL);
INSERT INTO topic_translation VALUES (7, 'en', 'Cultural', '2022-06-23 15:28:01.761078', 1, true, NULL);
INSERT INTO topic_translation VALUES (13, 'en', 'Finance', '2022-06-23 15:28:01.761078', 1, true, NULL);
INSERT INTO topic_translation VALUES (1, 'en', 'House', '2022-06-23 15:28:01.761078', 1, true, NULL);
INSERT INTO topic_translation VALUES (4, 'en', 'Education', '2022-06-23 15:28:01.761078', 1, true, NULL);
INSERT INTO topic_translation VALUES (3, 'en', 'Health', '2022-06-23 15:28:01.761078', 1, true, NULL);
INSERT INTO topic_translation VALUES (2, 'en', 'Employment', '2022-06-23 15:28:01.761078', 1, true, NULL);
INSERT INTO topic_translation VALUES (25, 'en', 'Administration', '2022-06-23 15:28:01.761078', 1, true, NULL);
INSERT INTO topic_translation VALUES (1, 'de', 'aggiornato', '2022-06-23 15:28:05.150802', 1, true, NULL);
INSERT INTO topic_translation VALUES (1, 'it', 'Casa', '2022-06-23 15:28:05.150802', 1, true, NULL);
INSERT INTO topic_translation VALUES (2, 'de', 'Werk', '2022-06-23 15:28:05.150802', 1, true, NULL);
INSERT INTO topic_translation VALUES (2, 'it', 'Lavoro', '2022-06-23 15:28:05.150802', 1, true, NULL);


--
-- Data for Name: topic_translation_prod; Type: TABLE DATA; Schema: micadoapp; Owner: -
--



--
-- Data for Name: user; Type: TABLE DATA; Schema: micadoapp; Owner: -
--



--
-- Data for Name: user_consent; Type: TABLE DATA; Schema: micadoapp; Owner: -
--



--
-- Data for Name: user_pictures; Type: TABLE DATA; Schema: micadoapp; Owner: -
--



--
-- Data for Name: user_preferences; Type: TABLE DATA; Schema: micadoapp; Owner: -
--



--
-- Data for Name: user_types; Type: TABLE DATA; Schema: micadoapp; Owner: -
--

INSERT INTO user_types VALUES (9, 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTE0LjkzNiAxNi40OEg5Ljg0OEw4Ljk4NCAxOS4zNkg1TDEwLjYxNiA0SDE0LjEyTDE5Ljc4NCAxOS4zNkgxNS44TDE0LjkzNiAxNi40OFpNMTAuNzEyIDEzLjY0OEgxNC4wMjRMMTIuMzkyIDguMzJMMTAuNzEyIDEzLjY0OFoiIGZpbGw9IiNGQkE1NUEiLz4KPC9zdmc+Cg==', true);
INSERT INTO user_types VALUES (1, 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTExLjcxMiAxNC4yNTU5SDkuNjk2VjE5LjY3OTlINlY0LjMxOTk1SDEyLjA0OEMxMy44NzIgNC4zMTk5NSAxNS4zMTIgNC43MDM5NSAxNi4zMiA1LjUxOTk1QzE3LjMyOCA2LjMzNTk1IDE3Ljg1NiA3LjQ4Nzk1IDE3Ljg1NiA4LjkyNzk1QzE3Ljg1NiA5Ljk4Mzk1IDE3LjYxNiAxMC44OTU5IDE3LjE4NCAxMS41Njc5QzE2Ljc1MiAxMi4yMzk5IDE2LjA4IDEyLjgxNTkgMTUuMTY4IDEzLjI5NTlMMTguMzg0IDE5LjQ4NzlWMTkuNjc5OUgxNC40TDExLjcxMiAxNC4yNTU5Wk05LjY5NiAxMS4zNzU5SDEyLjA0OEMxMi43NjggMTEuMzc1OSAxMy4yOTYgMTEuMTgzOSAxMy42MzIgMTAuNzk5OUMxMy45NjggMTAuNDE1OSAxNC4xNiA5LjkzNTk1IDE0LjE2IDkuMjYzOTVDMTQuMTYgOC41OTE5NSAxMy45NjggOC4wNjM5NSAxMy42MzIgNy43Mjc5NUMxMy4yOTYgNy4zOTE5NSAxMi43NjggNy4xNTE5NSAxMi4wNDggNy4xNTE5NUg5LjY5NlYxMS4zNzU5WiIgZmlsbD0iI0ZCQTU1QSIvPgo8L3N2Zz4K', true);
INSERT INTO user_types VALUES (7, 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTguODk2IDRMMTIuMzA0IDE0LjcwNEwxNS43MTIgNEgyMC42MDhWMTkuMzZIMTYuOTEyVjE1Ljc2TDE3LjI0OCA4LjQxNkwxMy41MDQgMTkuMzZIMTEuMDU2TDcuMzEyIDguNDE2TDcuNjQ4IDE1Ljc2VjE5LjM2SDRWNEg4Ljg5NloiIGZpbGw9IiNGQkE1NUEiLz4KPC9zdmc+Cg==', true);


--
-- Data for Name: user_types_translation; Type: TABLE DATA; Schema: micadoapp; Owner: -
--

INSERT INTO user_types_translation VALUES (7, 'en', 'Migrant ', '', '2022-06-23 15:30:03.495729', 1, false);
INSERT INTO user_types_translation VALUES (1, 'en', 'Refugee', '<p>Refugee</p>', '2022-06-23 15:30:03.495729', 1, false);
INSERT INTO user_types_translation VALUES (9, 'en', 'Asylum Seeker', '<p>Asylum Seeker</p>', '2022-06-23 15:30:03.495729', 1, false);
INSERT INTO user_types_translation VALUES (7, 'en', 'Migrant ', '', '2022-06-23 15:30:03.495729', 1, true);
INSERT INTO user_types_translation VALUES (1, 'en', 'Refugee', '<p>Refugee</p>', '2022-06-23 15:30:03.495729', 1, true);
INSERT INTO user_types_translation VALUES (9, 'en', 'Asylum Seeker', '<p>Asylum Seeker</p>', '2022-06-23 15:30:03.495729', 1, true);
INSERT INTO user_types_translation VALUES (1, 'nl', 'Vluchteling', '<p>Vluchteling</p>', '2022-06-23 15:30:06.496575', 1, true);
INSERT INTO user_types_translation VALUES (1, 'it', 'Rifugiato', ' ', '2022-06-23 15:30:06.496575', 1, true);
INSERT INTO user_types_translation VALUES (7, 'it', 'Migrante ', '', '2022-06-23 15:30:06.496575', 1, true);
INSERT INTO user_types_translation VALUES (9, 'nl', 'Asielzoeker', '<p>Asielzoeker</p>', '2022-06-23 15:30:06.496575', 1, true);
INSERT INTO user_types_translation VALUES (1, 'de', 'Flüchtling', '<p>Flüchtling</p>', '2022-06-23 15:30:06.496575', 1, true);
INSERT INTO user_types_translation VALUES (9, 'de', 'Asylsuchender', '<p>Asylsuchender</p>', '2022-06-23 15:30:06.496575', 1, true);


--
-- Data for Name: user_types_translation_prod; Type: TABLE DATA; Schema: micadoapp; Owner: -
--



--
-- Name: board_id_seq; Type: SEQUENCE SET; Schema: micadoapp; Owner: -
--

SELECT pg_catalog.setval('board_id_seq', 1, false);


--
-- Name: charts_id_seq; Type: SEQUENCE SET; Schema: micadoapp; Owner: -
--

SELECT pg_catalog.setval('charts_id_seq', 157, true);


--
-- Name: comment_translation_prod_id_seq; Type: SEQUENCE SET; Schema: micadoapp; Owner: -
--

SELECT pg_catalog.setval('comment_translation_prod_id_seq', 1, false);


--
-- Name: comments_id_seq; Type: SEQUENCE SET; Schema: micadoapp; Owner: -
--

SELECT pg_catalog.setval('comments_id_seq', 70, true);


--
-- Name: document_document_type_seq; Type: SEQUENCE SET; Schema: micadoapp; Owner: -
--

SELECT pg_catalog.setval('document_document_type_seq', 2, true);


--
-- Name: document_id_seq; Type: SEQUENCE SET; Schema: micadoapp; Owner: -
--

SELECT pg_catalog.setval('document_id_seq', 123, true);


--
-- Name: document_pictures_id_seq; Type: SEQUENCE SET; Schema: micadoapp; Owner: -
--

SELECT pg_catalog.setval('document_pictures_id_seq', 143, true);


--
-- Name: document_type_id_seq; Type: SEQUENCE SET; Schema: micadoapp; Owner: -
--

SELECT pg_catalog.setval('document_type_id_seq', 340, true);


--
-- Name: document_type_picture_id_seq; Type: SEQUENCE SET; Schema: micadoapp; Owner: -
--

SELECT pg_catalog.setval('document_type_picture_id_seq', 591, true);


--
-- Name: event_category_id_seq; Type: SEQUENCE SET; Schema: micadoapp; Owner: -
--

SELECT pg_catalog.setval('event_category_id_seq', 32, true);


--
-- Name: event_category_id_seq1; Type: SEQUENCE SET; Schema: micadoapp; Owner: -
--

SELECT pg_catalog.setval('event_category_id_seq1', 33, true);


--
-- Name: event_category_translation_prod_id_seq; Type: SEQUENCE SET; Schema: micadoapp; Owner: -
--

SELECT pg_catalog.setval('event_category_translation_prod_id_seq', 1, false);


--
-- Name: event_category_translation_prod_id_seq1; Type: SEQUENCE SET; Schema: micadoapp; Owner: -
--

SELECT pg_catalog.setval('event_category_translation_prod_id_seq1', 1, false);


--
-- Name: event_id_seq; Type: SEQUENCE SET; Schema: micadoapp; Owner: -
--

SELECT pg_catalog.setval('event_id_seq', 258, true);


--
-- Name: event_id_seq1; Type: SEQUENCE SET; Schema: micadoapp; Owner: -
--

SELECT pg_catalog.setval('event_id_seq1', 120, true);


--
-- Name: event_tags_id_seq; Type: SEQUENCE SET; Schema: micadoapp; Owner: -
--

SELECT pg_catalog.setval('event_tags_id_seq', 1, false);


--
-- Name: event_tags_id_seq1; Type: SEQUENCE SET; Schema: micadoapp; Owner: -
--

SELECT pg_catalog.setval('event_tags_id_seq1', 384, true);


--
-- Name: event_tags_id_seq2; Type: SEQUENCE SET; Schema: micadoapp; Owner: -
--

SELECT pg_catalog.setval('event_tags_id_seq2', 88, true);


--
-- Name: event_topic_id_event_seq; Type: SEQUENCE SET; Schema: micadoapp; Owner: -
--

SELECT pg_catalog.setval('event_topic_id_event_seq', 1, false);


--
-- Name: event_topic_id_event_seq1; Type: SEQUENCE SET; Schema: micadoapp; Owner: -
--

SELECT pg_catalog.setval('event_topic_id_event_seq1', 1, false);


--
-- Name: event_topic_id_topic_seq; Type: SEQUENCE SET; Schema: micadoapp; Owner: -
--

SELECT pg_catalog.setval('event_topic_id_topic_seq', 1, false);


--
-- Name: event_topic_id_topic_seq1; Type: SEQUENCE SET; Schema: micadoapp; Owner: -
--

SELECT pg_catalog.setval('event_topic_id_topic_seq1', 1, false);


--
-- Name: event_translation_prod_id_seq; Type: SEQUENCE SET; Schema: micadoapp; Owner: -
--

SELECT pg_catalog.setval('event_translation_prod_id_seq', 1, false);


--
-- Name: event_translation_prod_id_seq1; Type: SEQUENCE SET; Schema: micadoapp; Owner: -
--

SELECT pg_catalog.setval('event_translation_prod_id_seq1', 1, false);


--
-- Name: event_user_types_id_event_seq; Type: SEQUENCE SET; Schema: micadoapp; Owner: -
--

SELECT pg_catalog.setval('event_user_types_id_event_seq', 1, false);


--
-- Name: event_user_types_id_event_seq1; Type: SEQUENCE SET; Schema: micadoapp; Owner: -
--

SELECT pg_catalog.setval('event_user_types_id_event_seq1', 1, false);


--
-- Name: event_user_types_id_user_types_seq; Type: SEQUENCE SET; Schema: micadoapp; Owner: -
--

SELECT pg_catalog.setval('event_user_types_id_user_types_seq', 1, false);


--
-- Name: event_user_types_id_user_types_seq1; Type: SEQUENCE SET; Schema: micadoapp; Owner: -
--

SELECT pg_catalog.setval('event_user_types_id_user_types_seq1', 1, false);


--
-- Name: features_flags_id_seq; Type: SEQUENCE SET; Schema: micadoapp; Owner: -
--

SELECT pg_catalog.setval('features_flags_id_seq', 1, false);


--
-- Name: feedback_id_seq; Type: SEQUENCE SET; Schema: micadoapp; Owner: -
--

SELECT pg_catalog.setval('feedback_id_seq', 22, true);


--
-- Name: glossary_id_seq; Type: SEQUENCE SET; Schema: micadoapp; Owner: -
--

SELECT pg_catalog.setval('glossary_id_seq', 590, true);


--
-- Name: individual_intervention_plan_id_seq; Type: SEQUENCE SET; Schema: micadoapp; Owner: -
--

SELECT pg_catalog.setval('individual_intervention_plan_id_seq', 96, true);


--
-- Name: individual_intervention_plan_intervention_intervention_type_seq; Type: SEQUENCE SET; Schema: micadoapp; Owner: -
--

SELECT pg_catalog.setval('individual_intervention_plan_intervention_intervention_type_seq', 3, true);


--
-- Name: individual_intervention_plan_interventions_id_seq; Type: SEQUENCE SET; Schema: micadoapp; Owner: -
--

SELECT pg_catalog.setval('individual_intervention_plan_interventions_id_seq', 215, true);


--
-- Name: individual_intervention_plan_interventions_list_id_seq; Type: SEQUENCE SET; Schema: micadoapp; Owner: -
--

SELECT pg_catalog.setval('individual_intervention_plan_interventions_list_id_seq', 1, true);


--
-- Name: intervention_category_id_seq; Type: SEQUENCE SET; Schema: micadoapp; Owner: -
--

SELECT pg_catalog.setval('intervention_category_id_seq', 47, true);


--
-- Name: intervention_processes_intervention_type_seq; Type: SEQUENCE SET; Schema: micadoapp; Owner: -
--

SELECT pg_catalog.setval('intervention_processes_intervention_type_seq', 1, false);


--
-- Name: intervention_processes_process_id_seq; Type: SEQUENCE SET; Schema: micadoapp; Owner: -
--

SELECT pg_catalog.setval('intervention_processes_process_id_seq', 1, false);


--
-- Name: intervention_types_id_seq; Type: SEQUENCE SET; Schema: micadoapp; Owner: -
--

SELECT pg_catalog.setval('intervention_types_id_seq', 69, true);


--
-- Name: picture_hotspot_id_seq; Type: SEQUENCE SET; Schema: micadoapp; Owner: -
--

SELECT pg_catalog.setval('picture_hotspot_id_seq', 397, true);


--
-- Name: process_id_seq; Type: SEQUENCE SET; Schema: micadoapp; Owner: -
--

SELECT pg_catalog.setval('process_id_seq', 336, true);


--
-- Name: process_topic_id_process_seq; Type: SEQUENCE SET; Schema: micadoapp; Owner: -
--

SELECT pg_catalog.setval('process_topic_id_process_seq', 1, false);


--
-- Name: process_topic_id_topic_seq; Type: SEQUENCE SET; Schema: micadoapp; Owner: -
--

SELECT pg_catalog.setval('process_topic_id_topic_seq', 1, false);


--
-- Name: process_translation_id_seq; Type: SEQUENCE SET; Schema: micadoapp; Owner: -
--

SELECT pg_catalog.setval('process_translation_id_seq', 1, false);


--
-- Name: process_translation_prod_id_seq; Type: SEQUENCE SET; Schema: micadoapp; Owner: -
--

SELECT pg_catalog.setval('process_translation_prod_id_seq', 1, false);


--
-- Name: process_users_id_process_seq; Type: SEQUENCE SET; Schema: micadoapp; Owner: -
--

SELECT pg_catalog.setval('process_users_id_process_seq', 1, false);


--
-- Name: process_users_id_user_types_seq; Type: SEQUENCE SET; Schema: micadoapp; Owner: -
--

SELECT pg_catalog.setval('process_users_id_user_types_seq', 1, false);


--
-- Name: rasa_id_seq; Type: SEQUENCE SET; Schema: micadoapp; Owner: -
--

SELECT pg_catalog.setval('rasa_id_seq', 1, false);


--
-- Name: ratings_content_id_seq; Type: SEQUENCE SET; Schema: micadoapp; Owner: -
--

SELECT pg_catalog.setval('ratings_content_id_seq', 1, false);


--
-- Name: ratings_id_seq; Type: SEQUENCE SET; Schema: micadoapp; Owner: -
--

SELECT pg_catalog.setval('ratings_id_seq', 16, true);


--
-- Name: survey_answer_seq_id; Type: SEQUENCE SET; Schema: micadoapp; Owner: -
--

SELECT pg_catalog.setval('survey_answer_seq_id', 24, true);


--
-- Name: survey_id_seq; Type: SEQUENCE SET; Schema: micadoapp; Owner: -
--

SELECT pg_catalog.setval('survey_id_seq', 14, true);


--
-- Name: t_settings_id_seq; Type: SEQUENCE SET; Schema: micadoapp; Owner: -
--

SELECT pg_catalog.setval('t_settings_id_seq', 36, true);


--
-- Name: tenant_id_seq; Type: SEQUENCE SET; Schema: micadoapp; Owner: -
--

SELECT pg_catalog.setval('tenant_id_seq', 16, true);


--
-- Name: topic_id_seq; Type: SEQUENCE SET; Schema: micadoapp; Owner: -
--

SELECT pg_catalog.setval('topic_id_seq', 58, true);


--
-- Name: topic_translation_id_seq; Type: SEQUENCE SET; Schema: micadoapp; Owner: -
--

SELECT pg_catalog.setval('topic_translation_id_seq', 1, false);


--
-- Name: topic_translation_prod_id_seq; Type: SEQUENCE SET; Schema: micadoapp; Owner: -
--

SELECT pg_catalog.setval('topic_translation_prod_id_seq', 1, false);


--
-- Name: user_pic_id_seq; Type: SEQUENCE SET; Schema: micadoapp; Owner: -
--

SELECT pg_catalog.setval('user_pic_id_seq', 13, true);


--
-- Name: user_type_translation_prod_id_seq; Type: SEQUENCE SET; Schema: micadoapp; Owner: -
--

SELECT pg_catalog.setval('user_type_translation_prod_id_seq', 1, false);


--
-- Name: user_types_id_seq; Type: SEQUENCE SET; Schema: micadoapp; Owner: -
--

SELECT pg_catalog.setval('user_types_id_seq', 47, true);


--
-- Name: user_types_translation_id_seq; Type: SEQUENCE SET; Schema: micadoapp; Owner: -
--

SELECT pg_catalog.setval('user_types_translation_id_seq', 1, false);


--
-- Name: user_types_translation_prod_id_seq; Type: SEQUENCE SET; Schema: micadoapp; Owner: -
--

SELECT pg_catalog.setval('user_types_translation_prod_id_seq', 1, false);


--
-- Name: board board_pkey; Type: CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY board
    ADD CONSTRAINT board_pkey PRIMARY KEY (id);


--
-- Name: charts charts_pkey; Type: CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY charts
    ADD CONSTRAINT charts_pkey PRIMARY KEY (id);


--
-- Name: comment_translation_prod comment_translation_prod_pkey; Type: CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY comment_translation_prod
    ADD CONSTRAINT comment_translation_prod_pkey PRIMARY KEY (lang, id);


--
-- Name: comments comments_pkey; Type: CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY comments
    ADD CONSTRAINT comments_pkey PRIMARY KEY (id);


--
-- Name: comments_translation comments_translation_pkey; Type: CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY comments_translation
    ADD CONSTRAINT comments_translation_pkey PRIMARY KEY (id, lang, translated);


--
-- Name: document_pictures document_pictures_pk; Type: CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY document_pictures
    ADD CONSTRAINT document_pictures_pk PRIMARY KEY (id);


--
-- Name: document document_pk; Type: CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY document
    ADD CONSTRAINT document_pk PRIMARY KEY (id);


--
-- Name: document_type_picture document_type_picture_pk; Type: CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY document_type_picture
    ADD CONSTRAINT document_type_picture_pk PRIMARY KEY (id);


--
-- Name: document_type document_type_pkey; Type: CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY document_type
    ADD CONSTRAINT document_type_pkey PRIMARY KEY (id);


--
-- Name: document_type_translation document_type_translation_pkey; Type: CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY document_type_translation
    ADD CONSTRAINT document_type_translation_pkey PRIMARY KEY (id, lang, translated);


--
-- Name: document_type_translation_prod document_type_translation_prod_pk; Type: CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY document_type_translation_prod
    ADD CONSTRAINT document_type_translation_prod_pk PRIMARY KEY (id, lang);


--
-- Name: event_category event_category_pk; Type: CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY event_category
    ADD CONSTRAINT event_category_pk PRIMARY KEY (id);


--
-- Name: information_category event_category_pkey; Type: CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY information_category
    ADD CONSTRAINT event_category_pkey PRIMARY KEY (id);


--
-- Name: event_category_translation event_category_translation_original_pk_; Type: CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY event_category_translation
    ADD CONSTRAINT event_category_translation_original_pk_ PRIMARY KEY (id, lang, translated);


--
-- Name: information_category_translation_prod event_category_translation_pk; Type: CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY information_category_translation_prod
    ADD CONSTRAINT event_category_translation_pk PRIMARY KEY (id, lang);


--
-- Name: event_category_translation_prod event_category_translation_prod_original_pk_; Type: CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY event_category_translation_prod
    ADD CONSTRAINT event_category_translation_prod_original_pk_ PRIMARY KEY (id, lang);


--
-- Name: event event_pk; Type: CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY event
    ADD CONSTRAINT event_pk PRIMARY KEY (id);


--
-- Name: information event_pkey; Type: CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY information
    ADD CONSTRAINT event_pkey PRIMARY KEY (id);


--
-- Name: information_tags event_tags_pk; Type: CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY information_tags
    ADD CONSTRAINT event_tags_pk PRIMARY KEY (id);


--
-- Name: event_tags event_tags_pk_1; Type: CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY event_tags
    ADD CONSTRAINT event_tags_pk_1 PRIMARY KEY (id);


--
-- Name: event_tags_translation event_tags_translation_original_pk; Type: CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY event_tags_translation
    ADD CONSTRAINT event_tags_translation_original_pk PRIMARY KEY (id, lang, translated);


--
-- Name: event_tags_translation_prod event_tags_translation_prod_original_pk; Type: CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY event_tags_translation_prod
    ADD CONSTRAINT event_tags_translation_prod_original_pk PRIMARY KEY (id, lang);


--
-- Name: information_tags_translation_prod event_tags_translation_prod_pkey; Type: CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY information_tags_translation_prod
    ADD CONSTRAINT event_tags_translation_prod_pkey PRIMARY KEY (id, lang);


--
-- Name: event_topic event_topic_original_pk; Type: CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY event_topic
    ADD CONSTRAINT event_topic_original_pk PRIMARY KEY (id_event, id_topic);


--
-- Name: event_translation event_translation_original_pk; Type: CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY event_translation
    ADD CONSTRAINT event_translation_original_pk PRIMARY KEY (id, lang, translated);


--
-- Name: event_translation_prod event_translation_prod_original_pk; Type: CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY event_translation_prod
    ADD CONSTRAINT event_translation_prod_original_pk PRIMARY KEY (id, lang);


--
-- Name: event_user_types event_user_types_pk; Type: CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY event_user_types
    ADD CONSTRAINT event_user_types_pk PRIMARY KEY (id_event, id_user_types);


--
-- Name: features_flags_translation_prod feature_flags_translation_prod_pk; Type: CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY features_flags_translation_prod
    ADD CONSTRAINT feature_flags_translation_prod_pk PRIMARY KEY (id, lang);


--
-- Name: features_flags features_flag_pkey; Type: CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY features_flags
    ADD CONSTRAINT features_flag_pkey PRIMARY KEY (id);


--
-- Name: features_flags_translation features_flags_translation_pk; Type: CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY features_flags_translation
    ADD CONSTRAINT features_flags_translation_pk PRIMARY KEY (id, lang, translated);


--
-- Name: feedback feedback_pkey; Type: CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY feedback
    ADD CONSTRAINT feedback_pkey PRIMARY KEY (id);


--
-- Name: glossary glossary_pk; Type: CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY glossary
    ADD CONSTRAINT glossary_pk PRIMARY KEY (id);


--
-- Name: glossary_translation glossary_translation_pk; Type: CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY glossary_translation
    ADD CONSTRAINT glossary_translation_pk PRIMARY KEY (id, lang, translated);


--
-- Name: glossary_translation_prod glossary_translation_prod_pk; Type: CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY glossary_translation_prod
    ADD CONSTRAINT glossary_translation_prod_pk PRIMARY KEY (id, lang);


--
-- Name: individual_intervention_plan_interventions individual_intervention_plan_interventions_pk; Type: CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY individual_intervention_plan_interventions
    ADD CONSTRAINT individual_intervention_plan_interventions_pk PRIMARY KEY (id);


--
-- Name: individual_intervention_plan individual_intervention_plan_pkey; Type: CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY individual_intervention_plan
    ADD CONSTRAINT individual_intervention_plan_pkey PRIMARY KEY (id);


--
-- Name: information_category_translation information_category_translation_pk_1; Type: CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY information_category_translation
    ADD CONSTRAINT information_category_translation_pk_1 PRIMARY KEY (id, lang, translated);


--
-- Name: information_tags_translation information_tags_translation_pk; Type: CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY information_tags_translation
    ADD CONSTRAINT information_tags_translation_pk PRIMARY KEY (id, lang, translated);


--
-- Name: information_topic information_topic_pk; Type: CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY information_topic
    ADD CONSTRAINT information_topic_pk PRIMARY KEY (id_information, id_topic);


--
-- Name: information_translation information_translation_pk; Type: CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY information_translation
    ADD CONSTRAINT information_translation_pk PRIMARY KEY (id, lang, translated);


--
-- Name: information_translation_prod information_translation_prod_pk; Type: CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY information_translation_prod
    ADD CONSTRAINT information_translation_prod_pk PRIMARY KEY (id, lang);


--
-- Name: information_user_types information_user_types_pk; Type: CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY information_user_types
    ADD CONSTRAINT information_user_types_pk PRIMARY KEY (id_information, id_user_types);


--
-- Name: intervention_category intervention_category_pk; Type: CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY intervention_category
    ADD CONSTRAINT intervention_category_pk PRIMARY KEY (id);


--
-- Name: intervention_category_translation intervention_category_translation_pk; Type: CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY intervention_category_translation
    ADD CONSTRAINT intervention_category_translation_pk PRIMARY KEY (id, lang, translated);


--
-- Name: intervention_category_translation_prod intervention_category_translation_prod_pk; Type: CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY intervention_category_translation_prod
    ADD CONSTRAINT intervention_category_translation_prod_pk PRIMARY KEY (id, lang);


--
-- Name: completed_intervention_document intervention_doc_pk; Type: CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY completed_intervention_document
    ADD CONSTRAINT intervention_doc_pk PRIMARY KEY (id_document, id_intervention);


--
-- Name: intervention_type_validator intervention_type_validator_pk; Type: CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY intervention_type_validator
    ADD CONSTRAINT intervention_type_validator_pk PRIMARY KEY (tenant_id, intervention_type_id);


--
-- Name: intervention_types intervention_types_pkey; Type: CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY intervention_types
    ADD CONSTRAINT intervention_types_pkey PRIMARY KEY (id);


--
-- Name: intervention_types_translation intervention_types_translation_pk; Type: CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY intervention_types_translation
    ADD CONSTRAINT intervention_types_translation_pk PRIMARY KEY (id, lang, translated);


--
-- Name: intervention_types_translation_prod intervention_types_translation_prod_pk; Type: CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY intervention_types_translation_prod
    ADD CONSTRAINT intervention_types_translation_prod_pk PRIMARY KEY (id, lang);


--
-- Name: languages languages_pkey; Type: CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY languages
    ADD CONSTRAINT languages_pkey PRIMARY KEY (lang);


--
-- Name: migrant_app_config migrant_app_config_pkey; Type: CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY migrant_app_config
    ADD CONSTRAINT migrant_app_config_pkey PRIMARY KEY (id);


--
-- Name: picture_hotspot picture_hotspot_pk; Type: CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY picture_hotspot
    ADD CONSTRAINT picture_hotspot_pk PRIMARY KEY (id);


--
-- Name: picture_hotspot_translation picture_hotspot_translation_pk; Type: CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY picture_hotspot_translation
    ADD CONSTRAINT picture_hotspot_translation_pk PRIMARY KEY (pht_id, lang, translated);


--
-- Name: picture_hotspot_translation_prod picture_hotspot_translation_prod_pk; Type: CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY picture_hotspot_translation_prod
    ADD CONSTRAINT picture_hotspot_translation_prod_pk PRIMARY KEY (pht_id, lang);


--
-- Name: process_comments process_comment_pkey; Type: CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY process_comments
    ADD CONSTRAINT process_comment_pkey PRIMARY KEY (idcomment, idprocess);


--
-- Name: process process_pkey; Type: CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY process
    ADD CONSTRAINT process_pkey PRIMARY KEY (id);


--
-- Name: process_topic process_topic_pk; Type: CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY process_topic
    ADD CONSTRAINT process_topic_pk PRIMARY KEY (id_process, id_topic);


--
-- Name: process_translation process_translation_pk; Type: CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY process_translation
    ADD CONSTRAINT process_translation_pk PRIMARY KEY (id, lang, translated);


--
-- Name: process_translation_prod process_translation_prod_pk; Type: CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY process_translation_prod
    ADD CONSTRAINT process_translation_prod_pk PRIMARY KEY (id, lang);


--
-- Name: process_users process_users_pk; Type: CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY process_users
    ADD CONSTRAINT process_users_pk PRIMARY KEY (id_process, id_user_types);


--
-- Name: process_produced_documents produced_docs_pk; Type: CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY process_produced_documents
    ADD CONSTRAINT produced_docs_pk PRIMARY KEY (id_process, id_document);


--
-- Name: rasa rasa_pkey; Type: CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY rasa
    ADD CONSTRAINT rasa_pkey PRIMARY KEY (id);


--
-- Name: ratings ratings_pk_1; Type: CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY ratings
    ADD CONSTRAINT ratings_pk_1 PRIMARY KEY (id);


--
-- Name: settings settings_pk; Type: CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY settings
    ADD CONSTRAINT settings_pk PRIMARY KEY (key);


--
-- Name: step_document step_document_pk; Type: CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY step_document
    ADD CONSTRAINT step_document_pk PRIMARY KEY (id_document, id_step);


--
-- Name: mixed_icons step_icon_pkey; Type: CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY mixed_icons
    ADD CONSTRAINT step_icon_pkey PRIMARY KEY (id);


--
-- Name: step_link step_link_pk; Type: CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY step_link
    ADD CONSTRAINT step_link_pk PRIMARY KEY (id);


--
-- Name: step_link_translation_prod step_link_translation_prod_pk; Type: CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY step_link_translation_prod
    ADD CONSTRAINT step_link_translation_prod_pk PRIMARY KEY (lang, id);


--
-- Name: step step_pk; Type: CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY step
    ADD CONSTRAINT step_pk PRIMARY KEY (id);


--
-- Name: step_translation step_translation_pk; Type: CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY step_translation
    ADD CONSTRAINT step_translation_pk PRIMARY KEY (id, lang, translated);


--
-- Name: step_translation_prod step_translation_prod_pk; Type: CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY step_translation_prod
    ADD CONSTRAINT step_translation_prod_pk PRIMARY KEY (lang, id);


--
-- Name: step_link_translation steplink_translation_pk; Type: CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY step_link_translation
    ADD CONSTRAINT steplink_translation_pk PRIMARY KEY (id, lang, translated);


--
-- Name: survey_answers survey_answers_pkey; Type: CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY survey_answers
    ADD CONSTRAINT survey_answers_pkey PRIMARY KEY (id_answer);


--
-- Name: survey survey_pkey; Type: CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY survey
    ADD CONSTRAINT survey_pkey PRIMARY KEY (id);


--
-- Name: t_settings t_settings_pkey; Type: CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY t_settings
    ADD CONSTRAINT t_settings_pkey PRIMARY KEY (id);


--
-- Name: tenant tenant_pkey; Type: CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY tenant
    ADD CONSTRAINT tenant_pkey PRIMARY KEY (id);


--
-- Name: topic topic_pkey; Type: CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY topic
    ADD CONSTRAINT topic_pkey PRIMARY KEY (id);


--
-- Name: topic_translation topic_translation_pk; Type: CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY topic_translation
    ADD CONSTRAINT topic_translation_pk PRIMARY KEY (id, lang, translated);


--
-- Name: topic_translation_prod topic_translations_prod_pk; Type: CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY topic_translation_prod
    ADD CONSTRAINT topic_translations_prod_pk PRIMARY KEY (id, lang);


--
-- Name: t_settings_translation translation_pk; Type: CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY t_settings_translation
    ADD CONSTRAINT translation_pk PRIMARY KEY (id, lang, translated);


--
-- Name: t_settings_translation_prod translation_prod_pk; Type: CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY t_settings_translation_prod
    ADD CONSTRAINT translation_prod_pk PRIMARY KEY (id, lang);


--
-- Name: user_consent user_consent_pk; Type: CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY user_consent
    ADD CONSTRAINT user_consent_pk PRIMARY KEY (id_user);


--
-- Name: user_pictures user_picture_pk; Type: CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY user_pictures
    ADD CONSTRAINT user_picture_pk PRIMARY KEY (id);


--
-- Name: user user_pkey; Type: CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY "user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (id);


--
-- Name: user_preferences user_preference_pk; Type: CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY user_preferences
    ADD CONSTRAINT user_preference_pk PRIMARY KEY (id_user_type, id_user);


--
-- Name: user_types_translation_prod user_type_translation_prod_pk; Type: CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY user_types_translation_prod
    ADD CONSTRAINT user_type_translation_prod_pk PRIMARY KEY (id, lang);


--
-- Name: user_types_translation user_types_pk; Type: CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY user_types_translation
    ADD CONSTRAINT user_types_pk PRIMARY KEY (id, lang, translated);


--
-- Name: user_types user_types_pkey; Type: CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY user_types
    ADD CONSTRAINT user_types_pkey PRIMARY KEY (id);


--
-- Name: event_translation_prod_pgroonga_index; Type: INDEX; Schema: micadoapp; Owner: -
--

CREATE INDEX event_translation_prod_pgroonga_index ON event_translation_prod USING pgroonga ((ARRAY[event, description]));


--
-- Name: gin_survey_answer; Type: INDEX; Schema: micadoapp; Owner: -
--

CREATE INDEX gin_survey_answer ON survey_answers USING gin (answer);


--
-- Name: information_translation_prod_pgroonga_index; Type: INDEX; Schema: micadoapp; Owner: -
--

CREATE INDEX information_translation_prod_pgroonga_index ON information_translation_prod USING pgroonga ((ARRAY[information, description]));


--
-- Name: process_translation_prod_pgroonga_index; Type: INDEX; Schema: micadoapp; Owner: -
--

CREATE INDEX process_translation_prod_pgroonga_index ON process_translation_prod USING pgroonga ((ARRAY[process, description]));


--
-- Name: comments comment_tenant_id; Type: FK CONSTRAINT; Schema: micadoapp; Owner: -
--

-- ALTER TABLE ONLY comments
--    ADD CONSTRAINT comment_tenant_id FOREIGN KEY (tenant_id) REFERENCES wso2_shared.um_tenant(um_id) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;


--
-- Name: comments_translation comment_translation_id_fkey; Type: FK CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY comments_translation
    ADD CONSTRAINT comment_translation_id_fkey FOREIGN KEY (id) REFERENCES comments(id) NOT VALID;


--
-- Name: comments_translation comment_translation_lang_fkey; Type: FK CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY comments_translation
    ADD CONSTRAINT comment_translation_lang_fkey FOREIGN KEY (lang) REFERENCES languages(lang) NOT VALID;


--
-- Name: comment_translation_prod comment_translation_prod_id_fkey; Type: FK CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY comment_translation_prod
    ADD CONSTRAINT comment_translation_prod_id_fkey FOREIGN KEY (id) REFERENCES comments(id) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;


--
-- Name: comment_translation_prod comment_translation_prod_lang_fkey; Type: FK CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY comment_translation_prod
    ADD CONSTRAINT comment_translation_prod_lang_fkey FOREIGN KEY (lang) REFERENCES languages(lang) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;


--
-- Name: document document_ask_validate_by_tenant_fkey; Type: FK CONSTRAINT; Schema: micadoapp; Owner: -
--

-- ALTER TABLE ONLY document
--     ADD CONSTRAINT document_ask_validate_by_tenant_fkey FOREIGN KEY (ask_validate_by_tenant) REFERENCES wso2_shared.um_tenant(um_id);


--
-- Name: document document_document_type_fkey; Type: FK CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY document
    ADD CONSTRAINT document_document_type_fkey FOREIGN KEY (document_type) REFERENCES document_type(id);


--
-- Name: completed_intervention_document document_fk; Type: FK CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY completed_intervention_document
    ADD CONSTRAINT document_fk FOREIGN KEY (id_document) REFERENCES document(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: document_pictures document_pictures_fk; Type: FK CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY document_pictures
    ADD CONSTRAINT document_pictures_fk FOREIGN KEY (doc_id) REFERENCES document(id) ON DELETE CASCADE;


--
-- Name: document_type_picture document_type_picture_fk; Type: FK CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY document_type_picture
    ADD CONSTRAINT document_type_picture_fk FOREIGN KEY (document_type_id) REFERENCES document_type(id);


--
-- Name: document_type_translation document_type_translation_id_fkey; Type: FK CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY document_type_translation
    ADD CONSTRAINT document_type_translation_id_fkey FOREIGN KEY (id) REFERENCES document_type(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: document_type_translation document_type_translation_lang_fkey; Type: FK CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY document_type_translation
    ADD CONSTRAINT document_type_translation_lang_fkey FOREIGN KEY (lang) REFERENCES languages(lang) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: document_type_translation_prod document_type_translation_prod_id_fkey; Type: FK CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY document_type_translation_prod
    ADD CONSTRAINT document_type_translation_prod_id_fkey FOREIGN KEY (id) REFERENCES document_type(id) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;


--
-- Name: document_type_translation_prod document_type_translation_prod_lang_fkey; Type: FK CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY document_type_translation_prod
    ADD CONSTRAINT document_type_translation_prod_lang_fkey FOREIGN KEY (lang) REFERENCES languages(lang) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;


--
-- Name: document_type_validator document_type_validator_document_type_id_fkey; Type: FK CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY document_type_validator
    ADD CONSTRAINT document_type_validator_document_type_id_fkey FOREIGN KEY (document_type_id) REFERENCES document_type(id);


--
-- Name: event_category_translation event_category_translation_fk; Type: FK CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY event_category_translation
    ADD CONSTRAINT event_category_translation_fk FOREIGN KEY (id) REFERENCES event_category(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: event_category_translation event_category_translation_fk_1; Type: FK CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY event_category_translation
    ADD CONSTRAINT event_category_translation_fk_1 FOREIGN KEY (lang) REFERENCES languages(lang) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: information_category_translation event_category_translation_id_fkey; Type: FK CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY information_category_translation
    ADD CONSTRAINT event_category_translation_id_fkey FOREIGN KEY (id) REFERENCES information_category(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: information_category_translation event_category_translation_lang_fkey; Type: FK CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY information_category_translation
    ADD CONSTRAINT event_category_translation_lang_fkey FOREIGN KEY (lang) REFERENCES languages(lang) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: event_category_translation_prod event_category_translation_prod_fk; Type: FK CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY event_category_translation_prod
    ADD CONSTRAINT event_category_translation_prod_fk FOREIGN KEY (id) REFERENCES event_category(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: event_category_translation_prod event_category_translation_prod_fk_1; Type: FK CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY event_category_translation_prod
    ADD CONSTRAINT event_category_translation_prod_fk_1 FOREIGN KEY (lang) REFERENCES languages(lang) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: information_category_translation_prod event_category_translation_prod_id_fkey; Type: FK CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY information_category_translation_prod
    ADD CONSTRAINT event_category_translation_prod_id_fkey FOREIGN KEY (id) REFERENCES information_category(id) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;


--
-- Name: information_category_translation_prod event_category_translation_prod_lang_fkey; Type: FK CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY information_category_translation_prod
    ADD CONSTRAINT event_category_translation_prod_lang_fkey FOREIGN KEY (lang) REFERENCES languages(lang) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;


--
-- Name: event event_fk; Type: FK CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY event
    ADD CONSTRAINT event_fk FOREIGN KEY (category) REFERENCES event_category(id);


--
-- Name: event_tags event_tags_fk; Type: FK CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY event_tags
    ADD CONSTRAINT event_tags_fk FOREIGN KEY (event_id) REFERENCES event(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: information_tags event_tags_fk; Type: FK CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY information_tags
    ADD CONSTRAINT event_tags_fk FOREIGN KEY (information_id) REFERENCES information(id);


--
-- Name: event_tags_translation event_tags_translation_fk; Type: FK CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY event_tags_translation
    ADD CONSTRAINT event_tags_translation_fk FOREIGN KEY (id) REFERENCES event_tags(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: information_tags_translation event_tags_translation_fk; Type: FK CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY information_tags_translation
    ADD CONSTRAINT event_tags_translation_fk FOREIGN KEY (id) REFERENCES information_tags(id);


--
-- Name: event_tags_translation event_tags_translation_fk_1; Type: FK CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY event_tags_translation
    ADD CONSTRAINT event_tags_translation_fk_1 FOREIGN KEY (lang) REFERENCES languages(lang) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: information_tags_translation event_tags_translation_fk_1; Type: FK CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY information_tags_translation
    ADD CONSTRAINT event_tags_translation_fk_1 FOREIGN KEY (lang) REFERENCES languages(lang);


--
-- Name: event_tags_translation_prod event_tags_translation_prod_fk; Type: FK CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY event_tags_translation_prod
    ADD CONSTRAINT event_tags_translation_prod_fk FOREIGN KEY (id) REFERENCES event_tags(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: event_tags_translation_prod event_tags_translation_prod_fk_1; Type: FK CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY event_tags_translation_prod
    ADD CONSTRAINT event_tags_translation_prod_fk_1 FOREIGN KEY (lang) REFERENCES languages(lang) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: information_tags_translation_prod event_tags_translation_prod_id_fkey; Type: FK CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY information_tags_translation_prod
    ADD CONSTRAINT event_tags_translation_prod_id_fkey FOREIGN KEY (id) REFERENCES information_tags(id) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;


--
-- Name: information_tags_translation_prod event_tags_translation_prod_lang_fkey; Type: FK CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY information_tags_translation_prod
    ADD CONSTRAINT event_tags_translation_prod_lang_fkey FOREIGN KEY (lang) REFERENCES languages(lang) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;


--
-- Name: event_topic event_topic_fk; Type: FK CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY event_topic
    ADD CONSTRAINT event_topic_fk FOREIGN KEY (id_event) REFERENCES event(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: event_topic event_topic_fk_1; Type: FK CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY event_topic
    ADD CONSTRAINT event_topic_fk_1 FOREIGN KEY (id_topic) REFERENCES topic(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: information_topic event_topic_id_process_fkey; Type: FK CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY information_topic
    ADD CONSTRAINT event_topic_id_process_fkey FOREIGN KEY (id_information) REFERENCES information(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: information_topic event_topic_id_topic_fkey; Type: FK CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY information_topic
    ADD CONSTRAINT event_topic_id_topic_fkey FOREIGN KEY (id_topic) REFERENCES topic(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: event_translation event_translation_fk; Type: FK CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY event_translation
    ADD CONSTRAINT event_translation_fk FOREIGN KEY (id) REFERENCES event(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: event_translation event_translation_fk_1; Type: FK CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY event_translation
    ADD CONSTRAINT event_translation_fk_1 FOREIGN KEY (lang) REFERENCES languages(lang) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: information_translation event_translation_id_fkey; Type: FK CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY information_translation
    ADD CONSTRAINT event_translation_id_fkey FOREIGN KEY (id) REFERENCES information(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: information_translation event_translation_lang_fkey; Type: FK CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY information_translation
    ADD CONSTRAINT event_translation_lang_fkey FOREIGN KEY (lang) REFERENCES languages(lang) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: event_translation_prod event_translation_prod_fk; Type: FK CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY event_translation_prod
    ADD CONSTRAINT event_translation_prod_fk FOREIGN KEY (lang) REFERENCES languages(lang) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: event_translation_prod event_translation_prod_fk_1; Type: FK CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY event_translation_prod
    ADD CONSTRAINT event_translation_prod_fk_1 FOREIGN KEY (id) REFERENCES event(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: information_translation_prod event_translation_prod_id_fkey; Type: FK CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY information_translation_prod
    ADD CONSTRAINT event_translation_prod_id_fkey FOREIGN KEY (id) REFERENCES information(id) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;


--
-- Name: information_translation_prod event_translation_prod_lang_fkey; Type: FK CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY information_translation_prod
    ADD CONSTRAINT event_translation_prod_lang_fkey FOREIGN KEY (lang) REFERENCES languages(lang) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;


--
-- Name: information_user_types event_user_types_fk; Type: FK CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY information_user_types
    ADD CONSTRAINT event_user_types_fk FOREIGN KEY (id_information) REFERENCES information(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: event_user_types event_user_types_fk; Type: FK CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY event_user_types
    ADD CONSTRAINT event_user_types_fk FOREIGN KEY (id_event) REFERENCES event(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: information_user_types event_user_types_fk_1; Type: FK CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY information_user_types
    ADD CONSTRAINT event_user_types_fk_1 FOREIGN KEY (id_user_types) REFERENCES user_types(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: event_user_types event_user_types_fk_1; Type: FK CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY event_user_types
    ADD CONSTRAINT event_user_types_fk_1 FOREIGN KEY (id_user_types) REFERENCES user_types(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: features_flags_translation_prod feature_flags_translation_prod_id_fkey; Type: FK CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY features_flags_translation_prod
    ADD CONSTRAINT feature_flags_translation_prod_id_fkey FOREIGN KEY (id) REFERENCES features_flags(id) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;


--
-- Name: features_flags_translation_prod feature_flags_translation_prod_lang_fkey; Type: FK CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY features_flags_translation_prod
    ADD CONSTRAINT feature_flags_translation_prod_lang_fkey FOREIGN KEY (lang) REFERENCES languages(lang) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;


--
-- Name: features_flags_translation features_flags_translation_id_fkey; Type: FK CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY features_flags_translation
    ADD CONSTRAINT features_flags_translation_id_fkey FOREIGN KEY (id) REFERENCES features_flags(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: features_flags_translation features_flags_translation_lang_fkey; Type: FK CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY features_flags_translation
    ADD CONSTRAINT features_flags_translation_lang_fkey FOREIGN KEY (lang) REFERENCES languages(lang) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: glossary_translation glossary_translation_fk; Type: FK CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY glossary_translation
    ADD CONSTRAINT glossary_translation_fk FOREIGN KEY (id) REFERENCES glossary(id);


--
-- Name: glossary_translation glossary_translation_fk_1; Type: FK CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY glossary_translation
    ADD CONSTRAINT glossary_translation_fk_1 FOREIGN KEY (lang) REFERENCES languages(lang);


--
-- Name: glossary_translation_prod glossary_translation_prod_id_fkey; Type: FK CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY glossary_translation_prod
    ADD CONSTRAINT glossary_translation_prod_id_fkey FOREIGN KEY (id) REFERENCES glossary(id) NOT VALID;


--
-- Name: glossary_translation_prod glossary_translation_prod_lang_fkey; Type: FK CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY glossary_translation_prod
    ADD CONSTRAINT glossary_translation_prod_lang_fkey FOREIGN KEY (lang) REFERENCES languages(lang) NOT VALID;


--
-- Name: process_comments id_comment_fkey; Type: FK CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY process_comments
    ADD CONSTRAINT id_comment_fkey FOREIGN KEY (idcomment) REFERENCES comments(id) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;


--
-- Name: process_comments id_process_fkey; Type: FK CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY process_comments
    ADD CONSTRAINT id_process_fkey FOREIGN KEY (idprocess) REFERENCES process(id) NOT VALID;


--
-- Name: individual_intervention_plan_interventions individual_intervention_plan_interventions_intervention_type_fk; Type: FK CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY individual_intervention_plan_interventions
    ADD CONSTRAINT individual_intervention_plan_interventions_intervention_type_fk FOREIGN KEY (intervention_type) REFERENCES intervention_types(id);


--
-- Name: individual_intervention_plan_interventions individual_intervention_plan_interventions_list_id_fkey; Type: FK CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY individual_intervention_plan_interventions
    ADD CONSTRAINT individual_intervention_plan_interventions_list_id_fkey FOREIGN KEY (list_id) REFERENCES individual_intervention_plan(id);


--
-- Name: information information_fk; Type: FK CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY information
    ADD CONSTRAINT information_fk FOREIGN KEY (category) REFERENCES information_category(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: intervention_category_translation intervention_category_id_translation_fk; Type: FK CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY intervention_category_translation
    ADD CONSTRAINT intervention_category_id_translation_fk FOREIGN KEY (id) REFERENCES intervention_category(id);


--
-- Name: intervention_category_translation intervention_category_translation_fk; Type: FK CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY intervention_category_translation
    ADD CONSTRAINT intervention_category_translation_fk FOREIGN KEY (lang) REFERENCES languages(lang);


--
-- Name: intervention_category_translation_prod intervention_category_translation_prod_id_fkey; Type: FK CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY intervention_category_translation_prod
    ADD CONSTRAINT intervention_category_translation_prod_id_fkey FOREIGN KEY (id) REFERENCES intervention_category(id) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;


--
-- Name: intervention_category_translation_prod intervention_category_translation_prod_lang_fkey; Type: FK CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY intervention_category_translation_prod
    ADD CONSTRAINT intervention_category_translation_prod_lang_fkey FOREIGN KEY (lang) REFERENCES languages(lang) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;


--
-- Name: completed_intervention_document intervention_fk; Type: FK CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY completed_intervention_document
    ADD CONSTRAINT intervention_fk FOREIGN KEY (id_intervention) REFERENCES individual_intervention_plan_interventions(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: intervention_processes intervention_processes_intervention_type_fkey; Type: FK CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY intervention_processes
    ADD CONSTRAINT intervention_processes_intervention_type_fkey FOREIGN KEY (intervention_type) REFERENCES intervention_types(id);


--
-- Name: intervention_processes intervention_processes_process_id_fkey; Type: FK CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY intervention_processes
    ADD CONSTRAINT intervention_processes_process_id_fkey FOREIGN KEY (process_id) REFERENCES process(id);


--
-- Name: intervention_type_validator intervention_type_validator_fk; Type: FK CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY intervention_type_validator
    ADD CONSTRAINT intervention_type_validator_fk FOREIGN KEY (intervention_type_id) REFERENCES intervention_types(id);


--
-- Name: intervention_types intervention_types_fk; Type: FK CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY intervention_types
    ADD CONSTRAINT intervention_types_fk FOREIGN KEY (category_type) REFERENCES intervention_category(id);


--
-- Name: intervention_types_translation intervention_types_translation_id_fkey; Type: FK CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY intervention_types_translation
    ADD CONSTRAINT intervention_types_translation_id_fkey FOREIGN KEY (id) REFERENCES intervention_types(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: intervention_types_translation intervention_types_translation_lang_fkey; Type: FK CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY intervention_types_translation
    ADD CONSTRAINT intervention_types_translation_lang_fkey FOREIGN KEY (lang) REFERENCES languages(lang) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: intervention_types_translation_prod intervention_types_translation_prod_id_fkey; Type: FK CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY intervention_types_translation_prod
    ADD CONSTRAINT intervention_types_translation_prod_id_fkey FOREIGN KEY (id) REFERENCES intervention_types(id) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;


--
-- Name: intervention_types_translation_prod intervention_types_translation_prod_lang_fkey; Type: FK CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY intervention_types_translation_prod
    ADD CONSTRAINT intervention_types_translation_prod_lang_fkey FOREIGN KEY (lang) REFERENCES languages(lang) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;


--
-- Name: t_settings_translation lang_fk; Type: FK CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY t_settings_translation
    ADD CONSTRAINT lang_fk FOREIGN KEY (lang) REFERENCES languages(lang) NOT VALID;


--
-- Name: t_settings_translation_prod lang_fk; Type: FK CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY t_settings_translation_prod
    ADD CONSTRAINT lang_fk FOREIGN KEY (lang) REFERENCES languages(lang) NOT VALID;


--
-- Name: picture_hotspot picture_hotspot_fk; Type: FK CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY picture_hotspot
    ADD CONSTRAINT picture_hotspot_fk FOREIGN KEY (picture_id) REFERENCES document_type_picture(id);


--
-- Name: picture_hotspot_translation picture_hotspot_translation_fk; Type: FK CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY picture_hotspot_translation
    ADD CONSTRAINT picture_hotspot_translation_fk FOREIGN KEY (pht_id) REFERENCES picture_hotspot(id);


--
-- Name: picture_hotspot_translation picture_hotspot_translation_fk_1; Type: FK CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY picture_hotspot_translation
    ADD CONSTRAINT picture_hotspot_translation_fk_1 FOREIGN KEY (lang) REFERENCES languages(lang) ON DELETE CASCADE;


--
-- Name: picture_hotspot_translation_prod picture_hotspot_translation_prod_id_fkey; Type: FK CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY picture_hotspot_translation_prod
    ADD CONSTRAINT picture_hotspot_translation_prod_id_fkey FOREIGN KEY (pht_id) REFERENCES picture_hotspot(id) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;


--
-- Name: picture_hotspot_translation_prod picture_hotspot_translation_prod_lang_fkey; Type: FK CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY picture_hotspot_translation_prod
    ADD CONSTRAINT picture_hotspot_translation_prod_lang_fkey FOREIGN KEY (lang) REFERENCES languages(lang) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;


--
-- Name: process_topic process_topic_id_process_fkey; Type: FK CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY process_topic
    ADD CONSTRAINT process_topic_id_process_fkey FOREIGN KEY (id_process) REFERENCES process(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: process_topic process_topic_id_topic_fkey; Type: FK CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY process_topic
    ADD CONSTRAINT process_topic_id_topic_fkey FOREIGN KEY (id_topic) REFERENCES topic(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: process_translation process_translation_id_fkey; Type: FK CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY process_translation
    ADD CONSTRAINT process_translation_id_fkey FOREIGN KEY (id) REFERENCES process(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: process_translation process_translation_lang_fkey; Type: FK CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY process_translation
    ADD CONSTRAINT process_translation_lang_fkey FOREIGN KEY (lang) REFERENCES languages(lang) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: process_translation_prod process_translation_prod_id_fkey; Type: FK CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY process_translation_prod
    ADD CONSTRAINT process_translation_prod_id_fkey FOREIGN KEY (id) REFERENCES process(id) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;


--
-- Name: process_translation_prod process_translation_prod_lang_fkey; Type: FK CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY process_translation_prod
    ADD CONSTRAINT process_translation_prod_lang_fkey FOREIGN KEY (lang) REFERENCES languages(lang) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;


--
-- Name: process_users process_users_id_process_fkey; Type: FK CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY process_users
    ADD CONSTRAINT process_users_id_process_fkey FOREIGN KEY (id_process) REFERENCES process(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: process_users process_users_id_user_types_fkey; Type: FK CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY process_users
    ADD CONSTRAINT process_users_id_user_types_fkey FOREIGN KEY (id_user_types) REFERENCES user_types(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: step_document step_document_fk; Type: FK CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY step_document
    ADD CONSTRAINT step_document_fk FOREIGN KEY (id_step) REFERENCES step(id);


--
-- Name: step_document step_document_id_document_fkey; Type: FK CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY step_document
    ADD CONSTRAINT step_document_id_document_fkey FOREIGN KEY (id_document) REFERENCES document_type(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: step step_icon_fk; Type: FK CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY step
    ADD CONSTRAINT step_icon_fk FOREIGN KEY (step_icon) REFERENCES mixed_icons(id) NOT VALID;


--
-- Name: step step_id_process_fkey; Type: FK CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY step
    ADD CONSTRAINT step_id_process_fkey FOREIGN KEY (id_process) REFERENCES process(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: step_link step_link_fk; Type: FK CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY step_link
    ADD CONSTRAINT step_link_fk FOREIGN KEY (id_process) REFERENCES process(id);


--
-- Name: step_link step_link_from_fk; Type: FK CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY step_link
    ADD CONSTRAINT step_link_from_fk FOREIGN KEY (from_step) REFERENCES step(id);


--
-- Name: step_link step_link_to_fk; Type: FK CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY step_link
    ADD CONSTRAINT step_link_to_fk FOREIGN KEY (to_step) REFERENCES step(id);


--
-- Name: step_link_translation step_link_translation_fk; Type: FK CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY step_link_translation
    ADD CONSTRAINT step_link_translation_fk FOREIGN KEY (lang) REFERENCES languages(lang);


--
-- Name: step_link_translation_prod step_link_translation_prod_id_fkey; Type: FK CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY step_link_translation_prod
    ADD CONSTRAINT step_link_translation_prod_id_fkey FOREIGN KEY (id) REFERENCES step_link(id) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;


--
-- Name: step_link_translation_prod step_link_translation_prod_lang_fkey; Type: FK CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY step_link_translation_prod
    ADD CONSTRAINT step_link_translation_prod_lang_fkey FOREIGN KEY (lang) REFERENCES languages(lang) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;


--
-- Name: step_link_translation step_link_translation_step_fk; Type: FK CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY step_link_translation
    ADD CONSTRAINT step_link_translation_step_fk FOREIGN KEY (id) REFERENCES step_link(id);


--
-- Name: step_translation step_translation_fk; Type: FK CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY step_translation
    ADD CONSTRAINT step_translation_fk FOREIGN KEY (id) REFERENCES step(id);


--
-- Name: step_translation step_translation_lang_fkey; Type: FK CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY step_translation
    ADD CONSTRAINT step_translation_lang_fkey FOREIGN KEY (lang) REFERENCES languages(lang) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: step_translation_prod step_translation_prod_id_fkey; Type: FK CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY step_translation_prod
    ADD CONSTRAINT step_translation_prod_id_fkey FOREIGN KEY (id) REFERENCES step(id) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;


--
-- Name: step_translation_prod step_translation_prod_lang_fkey; Type: FK CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY step_translation_prod
    ADD CONSTRAINT step_translation_prod_lang_fkey FOREIGN KEY (lang) REFERENCES languages(lang) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;


--
-- Name: survey_answers survey_fk; Type: FK CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY survey_answers
    ADD CONSTRAINT survey_fk FOREIGN KEY (id_survey) REFERENCES survey(id);


--
-- Name: t_settings_translation t_setting_fk; Type: FK CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY t_settings_translation
    ADD CONSTRAINT t_setting_fk FOREIGN KEY (id) REFERENCES t_settings(id) NOT VALID;


--
-- Name: t_settings_translation_prod t_setting_fk; Type: FK CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY t_settings_translation_prod
    ADD CONSTRAINT t_setting_fk FOREIGN KEY (id) REFERENCES t_settings(id) NOT VALID;


--
-- Name: process_produced_documents to_docs_fk; Type: FK CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY process_produced_documents
    ADD CONSTRAINT to_docs_fk FOREIGN KEY (id_document) REFERENCES document_type(id) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;


--
-- Name: process_produced_documents to_process_fk; Type: FK CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY process_produced_documents
    ADD CONSTRAINT to_process_fk FOREIGN KEY (id_process) REFERENCES process(id) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;


--
-- Name: topic_translation topic_translation_id_fkey; Type: FK CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY topic_translation
    ADD CONSTRAINT topic_translation_id_fkey FOREIGN KEY (id) REFERENCES topic(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: topic_translation topic_translation_lang_fkey; Type: FK CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY topic_translation
    ADD CONSTRAINT topic_translation_lang_fkey FOREIGN KEY (lang) REFERENCES languages(lang) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: topic_translation_prod topic_translation_prod_id_fkey; Type: FK CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY topic_translation_prod
    ADD CONSTRAINT topic_translation_prod_id_fkey FOREIGN KEY (id) REFERENCES topic(id) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;


--
-- Name: topic_translation_prod topic_translation_prod_lang_fkey; Type: FK CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY topic_translation_prod
    ADD CONSTRAINT topic_translation_prod_lang_fkey FOREIGN KEY (lang) REFERENCES languages(lang) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;


--
-- Name: user_preferences user_type_fk; Type: FK CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY user_preferences
    ADD CONSTRAINT user_type_fk FOREIGN KEY (id_user_type) REFERENCES user_types(id) NOT VALID;


--
-- Name: user_types_translation_prod user_type_translation_prod_id_fkey; Type: FK CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY user_types_translation_prod
    ADD CONSTRAINT user_type_translation_prod_id_fkey FOREIGN KEY (id) REFERENCES user_types(id) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;


--
-- Name: user_types_translation_prod user_type_translation_prod_lang_fkey; Type: FK CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY user_types_translation_prod
    ADD CONSTRAINT user_type_translation_prod_lang_fkey FOREIGN KEY (lang) REFERENCES languages(lang) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;


--
-- Name: user_types_translation user_types_translation_id_fkey; Type: FK CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY user_types_translation
    ADD CONSTRAINT user_types_translation_id_fkey FOREIGN KEY (id) REFERENCES user_types(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: user_types_translation user_types_translation_lang_fkey; Type: FK CONSTRAINT; Schema: micadoapp; Owner: -
--

ALTER TABLE ONLY user_types_translation
    ADD CONSTRAINT user_types_translation_lang_fkey FOREIGN KEY (lang) REFERENCES languages(lang) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

