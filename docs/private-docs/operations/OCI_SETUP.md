# Oracle Cloud Infrastructure Setup Guide

## Overview

This guide provides step-by-step instructions for setting up an Oracle Cloud Infrastructure (OCI) account using the Always Free Tier for the Krawl project.

**OCI Specifications:**
- **Provider:** Oracle Cloud Infrastructure
- **Tier:** Always Free Tier
- **Compute Instances:** VM.Standard.E2.1.Micro (1/8 OCPU, 1 GB memory)
- **Object Storage:** 10 GB
- **Outbound Data Transfer:** 10 TB per month
- **Load Balancer:** 1 instance, 10 Mbps
- **Autonomous Database:** 2 instances, 20 GB each (optional, we use Aiven PostgreSQL)

**Related Documentation:**
- For similar service account setup patterns, see [`MAPBOX_SETUP.md`](./MAPBOX_SETUP.md) and [`SENTRY_SETUP.md`](./SENTRY_SETUP.md)
- For solution design details, see [`TASK-018_SOLUTION_DESIGN.md`](../tasks/TASK-018_SOLUTION_DESIGN.md)
- For deployment procedures, see [`DEPLOYMENT_GUIDE.md`](../technical/DEPLOYMENT_GUIDE.md)

---

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Step 1: Create OCI Account](#step-1-create-oci-account)
4. [Step 2: Verify Always Free Tier](#step-2-verify-always-free-tier)
5. [Step 3: Select Region](#step-3-select-region)
6. [Step 4: Review Network Configuration](#step-4-review-network-configuration)
7. [Step 5: Generate SSH Keys](#step-5-generate-ssh-keys)
8. [Step 6: Collect and Store Credentials](#step-6-collect-and-store-credentials)
7. [Step 7: Verify Configuration](#step-7-verify-configuration)
8. [Security Best Practices](#security-best-practices)
9. [Usage Monitoring](#usage-monitoring)
10. [Integration Points](#integration-points)
11. [Troubleshooting](#troubleshooting)
12. [Security Checklist](#security-checklist)
13. [Next Steps](#next-steps)
14. [References](#references)

---

## Prerequisites

- Internet connection
- Email address for OCI account registration
- Credit card (may be required for verification, not charged)
- Access to Oracle Cloud Console (https://cloud.oracle.com/)
- **Password manager** (recommended for secure credential storage):
  - **Free options:** Bitwarden (https://bitwarden.com/), KeePass (https://keepass.info/)
  - **Paid options:** 1Password, LastPass
  - **Alternative:** Secure encrypted file storage (not recommended for production)
- Terminal/command prompt access (for SSH key generation)

---

## Step 1: Create OCI Account

### 1.1 Navigate to Oracle Cloud

1. **Open Web Browser:**
   - Go to https://cloud.oracle.com/
   - Click "Start for Free" or "Sign Up"

2. **Account Registration Page:**
   - You'll be redirected to the account registration page
   - Review the Always Free Tier benefits displayed

### 1.2 Account Registration

1. **Enter Account Information:**
   - **Email Address:** Enter your email address (use project email or personal email)
   - **Password:** Create a strong password:
     - Minimum 12 characters
     - Mix of uppercase, lowercase, numbers, and symbols
     - Not used for other accounts
   - **Country/Region:** Select Philippines or appropriate region
   - **Cloud Account Name:** Enter a name for your cloud account (e.g., "Krawl Project")

2. **Accept Terms:**
   - Read and accept Oracle Cloud Terms of Service
   - Read and accept Privacy Policy
   - Click "Create Account" or "Continue"

### 1.3 Email Verification

1. **Check Email Inbox:**
   - Look for verification email from Oracle Cloud
   - **If email doesn't arrive within 5 minutes:**
     - Check spam/junk folder
     - Verify email address is correct
     - Request resend verification email
     - Contact Oracle Cloud support if issue persists

2. **Verify Email:**
   - Click the verification link in the email
   - You'll be redirected back to Oracle Cloud
   - Email verification is complete

### 1.4 Account Verification (May Require Credit Card)

1. **Complete Verification Form:**
   - **Personal Information:**
     - Full name
     - Address
     - Phone number
   - **Payment Method:**
     - Credit card may be required (for verification only, not charged)
     - **Note:** Card is used for identity verification, not billing
     - No charges will be made unless you upgrade to paid tier
   - **Purpose:** Select "Education" or "Personal Project"

2. **Submit Verification:**
   - Review all information
   - Submit verification form
   - **Wait Time:** Account verification may take 24-48 hours

3. **Verification Status:**
   - Check email for verification status updates
   - Log into OCI console to check account status
   - Account will show "Active" or "Verified" when ready

### 1.5 Account Activation

1. **Log into OCI Console:**
   - Go to https://cloud.oracle.com/
   - Click "Sign In"
   - Enter your email and password

2. **Verify Account Status:**
   - Navigate to "Profile" → "Account Settings"
   - Verify account status shows "Active" or "Verified"
   - Check for any account restrictions or warnings

3. **Complete Setup (if prompted):**
   - Complete any additional setup steps
   - Set up security questions (if prompted)
   - Enable two-factor authentication (recommended)

**Deliverables:**
- ✅ OCI account created
- ✅ Email verified
- ✅ Account verification submitted
- ✅ Account status confirmed as "Active"

**Verification:**
- Can log into OCI console
- Account status shows "Active" or "Verified"
- No account restrictions or warnings

---

## Step 2: Verify Always Free Tier

### 2.1 Access Always Free Resources

1. **Navigate to Always Free Resources:**
   - Log into OCI console
   - Click "Menu" (hamburger icon) → "Governance & Administration" → "Account Management"
   - Click "Always Free Resources"
   - Or navigate to "Billing & Cost Management" → "Always Free Resources"

2. **Review Always Free Tier Information:**
   - You'll see a list of Always Free Tier resources
   - Review the resource limits and availability

### 2.2 Verify Compute Resources

1. **Check Compute Instance Availability:**
   - **Shape:** VM.Standard.E2.1.Micro (Always Free)
   - **CPU:** 1/8 OCPU (0.125 vCPU)
   - **Memory:** 1 GB RAM
   - **Storage:** Block storage included
   - **Availability:** Should show as available in your selected region

2. **Document Compute Limits:**
   - Note the compute instance specifications
   - Understand resource reclamation policies (resources may be reclaimed if idle for 7+ days)

### 2.3 Verify Storage Resources

1. **Check Object Storage Availability:**
   - **Object Storage:** 10 GB
   - **Block Storage:** Included with compute instance
   - **Total Storage:** 10 GB object + block storage

2. **Document Storage Limits:**
   - Note storage capacity limits
   - Understand storage usage policies

### 2.4 Verify Network Resources

1. **Check Network Resource Availability:**
   - **Outbound Data Transfer:** 10 TB per month
   - **Load Balancer:** 1 instance, 10 Mbps (Always Free)
   - **VCN:** Default VCN included
   - **Internet Gateway:** Default gateway included

2. **Document Network Limits:**
   - Note data transfer limits
   - Understand network usage policies

### 2.5 Verify Database Resources (Optional)

1. **Check Autonomous Database Availability:**
   - **Autonomous Database:** 2 instances available
   - **Storage:** 20 GB each (40 GB total)
   - **Note:** We're using Aiven PostgreSQL, so these are optional

2. **Document Database Limits:**
   - Note database availability (if needed)
   - Understand we're using Aiven PostgreSQL instead

### 2.6 Document Resource Limits

1. **Create Resource Documentation:**
   - Document all Always Free Tier resources
   - Note resource limits and specifications
   - Record resource availability by region
   - Note resource reclamation policies

**Deliverables:**
- ✅ Always Free Tier resources verified
- ✅ Resource limits documented
- ✅ Region availability confirmed

**Verification:**
- All Always Free Tier resources show as available
- Resource limits match expected values
- No resource restrictions or warnings

---

## Step 3: Select Region

### 3.1 Research Region Availability

1. **Review OCI Regions:**
   - Research regions closest to Philippines (Cebu City)
   - Consider latency, availability, and Always Free Tier availability
   - **Recommended Regions:**
     - **Singapore (ap-singapore-1):** Closest to Philippines, lowest latency
     - **Tokyo (ap-tokyo-1):** Good alternative, slightly higher latency
     - **Seoul (ap-seoul-1):** Alternative option, higher latency

2. **Check Always Free Tier Availability:**
   - Verify Always Free Tier is available in preferred regions
   - Check for any region-specific restrictions

### 3.2 Select Region

1. **Set Default Region:**
   - **Recommended:** Singapore (ap-singapore-1)
     - Closest to Philippines
     - Lowest latency for Cebu City users
     - Good Always Free Tier availability
   - Navigate to "Profile" → "Region"
   - Select your preferred region
   - Set as default region

2. **Verify Region Selection:**
   - Confirm region is set as default
   - Verify Always Free Tier resources are available in selected region

### 3.3 Document Region Selection

1. **Record Region Information:**
   - Document selected region name and code
   - Note selection rationale (proximity, latency, availability)
   - Record region-specific resource availability

**Deliverables:**
- ✅ Region selected (Singapore recommended)
- ✅ Region availability verified
- ✅ Region set as default

**Verification:**
- Region selected and set as default
- All Always Free Tier resources available in region
- No region-specific restrictions

---

## Step 4: Review Network Configuration

### 4.1 Access VCN Configuration

1. **Navigate to Virtual Cloud Networks:**
   - Log into OCI console
   - Click "Menu" → "Networking" → "Virtual Cloud Networks"
   - Review default VCN (created automatically)

2. **Review Default VCN:**
   - **VCN Name:** Default VCN (or custom name)
   - **CIDR Block:** Usually 10.0.0.0/16
   - **Subnets:** Default public subnet (usually 10.0.0.0/24)
   - **Internet Gateway:** Default gateway attached
   - **Route Tables:** Default route table with internet gateway route

### 4.2 Review Security Lists

1. **Navigate to Security Lists:**
   - Click "Menu" → "Networking" → "Security Lists"
   - Find default security list for your VCN
   - Click on the security list to view rules

2. **Review Default Security List Rules:**

   **Ingress Rules (Inbound):**
   - **SSH (Port 22):** Allow from 0.0.0.0/0 (will be restricted in TASK-238)
   - **ICMP:** Allow from 0.0.0.0/0 (for ping)

   **Egress Rules (Outbound):**
   - **All Traffic:** Allow to 0.0.0.0/0

3. **Document Current Security Rules:**
   - Record default ingress rules
   - Record default egress rules
   - Note security list name and OCID

### 4.3 Plan Future Security Rules

1. **Document Planned Security Rules (for TASK-238):**
   - **SSH (Port 22):** Restrict to specific IPs if possible
   - **Spring Boot API (Port 8080):** Allow from 0.0.0.0/0 (public access)
   - **HTTPS (Port 443):** Allow from 0.0.0.0/0 (if using load balancer)

2. **Note:**
   - Full security rule configuration will be done in TASK-238
   - Current review is for documentation purposes
   - Default rules are sufficient for initial setup

### 4.4 Document Network Configuration

1. **Create Network Configuration Notes:**
   - VCN details (name, CIDR, subnets)
   - Security list rules (current and planned)
   - Internet gateway configuration
   - Route table configuration
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

## Step 5: Generate SSH Keys

### 5.1 Generate SSH Key Pair

1. **Open Terminal/Command Prompt:**
   - **Linux/Mac:** Open terminal
   - **Windows:** Open PowerShell or Command Prompt

2. **Navigate to Secure Directory:**
   ```bash
   # Linux/Mac
   cd ~/.ssh
   
   # Windows PowerShell
   cd $env:USERPROFILE\.ssh
   ```

3. **Generate SSH Key Pair:**

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

4. **When Prompted for Passphrase:**
   - Enter a strong passphrase (recommended)
   - Confirm passphrase
   - **Note:** Passphrase protects private key if compromised
   - **Important:** Remember this passphrase or store it securely

### 5.2 Verify Key Generation

1. **Verify Keys Were Created:**
   ```bash
   # Linux/Mac
   ls -la ~/.ssh/krawl_oci_key*
   
   # Windows PowerShell
   Get-ChildItem $env:USERPROFILE\.ssh\krawl_oci_key*
   ```

2. **Expected Files:**
   - `krawl_oci_key` (private key)
   - `krawl_oci_key.pub` (public key)

3. **Verify Key Format:**
   ```bash
   # View public key (safe to share)
   # Linux/Mac
   cat ~/.ssh/krawl_oci_key.pub
   
   # Windows PowerShell
   Get-Content $env:USERPROFILE\.ssh\krawl_oci_key.pub
   ```

### 5.3 Store Keys Securely

1. **Private Key (`krawl_oci_key`):**
   - **Copy Private Key Content:**
     ```bash
     # Linux/Mac
     cat ~/.ssh/krawl_oci_key
     
     # Windows PowerShell
     Get-Content $env:USERPROFILE\.ssh\krawl_oci_key
     ```
   - **Store in Secure Password Manager:**
     - **If you have a password manager** (1Password, LastPass, Bitwarden, KeePass, etc.):
       - Open your password manager
       - Create a new entry or note
       - **Title:** "Krawl OCI SSH Private Key"
       - Paste the entire private key content (including `-----BEGIN` and `-----END` lines)
       - Save the entry
     - **If you don't have a password manager:**
       - **Option 1:** Use a free password manager like Bitwarden (https://bitwarden.com/) or KeePass (https://keepass.info/)
       - **Option 2:** Store in a secure encrypted file on your computer (not recommended for production)
       - **Option 3:** Keep the key file in `~/.ssh/` directory with restrictive permissions (600) and never commit to git
     - Never commit to repository
     - **Important:** Keep the private key secure and never share it
   - **Set Restrictive File Permissions (Linux/Mac):**
     ```bash
     chmod 600 ~/.ssh/krawl_oci_key
     ```
   - **Verify `.gitignore` excludes key files:**
     - Check `.gitignore` includes `*.key` and `*.pem`
     - Verify keys are not tracked by git

2. **Public Key (`krawl_oci_key.pub`):**
   - **Copy Public Key Content:**
     ```bash
     # Linux/Mac
     cat ~/.ssh/krawl_oci_key.pub
     
     # Windows PowerShell
     Get-Content $env:USERPROFILE\.ssh\krawl_oci_key.pub
     ```
   - **Store in Secure Password Manager:**
     - **If you have a password manager:**
       - Create a new entry or note
       - **Title:** "Krawl OCI SSH Public Key"
       - Paste the public key content
       - Save the entry
     - **If you don't have a password manager:**
       - Store in a text file (public keys are safe to store anywhere)
       - Or keep in `~/.ssh/krawl_oci_key.pub` file
     - Ready for instance configuration in TASK-238
     - **Note:** Public key can be safely shared (it's public)

### 5.4 Document Key Information

1. **Create Key Documentation:**
   - Key type (Ed25519 or RSA 4096)
   - Key location (private key path)
   - Key purpose (OCI instance access)
   - Passphrase status (if protected)
   - Storage location (password manager entry name)

**Deliverables:**
- ✅ SSH key pair generated
- ✅ Private key stored securely
- ✅ Public key ready for instance configuration
- ✅ Key information documented

**Verification:**
- SSH keys exist in secure location
- Private key has restrictive permissions (600 on Unix)
- Public key can be copied for instance configuration
- Keys are not in repository

---

## Step 6: Collect and Store Credentials

### 6.1 Collect OCI Credentials

1. **Log into OCI Console:**
   - Go to https://cloud.oracle.com/
   - Sign in with your account

2. **Collect User OCID:**
   - Navigate to "Profile" (user icon) → "User Settings"
   - Find "OCID" (Oracle Cloud Identifier)
   - Click "Copy" to copy the OCID
   - **Format:** `ocid1.user.oc1..aaaaaaa...`
   - **Purpose:** User identification

3. **Collect Tenancy OCID:**
   - Navigate to "Menu" → "Administration" → "Tenancy Details"
   - Find "OCID" in the tenancy information
   - Click "Copy" to copy the OCID
   - **Format:** `ocid1.tenancy.oc1..aaaaaaa...`
   - **Purpose:** Tenancy identification

4. **Collect Compartment OCID (Default):**
   - Navigate to "Menu" → "Identity" → "Compartments"
   - Find root compartment (usually named "root" or your tenancy name)
   - Click on the compartment
   - Find "OCID" in compartment details
   - Click "Copy" to copy the OCID
   - **Format:** `ocid1.compartment.oc1..aaaaaaa...`
   - **Purpose:** Resource organization

5. **Note Selected Region:**
   - Note your selected region (e.g., `ap-singapore-1`)
   - **Purpose:** Resource location

### 6.2 Store Credentials Securely

1. **Use Secure Password Manager:**
   - Create entry: "Krawl OCI Account"
   - Store all OCIDs:
     - User OCID
     - Tenancy OCID
     - Compartment OCID (root)
     - Region
   - Add notes about credential purposes

2. **Document Credential Locations:**
   - Create notes document (without actual values)
   - Document where each credential is stored
   - Note credential purposes
   - **Example:**
     ```
     OCI Credentials Storage:
     - Password Manager Entry: "Krawl OCI Account"
     - User OCID: Stored in password manager
     - Tenancy OCID: Stored in password manager
     - Compartment OCID: Stored in password manager
     - Region: ap-singapore-1
     ```

### 6.3 Verify Credential Security

1. **Check `.gitignore` Configuration:**
   ```bash
   # Verify .gitignore includes:
   *.key
   *.pem
   credentials.txt
   oci-credentials.txt
   *.env
   .env*
   ```

2. **Verify Credentials Not in Repository:**
   ```bash
   git status
   # Should NOT show credential files
   
   # Search for OCID patterns (should not find actual OCIDs)
   git grep "ocid1\." --all
   ```

3. **Verify No Credentials in Documentation:**
   - Search documentation files for OCID patterns
   - Ensure no actual credentials are documented
   - Verify only credential locations are documented (without values)

**Deliverables:**
- ✅ OCI credentials collected
- ✅ Credentials stored securely
- ✅ Credential locations documented (without values)
- ✅ Security verified

**Verification:**
- All credentials stored in secure password manager
- No credentials in repository
- Credential locations documented
- `.gitignore` properly configured

---

## Step 7: Verify Configuration

### 7.1 Verify Account Status

1. **Check Account Status:**
   - Log into OCI console
   - Navigate to "Profile" → "Account Settings"
   - Verify account status shows "Active" or "Verified"
   - Check for any account restrictions or warnings

2. **Verify Always Free Tier:**
   - Navigate to "Always Free Resources"
   - Verify all resources show as available
   - Confirm resource limits match expected values

### 7.2 Verify Network Configuration

1. **Check VCN Configuration:**
   - Navigate to "Networking" → "Virtual Cloud Networks"
   - Verify default VCN exists
   - Verify VCN is configured correctly

2. **Check Security Lists:**
   - Navigate to "Networking" → "Security Lists"
   - Verify default security list exists
   - Verify security list rules are accessible

### 7.3 Verify SSH Keys

1. **Check SSH Keys:**
   - Verify SSH keys exist in secure location
   - Verify private key has restrictive permissions (600 on Unix)
   - Verify public key can be copied
   - Verify keys are not in repository

### 7.4 Verify Credentials

1. **Check Credential Storage:**
   - Verify credentials stored in secure password manager
   - Verify no credentials in repository
   - Verify credential locations documented

**Deliverables:**
- ✅ Account verified
- ✅ Network configuration verified
- ✅ SSH keys verified
- ✅ Credentials verified

**Verification:**
- All checks pass
- No errors or warnings
- Ready for TASK-238 (production environment setup)

---

## Security Best Practices

### Credential Management

1. **Never Commit Credentials:**
   - ✅ Never commit OCIDs, SSH keys, or passwords to repository
   - ✅ Use secure password manager for all credentials
   - ✅ Verify `.gitignore` excludes credential files
   - ✅ Regularly audit repository for accidental credential commits

2. **Credential Storage:**
   - ✅ Store all OCIDs in secure password manager
   - ✅ Use strong, unique passwords for OCI account
   - ✅ Enable two-factor authentication (MFA) if available
   - ✅ Document credential locations (without actual values)

### SSH Key Security

1. **Key Generation:**
   - ✅ Use Ed25519 or RSA 4096 for key generation
   - ✅ Protect private key with strong passphrase
   - ✅ Set restrictive file permissions (600 for private key)

2. **Key Storage:**
   - ✅ Store private key in secure password manager
   - ✅ Never commit private keys to repository
   - ✅ Keep public key ready for instance configuration
   - ✅ Rotate keys periodically (every 90 days recommended)

### Network Security

1. **Security Lists:**
   - ✅ Review default security list rules
   - ✅ Plan for least privilege security rules
   - ✅ Restrict SSH access to specific IPs if possible
   - ✅ Only open necessary ports (22 for SSH, 8080 for API)

2. **Network Configuration:**
   - ✅ Document network topology
   - ✅ Review security rules regularly
   - ✅ Plan for production security rules (TASK-238)

### Account Security

1. **Account Protection:**
   - ✅ Use strong password for OCI account
   - ✅ Enable MFA if available
   - ✅ Review account access logs regularly
   - ✅ Monitor for unauthorized access

2. **Access Management:**
   - ✅ Limit account access to necessary personnel
   - ✅ Review IAM policies regularly
   - ✅ Use least privilege principle

---

## Usage Monitoring

### Resource Usage Tracking

1. **Monitor Always Free Tier Usage:**
   - Navigate to "Billing & Cost Management" → "Cost Analysis"
   - Review resource usage regularly
   - Check for approaching limits

2. **Set Up Usage Alerts:**
   - Navigate to "Billing & Cost Management" → "Budgets"
   - Create budget alerts for Always Free Tier resources
   - Set alerts at 80% of resource limits

### Resource Reclamation Monitoring

1. **Understand Reclamation Policies:**
   - Resources may be reclaimed if idle for 7+ days
   - Monitor resource usage to prevent reclamation
   - Plan for regular resource usage

2. **Monitor Resource Status:**
   - Check resource status regularly
   - Verify resources are not marked for reclamation
   - Ensure regular usage of resources

---

## Integration Points

### With Deployment Guide (TASK-238)

**Production Environment Setup:**
- Account setup (TASK-018) enables production deployment
- Instance creation will use account created in TASK-018
- Network configuration will be finalized in TASK-238
- Security rules will be configured in TASK-238

### With Backend Deployment (TASK-241)

**Application Deployment:**
- Compute instance will be created in TASK-238
- Application deployment will use OCI account and instance
- Environment variables will be configured on instance
- Systemd service will be set up for Spring Boot application

### With Other Services

**Service Integration:**
- **Aiven PostgreSQL (TASK-012):** Backend will connect from OCI instance
- **Sentry (TASK-017):** Backend will send errors from OCI instance
- **Cloudinary (TASK-014):** Backend will upload images from OCI instance
- **Brevo (TASK-015):** Backend will send emails from OCI instance
- **Mapbox (TASK-016):** Backend will call APIs from OCI instance

---

## Troubleshooting

### Account Verification Issues

**Problem:** Account verification takes longer than expected (48+ hours)

**Solutions:**
1. Check email regularly for verification updates
2. Check OCI console for account status
3. Contact Oracle Cloud support if delay exceeds 48 hours
4. Verify all verification information is correct
5. Check for any account restrictions or warnings

### Region Availability Issues

**Problem:** Always Free Tier not available in preferred region

**Solutions:**
1. Check Always Free Tier availability by region
2. Select alternative region with availability
3. Verify resource availability in selected region
4. Document region selection rationale

### Network Configuration Issues

**Problem:** Cannot access VCN or security lists

**Solutions:**
1. Verify account has necessary permissions
2. Check IAM policies for networking access
3. Verify region selection is correct
4. Contact Oracle Cloud support if issues persist

### SSH Key Issues

**Problem:** SSH key generation fails or keys are lost

**Solutions:**
1. Regenerate keys if lost
2. Verify key generation command syntax
3. Check file permissions on key directory
4. Ensure OpenSSH is installed (Windows)
5. Store keys in secure password manager as backup

### Credential Storage Issues

**Problem:** Credentials accidentally committed to repository

**Solutions:**
1. Rotate credentials immediately
2. Remove credentials from git history
3. Update `.gitignore` to prevent future commits
4. Review repository for other credential leaks
5. Update team on credential rotation

---

## Security Checklist

Use this checklist to verify all security measures are in place:

### Credential Security
- [ ] OCIDs stored in secure password manager
- [ ] No credentials committed to repository
- [ ] `.gitignore` includes credential files
- [ ] Credential locations documented (without values)
- [ ] Account password is strong
- [ ] MFA enabled (if available)

### SSH Key Security
- [ ] SSH keys generated with strong encryption (Ed25519 or RSA 4096)
- [ ] Private key protected with passphrase
- [ ] Private key stored in secure password manager
- [ ] Private key file permissions set to 600 (Unix/Linux/Mac)
- [ ] Public key ready for instance configuration
- [ ] Keys are not in repository

### Network Security
- [ ] Default VCN reviewed and documented
- [ ] Security list rules reviewed
- [ ] Planned security rules documented for TASK-238
- [ ] Network topology documented

### Account Security
- [ ] Account status verified as "Active"
- [ ] Always Free Tier verified
- [ ] Region selected and set as default
- [ ] Account access logs reviewed
- [ ] Usage monitoring configured

### Documentation
- [ ] Setup guide created and complete
- [ ] Credential locations documented (without values)
- [ ] Network configuration documented
- [ ] Security checklist completed

---

## Next Steps

After successful OCI account setup:

1. ✅ Verify account is active and accessible
2. ✅ Verify Always Free Tier resources are available
3. ✅ Verify network configuration is accessible
4. ✅ Verify SSH keys are generated and stored securely
5. ✅ Verify credentials are stored securely
6. ✅ Proceed with TASK-238 (Production environment setup) in Week 15

**Note:** Full compute instance setup and deployment will be completed in TASK-238 and TASK-241.

---

## References

### Internal Documentation
- **Solution Design:** [`TASK-018_SOLUTION_DESIGN.md`](../tasks/TASK-018_SOLUTION_DESIGN.md)
- **Deployment Guide:** [`DEPLOYMENT_GUIDE.md`](../technical/DEPLOYMENT_GUIDE.md)
- **Budget and Resource Plan:** [`BUDGET_AND_RESOURCE_PLAN.md`](./BUDGET_AND_RESOURCE_PLAN.md)
- **Similar Setup Guides:**
  - [`MAPBOX_SETUP.md`](./MAPBOX_SETUP.md)
  - [`SENTRY_SETUP.md`](./SENTRY_SETUP.md)

### External Resources
- **Oracle Cloud Infrastructure Documentation:** https://docs.oracle.com/en-us/iaas/
- **OCI Always Free Tier:** https://www.oracle.com/cloud/free/
- **OCI Getting Started Guide:** https://docs.oracle.com/en-us/iaas/Content/GSG/Concepts/baremetalintro.htm
- **OCI Regions:** https://docs.oracle.com/en-us/iaas/Content/General/Concepts/regions.htm
- **OCI Security Best Practices:** https://docs.oracle.com/en-us/iaas/Content/Security/Concepts/securitybestpractices.htm

---

## Support

- **Oracle Cloud Support:** https://www.oracle.com/support/
- **OCI Documentation:** https://docs.oracle.com/en-us/iaas/
- **OCI Community:** https://community.oracle.com/tech/developers/categories/oracle-cloud-infrastructure
- **Project Documentation:** See `docs/private-docs/tasks/TASK-018_SOLUTION_DESIGN.md`

---

**Last Updated:** 2025-11-16  
**Status:** Active  
**Maintained By:** Development Team

