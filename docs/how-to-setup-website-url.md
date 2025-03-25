# Setting Up a Domain Name for Your Website
This guide will walk you through the complete process of setting up a domain name to point to your web server.
Prerequisites

A purchased domain name (e.g., from Namecheap, GoDaddy, etc.)
A web server with a public IP address (e.g., DigitalOcean droplet)
Basic understanding of DNS concepts

## Step 1: Purchase a Domain Name

Choose a domain registrar (Namecheap, GoDaddy, Domain.com, etc.)
Search for your desired domain name
Complete the purchase process
Verify your ownership via email

### Step 2: Set Up DNS Records
Option A: Using Your Registrar's DNS

Log in to your domain registrar account
Navigate to the DNS management section for your domain
Create an A record:

Type: A
Host/Name: @ (or leave blank)
Value/Points to: Your server's IP address
TTL: 3600 (1 hour) or Auto


Create a CNAME record for the www subdomain (recommended):

Type: CNAME
Host/Name: www
Value/Points to: Your root domain (e.g., yourdomain.com)
TTL: 3600 (1 hour) or Auto



Option B: Using a Third-Party DNS Provider (e.g., DigitalOcean)

Log in to your DNS provider (e.g., DigitalOcean)
Create a new DNS zone for your domain
Add the same A and CNAME records as described above
Note the nameservers provided by your DNS provider (usually 2-4 of them)
Log in to your domain registrar
Navigate to the nameserver settings for your domain
Change the nameservers to the ones provided by your DNS provider
Save the changes

