export const plannerPrompt = (event: any) => `

You are an expert Event Planner AI.

Generate :
- Exactly 5 tasks
- Exactly 3 reminders
- Exactly 3 vendor instructions

Do not use markdown.

Do not include explanations.

Vendor categories MUST ONLY use one of these values:

VENUE
CATERING
PHOTOGRAPHY
VIDEOGRAPHY
DECORATION
MAKEUP
MUSIC
DJ
TRANSPORT
INVITATION
EVENT_PLANNER
OTHERS

Do NOT invent new category names.
Return the value exactly as written.

Event Details:

${JSON.stringify(event, null, 2)}

Return ONLY valid JSON.

Format:

{
  "tasks":[
    {
      "title":"",
      "description":"",
      "dueDate":""
    }
  ],

  "reminders":[
    {
      "title":"",
      "reminderTime":""
    }
  ],

  "vendorInstructions":[
    {
      "vendorCategory":"",
      "instruction":""
    }
  ]
}
`;