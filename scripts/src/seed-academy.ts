import { sql } from "drizzle-orm";
import { db } from "@workspace/db";
import {
  modulesTable,
  lessonsTable,
  lessonProgressTable,
  questionsTable,
  examsTable,
  examQuestionsTable,
  attemptsTable,
} from "@workspace/db";

type SeedQuestion = {
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

type SeedLesson = {
  title: string;
  summary: string;
  estimatedMinutes: number;
  objectives: string[];
  content: string;
  questions: SeedQuestion[];
};

type SeedModule = {
  slug: string;
  phase: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  accentColor: string;
  estimatedHours: number;
  certTags: string[];
  objectives: string[];
  scenario: string;
  lessons: SeedLesson[];
};

const modules: SeedModule[] = [
  {
    slug: "foundations",
    phase: "Phase 01",
    title: "Day One at Northwind Robotics",
    subtitle: "Hardware, software & the security mindset",
    description:
      "You've just been hired as the first security engineer at Northwind Robotics, a 30-person startup. Before you can defend anything, you need to know what you're defending. Build the asset inventory and learn the core principles.",
    icon: "Building2",
    accentColor: "#22d3ee",
    estimatedHours: 3,
    certTags: ["Security+"],
    objectives: [
      "Explain the CIA triad and apply it to real decisions",
      "Build and maintain a hardware and software asset inventory",
      "Describe operating system hardening and patch management",
      "Understand authentication, authorization, and accounting (AAA)",
    ],
    scenario:
      "Northwind Robotics designs warehouse automation robots. There is no IT department yet — just a shared spreadsheet of passwords and a closet full of laptops. The CEO hands you a badge and says: 'Make us secure.' Your first job is to understand the company's technology from the ground up.",
    lessons: [
      {
        title: "The CIA Triad & Your Security Charter",
        summary:
          "The three goals every security control serves, and how to frame your mission at Northwind.",
        estimatedMinutes: 12,
        objectives: [
          "Define confidentiality, integrity, and availability",
          "Map business needs to security goals",
          "Recognize trade-offs between the three pillars",
        ],
        content: `## Your mission starts here

Every security decision you make at Northwind serves one of three goals. Together they form the **CIA triad** — the foundation of the entire field and a guaranteed topic on the Security+ exam.

### Confidentiality
Keeping information away from people who shouldn't see it. Northwind's robot firmware source code, customer contracts, and employee payroll all demand confidentiality. Controls include **encryption**, **access control**, and **data classification**.

### Integrity
Ensuring data is accurate and hasn't been tampered with. If an attacker silently changes a robot's calibration file, the data's *integrity* is broken even though it's still "available." Controls include **hashing**, **digital signatures**, and **change management**.

### Availability
Making sure systems and data are accessible when needed. If ransomware takes down the manufacturing line, you've lost availability. Controls include **redundancy**, **backups**, and **disaster recovery**.

### The constant trade-off
These three goals pull against each other. Locking a system in a vault maximizes confidentiality but destroys availability. Your job is to find the **balance** that fits the business. A public marketing site prioritizes availability; the payroll database prioritizes confidentiality.

> **Field note:** When a stakeholder asks for a control, ask yourself: *which leg of the triad does this protect, and what does it cost the other two?*`,
        questions: [
          {
            prompt:
              "An attacker modifies a robot's calibration file without authorization. Which part of the CIA triad is primarily affected?",
            options: ["Confidentiality", "Integrity", "Availability", "Authentication"],
            correctIndex: 1,
            explanation:
              "Integrity is about data being accurate and untampered. The data is still available, but it can no longer be trusted.",
          },
          {
            prompt:
              "Ransomware encrypts Northwind's manufacturing systems so they can't run. Which goal is most directly violated?",
            options: ["Confidentiality", "Integrity", "Availability", "Non-repudiation"],
            correctIndex: 2,
            explanation:
              "Availability ensures systems are accessible when needed. Ransomware denies access to legitimate users.",
          },
          {
            prompt: "Which control most directly supports confidentiality?",
            options: [
              "Redundant power supplies",
              "File hashing",
              "Data encryption",
              "Load balancing",
            ],
            correctIndex: 2,
            explanation:
              "Encryption keeps data unreadable to unauthorized parties, directly protecting confidentiality.",
          },
        ],
      },
      {
        title: "Building the Asset Inventory",
        summary:
          "You can't protect what you don't know you have. Catalog every device and system.",
        estimatedMinutes: 14,
        objectives: [
          "Explain why asset inventory is the first security control",
          "Distinguish hardware, software, and data assets",
          "Identify shadow IT risks",
        ],
        content: `## First control: know what you have

Walk the office. You find 28 laptops, 3 servers in a closet, a couple of network switches, a wifi router from a consumer store, and a cloud account nobody documented. This is your **attack surface**, and right now you can't see it.

### Why inventory is control #1
Frameworks like the **CIS Critical Security Controls** list *Inventory and Control of Enterprise Assets* as Control 1 for a reason: every other control depends on knowing what exists. An unknown laptop can't be patched, encrypted, or monitored.

### Three kinds of assets
- **Hardware assets** — laptops, servers, switches, phones, IoT devices, the robots themselves.
- **Software assets** — operating systems, applications, licenses, and the versions of each.
- **Data assets** — where sensitive data lives and flows.

### Shadow IT
That undocumented cloud account is **shadow IT**: technology used without the security team's knowledge. It's one of the most common sources of breaches because it sits completely outside your controls. Part of inventory is *discovering* what people set up on their own.

### Make it living
An inventory is worthless if it's a one-time spreadsheet. Tie it to automated discovery (network scans, MDM, cloud APIs) so it stays current as Northwind grows.`,
        questions: [
          {
            prompt:
              "Why is asset inventory often considered the very first security control?",
            options: [
              "It's required by law in every country",
              "Every other control depends on knowing what assets exist",
              "It's the cheapest control to implement",
              "It eliminates the need for encryption",
            ],
            correctIndex: 1,
            explanation:
              "You cannot patch, monitor, or protect a device you don't know about — inventory underpins everything else.",
          },
          {
            prompt: "An employee sets up an unapproved cloud storage account for work files. This is an example of:",
            options: ["Defense in depth", "Shadow IT", "Least privilege", "A honeypot"],
            correctIndex: 1,
            explanation:
              "Shadow IT is technology adopted without security team knowledge or approval, sitting outside your controls.",
          },
          {
            prompt: "Which is a DATA asset rather than a hardware or software asset?",
            options: [
              "A network switch",
              "The customer contract database",
              "The Windows operating system",
              "A laptop",
            ],
            correctIndex: 1,
            explanation:
              "Data assets are the information itself — like the customer contract database — distinct from the devices and programs that store it.",
          },
        ],
      },
      {
        title: "Operating Systems & Patch Management",
        summary:
          "Harden the systems you found and keep them current against known vulnerabilities.",
        estimatedMinutes: 13,
        objectives: [
          "Describe OS hardening techniques",
          "Explain the patch management lifecycle",
          "Understand the risk of unpatched systems",
        ],
        content: `## Locking down the machines

Your inventory shows a mix of Windows, macOS, and Linux. Out of the box, none of them are secure for a business. **Hardening** is the process of reducing a system's attack surface.

### Hardening basics
- **Disable unnecessary services and ports** — every running service is a potential entry point.
- **Remove default accounts and change default passwords.**
- **Apply the principle of least functionality** — install only what's needed.
- **Enable host firewalls and disk encryption** (BitLocker, FileVault, LUKS).
- **Use secure baselines** — CIS Benchmarks give you vetted hardening configs.

### Patch management
Software has bugs; some bugs are **vulnerabilities**. Vendors release **patches** to fix them. Attackers race to exploit known vulnerabilities before organizations patch — many breaches use flaws that had a fix available for months.

The lifecycle:
1. **Identify** available patches.
2. **Test** them in a non-production environment so they don't break things.
3. **Deploy** on a schedule, prioritizing critical and internet-facing systems.
4. **Verify** the patch applied successfully.

### Patch Tuesday and zero-days
Microsoft releases patches on the second Tuesday of each month ("Patch Tuesday"). A **zero-day** is a vulnerability exploited *before* a patch exists — these demand compensating controls like network isolation until a fix ships.`,
        questions: [
          {
            prompt: "What is the primary goal of system hardening?",
            options: [
              "To increase system performance",
              "To reduce the system's attack surface",
              "To make backups faster",
              "To improve user experience",
            ],
            correctIndex: 1,
            explanation:
              "Hardening removes unnecessary services, accounts, and software to shrink the ways an attacker can get in.",
          },
          {
            prompt:
              "Why should patches be tested before being deployed to production?",
            options: [
              "Testing is required by Patch Tuesday",
              "Patches can break compatibility or cause outages",
              "It makes the patch download faster",
              "Production systems can't receive patches",
            ],
            correctIndex: 1,
            explanation:
              "Patches sometimes introduce regressions; testing in a non-production environment prevents self-inflicted outages.",
          },
          {
            prompt: "A zero-day vulnerability is best described as one that:",
            options: [
              "Has been patched for zero days",
              "Is exploited before a patch is available",
              "Affects zero systems",
              "Takes zero days to exploit",
            ],
            correctIndex: 1,
            explanation:
              "A zero-day is exploited before the vendor has released a fix, leaving defenders to rely on compensating controls.",
          },
        ],
      },
      {
        title: "Identity & the AAA Model",
        summary:
          "Replace the shared password spreadsheet with real identity controls.",
        estimatedMinutes: 12,
        objectives: [
          "Define authentication, authorization, and accounting",
          "Explain multifactor authentication factors",
          "Apply least privilege to accounts",
        ],
        content: `## Killing the password spreadsheet

Northwind's shared password spreadsheet is a disaster: no accountability, no revocation, no MFA. Time to build real identity controls around the **AAA model**.

### Authentication — who are you?
Proving identity using one or more **factors**:
- **Something you know** — password, PIN.
- **Something you have** — phone, hardware token, smart card.
- **Something you are** — fingerprint, face, retina.

**Multifactor authentication (MFA)** combines two or more *different* factor types. A password plus an authenticator app is MFA; two passwords is not.

### Authorization — what can you do?
Once authenticated, authorization decides what resources you can access. The gold standard is **least privilege**: give each account only the access it needs, nothing more. Northwind's interns don't need access to payroll.

### Accounting — what did you do?
Logging and auditing user actions. Accounting gives you **non-repudiation** — users can't credibly deny actions tied to their unique identity. This is why shared accounts are dangerous: you lose attribution.

### Putting it together
Give everyone a unique account, enforce MFA, scope permissions by role, and log everything. You've just replaced the spreadsheet with a defensible identity foundation.`,
        questions: [
          {
            prompt: "Which combination qualifies as true multifactor authentication?",
            options: [
              "A password and a security question",
              "A password and a PIN",
              "A password and a code from an authenticator app",
              "Two different passwords",
            ],
            correctIndex: 2,
            explanation:
              "MFA requires two different factor TYPES. A password (something you know) plus an app code (something you have) qualifies; two knowledge factors do not.",
          },
          {
            prompt:
              "Interns are given access only to the systems they need for their tasks. This applies the principle of:",
            options: ["Defense in depth", "Least privilege", "Separation of duties", "Implicit deny"],
            correctIndex: 1,
            explanation:
              "Least privilege grants only the minimum access necessary to perform a role.",
          },
          {
            prompt: "Which AAA component provides non-repudiation?",
            options: ["Authentication", "Authorization", "Accounting", "Availability"],
            correctIndex: 2,
            explanation:
              "Accounting (logging/auditing of actions tied to a unique identity) makes it impossible for users to credibly deny what they did.",
          },
        ],
      },
    ],
  },
  {
    slug: "network-design",
    phase: "Phase 02",
    title: "Blueprinting the Network",
    subtitle: "Segmentation, perimeters & secure connectivity",
    description:
      "The office runs on a single flat network where everything can talk to everything. Design a segmented, defensible network with proper perimeters and secure remote access for Northwind's growing team.",
    icon: "Network",
    accentColor: "#a78bfa",
    estimatedHours: 3,
    certTags: ["Security+"],
    objectives: [
      "Explain IP addressing, ports, and protocols at a working level",
      "Design network segmentation with VLANs and zones",
      "Apply zero trust principles",
      "Configure firewalls and secure remote access",
    ],
    scenario:
      "Northwind is hiring fast and just signed a contract requiring them to handle sensitive customer data. The current 'plug everything into one switch' setup means a compromised laptop can reach the robot controllers and the finance server alike. You need a network blueprint that contains threats.",
    lessons: [
      {
        title: "Network Fundamentals: IP, Ports & Protocols",
        summary:
          "The addressing and protocols your defenses are built on.",
        estimatedMinutes: 14,
        objectives: [
          "Explain IP addresses and subnets",
          "Identify common ports and protocols",
          "Distinguish TCP from UDP",
        ],
        content: `## Speaking the network's language

Before you can segment the network, you need to understand how traffic flows.

### IP addresses and subnets
Every device gets an **IP address**. **Private ranges** (10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16) are used inside Northwind; public IPs face the internet. A **subnet mask** (e.g. /24) defines how big a network segment is — this is the basis for segmentation.

### Ports and protocols
Services listen on **ports**. Knowing the common ones is essential for firewall rules and exam questions:
- **22** — SSH (secure remote shell)
- **443** — HTTPS (encrypted web)
- **80** — HTTP (unencrypted web)
- **53** — DNS
- **3389** — RDP (Windows remote desktop)
- **445** — SMB (Windows file sharing)

### Secure vs insecure pairs
Many protocols have a secure replacement: use **HTTPS not HTTP**, **SSH not Telnet**, **SFTP not FTP**, **LDAPS not LDAP**. Part of your job is hunting down and replacing the insecure ones.

### TCP vs UDP
**TCP** is connection-oriented and reliable (web, email). **UDP** is connectionless and fast (DNS lookups, video, VoIP). Firewalls treat them as distinct.`,
        questions: [
          {
            prompt: "Which port is used by HTTPS?",
            options: ["22", "80", "443", "3389"],
            correctIndex: 2,
            explanation:
              "HTTPS (encrypted web traffic) uses TCP port 443. Port 80 is plain HTTP.",
          },
          {
            prompt: "Which is a private IP address range suitable for internal use?",
            options: ["8.8.8.0/24", "192.168.0.0/16", "1.1.1.0/24", "203.0.113.0/24"],
            correctIndex: 1,
            explanation:
              "192.168.0.0/16 is one of the RFC 1918 private ranges used inside organizations and not routable on the public internet.",
          },
          {
            prompt:
              "An administrator wants to replace an insecure remote-access protocol. They should replace Telnet with:",
            options: ["FTP", "SSH", "HTTP", "SNMPv1"],
            correctIndex: 1,
            explanation:
              "SSH provides encrypted remote shell access and is the secure replacement for cleartext Telnet.",
          },
        ],
      },
      {
        title: "Segmentation, VLANs & Zero Trust",
        summary:
          "Break the flat network into zones so one breach can't reach everything.",
        estimatedMinutes: 15,
        objectives: [
          "Explain network segmentation benefits",
          "Describe VLANs and a screened subnet (DMZ)",
          "Define the zero trust model",
        ],
        content: `## Containing the blast radius

Right now Northwind's network is **flat**: one compromised device can reach every other device. Segmentation fixes this.

### VLANs and zones
A **VLAN** (virtual LAN) logically separates devices even on the same physical switch. Design Northwind into zones:
- **Corporate** — employee laptops
- **Servers** — finance, file shares
- **OT/Robotics** — the robot controllers (highly sensitive, isolated)
- **Guest** — visitor wifi, fully separated from everything internal

Traffic between zones must pass through a firewall that enforces rules.

### The screened subnet (DMZ)
Public-facing services (a web server) go in a **screened subnet**, also called a **DMZ** — a buffer zone between the internet and the internal network. If the web server is breached, the attacker is still walled off from internal systems.

### Zero trust
The old model trusted anything "inside" the network. **Zero trust** assumes breach and trusts nothing by default — *never trust, always verify*. Every request is authenticated and authorized regardless of where it originates. Microsegmentation, strong identity, and continuous verification are its building blocks.

> **Field note:** Segmentation is one of the highest-leverage controls you can deploy. It turns a company-ending breach into a contained incident.`,
        questions: [
          {
            prompt: "What is the main security benefit of network segmentation?",
            options: [
              "It speeds up internet downloads",
              "It limits how far an attacker can move after a breach",
              "It eliminates the need for passwords",
              "It removes the need for firewalls",
            ],
            correctIndex: 1,
            explanation:
              "Segmentation contains the blast radius — a compromise in one zone can't freely reach others.",
          },
          {
            prompt:
              "Where should a public-facing web server be placed for the best security posture?",
            options: [
              "On the same VLAN as the finance server",
              "In a screened subnet (DMZ)",
              "On the guest wifi",
              "Directly on the internet with no firewall",
            ],
            correctIndex: 1,
            explanation:
              "A screened subnet/DMZ isolates public-facing services so a breach there doesn't expose the internal network.",
          },
          {
            prompt: "The core principle of zero trust is best summarized as:",
            options: [
              "Trust devices inside the perimeter",
              "Never trust, always verify",
              "Trust but verify once at login",
              "Trust all encrypted traffic",
            ],
            correctIndex: 1,
            explanation:
              "Zero trust assumes breach and verifies every request regardless of network location.",
          },
        ],
      },
      {
        title: "Firewalls & Secure Remote Access",
        summary:
          "Enforce your zones with firewall rules and let remote staff connect safely.",
        estimatedMinutes: 13,
        objectives: [
          "Describe firewall types and rule logic",
          "Explain VPNs and their modes",
          "Understand implicit deny",
        ],
        content: `## Enforcing the blueprint

Your zones only matter if something enforces the boundaries. That's the firewall's job.

### Firewall types
- **Packet-filtering / stateful** — allow or block traffic based on IP, port, and connection state.
- **Next-generation firewall (NGFW)** — adds application awareness, intrusion prevention, and deep packet inspection.
- **Web application firewall (WAF)** — protects web apps from attacks like SQL injection and XSS.

### Rule logic and implicit deny
Firewall rules are evaluated top-down. A critical concept: **implicit deny** — anything not explicitly allowed is blocked. You build an allowlist of permitted traffic and everything else is dropped by default. This is far safer than trying to block known-bad traffic.

### Secure remote access with VPNs
Northwind's remote employees need to reach internal systems safely. A **VPN** (virtual private network) creates an encrypted tunnel over the public internet.
- **Remote-access VPN** — individual users connect to the office.
- **Site-to-site VPN** — connects two offices/networks permanently.
- **Split tunnel vs full tunnel** — split tunnel sends only corporate traffic through the VPN; full tunnel routes everything, giving more control and inspection.

Pair the VPN with MFA so a stolen password alone can't open the tunnel.`,
        questions: [
          {
            prompt:
              "A firewall is configured so that any traffic not explicitly permitted is blocked. This is called:",
            options: ["Implicit deny", "Explicit allow", "Stateful inspection", "Port forwarding"],
            correctIndex: 0,
            explanation:
              "Implicit deny blocks anything not specifically allowed, which is the secure default for firewall rule sets.",
          },
          {
            prompt: "What does a VPN primarily provide for remote workers?",
            options: [
              "Faster internet speeds",
              "An encrypted tunnel to access internal resources securely",
              "Automatic patching of their laptop",
              "Free antivirus software",
            ],
            correctIndex: 1,
            explanation:
              "A VPN creates an encrypted tunnel over the public internet so remote users can reach internal systems securely.",
          },
          {
            prompt:
              "Which firewall type is specifically designed to protect web applications from attacks like SQL injection?",
            options: ["Packet-filtering firewall", "Web application firewall (WAF)", "Stateful firewall", "Host firewall"],
            correctIndex: 1,
            explanation:
              "A WAF inspects HTTP/HTTPS traffic to block web-specific attacks such as SQL injection and cross-site scripting.",
          },
        ],
      },
    ],
  },
  {
    slug: "security-tooling",
    phase: "Phase 03",
    title: "Standing Up Defenses",
    subtitle: "EDR, SIEM & vulnerability management",
    description:
      "With the network designed, deploy the core security tooling: endpoint protection, centralized logging, and a vulnerability management program that finds weaknesses before attackers do.",
    icon: "ShieldCheck",
    accentColor: "#34d399",
    estimatedHours: 3,
    certTags: ["Security+", "CySA+"],
    objectives: [
      "Deploy endpoint protection and understand EDR",
      "Centralize logs with a SIEM",
      "Run a vulnerability management lifecycle",
    ],
    scenario:
      "Northwind now has a clean network design, but you're flying blind — no visibility into what's happening on endpoints or across the environment. It's time to install the sensors and tooling that let you detect and respond to threats.",
    lessons: [
      {
        title: "Endpoint Protection & EDR",
        summary:
          "From signature antivirus to behavior-based endpoint detection and response.",
        estimatedMinutes: 12,
        objectives: [
          "Compare antivirus with EDR",
          "Explain behavioral detection",
          "Understand endpoint telemetry",
        ],
        content: `## Sensors on every machine

Endpoints — laptops and servers — are where most attacks land. You need protection that does more than match known virus signatures.

### Antivirus vs EDR
Traditional **antivirus (AV)** matches files against a database of known malware signatures. It misses anything new. **Endpoint Detection and Response (EDR)** watches *behavior*: processes spawning suspicious children, mass file encryption, credential dumping. It can detect novel and **fileless** attacks that signatures miss.

### What EDR gives you
- **Continuous telemetry** from every endpoint — process trees, network connections, file changes.
- **Detection** of suspicious behavior, mapped to techniques like the MITRE ATT&CK framework.
- **Response** — isolate a host from the network, kill a process, or roll back changes, often remotely.

### XDR and MDR
- **XDR** (Extended Detection and Response) correlates endpoint data with network, email, and cloud signals.
- **MDR** (Managed Detection and Response) is EDR/XDR operated by an outside team — useful for a small shop like Northwind without a 24/7 SOC.

> **Field note:** EDR's ability to *isolate* a compromised host in one click is one of the most valuable incident-response capabilities you can buy.`,
        questions: [
          {
            prompt:
              "What is the key advantage of EDR over traditional signature-based antivirus?",
            options: [
              "It uses less disk space",
              "It detects threats based on behavior, catching novel attacks",
              "It never needs updates",
              "It only scans on a fixed schedule",
            ],
            correctIndex: 1,
            explanation:
              "EDR watches behavior rather than matching known signatures, so it can catch new, fileless, and previously unseen attacks.",
          },
          {
            prompt:
              "A small company with no 24/7 security staff wants expert monitoring of its endpoints. The best fit is:",
            options: ["AV", "MDR", "A WAF", "A honeypot"],
            correctIndex: 1,
            explanation:
              "Managed Detection and Response (MDR) provides an external team to operate detection and response around the clock.",
          },
          {
            prompt: "A powerful EDR response action during an active compromise is to:",
            options: [
              "Increase the screen brightness",
              "Isolate the host from the network",
              "Defragment the disk",
              "Disable the firewall",
            ],
            correctIndex: 1,
            explanation:
              "Network isolation/containment stops a compromised host from spreading or communicating with attackers while you investigate.",
          },
        ],
      },
      {
        title: "SIEM & Centralized Logging",
        summary:
          "Pull every log into one place so you can correlate and alert on threats.",
        estimatedMinutes: 14,
        objectives: [
          "Explain the role of a SIEM",
          "Describe log aggregation and correlation",
          "Understand alerting and tuning",
        ],
        content: `## One pane of glass

Logs are scattered across firewalls, servers, EDR, and cloud apps. Individually they're noise. A **SIEM** (Security Information and Event Management) brings them together.

### What a SIEM does
1. **Aggregation** — collect logs from across the environment into one place.
2. **Normalization** — convert different log formats into a common structure.
3. **Correlation** — connect related events: a failed-login spike *followed by* a success *followed by* data transfer tells a story no single log shows.
4. **Alerting** — fire notifications when correlation rules or thresholds match.
5. **Retention** — store logs for investigations and compliance.

### Signal vs noise
A SIEM's biggest challenge is **alert fatigue** — too many false positives and analysts stop looking. **Tuning** rules to your environment is continuous work. This is core CySA+ material: analysts spend their days separating real threats from noise.

### SOAR
**SOAR** (Security Orchestration, Automation, and Response) layers on top to automate repetitive response steps — enrich an alert, open a ticket, isolate a host — so humans focus on judgment calls.

> **Field note:** Garbage in, garbage out. A SIEM is only as good as the log sources you feed it and the rules you tune.`,
        questions: [
          {
            prompt: "What is the primary purpose of a SIEM?",
            options: [
              "To encrypt all network traffic",
              "To aggregate and correlate logs to detect security events",
              "To replace the firewall",
              "To manage employee passwords",
            ],
            correctIndex: 1,
            explanation:
              "A SIEM centralizes logs from many sources and correlates them to surface security events that individual logs would miss.",
          },
          {
            prompt:
              "Analysts ignoring alerts because there are too many false positives is known as:",
            options: ["Alert fatigue", "Log rotation", "Privilege creep", "Data exfiltration"],
            correctIndex: 0,
            explanation:
              "Alert fatigue happens when excessive or low-quality alerts cause analysts to miss or ignore real threats; tuning reduces it.",
          },
          {
            prompt: "SOAR primarily adds which capability on top of a SIEM?",
            options: [
              "Physical security",
              "Automated orchestration of response actions",
              "Encryption of databases",
              "Wireless access control",
            ],
            correctIndex: 1,
            explanation:
              "SOAR automates and orchestrates repetitive response workflows so analysts can focus on decisions requiring judgment.",
          },
        ],
      },
      {
        title: "Vulnerability Management",
        summary:
          "Find and fix weaknesses on a continuous cycle before attackers exploit them.",
        estimatedMinutes: 14,
        objectives: [
          "Run the vulnerability management lifecycle",
          "Interpret CVSS severity scores",
          "Distinguish scanning types and false positives",
        ],
        content: `## Hunting your own weaknesses

You'd rather find Northwind's vulnerabilities before an attacker does. **Vulnerability management** is the continuous process of doing exactly that.

### The lifecycle
1. **Discover** assets (your inventory feeds this).
2. **Scan** for known vulnerabilities using tools like Nessus, Qualys, or OpenVAS.
3. **Prioritize** findings by risk.
4. **Remediate** — patch, reconfigure, or apply a compensating control.
5. **Verify** with a rescan, then repeat.

### Scanning types
- **Credentialed scans** log in and see far more (installed patches, configs) than **non-credentialed** scans. Credentialed scans are more accurate.
- **Agent-based** scanning runs continuously on the host.
- **External vs internal** scans show what attackers see from outside vs inside.

### Severity with CVSS
The **CVSS** (Common Vulnerability Scoring System) rates each vulnerability 0–10. Use it to prioritize, but combine it with **context**: a critical vuln on an internet-facing server outranks the same vuln on an isolated test box.

### False positives and negatives
A **false positive** is a reported vuln that isn't real; a **false negative** is a real vuln the scanner missed. Validating findings is a core CySA+ skill — never blindly trust scanner output.`,
        questions: [
          {
            prompt:
              "Which scan type generally produces the most accurate and detailed results?",
            options: [
              "Non-credentialed scan",
              "Credentialed scan",
              "Ping sweep",
              "Port knock",
            ],
            correctIndex: 1,
            explanation:
              "Credentialed scans authenticate to the host and can see installed patches and configurations, yielding far more accurate findings.",
          },
          {
            prompt: "CVSS is used to:",
            options: [
              "Encrypt vulnerability reports",
              "Score the severity of vulnerabilities on a 0–10 scale",
              "Scan for open ports",
              "Manage user accounts",
            ],
            correctIndex: 1,
            explanation:
              "The Common Vulnerability Scoring System provides a standardized 0–10 severity rating to help prioritize remediation.",
          },
          {
            prompt:
              "A scanner reports a vulnerability that, on investigation, does not actually exist. This is a:",
            options: ["False negative", "True positive", "False positive", "Zero-day"],
            correctIndex: 2,
            explanation:
              "A false positive is a finding that the scanner flags but which isn't actually a real vulnerability.",
          },
        ],
      },
    ],
  },
  {
    slug: "grc",
    phase: "Phase 04",
    title: "Governance, Risk & Compliance",
    subtitle: "Policies, risk decisions & regulations",
    description:
      "Northwind's new contract comes with compliance obligations. Build the governance layer: policies and frameworks, a real risk management process, and an understanding of the regulations you must meet.",
    icon: "Scale",
    accentColor: "#fbbf24",
    estimatedHours: 3,
    certTags: ["Security+", "CySA+"],
    objectives: [
      "Write policies and adopt a security framework",
      "Run a risk assessment and choose treatments",
      "Map key regulations to obligations",
    ],
    scenario:
      "The customer contract Northwind signed requires demonstrable security controls and an annual audit. Technical controls aren't enough anymore — you need governance: the policies, risk decisions, and compliance evidence that prove Northwind is trustworthy.",
    lessons: [
      {
        title: "Policies, Standards & Frameworks",
        summary:
          "The documents and frameworks that turn security from ad-hoc into a program.",
        estimatedMinutes: 12,
        objectives: [
          "Distinguish policy, standard, procedure, and guideline",
          "Recognize major frameworks",
          "Explain governance",
        ],
        content: `## From firefighting to a program

So far you've been making decisions case by case. **Governance** turns that into a repeatable program with documented expectations.

### The document hierarchy
- **Policy** — high-level statement of intent ("All data must be encrypted in transit"). Mandatory, approved by leadership.
- **Standard** — specific, mandatory rules that support a policy ("Use TLS 1.2 or higher").
- **Procedure** — step-by-step instructions to implement a standard.
- **Guideline** — recommended, non-mandatory best practices.

### Frameworks
You don't have to invent controls from scratch. Frameworks give you a vetted catalog:
- **NIST Cybersecurity Framework (CSF)** — Identify, Protect, Detect, Respond, Recover.
- **NIST 800-53** — detailed control catalog, common in government.
- **ISO/IEC 27001** — international standard for an information security management system (ISMS), certifiable.
- **CIS Controls** — prioritized, practical controls great for smaller orgs.

### Why it matters
Auditors and customers want to see that security is *governed*, not improvised. Adopting a framework gives Northwind a common language and a roadmap, and it maps directly to compliance requirements.`,
        questions: [
          {
            prompt:
              "Which document type is a high-level, mandatory statement of management intent?",
            options: ["Guideline", "Procedure", "Policy", "Baseline"],
            correctIndex: 2,
            explanation:
              "A policy is the high-level mandatory statement of intent; standards, procedures, and guidelines support it at increasing levels of detail.",
          },
          {
            prompt:
              "The five functions Identify, Protect, Detect, Respond, and Recover come from which framework?",
            options: ["ISO 27001", "PCI DSS", "NIST Cybersecurity Framework", "HIPAA"],
            correctIndex: 2,
            explanation:
              "Those five core functions are the structure of the NIST Cybersecurity Framework (CSF).",
          },
          {
            prompt: "Which is a recommended but NON-mandatory document?",
            options: ["Policy", "Standard", "Procedure", "Guideline"],
            correctIndex: 3,
            explanation:
              "Guidelines are recommended best practices and are not mandatory, unlike policies, standards, and procedures.",
          },
        ],
      },
      {
        title: "Risk Management & Assessment",
        summary:
          "Identify, measure, and treat risk so leadership can make informed decisions.",
        estimatedMinutes: 14,
        objectives: [
          "Define threat, vulnerability, and risk",
          "Calculate risk and use a risk matrix",
          "Choose among the four risk treatments",
        ],
        content: `## Making risk a decision, not a guess

Security is really **risk management**. You can't eliminate all risk, so you help leadership decide what's acceptable.

### The vocabulary
- **Threat** — something that could cause harm (ransomware, an insider).
- **Vulnerability** — a weakness a threat can exploit (an unpatched server).
- **Risk** — the likelihood and impact of a threat exploiting a vulnerability.

A threat with no matching vulnerability is low risk, and vice versa.

### Measuring risk
- **Qualitative** — rate likelihood and impact High/Medium/Low on a **risk matrix**. Fast and common.
- **Quantitative** — assign dollar values. Key formulas for Security+:
  - **SLE** (Single Loss Expectancy) = Asset Value x Exposure Factor
  - **ALE** (Annualized Loss Expectancy) = SLE x ARO (Annual Rate of Occurrence)

ALE tells you how much a risk costs per year, which justifies how much to spend mitigating it.

### The four treatments
1. **Mitigate** — reduce the risk with controls.
2. **Transfer** — shift it to someone else (cyber insurance).
3. **Avoid** — stop the risky activity entirely.
4. **Accept** — acknowledge and live with it (formally, by leadership).

> **Field note:** Risk acceptance is a *business* decision. Your job is to surface the risk clearly so leadership owns the choice.`,
        questions: [
          {
            prompt: "Risk is best defined as:",
            options: [
              "Any weakness in a system",
              "The likelihood and impact of a threat exploiting a vulnerability",
              "A piece of malware",
              "A failed audit",
            ],
            correctIndex: 1,
            explanation:
              "Risk combines the probability that a threat exploits a vulnerability with the impact if it does.",
          },
          {
            prompt:
              "A company buys cyber insurance to cover potential breach costs. This is which risk treatment?",
            options: ["Mitigate", "Transfer", "Avoid", "Accept"],
            correctIndex: 1,
            explanation:
              "Transferring risk shifts the financial impact to a third party, such as an insurer.",
          },
          {
            prompt:
              "Which formula gives the Annualized Loss Expectancy (ALE)?",
            options: [
              "Asset Value x Exposure Factor",
              "SLE x ARO",
              "Threat x Vulnerability",
              "Impact / Likelihood",
            ],
            correctIndex: 1,
            explanation:
              "ALE = SLE x ARO, where SLE is the single loss expectancy and ARO is the annual rate of occurrence.",
          },
        ],
      },
      {
        title: "Compliance, Regulations & Audits",
        summary:
          "The laws and standards Northwind must satisfy, and how audits prove it.",
        estimatedMinutes: 12,
        objectives: [
          "Map major regulations to data types",
          "Explain the role of audits and evidence",
          "Distinguish due care from due diligence",
        ],
        content: `## Proving you're trustworthy

Compliance is meeting external requirements — laws, regulations, and contractual standards. Northwind touches several.

### Key regulations and standards
- **PCI DSS** — applies if you handle payment card data. Contractual, strict, with required controls.
- **HIPAA** — protects healthcare data (PHI) in the US.
- **GDPR** — protects EU residents' personal data; heavy fines, applies globally if you serve EU users.
- **SOX** — financial reporting integrity for public companies.
- **CCPA/CPRA** — California consumer privacy.

The trigger is usually the **type of data** you handle. Identify Northwind's data and you'll know which rules apply.

### Audits and evidence
An **audit** independently verifies you're doing what you claim. Auditors want **evidence**: logs, configurations, policy documents, training records. This is why accounting/logging from Phase 01 matters — it produces the evidence trail. A **gap analysis** compares your current state to a required state before the real audit.

### Due care vs due diligence
- **Due diligence** — investigating and understanding risks (researching a vendor's security).
- **Due care** — taking reasonable action to address them (acting on what you found).

Demonstrating both protects Northwind legally and reputationally.`,
        questions: [
          {
            prompt:
              "Which standard specifically governs the handling of payment card data?",
            options: ["HIPAA", "GDPR", "PCI DSS", "SOX"],
            correctIndex: 2,
            explanation:
              "PCI DSS (Payment Card Industry Data Security Standard) applies to organizations that handle credit card data.",
          },
          {
            prompt:
              "An organization handling personal data of EU residents must comply with:",
            options: ["HIPAA", "GDPR", "SOX", "PCI DSS"],
            correctIndex: 1,
            explanation:
              "GDPR protects the personal data of EU residents and applies to any organization processing it, regardless of location.",
          },
          {
            prompt:
              "Researching a vendor's security posture before signing represents:",
            options: ["Due care", "Due diligence", "Risk acceptance", "An audit"],
            correctIndex: 1,
            explanation:
              "Due diligence is the investigation and understanding of risk; due care is taking reasonable action on what you find.",
          },
        ],
      },
    ],
  },
  {
    slug: "devsecops",
    phase: "Phase 05",
    title: "Building the Pipeline",
    subtitle: "DevSecOps, cloud & automation",
    description:
      "Northwind's engineers ship robot firmware and a customer portal. Embed security into how they build and deploy software — shift left, secure the pipeline, and lock down the cloud.",
    icon: "GitBranch",
    accentColor: "#f472b6",
    estimatedHours: 3,
    certTags: ["CySA+"],
    objectives: [
      "Integrate security into CI/CD pipelines",
      "Manage secrets and secure infrastructure as code",
      "Apply cloud security posture management",
    ],
    scenario:
      "Northwind's development team moves fast and pushes code to the cloud daily. Security can't be a gate that slows them down — it has to be built into the pipeline. Welcome to DevSecOps, where you make the secure path the easy path.",
    lessons: [
      {
        title: "CI/CD & Shifting Security Left",
        summary:
          "Catch security issues during development instead of after release.",
        estimatedMinutes: 13,
        objectives: [
          "Explain CI/CD pipelines",
          "Describe shift-left security",
          "Compare SAST, DAST, and SCA",
        ],
        content: `## Security at the speed of development

Northwind ships code constantly through a **CI/CD pipeline** (Continuous Integration / Continuous Delivery) — code is automatically built, tested, and deployed. DevSecOps inserts security checks into that flow.

### Shift left
The earlier you catch a flaw, the cheaper it is to fix. **Shifting left** means moving security testing earlier in the development lifecycle — into the developer's editor and the pull request — rather than scanning only after release.

### The testing toolbox
- **SAST** (Static Application Security Testing) — analyzes source code *without running it*, catching flaws like SQL injection patterns early.
- **DAST** (Dynamic Application Security Testing) — tests the *running* application from the outside, like an attacker would.
- **SCA** (Software Composition Analysis) — scans third-party/open-source dependencies for known vulnerabilities. Crucial, since most code is now dependencies.
- **IAST** combines static and dynamic approaches at runtime.

### The software supply chain
Attackers increasingly target the **supply chain** — the libraries, build tools, and dependencies you trust. An **SBOM** (Software Bill of Materials) inventories every component in your software so you can react fast when a dependency like Log4j turns out to be vulnerable.

> **Field note:** Make the pipeline *fail the build* on critical findings. Security that's only advisory gets ignored under deadline pressure.`,
        questions: [
          {
            prompt: "What does 'shifting left' mean in DevSecOps?",
            options: [
              "Moving servers to a new data center",
              "Performing security testing earlier in the development lifecycle",
              "Reducing the number of developers",
              "Switching to a left-handed keyboard layout",
            ],
            correctIndex: 1,
            explanation:
              "Shifting left moves security checks earlier (into coding and pull requests) where issues are cheaper and faster to fix.",
          },
          {
            prompt:
              "Which testing method analyzes source code without executing the application?",
            options: ["DAST", "SAST", "Penetration test", "Fuzzing"],
            correctIndex: 1,
            explanation:
              "SAST (Static Application Security Testing) inspects source code statically, without running the program.",
          },
          {
            prompt:
              "Scanning third-party open-source libraries for known vulnerabilities is the job of:",
            options: ["SCA", "WAF", "SIEM", "DLP"],
            correctIndex: 0,
            explanation:
              "Software Composition Analysis (SCA) identifies vulnerable third-party and open-source dependencies in your codebase.",
          },
        ],
      },
      {
        title: "Secrets, IaC & Container Security",
        summary:
          "Keep credentials out of code and secure the infrastructure you define as code.",
        estimatedMinutes: 13,
        objectives: [
          "Explain secrets management",
          "Secure infrastructure as code",
          "Describe container and image security",
        ],
        content: `## Securing how Northwind builds

Modern infrastructure is defined and deployed in code. That brings speed — and new risks.

### Secrets management
A **secret** is any credential: API keys, database passwords, tokens. The cardinal sin is **hardcoding secrets** in source code, where they leak through repositories. Instead use a **secrets manager** (HashiCorp Vault, AWS Secrets Manager) that stores, rotates, and injects secrets at runtime. Scan repos for accidentally committed secrets.

### Infrastructure as Code (IaC)
Tools like Terraform define servers, networks, and permissions as code. This is powerful but a single misconfiguration can be deployed everywhere instantly — a public storage bucket, an open security group. **IaC scanning** checks these definitions for insecure settings *before* they deploy.

### Container security
Northwind packages apps in **containers** (Docker). Secure them by:
- Using **minimal, trusted base images** — less software, smaller attack surface.
- **Scanning images** for vulnerabilities before deployment.
- Never running containers as **root** unnecessarily.
- Protecting the **orchestrator** (Kubernetes) and its secrets.

> **Field note:** Misconfigured cloud storage and leaked secrets are two of the most common real-world breach causes. Automate the checks for both.`,
        questions: [
          {
            prompt: "What is the recommended way to handle API keys and passwords in applications?",
            options: [
              "Hardcode them in the source code for convenience",
              "Store them in a secrets manager and inject at runtime",
              "Email them to the team",
              "Put them in a public README",
            ],
            correctIndex: 1,
            explanation:
              "Secrets should live in a dedicated secrets manager that stores, rotates, and injects them — never hardcoded in source.",
          },
          {
            prompt:
              "Scanning Terraform definitions for insecure settings before deployment is an example of:",
            options: ["DAST", "IaC scanning", "Penetration testing", "Phishing simulation"],
            correctIndex: 1,
            explanation:
              "Infrastructure-as-code scanning catches misconfigurations (like a public bucket) in the definition before it is deployed.",
          },
          {
            prompt: "Which practice improves container security?",
            options: [
              "Always run containers as root",
              "Use large base images with many tools",
              "Use minimal trusted base images and scan them for vulnerabilities",
              "Skip image updates to maintain stability",
            ],
            correctIndex: 2,
            explanation:
              "Minimal, trusted, scanned base images reduce the attack surface and catch known vulnerabilities before deployment.",
          },
        ],
      },
      {
        title: "Cloud Security Posture",
        summary:
          "Understand the shared responsibility model and keep cloud configs secure.",
        estimatedMinutes: 12,
        objectives: [
          "Explain the shared responsibility model",
          "Identify common cloud misconfigurations",
          "Describe CSPM and CASB",
        ],
        content: `## Owning your half of the cloud

Northwind runs in the cloud. A core misunderstanding causes many breaches: assuming the cloud provider secures everything.

### The shared responsibility model
- The **provider** secures the cloud *infrastructure* — physical data centers, hypervisors, the underlying network.
- **You** secure what you put *in* the cloud — your data, identity and access configuration, OS patching (for IaaS), and application settings.

The dividing line shifts by service model (**IaaS, PaaS, SaaS**), but customer responsibility never disappears. Most cloud breaches are *customer* misconfigurations, not provider failures.

### Common cloud misconfigurations
- Publicly exposed storage buckets.
- Overly permissive IAM roles (violating least privilege).
- Disabled logging.
- Open management ports to the internet.

### Tools that help
- **CSPM** (Cloud Security Posture Management) continuously checks cloud configurations against best practices and flags drift.
- **CASB** (Cloud Access Security Broker) sits between users and cloud services to enforce policy and visibility, including for SaaS apps.
- **CWPP** protects cloud workloads (VMs, containers).

> **Field note:** Identity is the new perimeter in the cloud. Tightly scoped IAM and logging beat almost any other single control.`,
        questions: [
          {
            prompt:
              "Under the shared responsibility model, who is responsible for securing customer data and access configuration in the cloud?",
            options: [
              "Always the cloud provider",
              "The customer",
              "Nobody, it's automatic",
              "The internet service provider",
            ],
            correctIndex: 1,
            explanation:
              "The provider secures the underlying infrastructure, but the customer is always responsible for their data, identities, and configurations.",
          },
          {
            prompt: "Which is the most common cause of real-world cloud breaches?",
            options: [
              "Cloud provider data center failures",
              "Customer misconfigurations such as public buckets and over-permissive IAM",
              "Hypervisor escapes",
              "Physical theft of servers",
            ],
            correctIndex: 1,
            explanation:
              "Most cloud breaches stem from customer-side misconfigurations, not failures of the provider's infrastructure.",
          },
          {
            prompt:
              "Which tool continuously checks cloud configurations against best practices?",
            options: ["CSPM", "EDR", "WAF", "SAST"],
            correctIndex: 0,
            explanation:
              "Cloud Security Posture Management (CSPM) continuously evaluates cloud configurations and flags risky drift.",
          },
        ],
      },
    ],
  },
  {
    slug: "detection-response",
    phase: "Phase 06",
    title: "Detection & Response",
    subtitle: "SOC operations, threats & incident response",
    description:
      "Northwind's defenses are built — now operate them. Learn how attackers work, run the incident response lifecycle, and use threat intelligence to stay ahead. This is the heart of the analyst role.",
    icon: "Radar",
    accentColor: "#f87171",
    estimatedHours: 3,
    certTags: ["CySA+"],
    objectives: [
      "Map attacker behavior with the kill chain and MITRE ATT&CK",
      "Execute the incident response lifecycle",
      "Apply threat intelligence and continuous monitoring",
    ],
    scenario:
      "At 2 a.m., your SIEM fires an alert: unusual outbound traffic from a robotics workstation. This is the moment everything you've built is tested. Learn to think like an attacker, respond like a professional, and turn every incident into a lesson.",
    lessons: [
      {
        title: "Threats, Actors & the Kill Chain",
        summary:
          "Know your adversary and the stages of an attack.",
        estimatedMinutes: 13,
        objectives: [
          "Classify threat actors and their motivations",
          "Walk through the Cyber Kill Chain",
          "Introduce MITRE ATT&CK",
        ],
        content: `## Know your adversary

Effective defense starts with understanding who attacks and how.

### Threat actors
- **Script kiddies** — low skill, using others' tools.
- **Hacktivists** — driven by ideology.
- **Organized crime** — financially motivated, often behind ransomware.
- **Nation-state / APT** (Advanced Persistent Threat) — highly resourced, stealthy, persistent.
- **Insider threats** — employees or contractors, malicious or negligent.

Understanding **motivation** and **capability** helps you prioritize defenses.

### The Cyber Kill Chain
Lockheed Martin's model breaks an attack into stages:
1. **Reconnaissance** — research the target.
2. **Weaponization** — build the exploit.
3. **Delivery** — send it (phishing email).
4. **Exploitation** — trigger the vulnerability.
5. **Installation** — establish a foothold.
6. **Command & Control (C2)** — remote control.
7. **Actions on Objectives** — steal data, deploy ransomware.

Disrupting *any* stage can stop the attack — defense in depth gives you many chances.

### MITRE ATT&CK
A detailed, real-world knowledge base of attacker **tactics and techniques**. Analysts map detections to ATT&CK to understand coverage gaps and communicate precisely about adversary behavior. It's foundational to modern threat detection and CySA+.`,
        questions: [
          {
            prompt:
              "A highly resourced, stealthy, and persistent attacker, often state-sponsored, is known as:",
            options: ["Script kiddie", "Hacktivist", "APT", "Insider"],
            correctIndex: 2,
            explanation:
              "An Advanced Persistent Threat (APT) is well-funded, sophisticated, and maintains long-term stealthy access, frequently nation-state backed.",
          },
          {
            prompt:
              "In the Cyber Kill Chain, sending a phishing email to the victim occurs at which stage?",
            options: ["Reconnaissance", "Delivery", "Installation", "Actions on Objectives"],
            correctIndex: 1,
            explanation:
              "Delivery is the stage where the weaponized payload is transmitted to the target, such as via a phishing email.",
          },
          {
            prompt: "MITRE ATT&CK is best described as:",
            options: [
              "A firewall product",
              "A knowledge base of adversary tactics and techniques",
              "An encryption algorithm",
              "A compliance regulation",
            ],
            correctIndex: 1,
            explanation:
              "MITRE ATT&CK catalogs real-world attacker tactics and techniques, used to map detections and find coverage gaps.",
          },
        ],
      },
      {
        title: "The Incident Response Lifecycle",
        summary:
          "A repeatable process for handling the 2 a.m. alert without panic.",
        estimatedMinutes: 14,
        objectives: [
          "List the phases of incident response",
          "Distinguish containment strategies",
          "Explain the value of lessons learned",
        ],
        content: `## When the alert fires

Panic is the enemy. The **incident response (IR) lifecycle** (NIST 800-61) gives you a calm, repeatable process.

### The phases
1. **Preparation** — plans, tools, training, and contacts ready *before* an incident. The work you did in earlier phases.
2. **Detection & Analysis** — identify that an incident is happening and determine its scope. Your SIEM and EDR shine here.
3. **Containment** — stop the bleeding. **Short-term** containment isolates the affected host immediately; **long-term** containment applies temporary fixes while you prepare to eradicate.
4. **Eradication** — remove the threat: delete malware, close the vulnerability, reset credentials.
5. **Recovery** — restore systems to normal, validate they're clean, and monitor closely.
6. **Lessons Learned** — a post-incident review to improve. *Why* did it happen and how do we prevent it?

### Key practices
- **Preserve evidence** with proper **chain of custody** if legal action is possible.
- **Communicate** per your plan — who to notify, including legal and possibly regulators.
- **Don't tip off the attacker** before you're ready to contain.

> **Field note:** The lessons-learned phase is the one most often skipped and the most valuable. Every incident should make Northwind harder to hit next time.`,
        questions: [
          {
            prompt:
              "What is the correct order of the core incident response phases (after preparation)?",
            options: [
              "Recovery, Containment, Detection, Eradication",
              "Detection & Analysis, Containment, Eradication, Recovery",
              "Containment, Recovery, Detection, Eradication",
              "Eradication, Detection, Recovery, Containment",
            ],
            correctIndex: 1,
            explanation:
              "Following preparation: Detection & Analysis, then Containment, Eradication, Recovery, and finally Lessons Learned.",
          },
          {
            prompt:
              "Immediately isolating a compromised host from the network is an example of:",
            options: ["Eradication", "Short-term containment", "Recovery", "Preparation"],
            correctIndex: 1,
            explanation:
              "Short-term containment quickly limits damage (e.g., isolating the host) before full eradication.",
          },
          {
            prompt:
              "Why is the lessons-learned phase important?",
            options: [
              "It assigns blame to an individual",
              "It improves defenses and prevents recurrence",
              "It is required to reboot servers",
              "It deletes all the logs",
            ],
            correctIndex: 1,
            explanation:
              "The post-incident review identifies root causes and improvements so the organization is more resilient next time.",
          },
        ],
      },
      {
        title: "Threat Intelligence & Continuous Monitoring",
        summary:
          "Stay ahead of attackers with intel, hunting, and constant vigilance.",
        estimatedMinutes: 13,
        objectives: [
          "Define threat intelligence and IOCs",
          "Explain threat hunting",
          "Describe continuous monitoring",
        ],
        content: `## Staying ahead

Reactive defense isn't enough. Mature programs get proactive.

### Threat intelligence
**Threat intelligence** is evidence-based knowledge about threats used to inform decisions. Sources include commercial feeds, **OSINT** (open-source intelligence), and sharing communities like **ISACs**.

**Indicators of Compromise (IOCs)** are the artifacts intel provides — malicious IPs, file hashes, domains. Feed them into your SIEM and EDR to detect known-bad activity automatically. The **TTPs** (Tactics, Techniques, and Procedures) behind them are more durable than individual IOCs, which attackers change easily.

### Threat hunting
Rather than waiting for alerts, **threat hunting** proactively searches the environment for hidden threats based on a hypothesis ("If an attacker were here, what would I see?"). It assumes the attacker may already be inside and goes looking — a core CySA+ activity.

### Continuous monitoring
Security isn't a project that ends. **Continuous monitoring** keeps watching: log review, alerting, periodic scanning, and metrics. Combined with regular reassessment of risk, it keeps Northwind's posture from decaying as the company changes.

> **Field note:** You've now built Northwind's program end to end — inventory, network, tooling, governance, pipeline, and operations. Security is a cycle, not a finish line. Keep iterating.`,
        questions: [
          {
            prompt: "An Indicator of Compromise (IOC) is:",
            options: [
              "A company security policy",
              "An artifact like a malicious IP or file hash that signals a possible breach",
              "A type of firewall",
              "A compliance certificate",
            ],
            correctIndex: 1,
            explanation:
              "IOCs are forensic artifacts (IPs, hashes, domains) that indicate potential malicious activity and can be fed into detection tools.",
          },
          {
            prompt: "Threat hunting is best described as:",
            options: [
              "Waiting for the SIEM to generate an alert",
              "Proactively searching for hidden threats based on a hypothesis",
              "Installing antivirus",
              "Writing a security policy",
            ],
            correctIndex: 1,
            explanation:
              "Threat hunting proactively looks for adversaries already in the environment rather than waiting for automated alerts.",
          },
          {
            prompt:
              "Which is more durable and harder for an attacker to change than individual IOCs?",
            options: [
              "Their TTPs (tactics, techniques, and procedures)",
              "Their IP addresses",
              "Their file hashes",
              "Their domain names",
            ],
            correctIndex: 0,
            explanation:
              "Attackers can swap IPs, hashes, and domains easily, but their underlying TTPs are far more costly to change.",
          },
        ],
      },
    ],
  },
];

type SeedExam = {
  slug: string;
  cert: string;
  title: string;
  description: string;
  icon: string;
  accentColor: string;
  passPercentage: number;
  timeLimitMinutes: number;
  questions: SeedQuestion[];
};

const exams: SeedExam[] = [
  {
    slug: "security-plus-practice",
    cert: "Security+",
    title: "CompTIA Security+ Practice Exam",
    description:
      "A timed practice exam covering the Security+ domains: general security concepts, threats and vulnerabilities, architecture, operations, and governance. Aim for the passing bar before sitting the real SY0-701.",
    icon: "ShieldCheck",
    accentColor: "#22d3ee",
    passPercentage: 75,
    timeLimitMinutes: 20,
    questions: [
      {
        prompt:
          "Which control type is a security guard at a building entrance?",
        options: ["Technical", "Managerial", "Physical", "Operational"],
        correctIndex: 2,
        explanation:
          "A security guard is a physical control. Technical controls are technology-based; managerial controls are policies and oversight.",
      },
      {
        prompt:
          "A user receives an email appearing to be from the CEO urgently requesting a wire transfer. This is an example of:",
        options: ["Whaling/BEC", "Smishing", "Tailgating", "A watering hole attack"],
        correctIndex: 0,
        explanation:
          "Impersonating an executive to drive a fraudulent action is whaling / business email compromise (BEC), a targeted form of phishing.",
      },
      {
        prompt:
          "Which encryption approach uses the same key to encrypt and decrypt?",
        options: ["Asymmetric", "Symmetric", "Hashing", "Steganography"],
        correctIndex: 1,
        explanation:
          "Symmetric encryption uses a single shared key (e.g., AES). Asymmetric uses a public/private key pair.",
      },
      {
        prompt:
          "A company wants to ensure a downloaded file has not been altered. Which technique verifies integrity?",
        options: ["Encryption", "Hashing", "Compression", "Tokenization"],
        correctIndex: 1,
        explanation:
          "A cryptographic hash (e.g., SHA-256) verifies integrity: any change to the file changes the hash.",
      },
      {
        prompt: "Which is an example of something you ARE (a biometric factor)?",
        options: ["A smart card", "A password", "A fingerprint", "A one-time code"],
        correctIndex: 2,
        explanation:
          "A fingerprint is an inherence factor (something you are). Smart cards are possession; passwords and OTP codes are knowledge/possession respectively.",
      },
      {
        prompt:
          "What does a digital certificate primarily bind a public key to?",
        options: ["A password", "An identity", "An IP address", "A firewall rule"],
        correctIndex: 1,
        explanation:
          "A digital certificate binds a public key to an identity and is issued/signed by a trusted Certificate Authority (CA).",
      },
      {
        prompt:
          "Separating duties so no single person can complete a sensitive transaction alone is:",
        options: ["Least privilege", "Separation of duties", "Job rotation", "Mandatory vacation"],
        correctIndex: 1,
        explanation:
          "Separation of duties splits critical tasks among multiple people to prevent fraud and error.",
      },
      {
        prompt: "Which attack floods a service to deny availability to legitimate users?",
        options: ["Phishing", "DDoS", "SQL injection", "Privilege escalation"],
        correctIndex: 1,
        explanation:
          "A Distributed Denial of Service (DDoS) attack overwhelms a target with traffic to make it unavailable.",
      },
      {
        prompt:
          "A backup strategy keeps three copies of data on two media types with one off-site. This is the:",
        options: ["RAID 5 rule", "3-2-1 rule", "AAA model", "CIA triad"],
        correctIndex: 1,
        explanation:
          "The 3-2-1 backup rule: three copies, on two different media, with one stored off-site.",
      },
      {
        prompt:
          "Which document defines acceptable use, response times, and penalties between a provider and customer?",
        options: ["MOU", "SLA", "NDA", "BPA"],
        correctIndex: 1,
        explanation:
          "A Service Level Agreement (SLA) defines expected service levels and remedies between a provider and a customer.",
      },
      {
        prompt:
          "An attacker intercepts and possibly alters traffic between two parties. This is a:",
        options: ["Replay attack", "On-path (man-in-the-middle) attack", "Brute-force attack", "Birthday attack"],
        correctIndex: 1,
        explanation:
          "An on-path (formerly man-in-the-middle) attack places the attacker between two communicating parties to intercept or modify traffic.",
      },
      {
        prompt:
          "Which is the BEST defense against password-guessing brute-force attacks on accounts?",
        options: [
          "Account lockout and MFA",
          "Disabling the firewall",
          "Allowing unlimited login attempts",
          "Using shorter passwords",
        ],
        correctIndex: 0,
        explanation:
          "Account lockout thresholds plus multifactor authentication strongly mitigate brute-force credential attacks.",
      },
    ],
  },
  {
    slug: "cysa-plus-practice",
    cert: "CySA+",
    title: "CompTIA CySA+ Practice Exam",
    description:
      "A timed practice exam focused on the analyst skill set: security operations, vulnerability management, incident response, and reporting. Built to mirror the CS0-003 emphasis on detection and analysis.",
    icon: "Radar",
    accentColor: "#f87171",
    passPercentage: 75,
    timeLimitMinutes: 20,
    questions: [
      {
        prompt:
          "An analyst reviewing logs sees many failed logins followed by one success from a foreign IP, then large data transfers. This pattern most likely indicates:",
        options: [
          "Normal user behavior",
          "A compromised account / account takeover",
          "A scheduled backup",
          "A software update",
        ],
        correctIndex: 1,
        explanation:
          "A brute-force/credential-stuffing success followed by data exfiltration is a classic account-takeover pattern that warrants investigation.",
      },
      {
        prompt: "When prioritizing vulnerabilities, which factor adds the MOST context to a raw CVSS score?",
        options: [
          "The color of the report",
          "Asset exposure and business criticality",
          "The scanner vendor's name",
          "The file size of the scan",
        ],
        correctIndex: 1,
        explanation:
          "CVSS gives base severity, but exposure (internet-facing?) and asset criticality determine real risk and remediation priority.",
      },
      {
        prompt:
          "A vulnerability scan flags an issue that does not actually exist on the host. This is a:",
        options: ["False negative", "False positive", "True positive", "Zero-day"],
        correctIndex: 1,
        explanation:
          "A false positive is a finding reported by the scanner that is not actually present; analysts must validate findings.",
      },
      {
        prompt:
          "Which framework maps adversary tactics and techniques to help analysts identify detection gaps?",
        options: ["PCI DSS", "MITRE ATT&CK", "COBIT", "ITIL"],
        correctIndex: 1,
        explanation:
          "MITRE ATT&CK catalogs real-world tactics and techniques, letting analysts measure detection coverage and gaps.",
      },
      {
        prompt:
          "During incident response, isolating an affected host to stop spread is part of which phase?",
        options: ["Preparation", "Containment", "Recovery", "Lessons learned"],
        correctIndex: 1,
        explanation:
          "Containment limits the scope and spread of an incident, for example by isolating affected systems.",
      },
      {
        prompt:
          "Proactively searching the environment for undetected threats based on a hypothesis is called:",
        options: ["Patch management", "Threat hunting", "Penetration testing", "Log rotation"],
        correctIndex: 1,
        explanation:
          "Threat hunting is the proactive, hypothesis-driven search for adversaries that automated tools may have missed.",
      },
      {
        prompt:
          "Which log source would BEST help an analyst investigate suspicious process execution on a workstation?",
        options: ["Firewall logs", "EDR / endpoint telemetry", "DNS server uptime", "Printer logs"],
        correctIndex: 1,
        explanation:
          "EDR/endpoint telemetry captures process creation, command lines, and parent-child relationships needed to investigate execution.",
      },
      {
        prompt:
          "A SIEM rule generates hundreds of low-value alerts daily, causing analysts to miss real ones. The best response is to:",
        options: [
          "Disable the SIEM",
          "Tune the rule to reduce false positives",
          "Ignore all alerts",
          "Increase the alert volume",
        ],
        correctIndex: 1,
        explanation:
          "Tuning detection rules to the environment reduces false positives and combats alert fatigue without losing visibility.",
      },
      {
        prompt:
          "Artifacts like malicious IPs, domains, and file hashes used to detect known threats are called:",
        options: ["IOCs", "SLAs", "TTLs", "ACLs"],
        correctIndex: 0,
        explanation:
          "Indicators of Compromise (IOCs) are forensic artifacts fed into detection tooling to spot known malicious activity.",
      },
      {
        prompt:
          "To preserve evidence for possible prosecution, an analyst must maintain:",
        options: ["Chain of custody", "A risk register", "An SLA", "A change ticket"],
        correctIndex: 0,
        explanation:
          "Chain of custody documents who handled evidence and when, preserving its integrity and admissibility.",
      },
      {
        prompt:
          "Which type of vulnerability scan provides the most accurate results about installed patches?",
        options: [
          "Non-credentialed external scan",
          "Credentialed scan",
          "Ping sweep",
          "Banner grab only",
        ],
        correctIndex: 1,
        explanation:
          "Credentialed scans authenticate to the host and can accurately read installed software, patches, and configurations.",
      },
      {
        prompt:
          "An analyst wants to share threat data with peers in the same industry. The BEST channel is:",
        options: ["A public social media post", "An ISAC", "An anonymous forum", "A personal blog"],
        correctIndex: 1,
        explanation:
          "Information Sharing and Analysis Centers (ISACs) enable trusted, industry-specific sharing of threat intelligence.",
      },
    ],
  },
];

async function seed(): Promise<void> {
  console.log("Clearing existing data...");
  await db.execute(
    sql`TRUNCATE TABLE
      ${attemptsTable},
      ${lessonProgressTable},
      ${questionsTable},
      ${lessonsTable},
      ${examQuestionsTable},
      ${examsTable},
      ${modulesTable}
    RESTART IDENTITY CASCADE`,
  );

  let moduleOrder = 1;
  for (const m of modules) {
    const [insertedModule] = await db
      .insert(modulesTable)
      .values({
        slug: m.slug,
        order: moduleOrder++,
        phase: m.phase,
        title: m.title,
        subtitle: m.subtitle,
        description: m.description,
        icon: m.icon,
        accentColor: m.accentColor,
        estimatedHours: m.estimatedHours,
        certTags: m.certTags,
        objectives: m.objectives,
        scenario: m.scenario,
      })
      .returning();

    let lessonOrder = 1;
    for (const l of m.lessons) {
      const [insertedLesson] = await db
        .insert(lessonsTable)
        .values({
          moduleId: insertedModule.id,
          order: lessonOrder++,
          title: l.title,
          summary: l.summary,
          content: l.content,
          estimatedMinutes: l.estimatedMinutes,
          objectives: l.objectives,
        })
        .returning();

      let qOrder = 1;
      for (const q of l.questions) {
        await db.insert(questionsTable).values({
          lessonId: insertedLesson.id,
          order: qOrder++,
          prompt: q.prompt,
          options: q.options,
          correctIndex: q.correctIndex,
          explanation: q.explanation,
        });
      }
    }
  }

  for (const e of exams) {
    const [insertedExam] = await db
      .insert(examsTable)
      .values({
        slug: e.slug,
        cert: e.cert,
        title: e.title,
        description: e.description,
        icon: e.icon,
        accentColor: e.accentColor,
        passPercentage: e.passPercentage,
        timeLimitMinutes: e.timeLimitMinutes,
      })
      .returning();

    let qOrder = 1;
    for (const q of e.questions) {
      await db.insert(examQuestionsTable).values({
        examId: insertedExam.id,
        order: qOrder++,
        prompt: q.prompt,
        options: q.options,
        correctIndex: q.correctIndex,
        explanation: q.explanation,
      });
    }
  }

  console.log("Seed complete.");
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
