# ClaimHeart Unified Workflow Graph

This file contains a single, end-to-end Mermaid workflow diagram for ClaimHeart. It is meant to be the one-page visual reference that shows:

- all three user types and their dashboards
- the shared frontend and backend flow
- the multi-agent claim processing pipeline
- storage, policy knowledge, fraud baselines, notifications, and audit outputs

```mermaid
flowchart LR

    %% =========================
    %% USER AND EXPERIENCE LAYER
    %% =========================

    subgraph USERS["Stakeholders"]
        PAT["Patient User\ninsured member / caregiver\ntracks claim progress, reads letters, uploads missing medical docs\nreceives decisions, alerts, and next steps"]
        HOS["Hospital / TPA Staff\nprovider-side operations team\nsubmits pre-auth/discharge files, answers insurer queries\ncompletes evidence package for adjudication"]
        INS["Insurance Reviewer\nmedical + claims review team\nassesses policy fit, fraud signals, and final recommendation\napproves, queries, denies, or escalates"]
    end

    subgraph FRONTEND["Frontend Experience - Next.js"]
        PD["Patient Dashboard\npatient-facing claim workspace\nclaim timeline, decision letters, pending document requests\nuploads files, responds to queries, initiates appeal"]
        HD["Hospital / TPA Dashboard\nprovider submission workspace\nintake status, insurer query inbox, document gaps, TAT timer\nuploads medical/billing evidence and closes queries"]
        ID["Insurer Dashboard\nreviewer control panel\npolicy evidence, fraud queue, SLA risk, audit trail\nreviews packet, requests clarification, finalizes disposition"]
        UI["Shared UI Shell\nrole-aware navigation and layout layer\nroutes users to correct modules and guards protected pages\nconsistent workflow across all personas"]
        STATE["Client State + API Client\nfrontend data/control layer\nmanages auth/session, sends API requests, caches responses\nsynchronized UI with retry and refresh behavior"]
    end

    %% =========================
    %% BACKEND CONTROL PLANE
    %% =========================

    subgraph BACKEND["Backend Core - FastAPI + Celery"]
        APIGW["API Gateway\nsecure backend entry point\nperforms RBAC checks, schema validation, request routing, and stage guardrails\nonly valid, authorized actions reach services"]
        CLAIMSVC["Claim Service\ncentral claim lifecycle service\ncreates/updates claims, persists metadata, triggers processing jobs\ncanonical claim record with stage progression"]
        POLICYSVC["Policy Service\npolicy ingestion/retrieval service\naccepts policy files, tracks index status, provides clause retrieval\nsearchable policy knowledge for adjudication"]
        FRAUDSVC["Fraud Service\nfraud operations service\nfetches risk signals, stores review notes, exposes fraud evidence APIs\ninvestigator-ready risk context"]
        LETTERSVC["Letter Service\ncommunication generation service\nmanages draft templates, edits, approvals, and dispatch history\ntraceable member/provider communications"]
        USERSVC["User/Auth Service\nidentity and access service\nauthenticates users, resolves roles, issues/validates sessions\npersona-specific secure access"]
        QUEUE["Redis Queue\nasync job transport\nbuffers claim-processing tasks for worker pickup\nreliable decoupled execution"]
        WORKER["Celery Workers\nbackground execution pool\nruns extraction, analysis, and communication jobs\nscalable non-blocking processing"]
        ORCH["Claim Orchestrator\nworkflow controller for claim pipeline\nfans out agent tasks, coordinates retries, tracks workflow state\ndeterministic parallel processing and completion"]
    end

    %% =========================
    %% AGENT COMMITTEE
    %% =========================

    subgraph AGENTS["Committee of Specialized Agents - Run in Parallel"]
        REDACT["Pre-Processing: PII Redaction\nprivacy guard before AI analysis\ndetects/masks identifiers (name, contact, IDs) in documents\ncompliant inputs for downstream models"]
        EXTRACT["Agent 1 - Extractor Agent\ndocument-to-structure converter\nparses PDFs/images via OCR/vision and normalizes claim fields\nstructured claim JSON + extracted entities"]
        CONTEXT["Shared Claim Context Builder\nunified evidence assembly layer\nmerges extraction output, history, billing, policy refs, and stage data\none context object for all specialist agents"]
        POLICY["Agent 2 - Policy RAG Agent\npolicy eligibility evaluator\nretrieves relevant clauses and tests coverage/sub-limits/exclusions\ndecision rationale with exact clause citations"]
        FRAUD["Agent 3 - Fraud Investigator Agent\nrisk and anomaly analyst\nruns duplicate/provider-pattern checks and baseline variance tests\nfraud score, evidence list, and review recommendation"]
        TAT["Agent 4 - TAT Monitor Agent\nSLA compliance monitor\ncomputes elapsed time, detects bottlenecks, flags breach risk\nwarning level, delay reason, escalation signals"]
        MERGE["Decision Core - Aggregator\nexplainable decision synthesizer\ncombines policy, fraud, and TAT outputs with conflict resolution\nsingle auditable decision packet for action"]
        MEDIATOR["Agent 5 - Mediator Agent\nmulti-party communication composer\ngenerates patient letter, provider query, insurer summary\nchannel-ready, role-specific, explainable messaging"]
        FIELDTRIGGER["Escalation Layer - Field Verification Trigger\nmanual verification gateway\nroutes high-risk/unverifiable claims to on-ground checks\nadditional evidence before final closure"]
    end

    %% =========================
    %% DATA AND KNOWLEDGE
    %% =========================

    subgraph DATA["Data and Knowledge Layer"]
        DB[("PostgreSQL Claim DB\nsystem-of-record transactional database\nclaims, stages, outputs, letters, flags, verification results\ndashboards, APIs, and workflow continuity")]
        DOCS["Document Store / S3\ndurable object storage\nraw uploads, redacted copies, images, reports\nextraction, audits, and evidence replay"]
        VECTOR["Policy Vector Store\nsemantic retrieval index for policy text\nembeddings/chunks with metadata + citations\nclause-grounded policy analysis"]
        BASELINE["Cost Baselines + Clinical Rules\nfraud reference knowledge base\nregional tariffs, room caps, treatment protocol norms\nanomaly and overbilling detection"]
        AUDIT["Audit Ledger\nimmutable action history\nmachine decisions, human overrides, timestamps, reasons\ngovernance, compliance, and dispute defense"]
        CACHE["Redis Cache + Timers\nlow-latency operational state\nSLA counters, transient session data, queue coordination state\nfast checks and orchestration timing"]
    end

    %% =========================
    %% EXTERNAL INPUTS AND OUTPUTS
    %% =========================

    subgraph EXTERNAL["External Sources and Output Channels"]
        POLICYPDF["Policy PDFs\nsource contract documents\ncoverage terms, exclusions, limits, riders"]
        INGEST["Policy Chunking + Embedding Pipeline\npolicy preprocessing workflow\nsplits, cleans, embeds, and indexes policy text\nsearchable vector knowledge"]
        NOTIFY["SMS / Email / Push / In-App Alerts\noutbound communication channels\ndecisions, pending-action reminders, escalation notices"]
        FIELDAGENT["Physical Field Agent\nexternal verification resource\nperforms on-ground hospital and document authenticity checks\nverification findings and discrepancy notes"]
    end

    %% =========================
    %% USER TO DASHBOARD FLOW
    %% =========================

    PAT -->|"tracks claim / uploads docs"| PD
    HOS -->|"submits pre-auth / discharge docs"| HD
    INS -->|"reviews decision / raises query"| ID

    PD --> UI
    HD --> UI
    ID --> UI
    UI --> STATE
    STATE --> APIGW

    %% =========================
    %% API AND SERVICE FLOW
    %% =========================

    APIGW --> USERSVC
    APIGW --> CLAIMSVC
    APIGW --> POLICYSVC
    APIGW --> FRAUDSVC
    APIGW --> LETTERSVC
    APIGW --> AUDIT

    CLAIMSVC -->|"claim record + stage data"| DB
    CLAIMSVC -->|"raw uploads"| DOCS
    CLAIMSVC -->|"enqueue claim workflow"| QUEUE

    POLICYSVC --> VECTOR
    POLICYSVC --> DB
    FRAUDSVC --> DB
    LETTERSVC --> DB

    QUEUE --> WORKER
    WORKER --> ORCH
    QUEUE --> CACHE
    DB --> CACHE

    %% =========================
    %% CLAIM PROCESSING PIPELINE
    %% =========================

    DOCS -->|"claim files"| REDACT
    ORCH --> REDACT
    REDACT --> EXTRACT
    EXTRACT -->|"structured claim JSON"| CONTEXT
    EXTRACT --> DB

    DB -->|"claim history + policy refs + stage state"| CONTEXT

    CONTEXT -->|"coverage context"| POLICY
    CONTEXT -->|"risk context"| FRAUD
    CONTEXT -->|"timers and stage status"| TAT

    VECTOR -->|"relevant clauses + citations"| POLICY
    BASELINE -->|"cost and clinical reference"| FRAUD
    CACHE -->|"SLA counters"| TAT

    POLICY -->|"coverage decision + citation"| MERGE
    FRAUD -->|"risk score + evidence"| MERGE
    TAT -->|"warning / breach / bottleneck"| MERGE

    MERGE -->|"final decision packet"| MEDIATOR
    MERGE -->|"persist merged decision"| DB
    MERGE -->|"audit explanation trail"| AUDIT
    MERGE -->|"high risk or unresolved mismatch"| FIELDTRIGGER

    MEDIATOR -->|"patient letter / hospital query /\ninsurer summary"| DB
    MEDIATOR -->|"send communications"| NOTIFY
    MEDIATOR --> AUDIT

    FIELDTRIGGER -->|"dispatch case"| FIELDAGENT
    FIELDAGENT -->|"verification report"| DB
    FIELDAGENT --> AUDIT

    %% =========================
    %% FEEDBACK INTO DASHBOARDS
    %% =========================

    DB -->|"claim timeline + status + letters"| PD
    DB -->|"open queries + document gaps + TAT"| HD
    DB -->|"decision queue + evidence + actions"| ID
    AUDIT -->|"full audit history"| ID
    NOTIFY --> PAT
    NOTIFY --> HOS
    NOTIFY --> INS

    %% =========================
    %% KNOWLEDGE INGESTION
    %% =========================

    POLICYPDF --> INGEST
    INGEST --> VECTOR

    %% =========================
    %% STYLING
    %% =========================

    classDef actor fill:#fef3c7,stroke:#d97706,stroke-width:1.5px,color:#111;
    classDef ui fill:#dbeafe,stroke:#2563eb,stroke-width:1.5px,color:#111;
    classDef backend fill:#ede9fe,stroke:#7c3aed,stroke-width:1.5px,color:#111;
    classDef agent fill:#dcfce7,stroke:#16a34a,stroke-width:1.5px,color:#111;
    classDef decision fill:#bbf7d0,stroke:#15803d,stroke-width:2px,color:#111;
    classDef data fill:#fce7f3,stroke:#db2777,stroke-width:1.5px,color:#111;
    classDef ext fill:#f3f4f6,stroke:#4b5563,stroke-width:1.5px,color:#111;

    class PAT,HOS,INS actor;
    class PD,HD,ID,UI,STATE ui;
    class APIGW,CLAIMSVC,POLICYSVC,FRAUDSVC,LETTERSVC,USERSVC,QUEUE,WORKER,ORCH backend;
    class REDACT,EXTRACT,CONTEXT,POLICY,FRAUD,TAT,MEDIATOR,FIELDTRIGGER agent;
    class MERGE decision;
    class DB,DOCS,VECTOR,BASELINE,AUDIT,CACHE data;
    class POLICYPDF,INGEST,NOTIFY,FIELDAGENT ext;
```

