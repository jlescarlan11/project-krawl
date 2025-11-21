# TASK-018 Solution Design: Set up Oracle Cloud Infrastructure Account (Always Free Tier)

## Document Metadata

**Task ID:** TASK-018  
**Task Name:** Set up Oracle Cloud Infrastructure account (Always Free Tier)  
**Priority:** Critical  
**Epic:** epic:project-setup  
**Phase:** Phase 1: Foundation  
**Week:** Week 1  
**Estimated Effort:** 1 day  
**Status:** Ready for Implementation  
**Design Date:** 2025-11-16  
**Designer:** Senior Software Architect

---

## Executive Summary

This document provides a comprehensive solution design for TASK-018: Setting up an Oracle Cloud Infrastructure (OCI) account using the Always Free Tier to host the backend application. The solution follows established patterns from similar infrastructure setup tasks and ensures secure credential management, proper network configuration, and comprehensive documentation.

**Key Deliverables:**
- OCI account created and verified
- Always Free Tier resources verified and documented
- Network configuration documented
- SSH keys generated and stored securely
- Access credentials stored securely
- Comprehensive setup documentation created
- Account settings reviewed

**Note:** Full compute instance setup and deployment will be completed in TASK-238 (Week 15). This task focuses on account creation, verification, and initial configuration.

---

## Table of Contents

1. [Architecture/Design](#architecturedesign)
2. [Implementation Plan](#implementation-plan)
3. [Technical Specifications](#technical-specifications)
4. [Edge Case Handling](#edge-case-handling)
5. [Testing Strategy](#testing-strategy)
6. [Security Considerations](#security-considerations)
7. [Documentation Updates](#documentation-updates)
8. [Acceptance Criteria Verification](#acceptance-criteria-verification)

---

## Architecture/Design

### High-Level Approach

The solution follows an **infrastructure account setup pattern** and consists of:

1. **Account Creation** - Manual process via OCI web interface
2. **Always Free Tier Verification** - Verify available resources and limits
3. **Network Configuration** - Review and document default VCN setup
4. **SSH Key Generation** - Create SSH keys for future instance access
5. **Credential Management** - Store OCI credentials securely
6. **Documentation** - Create comprehensive setup guide and update project documentation

### Design Patterns

#### 1. **Security-First Approach**
- Credentials stored in secure password manager (never committed to repository)
- SSH keys generated with strong encryption (RSA 4096 or Ed25519)
- Private keys protected with passphrases
- Network security configured with least privilege

#### 2. **Infrastructure as Documentation**
- All configurations documented in setup guide
- Network topology documented
- Security rules documented
- Credential locations documented (without values)

#### 3. **Separation of Concerns**
- Account setup (TASK-018) - Account creation and verification
- Instance setup (TASK-238) - Compute instance creation and configuration
- Deployment (TASK-241) - Application deployment to instance

### Component Structure

```
TASK-018 Implementation
│
├── Account Setup (Manual)
│   ├── OCI Account Creation
│   │   ├── Navigate to cloud.oracle.com
│   │   ├── Sign up for Always Free Tier
│   │   ├── Complete account verification
│   │   └── Email verification
│   │
│   └── Account Verification
│       ├── Verify account status
│       ├── Verify Always Free Tier eligibility
│       └── Review account settings
│
├── Resource Verification
│   ├── Always Free Tier Resources
│   │   ├── Compute instances (1/8 OCPU, 1 GB memory)
│   │   ├── Object storage (10 GB)
│   │   ├── Outbound data transfer (10 TB/month)
│   │   └── Autonomous Database (2 instances, 20 GB each)
│   │
│   └── Region Selection
│       ├── Research region availability
│       ├── Select appropriate region (Singapore recommended)
│       └── Verify Always Free Tier availability
│
├── Network Configuration
│   ├── Virtual Cloud Network (VCN)
│   │   ├── Use default VCN initially
│   │   ├── Review default security lists
│   │   └── Document network configuration
│   │
│   └── Security Lists
│       ├── Review default ingress rules
│       ├── Document security rules
│       └── Plan for future configuration
│
├── SSH Key Management
│   ├── Key Generation
│   │   ├── Generate SSH key pair (RSA 4096 or Ed25519)
│   │   ├── Protect private key with passphrase
│   │   └── Store keys securely
│   │
│   └── Key Storage
│       ├── Private key: Secure password manager
│       ├── Public key: Ready for instance configuration
│       └── Never commit keys to repository
│
├── Credential Management
│   ├── OCI Credentials
│   │   ├── User OCID
│   │   ├── Tenancy OCID
│   │   ├── API keys (if needed)
│   │   └── Compartment OCID
│   │
│   └── Storage
│       ├── Secure password manager
│       ├── Document credential locations (without values)
│       └── Never commit to repository
│
└── Documentation
    ├── OCI_SETUP.md (comprehensive guide)
    ├── README.md update
    └── Task tracking update
```

### Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│              OCI Account Setup Process                       │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  Step 1: Account Creation                                    │
│  - Navigate to cloud.oracle.com                              │
│  - Sign up for Always Free Tier account                      │
│  - Complete account verification (may require credit card)  │
│  - Verify email address                                      │
│  - Wait for account activation (24-48 hours)                │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  Step 2: Always Free Tier Verification                       │
│  - Access OCI console                                        │
│  - Navigate to "Always Free Resources"                       │
│  - Verify compute instance availability                      │
│  - Verify object storage availability                        │
│  - Verify network resources                                  │
│  - Document resource limits                                  │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  Step 3: Region Selection                                     │
│  - Research region availability                              │
│  - Select region (Singapore recommended)                    │
│  - Verify Always Free Tier availability in region            │
│  - Set region as default                                     │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  Step 4: Network Configuration Review                        │
│  - Access VCN configuration                                  │
│  - Review default VCN                                        │
│  - Review default security lists                             │
│  - Document network topology                                 │
│  - Plan for future security rules                           │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  Step 5: SSH Key Generation                                   │
│  - Generate SSH key pair (RSA 4096 or Ed25519)              │
│  - Protect private key with passphrase                      │
│  - Store private key securely                                │
│  - Prepare public key for instance configuration             │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  Step 6: Credential Storage                                   │
│  - Collect OCI credentials (OCIDs, etc.)                    │
│  - Store in secure password manager                         │
│  - Document credential locations (without values)          │
│  - Verify credentials not in repository                     │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  Step 7: Documentation                                        │
│  - Create OCI_SETUP.md                                       │
│  - Update README.md                                          │
│  - Update task tracking                                      │
└─────────────────────────────────────────────────────────────┘
```

### Integration Points

#### With Deployment Guide (TASK-238)
- **Account Setup (TASK-018)** enables production deployment
- **Instance Creation (TASK-238)** will use account created in TASK-018
- **Network Configuration** will be finalized in TASK-238
- **Security Rules** will be configured in TASK-238

#### With Backend Deployment (TASK-241)
- **Compute Instance** will be created in TASK-238
- **Application Deployment** will use OCI account and instance
- **Environment Variables** will be configured on instance
- **Systemd Service** will be set up for Spring Boot application

#### With Other Services
- **Aiven PostgreSQL (TASK-012):** Backend will connect from OCI instance
- **Sentry (TASK-017):** Backend will send errors from OCI instance
- **Cloudinary (TASK-014):** Backend will upload images from OCI instance
- **Brevo (TASK-015):** Backend will send emails from OCI instance
- **Mapbox (TASK-016):** Backend will call APIs from OCI instance

---

## Implementation Plan

### Step-by-Step Breakdown

#### **Step 1: Account Creation** (30-60 minutes + 24-48 hour wait)

**Actions:**

**1.1 Navigate to Oracle Cloud**
1. Open web browser
2. Navigate to https://cloud.oracle.com/
3. Click "Start for Free" or "Sign Up"

**1.2 Account Registration**
1. Enter account information:
   - **Email address:** Use project email or personal email
   - **Password:** Create strong password (minimum 12 characters)
   - **Country/Region:** Select Philippines or appropriate region
2. Accept terms of service and privacy policy
3. Click "Create Account"

**1.3 Email Verification**
1. Check email inbox for verification email
2. Click verification link in email
3. Complete email verification process
4. **If email doesn't arrive:**
   - Check spam/junk folder
   - Wait 5-10 minutes
   - Request resend verification email
   - Verify email address is correct

**1.4 Account Verification (May Require Credit Card)**
1. Complete account verification form:
   - **Personal Information:** Name, address, phone number
   - **Payment Method:** Credit card may be required (not charged)
   - **Purpose:** Select "Education" or "Personal Project"
2. Submit verification form
3. **Wait for verification:** May take 24-48 hours
4. Check email for verification status updates

**1.5 Account Activation**
1. Log into OCI console: https://cloud.oracle.com/
2. Verify account status shows "Active" or "Verified"
3. Complete any additional setup steps if prompted

**Deliverables:**
- ✅ OCI account created
- ✅ Email verified
- ✅ Account verification submitted
- ✅ Account status confirmed as "Active"

**Verification:**
- Can log into OCI console
- Account status shows "Active" or "Verified"
- No account restrictions or warnings

**Estimated Time:** 30-60 minutes active work + 24-48 hours wait for verification

---

#### **Step 2: Always Free Tier Verification** (15 minutes)

**Actions:**

**2.1 Access Always Free Resources**
1. Log into OCI console
2. Navigate to "Menu" → "Governance & Administration" → "Account Management"
3. Click "Always Free Resources" or navigate to "Billing & Cost Management" → "Always Free Resources"

**2.2 Verify Compute Resources**
1. Check compute instance availability:
   - ✅ **Shape:** VM.Standard.E2.1.Micro (Always Free)
   - ✅ **CPU:** 1/8 OCPU
   - ✅ **Memory:** 1 GB RAM
   - ✅ **Availability:** Available in selected region
2. Document compute resource limits

**2.3 Verify Storage Resources**
1. Check object storage availability:
   - ✅ **Object Storage:** 10 GB
   - ✅ **Block Storage:** Included with compute instance
2. Document storage resource limits

**2.4 Verify Network Resources**
1. Check network resource availability:
   - ✅ **Outbound Data Transfer:** 10 TB per month
   - ✅ **Load Balancer:** 1 instance, 10 Mbps (Always Free)
2. Document network resource limits

**2.5 Verify Database Resources (Optional)**
1. Check autonomous database availability:
   - ✅ **Autonomous Database:** 2 instances available
   - ✅ **Storage:** 20 GB each (40 GB total)
   - **Note:** We're using Aiven PostgreSQL, so this is optional

**2.6 Document Resource Limits**
1. Create notes document with:
   - Resource types and limits
   - Region availability
   - Usage tracking recommendations
   - Resource reclamation policies

**Deliverables:**
- ✅ Always Free Tier resources verified
- ✅ Resource limits documented
- ✅ Region availability confirmed

**Verification:**
- All Always Free Tier resources show as available
- Resource limits match expected values
- No resource restrictions or warnings

---

#### **Step 3: Region Selection** (10 minutes)

**Actions:**

**3.1 Research Region Availability**
1. Review OCI region documentation
2. Identify regions closest to Philippines (Cebu City):
   - **Singapore (ap-singapore-1):** Recommended (closest)
   - **Tokyo (ap-tokyo-1):** Alternative option
   - **Seoul (ap-seoul-1):** Alternative option
3. Check Always Free Tier availability in each region

**3.2 Select Region**
1. **Recommended:** Singapore (ap-singapore-1)
   - Closest to Philippines
   - Lower latency for Cebu City users
   - Good Always Free Tier availability
2. Set selected region as default in OCI console
3. Verify region selection in account settings

**3.3 Verify Region Availability**
1. Navigate to "Always Free Resources" in selected region
2. Verify all resources are available in region
3. Document region selection and rationale

**Deliverables:**
- ✅ Region selected (Singapore recommended)
- ✅ Region availability verified
- ✅ Region set as default

**Verification:**
- Region selected and set as default
- All Always Free Tier resources available in region
- No region-specific restrictions

---

#### **Step 4: Network Configuration Review** (20 minutes)

**Actions:**

**4.1 Access VCN Configuration**
1. Log into OCI console
2. Navigate to "Networking" → "Virtual Cloud Networks"
3. Review default VCN (created automatically):
   - **VCN Name:** Default VCN
   - **CIDR Block:** Usually 10.0.0.0/16
   - **Subnets:** Default public subnet
   - **Internet Gateway:** Default gateway

**4.2 Review Security Lists**
1. Navigate to "Networking" → "Security Lists"
2. Review default security list:
   - **Ingress Rules:** Default rules for SSH (port 22) and ICMP
   - **Egress Rules:** Default allow-all rule
3. Document current security rules

**4.3 Plan Future Security Rules**
1. Document planned security rules for TASK-238:
   - **SSH (Port 22):** Restrict to specific IPs if possible
   - **Spring Boot API (Port 8080):** Allow from 0.0.0.0/0 (public access)
   - **HTTPS (Port 443):** Allow from 0.0.0.0/0 (if using load balancer)
2. Note: Full security rule configuration will be done in TASK-238

**4.4 Document Network Configuration**
1. Create network configuration notes:
   - VCN details (name, CIDR, subnets)
   - Security list rules
   - Internet gateway configuration
   - Planned security rules for production

**Deliverables:**
- ✅ Network configuration reviewed
- ✅ Security lists reviewed
- ✅ Network topology documented
- ✅ Future security rules planned

**Verification:**
- Default VCN exists and is configured
- Security lists are accessible
- Network configuration is documented

---

#### **Step 5: SSH Key Generation** (15 minutes)

**Actions:**

**5.1 Generate SSH Key Pair**
1. Open terminal/command prompt
2. Navigate to secure directory (e.g., `~/.ssh/` or `C:\Users\YourName\.ssh\`)
3. Generate SSH key pair:

   **Option A: Ed25519 (Recommended - More Secure)**
   ```bash
   # Linux/Mac
   ssh-keygen -t ed25519 -C "krawl-oci-instance" -f ~/.ssh/krawl_oci_key
   
   # Windows PowerShell (using OpenSSH)
   ssh-keygen -t ed25519 -C "krawl-oci-instance" -f $env:USERPROFILE\.ssh\krawl_oci_key
   ```

   **Option B: RSA 4096 (Alternative)**
   ```bash
   # Linux/Mac
   ssh-keygen -t rsa -b 4096 -C "krawl-oci-instance" -f ~/.ssh/krawl_oci_key
   
   # Windows PowerShell
   ssh-keygen -t rsa -b 4096 -C "krawl-oci-instance" -f $env:USERPROFILE\.ssh\krawl_oci_key
   ```

4. **When prompted for passphrase:**
   - Enter strong passphrase (recommended)
   - Confirm passphrase
   - **Note:** Passphrase protects private key if compromised

**5.2 Verify Key Generation**
1. Verify keys were created:
   ```bash
   # Linux/Mac
   ls -la ~/.ssh/krawl_oci_key*
   
   # Windows PowerShell
   Get-ChildItem $env:USERPROFILE\.ssh\krawl_oci_key*
   ```
2. Expected files:
   - `krawl_oci_key` (private key)
   - `krawl_oci_key.pub` (public key)

**5.3 Store Keys Securely**
1. **Private Key (`krawl_oci_key`):**
   - Store in secure password manager
   - Never commit to repository
   - Set restrictive file permissions (600):
     ```bash
     # Linux/Mac
     chmod 600 ~/.ssh/krawl_oci_key
     ```

2. **Public Key (`krawl_oci_key.pub`):**
   - Copy public key content
   - Store in secure password manager
   - Ready for instance configuration in TASK-238
   - Can be safely shared (public key)

**5.4 Document Key Information**
1. Document key details:
   - Key type (Ed25519 or RSA 4096)
   - Key location (private key path)
   - Key purpose (OCI instance access)
   - Passphrase status (if protected)

**Deliverables:**
- ✅ SSH key pair generated
- ✅ Private key stored securely
- ✅ Public key ready for instance configuration
- ✅ Key information documented

**Verification:**
- SSH keys exist in secure location
- Private key has restrictive permissions (600)
- Public key can be copied for instance configuration
- Keys are not in repository

---

#### **Step 6: Credential Collection and Storage** (15 minutes)

**Actions:**

**6.1 Collect OCI Credentials**
1. Log into OCI console
2. Navigate to "Profile" → "User Settings"
3. Collect the following credentials:

   **User OCID:**
   - Navigate to "Profile" → "User Settings"
   - Copy "OCID" (Oracle Cloud Identifier)
   - Format: `ocid1.user.oc1..aaaaaaa...`

   **Tenancy OCID:**
   - Navigate to "Administration" → "Tenancy Details"
   - Copy "OCID"
   - Format: `ocid1.tenancy.oc1..aaaaaaa...`

   **Compartment OCID (Default):**
   - Navigate to "Identity" → "Compartments"
   - Find root compartment
   - Copy "OCID"
   - Format: `ocid1.compartment.oc1..aaaaaaa...`

   **Region:**
   - Note selected region (e.g., `ap-singapore-1`)

**6.2 Store Credentials Securely**
1. **Use Secure Password Manager:**
   - Store all OCIDs in password manager
   - Create entry: "Krawl OCI Account"
   - Include all collected credentials

2. **Document Credential Locations:**
   - Create notes document (without actual values)
   - Document where each credential is stored
   - Note credential purposes

**6.3 Verify Credential Security**
1. Check `.gitignore` includes credential files:
   ```bash
   # Verify .gitignore includes:
   *.key
   *.pem
   credentials.txt
   oci-credentials.txt
   ```
2. Verify credentials are not in repository:
   ```bash
   git status
   # Should NOT show credential files
   ```
3. Verify no credentials in code or documentation:
   - Search repository for OCID patterns
   - Ensure no actual credentials in documentation

**Deliverables:**
- ✅ OCI credentials collected
- ✅ Credentials stored securely
- ✅ Credential locations documented (without values)
- ✅ Security verified

**Verification:**
- All credentials stored in secure password manager
- No credentials in repository
- Credential locations documented

---

#### **Step 7: Documentation** (2-3 hours)

**Actions:**

**7.1 Create OCI Setup Guide**
1. Create `docs/private-docs/operations/OCI_SETUP.md`
2. Follow structure from `MAPBOX_SETUP.md` and `SENTRY_SETUP.md`
3. Include sections:
   - Overview and specifications
   - Prerequisites
   - Step-by-step account creation
   - Always Free Tier verification
   - Region selection guide
   - Network configuration
   - SSH key setup
   - Credential management
   - Security best practices
   - Troubleshooting
   - Security checklist
   - Next steps (TASK-238)

**7.2 Update README.md**
1. Open `README.md`
2. Find "Set up service accounts" section (around line 263)
3. Update OCI status:
   ```markdown
   - [x] Set up Oracle Cloud Infrastructure account ✅ (see [OCI_SETUP.md](./docs/private-docs/operations/OCI_SETUP.md))
   ```
4. Save file

**7.3 Update Task Tracking**
1. Update project management tool (if used)
2. Mark TASK-018 as complete
3. Add completion notes:
   - Account created: [Date]
   - Always Free Tier verified: [Date]
   - Region selected: [Region name]
   - SSH keys generated: [Date]
   - Documentation created: [Date]

**Deliverables:**
- ✅ OCI_SETUP.md created
- ✅ README.md updated
- ✅ Task tracking updated

**Verification:**
- Documentation is accurate and complete
- All cross-references work
- Task marked as complete

---

### Files to Create

1. **`docs/private-docs/operations/OCI_SETUP.md`** (New)
   - **Purpose:** Comprehensive step-by-step setup guide for OCI account
   - **Pattern:** Follow `MAPBOX_SETUP.md` and `SENTRY_SETUP.md` structure
   - **Content:**
     - Overview and OCI Always Free Tier specifications
     - Prerequisites
     - Account creation instructions
     - Always Free Tier verification steps
     - Region selection guide
     - Network configuration review
     - SSH key generation and management
     - Credential collection and storage
     - Security best practices
     - Usage monitoring
     - Troubleshooting section
     - Security checklist
     - Next steps (references to TASK-238)

2. **`docs/private-docs/tasks/TASK-018_SOLUTION_DESIGN.md`** (This document)
   - **Purpose:** Solution design document for TASK-018
   - **Content:** Architecture, implementation plan, technical specifications

### Files to Modify

1. **`README.md`**
   - **Change:** Update service account checklist
   - **Section:** "Set up service accounts" (~line 270)
   - **Before:** `- [ ] Set up Oracle Cloud Infrastructure account`
   - **After:** `- [x] Set up Oracle Cloud Infrastructure account ✅ (see [OCI_SETUP.md](./docs/private-docs/operations/OCI_SETUP.md))`

### Files Already Configured (No Changes Needed)

- ✅ `.gitignore` - Already excludes credential files and SSH keys
- ✅ `docs/private-docs/technical/DEPLOYMENT_GUIDE.md` - Already references OCI
- ✅ `docs/private-docs/operations/BUDGET_AND_RESOURCE_PLAN.md` - Already has OCI specifications

### Dependencies to Add

**None required.** OCI account setup is infrastructure configuration only. Future tasks will use the account:
- **TASK-238:** Production environment setup (Week 15)
- **TASK-241:** Backend deployment to OCI (Week 15)

---

## Technical Specifications

### OCI Always Free Tier Resources

#### Compute Resources
- **Shape:** VM.Standard.E2.1.Micro (Always Free)
- **CPU:** 1/8 OCPU (0.125 vCPU)
- **Memory:** 1 GB RAM
- **Storage:** Block storage included
- **Note:** Resources may be reclaimed if idle for extended periods (typically 7 days)

#### Storage Resources
- **Object Storage:** 10 GB
- **Block Storage:** Included with compute instance
- **Total Storage:** 10 GB object + block storage

#### Network Resources
- **Outbound Data Transfer:** 10 TB per month
- **Load Balancer:** 1 instance, 10 Mbps (Always Free)
- **VCN:** Default VCN included
- **Internet Gateway:** Default gateway included

#### Database Resources (Alternative - Not Used)
- **Autonomous Database:** 2 instances available
- **Storage:** 20 GB each (40 GB total)
- **Note:** We're using Aiven PostgreSQL, so these are optional

### Region Specifications

#### Recommended Region: Singapore (ap-singapore-1)
- **Location:** Singapore
- **Proximity to Philippines:** Closest OCI region to Cebu City
- **Latency:** Lowest latency for Philippine users
- **Always Free Tier:** Available
- **Data Residency:** Asia-Pacific

#### Alternative Regions
- **Tokyo (ap-tokyo-1):** Good alternative, slightly higher latency
- **Seoul (ap-seoul-1):** Alternative option, higher latency

### Network Configuration

#### Default VCN Configuration
- **VCN Name:** Default VCN (or custom name)
- **CIDR Block:** Usually 10.0.0.0/16
- **Subnets:** Default public subnet (10.0.0.0/24)
- **Internet Gateway:** Default gateway attached
- **Route Tables:** Default route table with internet gateway route

#### Default Security List Rules

**Ingress Rules:**
- **SSH (Port 22):** Allow from 0.0.0.0/0 (will be restricted in TASK-238)
- **ICMP:** Allow from 0.0.0.0/0 (for ping)

**Egress Rules:**
- **All Traffic:** Allow to 0.0.0.0/0

**Planned Security Rules (TASK-238):**
- **SSH (Port 22):** Restrict to specific IPs if possible
- **Spring Boot API (Port 8080):** Allow from 0.0.0.0/0
- **HTTPS (Port 443):** Allow from 0.0.0.0/0 (if using load balancer)

### SSH Key Specifications

#### Key Type Options

**Option 1: Ed25519 (Recommended)**
- **Algorithm:** Ed25519
- **Key Size:** 256 bits (equivalent to RSA 3072)
- **Security:** Stronger and faster than RSA
- **Command:**
  ```bash
  ssh-keygen -t ed25519 -C "krawl-oci-instance" -f ~/.ssh/krawl_oci_key
  ```

**Option 2: RSA 4096 (Alternative)**
- **Algorithm:** RSA
- **Key Size:** 4096 bits
- **Security:** Strong, widely supported
- **Command:**
  ```bash
  ssh-keygen -t rsa -b 4096 -C "krawl-oci-instance" -f ~/.ssh/krawl_oci_key
  ```

#### Key Storage
- **Private Key:** `~/.ssh/krawl_oci_key` (Linux/Mac) or `C:\Users\YourName\.ssh\krawl_oci_key` (Windows)
- **Public Key:** `~/.ssh/krawl_oci_key.pub` (Linux/Mac) or `C:\Users\YourName\.ssh\krawl_oci_key.pub` (Windows)
- **File Permissions:** 600 (private key), 644 (public key)
- **Passphrase:** Recommended for additional security

### Credential Specifications

#### Required Credentials

**User OCID:**
- **Format:** `ocid1.user.oc1..aaaaaaa...`
- **Location:** Profile → User Settings → OCID
- **Purpose:** User identification

**Tenancy OCID:**
- **Format:** `ocid1.tenancy.oc1..aaaaaaa...`
- **Location:** Administration → Tenancy Details → OCID
- **Purpose:** Tenancy identification

**Compartment OCID:**
- **Format:** `ocid1.compartment.oc1..aaaaaaa...`
- **Location:** Identity → Compartments → Root Compartment → OCID
- **Purpose:** Resource organization

**Region:**
- **Format:** `ap-singapore-1` (or selected region)
- **Location:** Account settings
- **Purpose:** Resource location

#### Credential Storage
- **Storage Method:** Secure password manager
- **Entry Name:** "Krawl OCI Account"
- **Security:** Never commit to repository
- **Documentation:** Document locations without values

---

## Edge Case Handling

### Edge Case 1: Account Verification Requires Credit Card

**Scenario:** OCI requires credit card for account verification (not charged)

**Handling:**
1. **Preparation:**
   - Prepare credit card information in advance
   - Understand that card is for verification only (not charged)
   - Have alternative payment method ready if needed

2. **During Verification:**
   - Enter credit card information when prompted
   - Verify card is not charged (check statement)
   - Complete verification process

3. **Documentation:**
   - Document verification requirement in setup guide
   - Note that card is not charged
   - Provide guidance for users without credit card

**Mitigation:**
- Prepare credit card information before starting
- Understand verification is standard practice
- Verify no charges on card after verification

---

### Edge Case 2: Region Availability Limited

**Scenario:** Always Free Tier not available in preferred region

**Handling:**
1. **Research:**
   - Check Always Free Tier availability by region before selection
   - Have backup region options identified
   - Verify resource availability in alternative regions

2. **Selection:**
   - Select best available region
   - Consider latency, availability, and resource limits
   - Document region selection rationale

3. **Alternative:**
   - If Always Free Tier unavailable in all preferred regions:
     - Select region with best availability
     - Document limitations
     - Plan for potential region migration if needed

**Mitigation:**
- Research region availability before account creation
- Have multiple region options identified
- Verify availability in selected region

---

### Edge Case 3: Resource Limits Misunderstood

**Scenario:** Confusion about Always Free Tier limits and restrictions

**Handling:**
1. **Documentation:**
   - Clearly document all resource limits
   - Explain resource reclamation policies
   - Provide usage monitoring guidance

2. **Verification:**
   - Verify resource limits in OCI console
   - Document actual limits vs. expected limits
   - Note any discrepancies

3. **Clarification:**
   - Review OCI Always Free Tier documentation
   - Understand resource reclamation policies
   - Plan for resource usage patterns

**Mitigation:**
- Review OCI documentation thoroughly
- Verify limits in console
- Document limits clearly

---

### Edge Case 4: Credential Security Risk

**Scenario:** Risk of credentials being committed to repository

**Handling:**
1. **Prevention:**
   - Never commit credentials to repository
   - Use secure password manager
   - Verify `.gitignore` includes credential files

2. **Verification:**
   - Check git status for credential files
   - Search repository for credential patterns
   - Verify no credentials in code or documentation

3. **Remediation:**
   - If credentials accidentally committed:
     - Rotate credentials immediately
     - Remove from git history
     - Update `.gitignore`

**Mitigation:**
- Use secure password manager
- Verify `.gitignore` configuration
- Never commit credentials
- Regular security audits

---

### Edge Case 5: Account Verification Delay

**Scenario:** Account verification takes longer than expected (48+ hours)

**Handling:**
1. **Monitoring:**
   - Check email regularly for verification updates
   - Check OCI console for account status
   - Contact OCI support if delay exceeds 48 hours

2. **Communication:**
   - Document verification delay
   - Note expected timeline
   - Plan for delayed completion

3. **Alternative:**
   - Continue with other tasks while waiting
   - Prepare documentation in advance
   - Have support contact information ready

**Mitigation:**
- Start account creation early
- Allow 24-48 hours for verification
- Have support contact ready

---

### Edge Case 6: SSH Key Generation Failure

**Scenario:** SSH key generation fails or keys are lost

**Handling:**
1. **Prevention:**
   - Generate keys in secure location
   - Backup keys to secure password manager
   - Document key locations

2. **Recovery:**
   - Regenerate keys if lost
   - Update key storage location
   - Document new key information

3. **Verification:**
   - Test key generation process
   - Verify keys are accessible
   - Confirm key permissions

**Mitigation:**
- Generate keys in secure location
- Backup keys to password manager
- Document key locations
- Test key generation process

---

## Testing Strategy

### Manual Testing Steps

#### Test 1: Account Creation Verification

**Steps:**
1. Navigate to https://cloud.oracle.com/
2. Attempt to log in with created account
3. Verify account status shows "Active" or "Verified"
4. Verify no account restrictions or warnings

**Expected Results:**
- ✅ Can log into OCI console
- ✅ Account status is "Active" or "Verified"
- ✅ No restrictions or warnings

**Pass Criteria:** All checks pass

---

#### Test 2: Always Free Tier Verification

**Steps:**
1. Log into OCI console
2. Navigate to "Always Free Resources"
3. Verify compute instance availability
4. Verify object storage availability
5. Verify network resources availability
6. Document resource limits

**Expected Results:**
- ✅ Compute instances available (1/8 OCPU, 1 GB RAM)
- ✅ Object storage available (10 GB)
- ✅ Network resources available (10 TB/month)
- ✅ Resource limits match expected values

**Pass Criteria:** All resources available and limits match expected values

---

#### Test 3: Region Selection Verification

**Steps:**
1. Verify selected region in account settings
2. Navigate to "Always Free Resources" in selected region
3. Verify all resources available in region
4. Document region selection

**Expected Results:**
- ✅ Region selected (Singapore recommended)
- ✅ All Always Free Tier resources available in region
- ✅ No region-specific restrictions

**Pass Criteria:** Region selected and resources available

---

#### Test 4: Network Configuration Verification

**Steps:**
1. Navigate to "Networking" → "Virtual Cloud Networks"
2. Verify default VCN exists
3. Navigate to "Security Lists"
4. Verify default security list exists
5. Review security list rules
6. Document network configuration

**Expected Results:**
- ✅ Default VCN exists and is configured
- ✅ Default security list exists
- ✅ Security rules are accessible
- ✅ Network configuration documented

**Pass Criteria:** Network configuration accessible and documented

---

#### Test 5: SSH Key Verification

**Steps:**
1. Verify SSH keys exist in secure location
2. Check private key file permissions (should be 600)
3. Verify public key can be copied
4. Test key format (Ed25519 or RSA 4096)
5. Verify keys are not in repository

**Expected Results:**
- ✅ SSH keys exist in secure location
- ✅ Private key has restrictive permissions (600)
- ✅ Public key can be copied
- ✅ Keys are not in repository

**Pass Criteria:** Keys exist, secure, and not in repository

---

#### Test 6: Credential Storage Verification

**Steps:**
1. Verify credentials stored in secure password manager
2. Check `.gitignore` includes credential files
3. Verify no credentials in repository
4. Search repository for credential patterns
5. Verify credential locations documented (without values)

**Expected Results:**
- ✅ Credentials stored in secure password manager
- ✅ `.gitignore` includes credential files
- ✅ No credentials in repository
- ✅ Credential locations documented

**Pass Criteria:** Credentials secure and not in repository

---

### Acceptance Criteria Testing

#### AC1: OCI Account Created
- **Test:** Log into OCI console
- **Expected:** Account accessible, status "Active"
- **Pass:** ✅ Account accessible

#### AC2: Always Free Tier Verified
- **Test:** Verify resources in "Always Free Resources"
- **Expected:** All resources available (compute, storage, network)
- **Pass:** ✅ All resources verified

#### AC3: Compute Instance Created (Optional)
- **Test:** Verify ability to create compute instance
- **Expected:** Can create VM.Standard.E2.1.Micro instance
- **Pass:** ✅ Instance creation possible (or documented for TASK-238)

#### AC4: Network Configuration Set Up
- **Test:** Verify default VCN and security lists
- **Expected:** VCN exists, security lists accessible
- **Pass:** ✅ Network configuration accessible

#### AC5: Security Rules Configured
- **Test:** Review default security list rules
- **Expected:** Default rules exist, planned rules documented
- **Pass:** ✅ Security rules reviewed and documented

#### AC6: Access Credentials Stored Securely
- **Test:** Verify credentials in password manager, not in repository
- **Expected:** Credentials secure, not committed
- **Pass:** ✅ Credentials secure

#### AC7: Account Settings Reviewed
- **Test:** Review account settings, region, billing
- **Expected:** Settings reviewed, documented
- **Pass:** ✅ Account settings reviewed

---

## Security Considerations

### Critical Security Requirements

#### 1. Credential Management
- ✅ **Never commit credentials to repository**
- ✅ **Use secure password manager** for all OCI credentials
- ✅ **Document credential locations** (without actual values)
- ✅ **Rotate credentials** if accidentally exposed
- ✅ **Verify `.gitignore`** includes credential files

#### 2. SSH Key Security
- ✅ **Generate strong keys** (Ed25519 or RSA 4096)
- ✅ **Protect private key with passphrase**
- ✅ **Store private key securely** (never commit)
- ✅ **Set restrictive file permissions** (600 for private key)
- ✅ **Use public key for instance configuration** (safe to share)

#### 3. Network Security
- ✅ **Review default security lists**
- ✅ **Plan for least privilege** security rules
- ✅ **Document network configuration**
- ✅ **Plan for SSH access restrictions** (specific IPs if possible)
- ✅ **Use HTTPS** for all external communications

#### 4. Account Security
- ✅ **Use strong password** for OCI account
- ✅ **Enable MFA** if available
- ✅ **Review account access logs** regularly
- ✅ **Monitor for unauthorized access**
- ✅ **Keep account information private**

### Security Checklist

- [ ] Credentials stored securely (not in repository)
- [ ] SSH keys generated with strong encryption
- [ ] Private SSH key protected with passphrase
- [ ] SSH key file permissions set correctly (600)
- [ ] `.gitignore` includes credential files
- [ ] No credentials in repository (verified)
- [ ] Credential locations documented (without values)
- [ ] Account password is strong
- [ ] MFA enabled (if available)
- [ ] Network security reviewed
- [ ] Security rules documented
- [ ] Access logs reviewed

---

## Documentation Updates

### Files to Create

1. **`docs/private-docs/operations/OCI_SETUP.md`**
   - Comprehensive OCI setup guide
   - Step-by-step account creation
   - Always Free Tier verification
   - Region selection guide
   - Network configuration
   - SSH key setup
   - Credential management
   - Security best practices
   - Troubleshooting section
   - Security checklist

### Files to Modify

1. **`README.md`**
   - Update service account checklist
   - Add reference to OCI setup guide
   - Mark TASK-018 as complete

### Documentation Standards

- Follow `MAPBOX_SETUP.md` and `SENTRY_SETUP.md` patterns
- Include table of contents
- Provide step-by-step instructions
- Include troubleshooting section
- Add security checklist
- Cross-reference related documentation

---

## Acceptance Criteria Verification

### Acceptance Criteria Checklist

- [ ] **AC1:** OCI account created
- [ ] **AC2:** Always Free Tier verified (2 Autonomous DBs, compute instances, 10 GB storage, 10 TB transfer)
- [ ] **AC3:** Compute instance created (if needed) - Optional for TASK-018
- [ ] **AC4:** Network configuration set up
- [ ] **AC5:** Security rules configured
- [ ] **AC6:** Access credentials stored securely
- [ ] **AC7:** Account settings reviewed

**Total:** 0/7 criteria met (0%) - Ready to begin implementation

### Verification Process

1. **Account Creation:** Verify account is active and accessible
2. **Always Free Tier:** Verify all resources available and limits match
3. **Network Configuration:** Verify VCN and security lists accessible
4. **Security Rules:** Verify default rules exist, planned rules documented
5. **Credentials:** Verify stored securely, not in repository
6. **Account Settings:** Verify reviewed and documented

---

## Next Steps

### Immediate Next Steps (TASK-018)
1. Begin OCI account creation process
2. Complete account verification
3. Verify Always Free Tier resources
4. Generate SSH keys
5. Store credentials securely
6. Create OCI_SETUP.md
7. Update README.md

### Future Tasks
- **TASK-238 (Week 15):** Set up production environment (OCI)
  - Will use account created in TASK-018
  - Will create production compute instance
  - Will configure production networking and security

- **TASK-241 (Week 15):** Deploy backend to Oracle Cloud Infrastructure
  - Will deploy Spring Boot application to OCI instance
  - Will configure systemd service
  - Will set up monitoring and logging

---

## References

### Internal Documentation
- `docs/private-docs/tasks/WEEK_01_TASKS.md` - Task description
- `docs/private-docs/tasks/TASK_DEPENDENCIES.md` - Dependency information
- `docs/private-docs/operations/MAPBOX_SETUP.md` - Setup guide pattern
- `docs/private-docs/operations/SENTRY_SETUP.md` - Setup guide pattern
- `docs/private-docs/operations/BUDGET_AND_RESOURCE_PLAN.md` - OCI specifications
- `docs/private-docs/technical/DEPLOYMENT_GUIDE.md` - Deployment procedures

### External Resources
- **Oracle Cloud Infrastructure Documentation:** https://docs.oracle.com/en-us/iaas/
- **OCI Always Free Tier:** https://www.oracle.com/cloud/free/
- **OCI Getting Started Guide:** https://docs.oracle.com/en-us/iaas/Content/GSG/Concepts/baremetalintro.htm
- **OCI Regions:** https://docs.oracle.com/en-us/iaas/Content/General/Concepts/regions.htm

---

*This solution design provides a comprehensive plan for implementing TASK-018. All identified edge cases are handled, security considerations are addressed, and the implementation plan is ready for execution.*



