// Shape of src/content/toolkit-content.json, which is generated from
// scripts/toolkit-content/build_pdf.py by scripts/toolkit-content/export_json.py.

export type EmailTemplate = { title: string; subject: string; body: string };
export type EmailCategory = { name: string; templates: EmailTemplate[] };
export type Checklist = { name: string; items: string[] };
export type Workflow = { trigger: string; steps: string[] };
export type Prompt = { title: string; prompt: string };
export type Phase = { phase: string; steps: string[] };
export type Term = { term: string; definition: string };
export type CodeRegion = { region: string; codes: { code: string; name: string }[] };
export type GroupedChecklist = { category: string; items: string[] };

export type RawToolkitContent = {
  quickStart: Phase[];
  emailCategories: EmailCategory[];
  checklists: Checklist[];
  workflows: Workflow[];
  prompts: Prompt[];
  glossary: Term[];
  incoterms: Term[];
  airCarrierCodes: CodeRegion[];
  airportCodes: CodeRegion[];
  emergencyChecklist: GroupedChecklist[];
  premium: { emailCategory: EmailCategory; checklist: Checklist };
};

// What one buyer actually sees — Premium content is merged in server-side
// only for Premium / Bundle orders, so it never reaches a Standard buyer.
export type ToolkitContent = Omit<RawToolkitContent, "premium"> & {
  premiumCategoryName: string | null;
  premiumChecklistName: string | null;
};
