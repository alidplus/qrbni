/**
 * Seed NocoDB from cv.yaml + services catalog.
 * Usage: set -a && source .env.local && set +a && node scripts/nocodb/seed.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { load as loadYaml } from "js-yaml";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");
const BASE_URL = (process.env.NOCODB_BASE_URL || "https://app.nocodb.com").replace(
  /\/$/,
  "",
);
const TOKEN = process.env.NOCODB_API_TOKEN;
const ids = JSON.parse(
  fs.readFileSync(path.join(__dirname, ".table-ids.json"), "utf8"),
).tables;

if (!TOKEN) {
  console.error("NOCODB_API_TOKEN missing");
  process.exit(1);
}

async function api(method, pathname, body) {
  const res = await fetch(`${BASE_URL}${pathname}`, {
    method,
    headers: {
      "xc-token": TOKEN,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }
  if (!res.ok) {
    throw new Error(
      `${method} ${pathname} → ${res.status}: ${typeof data === "string" ? data : JSON.stringify(data)}`,
    );
  }
  return data;
}

async function createRecords(tableTitle, records) {
  if (!records.length) return [];
  const tableId = ids[tableTitle];
  if (!tableId) throw new Error(`Unknown table ${tableTitle}`);
  // NocoDB accepts array body
  const created = await api("POST", `/api/v2/tables/${tableId}/records`, records);
  const list = Array.isArray(created) ? created : [created];
  console.log(`+ ${tableTitle}: ${list.length} row(s)`);
  return list;
}

async function count(tableTitle) {
  const tableId = ids[tableTitle];
  const data = await api(
    "GET",
    `/api/v2/tables/${tableId}/records?limit=1`,
  );
  return data?.pageInfo?.totalRows ?? data?.list?.length ?? 0;
}

const cv = loadYaml(fs.readFileSync(path.join(ROOT, "cv.yaml"), "utf8"));

// Idempotency: skip if SiteSettings already seeded
const settingsCount = await count("SiteSettings");
if (settingsCount > 0) {
  console.log("Seed already present (SiteSettings rows > 0). Aborting.");
  process.exit(0);
}

await createRecords("SiteSettings", [
  {
    Key: "default",
    show_blog: true,
    show_services: true,
    show_projects: true,
    show_experience: true,
    show_contact_form: true,
    fa_locale_enabled: true,
    maintenance_mode: false,
    indexing_enabled: true,
    show_hireable: false,
    show_day_rate: false,
    day_rate_amount: cv.basics?.availability?.twine_day_rate?.amount ?? 250,
    day_rate_currency:
      cv.basics?.availability?.twine_day_rate?.currency ?? "USD",
    calendly_url: "https://calendly.com/alighorbani/30min",
    public_email: "ali.ghorbani.tr@gmail.com",
    public_phone: "+989143252762",
    public_location: "Istanbul",
    maintenance_message_en: "Back soon.",
    maintenance_message_fa: "به‌زودی برمی‌گردیم.",
  },
]);

const [profile] = await createRecords("Profile", [
  {
    Name: cv.basics.name,
    Slug: "ali-ghorbani",
    AvatarUrl: cv.basics.avatar?.github || cv.basics.avatar?.twine || null,
    GitHub: cv.basics.profiles?.github,
    LinkedIn: cv.basics.profiles?.linkedin,
    Twine: cv.basics.profiles?.twine,
    Hireable: Boolean(cv.basics.availability?.hireable),
    TotalExperience: cv.basics.total_experience_reported,
  },
]);

const profileId = profile.Id ?? profile.id;
await createRecords("ProfileLocale", [
  {
    ProfileId: profileId,
    Locale: "en",
    Headline: String(cv.basics.headline || "").replace("Severless", "Serverless"),
    Summary: String(cv.basics.summary || "").trim(),
    Label: (cv.basics.label || []).join(" · "),
  },
]);

await createRecords(
  "Language",
  (cv.languages || []).map((l, i) => ({
    Name: l.name,
    Proficiency: l.proficiency,
    Level: l.level,
    Sort: i + 1,
  })),
);

await createRecords(
  "SocialLink",
  [
    { Label: "LinkedIn", Url: cv.basics.profiles?.linkedin, Sort: 1 },
    { Label: "GitHub", Url: cv.basics.profiles?.github, Sort: 2 },
    { Label: "Twine", Url: cv.basics.profiles?.twine, Sort: 3 },
  ].filter((x) => x.Url),
);

const primarySkills = (cv.skills?.primary || []).map((s, i) => ({
  Name: s.name,
  Level: s.level,
  Group: "primary",
  Sort: i + 1,
}));
const alsoSkills = (cv.skills?.also_used || []).map((s, i) => ({
  Name: s,
  Level: null,
  Group: "also_used",
  Sort: 100 + i,
}));
await createRecords("Skill", [...primarySkills, ...alsoSkills]);

for (const [index, exp] of (cv.experience || []).entries()) {
  const [row] = await createRecords("Experience", [
    {
      Company: exp.company,
      CompanyUrl: exp.company_url || null,
      Website: exp.website || null,
      RelatedCompany: exp.related_company || null,
      Location: exp.location || null,
      StartDate: exp.start_date || null,
      EndDate: exp.end_date || null,
      Current: Boolean(exp.current),
      Sort: index + 1,
      Tech: (exp.tech || []).join(", "),
      DateNotes: exp.date_notes ? String(exp.date_notes).trim() : null,
    },
  ]);
  const experienceId = row.Id ?? row.id;
  await createRecords("ExperienceLocale", [
    {
      ExperienceId: experienceId,
      Locale: "en",
      Title: exp.title || "Role",
      Summary: exp.summary ? String(exp.summary).trim() : null,
    },
  ]);
  const highlights = (exp.highlights || []).map((h, i) => ({
    ExperienceId: experienceId,
    Locale: "en",
    Body: String(h).trim(),
    Sort: i + 1,
  }));
  await createRecords("ExperienceHighlight", highlights);
}

for (const [index, project] of (cv.projects || []).entries()) {
  const [row] = await createRecords("Project", [
    {
      Name: project.name,
      Role: project.role || null,
      Company: project.company || null,
      StartDate: project.start_date || null,
      EndDate: project.end_date || null,
      Current: Boolean(project.current),
      Sort: index + 1,
      Tech: (project.tech || []).join(", "),
      RelatedPosts: (project.related_posts || []).join("\n"),
    },
  ]);
  await createRecords("ProjectLocale", [
    {
      ProjectId: row.Id ?? row.id,
      Locale: "en",
      Summary: project.summary ? String(project.summary).trim() : null,
    },
  ]);
}

for (const [index, edu] of (cv.education || []).entries()) {
  const [row] = await createRecords("Education", [
    {
      Institution: edu.institution,
      InstitutionUrl: edu.institution_url || null,
      StartDate: edu.start_date || null,
      EndDate: edu.end_date || null,
      Location: edu.location || null,
      Sort: index + 1,
    },
  ]);
  await createRecords("EducationLocale", [
    {
      EducationId: row.Id ?? row.id,
      Locale: "en",
      Degree: edu.degree || null,
      Field: edu.field || null,
    },
  ]);
}

// Services from service-propose.md structure (homepage categories)
const serviceCategories = [
  {
    Key: "product-development",
    Sort: 1,
    Title: "Custom Product Development",
    Description: "Web apps, SaaS, and APIs from idea to production.",
    services: [
      {
        Key: "custom-web-apps",
        Title: "Custom Web Applications",
        Summary: "Build scalable web applications from idea to production.",
        BulletsMarkdown:
          "- SaaS platforms\n- Internal business tools\n- Admin dashboards\n- Customer portals\n- Marketplaces",
      },
      {
        Key: "mvp",
        Title: "MVP Development",
        Summary: "Launch a production-ready MVP for founders and early-stage startups.",
        BulletsMarkdown: "- Product validation\n- Fast iteration\n- Solid foundations",
      },
      {
        Key: "api-development",
        Title: "API Development",
        Summary: "Design and build robust APIs with auth, payments, and docs.",
        BulletsMarkdown: "- REST & GraphQL\n- Authentication\n- Payments\n- SDKs & documentation",
      },
    ],
  },
  {
    Key: "architecture-consulting",
    Sort: 2,
    Title: "Architecture & Consulting",
    Description: "Reviews, audits, and fractional technical leadership.",
    services: [
      {
        Key: "architecture-review",
        Title: "Architecture Review",
        Summary: "Bottlenecks, security risks, performance, and a refactoring roadmap.",
        BulletsMarkdown: "- Codebase review\n- Risk map\n- Prioritized improvements",
      },
      {
        Key: "code-audit",
        Title: "Code Audit",
        Summary: "Independent review before launch or investment.",
        BulletsMarkdown: "- Quality & maintainability\n- Security & scalability\n- Technical debt",
      },
      {
        Key: "cto-advisory",
        Title: "CTO Advisory",
        Summary: "Fractional technical leadership for startups.",
        BulletsMarkdown: "- Hiring advice\n- Architecture decisions\n- Roadmaps & mentoring",
      },
    ],
  },
  {
    Key: "performance-infra",
    Sort: 3,
    Title: "Performance & Infrastructure",
    Description: "Make systems faster and operations calmer.",
    services: [
      {
        Key: "performance",
        Title: "Performance Optimization",
        Summary: "Backend, database, API latency, and frontend performance.",
        BulletsMarkdown: "- Query tuning\n- Caching\n- Frontend Core Web Vitals",
      },
      {
        Key: "cloud-devops",
        Title: "Cloud & DevOps",
        Summary: "CI/CD, containers, monitoring, and infrastructure automation.",
        BulletsMarkdown: "- Docker & CI/CD\n- Cloudflare / cloud deploy\n- Observability",
      },
    ],
  },
  {
    Key: "ai-integration",
    Sort: 4,
    Title: "AI Integration",
    Description: "Add practical AI to existing products.",
    services: [
      {
        Key: "ai-features",
        Title: "AI Features for Existing Products",
        Summary: "Chat, RAG, document search, workflows, agents, and MCP.",
        BulletsMarkdown:
          "- AI chat & RAG\n- Workflow automation\n- MCP & agent development\n- OpenAI integrations",
      },
    ],
  },
  {
    Key: "partnerships",
    Sort: 5,
    Title: "Long-Term Partnerships",
    Description: "Ongoing senior engineering capacity.",
    services: [
      {
        Key: "technical-partner",
        Title: "Technical Partner Retainer",
        Summary: "External senior engineer for features, architecture, and planning.",
        BulletsMarkdown: "- 20–40 hours/month\n- Feature development\n- Technical decisions",
      },
      {
        Key: "startup-cto",
        Title: "Startup CTO (part-time)",
        Summary: "Part-time technical leadership without a full-time hire.",
        BulletsMarkdown: "- Roadmaps\n- Team mentoring\n- Architecture ownership",
      },
    ],
  },
];

for (const cat of serviceCategories) {
  const [catRow] = await createRecords("ServiceCategory", [
    { Key: cat.Key, Sort: cat.Sort, Active: true },
  ]);
  const categoryId = catRow.Id ?? catRow.id;
  await createRecords("ServiceCategoryLocale", [
    {
      CategoryId: categoryId,
      Locale: "en",
      Title: cat.Title,
      Description: cat.Description,
    },
  ]);
  for (const [i, svc] of cat.services.entries()) {
    const [svcRow] = await createRecords("Service", [
      {
        CategoryId: categoryId,
        Key: svc.Key,
        Sort: i + 1,
        Active: true,
        CtaType: "both",
      },
    ]);
    await createRecords("ServiceLocale", [
      {
        ServiceId: svcRow.Id ?? svcRow.id,
        Locale: "en",
        Title: svc.Title,
        Summary: svc.Summary,
        BulletsMarkdown: svc.BulletsMarkdown,
      },
    ]);
  }
}

// Sample published EN blog post (placeholder)
await createRecords("BlogCategory", [{ Slug: "engineering", Sort: 1 }]);
const catList = await api(
  "GET",
  `/api/v2/tables/${ids.BlogCategory}/records?limit=1`,
);
const blogCategoryId = catList.list?.[0]?.Id;
if (blogCategoryId) {
  await createRecords("BlogCategoryLocale", [
    { CategoryId: blogCategoryId, Locale: "en", Name: "Engineering" },
  ]);
}

await createRecords("BlogPost", [
  {
    Slug: "hello-qrbni",
    Locale: "en",
    Status: "draft",
    Title: "Hello qrbni.dev",
    Excerpt: "Notes on building this site with Next.js, Workers, and NocoDB.",
    BodyMarkdown:
      "# Hello\n\nThis is a draft seed post. Publish it from NocoDB when ready.\n",
    SeoTitle: "Hello qrbni.dev",
    SeoDescription: "Building a personal site on Cloudflare Workers + NocoDB.",
    CategoryId: blogCategoryId ?? null,
    TagSlugs: "meta",
    RelatedSlugs: "",
  },
]);

console.log("Seed complete.");
