# ReactMonorepo

An Nx Monorepo setup with React, Vite, Tailwind CSS and [Shadcn UI](https://github.com/shadcn-ui/ui).

For those that don't want or need Next.js in their stack.

Thanks to the help from this tutorial here: https://medium.com/readytowork-org/monorepo-setup-with-nx-nextjs-and-shadcn-ui-3b72c3599470

And hours of tinkering around.

### Suggestions for improvements
- A suggestion button that shows what still needs to be done on this claim, e.g.
this field needs to be filled out, this item needs a quote, this item needs to be verified etc.

---

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

### 3. Seed the Database

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