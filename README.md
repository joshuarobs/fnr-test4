# Insurance Fair and Reasonable Demo app

This web app is a demo for an Insurance company's Fair and Reasonable process (FNR). This FNR process takes place when an insured makes a claim that has contents items in it.

This demo app aims to:
1. Have a single source of truth for this process, preventing confusion
2. Speed up the process by allowing partner assessors to input values directly and customers to do so with their quotes, thus reducing the burden on the agent
3. Be a foundation for AI integration, such as LLM APIs being queried at intervals (e.g. every hour, after hours), to automate quote checking
4. Speed up a burdensome 100 item FNR from 2 weeks to 20 minutes, or 1 business day
5. Speed up the claims process for the customer

Currently these processes are:
1. Done manually with Excel spreadsheets
2. No single source of truth - i.e. multiple spreadsheets copies that occur when agents don't communicate and collaborate properly
3. Can take up to 2 weeks for a 100 item FNR, as other KPIs and priorities are to be met

The FNR process:
1. Starts off with a contents assessing company to create an inventory list
2. The insured will provide a like for like quote for each item
3. The claims agent will then review each quote, add up all the amounts and cash settle it

## Deployment
1. Pull the repo, install everything as required
2. Run the development scripts: `nx serve app`, `nx serve server`, `prisma:studio`, `db:seed`
3. To deploy on the server, setup the website URL, https, dns, Digital Ocean droplet or other server, env variables in this Github repo, then run `Cleanup > Setup > Deploy` workflow scripts in Github Actions to push latest changes to the server
4. Login with the seeded admin credentials

# ReactMonorepo

An Nx Monorepo setup with React, Vite, Tailwind CSS and [Shadcn UI](https://github.com/shadcn-ui/ui).

For those that don't want or need Next.js in their stack.

Thanks to the help from this tutorial here: https://medium.com/readytowork-org/monorepo-setup-with-nx-nextjs-and-shadcn-ui-3b72c3599470

And hours of tinkering around.

### Suggestions for improvements
- A suggestion button that shows what still needs to be done on this claim, e.g.
this field needs to be filled out, this item needs a quote, this item needs to be verified etc.
- A universal search input bar. Press / or double shift to open it.
  - Allows user to search for anything, for another claim or for filtering a specific item.
  - Better UX as users only have to press the keybind for this search bar
  - If users still want to filter only, they can press "t"
  - Look at Github and vscode for inspiration for this.
- Add "TBD" as a status option, since sometimes contents people need to still determine if an item is repairable or not
- Claime page> Burger menu > Recalculate values
  - Put text underneath "Last calculated 3 days ago"
  - Gives context when values were last refreshed
  - Also feedback, so when users click on it, they know it worked

---

## Installation
### 1. Cline prompt for Vscode
Be sure to copy this prompt and put it in the "Custom Instructions" section in Cline's settings.
This will make it so that Cline acts properly and will hopefully make less mistakes.

````
Do not delete existing comments unless necessary. Do not waste time trying to change quotetation mark as it doesn't matter if its ' or ". If you need help with database migrations, look at README and when running commands assume docker is running.
When you make new components, please write some comments, and use arrow format and export const. When importing from 'shared/src/components/ui', e.g. DropdownMenu, Button, shadcn related stuff, import it as from "@react-monorepo/shared".
Stop worrying about tsconfig files and composite = true, unless its really necessary which in many cases it isn't.
For server tests, try "npx nx test fnr-server-e2e". If that wont work, try look in package.json for the script. If there's prisma migration issues with permissions, look at README for help.
````

## Database Setup and Seeding

### 1. Start the PostgreSQL Database
```sh
docker-compose up -d
```

### 2. Reset and Initialize Database
```sh
cd apps/fnr-server && npx prisma db push --force-reset
```

This command will reset the database and apply the current schema. Use this instead of migrations when you need to start fresh.

### 3. Schema Changes and Migrations Workflow

When making changes to the database schema, follow these steps in order:

1. **Make Schema Changes**
   - Edit the schema in `apps/fnr-server/prisma/schema.prisma`
   - Save your changes

2. **Stop Running Services**
   ```sh
   # Stop any running development servers and database processes
   # Close Prisma Studio if it's running
   ```

3. **Create Migration**
   ```sh
   cd apps/fnr-server && npx prisma migrate dev --name your_migration_name
   ```

4. **Generate Prisma Client**
   ```sh
   cd apps/fnr-server && npx prisma generate
   ```

5. **Re-run client, server and studio**
   Run the nx scripts in package.json or the IDE GUI to start the client and server so we can run the next operations afterwards.

6. **Reset and Seed Database**
   ```sh
   cd apps/fnr-server && npx prisma db push --force-reset
   # Then run the appropriate seed command for your OS:
   ```
   
   Windows:
   ```sh
   cd apps/fnr-server && npx tsx prisma/seed.ts
   ```
   
   macOS/Linux:
   ```sh
   cd apps/fnr-server && npx ts-node --compiler-options '{"module":"CommonJS"}' prisma/seed.ts
   ```

7. **Restart Services**
   - Restart your development servers
   - Restart any other necessary processes

### 4. Seed the Database

#### On Windows
```sh
cd apps/fnr-server && npx tsx prisma/seed.ts
```

When prompted to install tsx, type 'y' to proceed. The seed script will create all necessary test accounts and sample data.

#### On macOS/Linux
```sh
cd apps/fnr-server && npx ts-node --compiler-options '{"module":"CommonJS"}' prisma/seed.ts
```

> **Note**: Make sure to include the single quotes around the compiler options on macOS/Linux.

### 5. Prisma Troubleshooting

When running Prisma commands (like `prisma generate` or `prisma migrate`), you might encounter permission errors, especially on Windows. To resolve these:

1. **Close Running Processes**: Ensure the following are not running:
   - Nx development server (`nx serve fnr-app`)
   - Server application
   - Prisma Studio
   - Any other processes that might be using the Prisma client

2. **Run Prisma Commands**: After closing all processes, run your Prisma commands:
```sh
cd apps/fnr-server && npx prisma generate
# or
cd apps/fnr-server && npx prisma migrate dev --name your_migration_name
```

3. **Restart Services**: After successful Prisma operations, you can restart your development servers and other services.

> **Note**: If you still encounter permission errors, try closing VSCode and reopening it, as it might have locks on some files.

---

## Test Credentials

After running the database seed, the following test accounts will be available.

All accounts use the password: `12345`

### Admin Access
| Email | Role | Name |
|-------|------|------|
| `admin@example.com` | ADMIN | Admin User |

### Staff Access
| Email | Role | Name |
|-------|------|------|
| `staff@example.com` | STAFF | Staff |
| `claims@example.com` | STAFF | Sarah Johnson |
| `valuations@example.com` | STAFF | Mike Williams |

### Supplier Access
| Email | Role | Name |
|-------|------|------|
| `electronics@supplier.com` | SUPPLIER | Tech Solutions |
| `appliances@supplier.com` | SUPPLIER | Home Appliances |

### Customer Access
| Email | Role | Name |
|-------|------|------|
| `john@example.com` | INSURED | John Smith |
| `jane@example.com` | INSURED | Jane Brown |

> **Note**: These credentials are for testing purposes only. In production, you should use secure passwords and remove any test accounts.
>

## Instructions

### Adding new Shadcn elements

1. Look for a component here `https://ui.shadcn.com/docs/components/accordion`
2. Run the command for the component, e.g.: `npx shadcn-ui@latest add button`
3. It should create a local copy in `shared/src/components/`
4. Ensure that all the imports are done properly. Reference the `button.tsx` in case there's anything wrong, as that file works properly.
5. Add the export into `shared/src/index.ts` e.g. `export * from './components/ui/button';` or else you can't import it

### Recently Viewed Claims Implementation

The recently viewed claims feature follows these key principles:

1. **Server Updates (ClaimPage.tsx)**
   ```typescript
   // Always record the view when visiting a claim page
   const [recordView] = useRecordClaimViewMutation();
   
   React.useEffect(() => {
     if (id) {
       recordView(id);
     }
   }, [id, recordView]);
   ```

2. **UI Updates (Sidebar.tsx)**
   ```typescript
   // Only refetch the recently viewed list when NOT on a claim page
   const { data: recentViews, refetch } = useGetRecentlyViewedClaimsQuery();

   React.useEffect(() => {
     if (!isOnClaimPage) {
       refetch();
     }
   }, [isOnClaimPage, refetch]);
   ```

Key points to remember:
- The server ALWAYS gets updated when visiting a claim page
- The sidebar's recently viewed section only updates when navigating to non-claim pages
- Do NOT use invalidatesTags in the recordClaimView mutation as this would cause unwanted refreshes
- Use useEffect with refetch() for controlled updates based on the current page

<a alt="Nx logo" href="https://nx.dev" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" width="45"></a>

✨ Your new, shiny [Nx workspace](https://nx.dev) is almost ready ✨.

[Learn more about this workspace setup and its capabilities](https://nx.dev/getting-started/tutorials/react-monorepo-tutorial?utm_source=nx_project&amp;utm_medium=readme&amp;utm_campaign=nx_projects) or run `npx nx graph` to visually explore what was created. Now, let's get you up to speed!

## Finish your CI setup

[Click here to finish setting up your workspace!](https://cloud.nx.app/connect/nydsvj1Hng)


## Run tasks

To run the dev server for your app, use:

```sh
npx nx serve fnr-app
```

To create a production bundle:

```sh
npx nx build fnr-app
```

To see all available targets to run for a project, run:

```sh
npx nx show project fnr-app
```

These targets are either [inferred automatically](https://nx.dev/concepts/inferred-tasks?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) or defined in the `project.json` or `package.json` files.

[More about running tasks in the docs &raquo;](https://nx.dev/features/run-tasks?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Add new projects

While you could add new projects to your workspace manually, you might want to leverage [Nx plugins](https://nx.dev/concepts/nx-plugins?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) and their [code generation](https://nx.dev/features/generate-code?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) feature.

Use the plugin's generator to create new projects.

To generate a new application, use:

```sh
npx nx g @nx/react:app demo
```

To generate a new library, use:

```sh
npx nx g @nx/react:lib mylib
```

You can use `npx nx list` to get a list of installed plugins. Then, run `npx nx list <plugin-name>` to learn about more specific capabilities of a particular plugin. Alternatively, [install Nx Console](https://nx.dev/getting-started/editor-setup?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) to browse plugins and generators in your IDE.

[Learn more about Nx plugins &raquo;](https://nx.dev/concepts/nx-plugins?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) | [Browse the plugin registry &raquo;](https://nx.dev/plugin-registry?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)


[Learn more about Nx on CI](https://nx.dev/ci/intro/ci-with-nx#ready-get-started-with-your-provider?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Install Nx Console

Nx Console is an editor extension that enriches your developer experience. It lets you run tasks, generate code, and improves code autocompletion in your IDE. It is available for VSCode and IntelliJ.

[Install Nx Console &raquo;](https://nx.dev/getting-started/editor-setup?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Useful links

Learn more:

- [Learn more about this workspace setup](https://nx.dev/getting-started/tutorials/react-monorepo-tutorial?utm_source=nx_project&amp;utm_medium=readme&amp;utm_campaign=nx_projects)
- [Learn about Nx on CI](https://nx.dev/ci/intro/ci-with-nx?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [Releasing Packages with Nx release](https://nx.dev/features/manage-releases?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [What are Nx plugins?](https://nx.dev/concepts/nx-plugins?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

And join the Nx community:
- [Discord](https://go.nx.dev/community)
- [Follow us on X](https://twitter.com/nxdevtools) or [LinkedIn](https://www.linkedin.com/company/nrwl)
- [Our Youtube channel](https://www.youtube.com/@nxdevtools)
- [Our blog](https://nx.dev/blog?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)


### Test ideas
- Pressing down with the highlighted cell at bottom of table will automatically go to next page

## Deployment

The application can be deployed using either GitHub Actions (recommended) or manual deployment scripts.

### GitHub Actions Deployment (Recommended)

We use GitHub Actions for automated CI/CD to Digital Ocean. This provides:
- Automated builds and tests
- Automatic deployment on push to main/staging
- Deployment verification and health checks
- Automatic rollback on failure

See [Deployment Guide](docs/deployment.md) for detailed setup instructions and configuration.

### Windows Deployment Setup

Since the deployment scripts are written in bash, Windows users need a different approach for the initial setup:

1. **Generate SSH Key**
   ```powershell
   # Open PowerShell and run:
   ssh-keygen -t rsa -b 4096 -C "github-actions-deploy" -f "$env:USERPROFILE\.ssh\fnr_app_github_actions_deploy"
   # This creates two files:
   # - fnr_app_github_actions_deploy.pub (public key for Digital Ocean)
   # - fnr_app_github_actions_deploy (private key for GitHub Actions)
   # Press Enter twice to skip passphrase (required for automated deployment)
   ```

2. **Add Public Key to Droplet**
   ```powershell
   # Method 1 - If you have password access to the droplet:
   cat "$env:USERPROFILE\.ssh\fnr_app_github_actions_deploy.pub" | ssh root@your_droplet_ip "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys"

   # Method 2 - Manual setup:
   # 1. Display your public key:
   cat "$env:USERPROFILE\.ssh\fnr_app_github_actions_deploy.pub"
   # 2. Copy the output
   # 3. SSH into your droplet:
   ssh root@your_droplet_ip
   # 4. Create .ssh directory and set permissions:
   mkdir -p ~/.ssh
   chmod 700 ~/.ssh
   # 5. Add your key:
   echo "your-public-key-here" >> ~/.ssh/authorized_keys
   chmod 600 ~/.ssh/authorized_keys
   ```

3. **Add GitHub Secrets**
   - Go to your GitHub repository → Settings → Secrets → Actions
   - Add these required secrets:
     ```
     DO_SSH_KEY: Your private key content (from fnr_app_github_actions_deploy - the file WITHOUT .pub)
                 Make sure to copy the entire key including BEGIN and END lines
     DROPLET_IP: Your droplet's IP address
     DATABASE_URL: postgresql://fnrapp:your_password@localhost:5432/fnrdb
     SESSION_SECRET: (Generate with: openssl rand -base64 32)
     CLIENT_URL: http://your_droplet_ip:3000
     ```

4. **Test Connection**
   ```powershell
   # Test SSH connection to droplet using the private key
   ssh -i "$env:USERPROFILE\.ssh\fnr_app_github_actions_deploy" root@your_droplet_ip "echo 'SSH key setup successful!'"
   ```

5. **Deploy Application**
   - Push your changes to the main branch
   - GitHub Actions will automatically deploy your application
   - Monitor the deployment in GitHub Actions tab

### Important Notes
- Set `PROD_DROPLET_IP` in `.env.deploy` file
- Update database credentials in server's `.env` after setup
- Configure SSL with `certbot --nginx` if needed
- If you encounter permission issues, ensure proper file permissions on both your local machine and the droplet
