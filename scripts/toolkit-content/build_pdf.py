import html as _html

# ---------------------------------------------------------------------------
# CONTENT DATA
# ---------------------------------------------------------------------------

EMAIL_CATEGORIES = [
    {
        "name": "Pickup Requests",
        "templates": [
            {
                "title": "Standard Pickup Request",
                "subject": "Pickup Request – [Shipper Name] – Ref [Shipment Ref]",
                "body": """Hi [Contact Name],

Could you please arrange pickup for the shipment below?

Shipper: [Shipper Name]
Pickup address: [Full Pickup Address]
Delivery address: [Full Delivery Address]
Ready date: [Date]
Pieces / Weight / Dimensions: [Pieces] / [Weight] kg / [L x W x H cm]
Reference: [Shipment Ref]

Please confirm the pickup date and driver ETA once scheduled.

Thanks,
[Your Name]""",
            },
            {
                "title": "Urgent Same-Day Pickup Request",
                "subject": "URGENT – Same-Day Pickup Needed – Ref [Shipment Ref]",
                "body": """Hi [Contact Name],

We need a same-day pickup for the shipment below — please treat as priority.

Shipper: [Shipper Name]
Pickup address: [Full Pickup Address]
Delivery address: [Full Delivery Address]
Cargo ready from: [Time]
Latest pickup time: [Time] (vessel/flight cut-off is [Cut-off Time])
Pieces / Weight: [Pieces] / [Weight] kg
Reference: [Shipment Ref]

Please confirm you can accommodate this within the next [X] hours, and share the
driver's name and ETA once assigned.

Thanks,
[Your Name]""",
            },
            {
                "title": "Pickup Request – Appointment / Restricted Access",
                "subject": "Pickup Request (Appointment Required) – Ref [Shipment Ref]",
                "body": """Hi [Contact Name],

This pickup location requires a booked appointment slot. Details below:

Shipper: [Shipper Name]
Pickup address: [Full Pickup Address]
Delivery address: [Full Delivery Address]
Site contact: [Name / Phone]
Access notes: [Loading dock / forklift required / ID needed, etc.]
Requested window: [Date, time window]
Reference: [Shipment Ref]

Please book the appointment directly with the site contact and confirm the
slot back to me once arranged.

Thanks,
[Your Name]""",
            },
            {
                "title": "Pickup Confirmation to Customer",
                "subject": "Pickup Confirmed – Ref [Shipment Ref]",
                "body": """Hi [Customer Name],

Confirming pickup has been scheduled for your shipment:

Reference: [Shipment Ref]
Pickup date: [Date]
Carrier / Driver: [Name]

We'll update you as soon as the cargo is collected and in transit.

Best regards,
[Your Name]""",
            },
        ],
    },
    {
        "name": "POD Requests",
        "templates": [
            {
                "title": "POD Request – Standard",
                "subject": "POD Request – Ref [Shipment Ref]",
                "body": """Hi [Contact Name],

Could you send over the Proof of Delivery for the shipment below?

Reference: [Shipment Ref]
Delivered to: [Consignee]
Delivery date (expected): [Date]

Signed POD or delivery confirmation is fine — whichever you have on file.

Thanks,
[Your Name]""",
            },
            {
                "title": "POD Request – Urgent Follow-Up",
                "subject": "URGENT – Still Awaiting POD – Ref [Shipment Ref]",
                "body": """Hi [Contact Name],

Following up — we still haven't received the POD for reference [Shipment Ref],
delivered on [Date]. Our customer is chasing us for confirmation.

Could you send it across today, or let me know if there's a delay on your side?

Thanks,
[Your Name]""",
            },
        ],
    },
    {
        "name": "Pre-Alerts",
        "templates": [
            {
                "title": "Pre-Alert to Consignee",
                "subject": "Pre-Alert – Shipment [Shipment Ref] Incoming",
                "body": """Hi [Consignee Contact],

Please find pre-alert details for an incoming shipment:

Reference: [Shipment Ref]
Vessel / Flight: [Name / Number]
ETD: [Date] — ETA: [Date]
Pieces / Weight: [Pieces] / [Weight] kg
Documents attached: [Invoice / Packing List / B/L / AWB]

Please confirm receipt and let us know if any documentation is missing on
your end for customs clearance.

Best regards,
[Your Name]""",
            },
            {
                "title": "Pre-Alert to Destination Agent",
                "subject": "Pre-Alert – Inbound Shipment [Shipment Ref]",
                "body": """Hi [Agent Contact],

Pre-alerting the following shipment for your handling:

Reference: [Shipment Ref]
Vessel / Flight: [Name / Number] — ETA [Date]
Consignee: [Consignee Name]
Cargo: [Pieces] / [Weight] kg / [Commodity]
DG status: [Non-DG / DG — see attached DG docs]

Documents attached. Please confirm you're set to handle clearance and
onward delivery, and share your local contact for the consignee.

Thanks,
[Your Name]""",
            },
            {
                "title": "Pre-Alert – Missing Info Follow-Up (Internal)",
                "subject": "Missing Info for Pre-Alert – Ref [Shipment Ref]",
                "body": """Hi [Colleague / Booking Team],

I need the following before I can send the pre-alert for [Shipment Ref]:

- [ ] Final vessel/flight and ETD/ETA
- [ ] Confirmed pieces / weight / dimensions
- [ ] Commercial invoice and packing list
- [ ] DG status confirmation

Please send when available — pre-alert is due to go out by [Time/Date].

Thanks,
[Your Name]""",
            },
        ],
    },
    {
        "name": "Vessel Delivery Instructions",
        "templates": [
            {
                "title": "Onboard Delivery Instructions to Trucker",
                "subject": "Delivery Instructions – Vessel [Vessel Name] – Ref [Shipment Ref]",
                "body": """Hi [Driver / Trucking Company],

Please find delivery instructions for the vessel delivery below:

Vessel: [Vessel Name] — Berth: [Berth/Terminal]
Delivery cut-off: [Date / Time]
Delivery address: [Terminal gate / address]
Reference / Booking number: [Booking Ref]
Contact on-site: [Agent Name / Phone]

Please confirm receipt of these instructions and share the delivery time
once arranged.

Thanks,
[Your Name]""",
            },
            {
                "title": "Delivery Instructions with Hard Cut-Off Warning",
                "subject": "TIME-CRITICAL – Delivery Cut-Off [Time] – Ref [Shipment Ref]",
                "body": """Hi [Driver / Trucking Company],

This delivery has a hard cut-off — please read carefully.

Vessel: [Vessel Name]
Absolute cut-off: [Date / Time] — cargo NOT accepted after this time
Delivery address: [Terminal gate / address]
Reference: [Shipment Ref]

Please confirm you can make this cut-off. If not achievable, notify me
immediately so we can activate a backup plan.

Thanks,
[Your Name]""",
            },
        ],
    },
    {
        "name": "Warehouse Releases",
        "templates": [
            {
                "title": "Warehouse Release Request",
                "subject": "Release Request – Ref [Shipment Ref]",
                "body": """Hi [Warehouse Contact],

Please release the following cargo for collection:

Reference: [Shipment Ref]
Cargo: [Pieces] / [Weight] kg / [Description]
Collecting carrier: [Carrier Name]
Collection window: [Date / Time]

Release note / authorization attached. Please confirm the cargo is ready
for collection.

Thanks,
[Your Name]""",
            },
            {
                "title": "Release Follow-Up – Missing Release Note",
                "subject": "Follow-Up – Release Note Needed – Ref [Shipment Ref]",
                "body": """Hi [Warehouse Contact],

Our driver is scheduled to collect [Shipment Ref] but the warehouse is
requesting a release note we haven't yet issued on our side.

Could you confirm exactly what's required (release note / ID / reference
number) so I can send it across immediately and avoid delaying the driver?

Thanks,
[Your Name]""",
            },
        ],
    },
    {
        "name": "Dimensions Requests",
        "templates": [
            {
                "title": "Dimensions & Weight Request to Shipper",
                "subject": "Dimensions & Weight Needed – Ref [Shipment Ref]",
                "body": """Hi [Shipper Contact],

To finalize the booking for [Shipment Ref], could you confirm:

- Number of pieces:
- Weight per piece (kg):
- Dimensions per piece (L x W x H, cm):
- Stackable? (Y/N):

This is needed to confirm space and pricing — happy to proceed as soon as
we have these details.

Thanks,
[Your Name]""",
            },
            {
                "title": "Missing Dimensions – Booking Blocked",
                "subject": "URGENT – Booking On Hold, Dimensions Needed – Ref [Shipment Ref]",
                "body": """Hi [Shipper Contact],

We can't confirm the booking for [Shipment Ref] without final dimensions
and weight — the carrier requires this before accepting space.

Could you send these over today? Booking cut-off is [Date / Time], after
which we may lose the allocated space.

Thanks,
[Your Name]""",
            },
        ],
    },
    {
        "name": "Missing Shipment Follow-Ups",
        "templates": [
            {
                "title": "Shipment Not Arrived – Internal Check",
                "subject": "Checking Status – [Shipment Ref] Not Yet Arrived",
                "body": """Hi [Colleague],

[Shipment Ref] was expected at [Location] by [Date/Time] and hasn't shown
up on our tracking. Can you check with [Carrier/Warehouse] and confirm
current status?

Please let me know as soon as you hear back — customer is asking.

Thanks,
[Your Name]""",
            },
            {
                "title": "Shipment Not Arrived – External Follow-Up to Trucker",
                "subject": "Status Check – [Shipment Ref] Expected [Date]",
                "body": """Hi [Trucking Company],

[Shipment Ref] was due for delivery/pickup at [Location] on [Date] and we
haven't had confirmation yet. Could you provide a status update and, if
delayed, a revised ETA?

Thanks,
[Your Name]""",
            },
            {
                "title": "Missing Shipment – Escalation to Customer",
                "subject": "Update Needed – [Shipment Ref] Status",
                "body": """Hi [Customer Name],

We're currently confirming the exact status of [Shipment Ref] with our
carrier following an unexpected delay in tracking updates. We'll follow up
with a firm status within [timeframe] and apologize for the uncertainty in
the meantime.

Best regards,
[Your Name]""",
            },
        ],
    },
    {
        "name": "Delay Notifications",
        "templates": [
            {
                "title": "Delay Notification to Customer",
                "subject": "Delay Notice – [Shipment Ref]",
                "body": """Hi [Customer Name],

We want to flag a delay affecting your shipment:

Reference: [Shipment Ref]
Original ETA: [Date]
Revised ETA: [Date]
Reason: [Vessel delay / customs hold / carrier issue, etc.]

We're actively monitoring this and will update you as soon as we have
further movement. Apologies for the inconvenience.

Best regards,
[Your Name]""",
            },
            {
                "title": "Delay Notification – New ETA with Alternative Offered",
                "subject": "Delay Update + Alternative Option – [Shipment Ref]",
                "body": """Hi [Customer Name],

Following the delay on [Shipment Ref] (revised ETA [Date]), we wanted to
flag a possible alternative to recover time:

Option: [e.g. next available vessel / air freight upgrade / different port]
Estimated new ETA: [Date]
Estimated cost impact: [If any]

Let us know if you'd like us to proceed with this option, or if the
revised ETA above works for you.

Best regards,
[Your Name]""",
            },
            {
                "title": "Delay Notification – Internal Heads-Up",
                "subject": "Heads-Up: Delay on [Shipment Ref]",
                "body": """Hi team,

Flagging a delay on [Shipment Ref] — [brief reason]. New ETA is [Date].

Customer has [not yet been informed / been informed]. Please hold off on
any related bookings until this is confirmed.

Thanks,
[Your Name]""",
            },
        ],
    },
    {
        "name": "Next-Port Proposals",
        "templates": [
            {
                "title": "Next-Port Proposal to Customer",
                "subject": "Next-Port Option – [Shipment Ref]",
                "body": """Hi [Customer Name],

As [original port/vessel] is no longer achievable for [Shipment Ref], we'd
like to propose shipping via the next available option:

Proposed port/vessel: [Name]
New ETD / ETA: [Dates]
Additional cost (if any): [Amount]

Please confirm if we should proceed, or if you'd prefer to explore another
option.

Best regards,
[Your Name]""",
            },
            {
                "title": "Next-Port Proposal to Agent",
                "subject": "Next-Port Rebooking Request – [Shipment Ref]",
                "body": """Hi [Agent Contact],

We need to rebook [Shipment Ref] onto the next available vessel/port after
missing [original vessel/port].

Could you check availability and share the earliest option, including new
ETD/ETA and any rate difference?

Thanks,
[Your Name]""",
            },
        ],
    },
    {
        "name": "DG Information Requests",
        "templates": [
            {
                "title": "DG Information Request to Shipper",
                "subject": "DG Information Needed – Ref [Shipment Ref]",
                "body": """Hi [Shipper Contact],

To confirm whether this shipment can move as booked, we need the following
dangerous goods information:

- UN number (if applicable):
- Proper shipping name:
- Class / Packing group:
- MSDS / SDS attached? (Y/N)

Please confirm — even if the cargo is Non-DG, a written confirmation helps
us proceed without delay.

Thanks,
[Your Name]""",
            },
            {
                "title": "MSDS / DG Documents Follow-Up",
                "subject": "Follow-Up – MSDS Required – Ref [Shipment Ref]",
                "body": """Hi [Shipper Contact],

Our carrier requires the MSDS (Safety Data Sheet) before accepting this
booking. Could you send this across as soon as possible? Without it we
risk missing the current booking cut-off of [Date/Time].

Thanks,
[Your Name]""",
            },
        ],
    },
    {
        "name": "Airfreight Quotation Requests",
        "templates": [
            {
                "title": "Airfreight Quote Request to Airline/Agent",
                "subject": "Airfreight Quote Request – [Origin] to [Destination]",
                "body": """Hi [Contact Name],

Could you quote airfreight for the below?

Origin / Destination: [Airport / Airport]
Pieces / Weight / Dimensions: [Pieces] / [Weight] kg / [L x W x H cm]
Ready date: [Date]
Commodity: [Description]
DG: [Yes/No — details if yes]

Please include transit time and earliest available flight.

Thanks,
[Your Name]""",
            },
            {
                "title": "Urgent Airfreight Quote – Same Day",
                "subject": "URGENT Airfreight Quote Needed – [Origin] to [Destination]",
                "body": """Hi [Contact Name],

Need an urgent airfreight quote — cargo must move today if possible.

Origin / Destination: [Airport / Airport]
Pieces / Weight: [Pieces] / [Weight] kg
Cargo ready: [Time]
DG: [Yes/No]

Please advise the earliest possible flight and rate as soon as you can —
happy to confirm by phone if faster.

Thanks,
[Your Name]""",
            },
        ],
    },
    {
        "name": "Agent Coordination",
        "templates": [
            {
                "title": "Agent Coordination – Handover Instructions",
                "subject": "Handover Instructions – [Shipment Ref]",
                "body": """Hi [Agent Contact],

Handing over the following shipment for your side of the move:

Reference: [Shipment Ref]
Current status: [e.g. departed origin, in transit]
Next milestone: [e.g. arrival, customs, delivery]
Special instructions: [Any handling notes]

Documents attached. Please confirm receipt and let me know if you need
anything further from our side.

Thanks,
[Your Name]""",
            },
            {
                "title": "Agent Coordination – Urgent Shipment Brief",
                "subject": "URGENT Shipment Brief – [Shipment Ref]",
                "body": """Hi [Agent Contact],

This shipment is time-critical — please treat as priority on your end.

Reference: [Shipment Ref]
Deadline: [Date/Time and what it's tied to, e.g. vessel cut-off]
Current status: [Status]
What we need from you: [e.g. confirm delivery slot, confirm customs cleared]

Please confirm receipt and expected timing.

Thanks,
[Your Name]""",
            },
            {
                "title": "Agent Coordination – POD Request to Destination Agent",
                "subject": "POD Request – [Shipment Ref]",
                "body": """Hi [Agent Contact],

Could you confirm final delivery and send the POD for [Shipment Ref] once
available? Our customer is awaiting confirmation.

Thanks for handling this one — let me know if anything is needed from our
side to close it out.

Best regards,
[Your Name]""",
            },
        ],
    },
    {
        "name": "Booking Amendments & Changes",
        "templates": [
            {
                "title": "Amend Booking – Change in Pieces / Weight",
                "subject": "Booking Amendment – Ref [Shipment Ref]",
                "body": """Hi [Contact Name],

We need to amend the booking below — the piece count/weight has changed
since the original request:

Reference / Booking number: [Shipment Ref]
Original: [Pieces] / [Weight] kg
Updated: [New Pieces] / [New Weight] kg
Reason for change: [Reason]

Could you confirm whether this affects the rate, space or cut-off, and
reconfirm the booking once updated?

Thanks,
[Your Name]""",
            },
            {
                "title": "Amend Booking – Change in Ready Date",
                "subject": "Booking Amendment – New Ready Date – Ref [Shipment Ref]",
                "body": """Hi [Contact Name],

The cargo ready date for the booking below has changed:

Reference: [Shipment Ref]
Original ready date: [Date]
New ready date: [Date]
Reason: [Delay at supplier / production / other]

Please confirm whether the current vessel/flight booking still holds, or
if we need to rebook onto a later option.

Thanks,
[Your Name]""",
            },
            {
                "title": "Booking Cancellation Request",
                "subject": "Booking Cancellation – Ref [Shipment Ref]",
                "body": """Hi [Contact Name],

Please cancel the booking below:

Reference / Booking number: [Shipment Ref]
Reason for cancellation: [Reason]

Could you confirm the cancellation and let us know if any cancellation fee
applies, so we can inform the customer if needed?

Thanks,
[Your Name]""",
            },
            {
                "title": "Change of Consignee / Delivery Address",
                "subject": "Delivery Address Change – Ref [Shipment Ref]",
                "body": """Hi [Contact Name],

The delivery details for the shipment below have changed:

Reference: [Shipment Ref]
Original consignee / delivery address: [Original Details]
New consignee / delivery address: [New Full Address]
Effective from: [Date, or "immediately"]

Please confirm this change is reflected in your system before the cargo
moves, and flag if it affects customs or delivery documents already
issued.

Thanks,
[Your Name]""",
            },
        ],
    },
    {
        "name": "Rate & Quote Negotiation",
        "templates": [
            {
                "title": "Initial Rate Request to Carrier",
                "subject": "Rate Request – [Origin] to [Destination]",
                "body": """Hi [Carrier / Agent Contact],

Could you provide a rate for the following lane?

Origin / Destination: [Origin] to [Destination]
Mode: [Sea FCL / Sea LCL / Air / Road]
Cargo: [Pieces] / [Weight] kg / [Commodity]
Frequency: [One-off / recurring — volume per month if recurring]
Target ready date: [Date]

Please include transit time, all-in cost (with surcharges) and validity
of the rate.

Thanks,
[Your Name]""",
            },
            {
                "title": "Rate Counter-Offer",
                "subject": "Re: Rate Offer – [Origin] to [Destination]",
                "body": """Hi [Carrier / Agent Contact],

Thanks for the rate on [Origin] to [Destination]. It's a little above what
we need to remain competitive for the customer — would you be able to
improve on [Quoted Rate] given [reason: volume commitment / recurring
lane / flexible dates]?

We'd like to confirm today if we can align on pricing.

Thanks,
[Your Name]""",
            },
            {
                "title": "Rate Confirmation to Customer",
                "subject": "Rate Confirmation – [Origin] to [Destination]",
                "body": """Hi [Customer Name],

Confirming the rate for your shipment:

Origin / Destination: [Origin] to [Destination]
Rate: [Amount] (all-in / excluding [exclusions, if any])
Transit time: [Days]
Validity: [Date]

Let me know if you'd like to proceed and I'll get the booking confirmed.

Best regards,
[Your Name]""",
            },
        ],
    },
    {
        "name": "Customs Query & Clearance",
        "templates": [
            {
                "title": "Customs Query – Additional Documents Requested",
                "subject": "Customs Query – Documents Needed – Ref [Shipment Ref]",
                "body": """Hi [Contact Name],

Customs has requested additional documentation before this shipment can
clear:

Reference: [Shipment Ref]
Documents requested: [e.g. certificate of origin, license, revised invoice]
Reason given: [Reason, if provided]
Deadline: [Date/Time]

Could you provide these as soon as possible to avoid storage/demurrage
charges building up?

Thanks,
[Your Name]""",
            },
            {
                "title": "Customs Hold Notification to Customer",
                "subject": "Customs Hold – Ref [Shipment Ref]",
                "body": """Hi [Customer Name],

Your shipment has been placed on hold by customs:

Reference: [Shipment Ref]
Reason for hold: [Reason, as far as known]
What's needed to release it: [Documents / inspection / payment]
Estimated impact on delivery: [Timeframe]

We're actively working with our broker to resolve this and will update
you as soon as there's movement.

Best regards,
[Your Name]""",
            },
            {
                "title": "HS Code Confirmation Request",
                "subject": "HS Code Confirmation Needed – Ref [Shipment Ref]",
                "body": """Hi [Shipper / Customer Contact],

To complete the customs declaration for [Shipment Ref], could you confirm
the HS code for:

Commodity: [Description]
Suggested HS code (if any): [Code]

If you're not sure, a detailed product description and intended use will
help our broker classify it correctly.

Thanks,
[Your Name]""",
            },
        ],
    },
    {
        "name": "New Shipment Kickoff",
        "templates": [
            {
                "title": "New Shipment – Request Full Instructions from Customer",
                "subject": "New Shipment – Details Needed to Get Started",
                "body": """Hi [Customer Name],

Thanks for the new booking — to get this moving, could you confirm:

Origin / Destination: [Origin] to [Destination]
Cargo: [Pieces] / [Weight] kg / [Dimensions] / [Commodity]
Ready date: [Date]
DG status: [Yes/No — details if yes]
Incoterm: [e.g. FOB, CIF, DAP]
Any deadline we should be aware of: [Date, if applicable]

Once I have these, I'll come back with routing options and a firm
timeline.

Best regards,
[Your Name]""",
            },
            {
                "title": "Internal Handover – New Shipment from Sales",
                "subject": "New Shipment Handover – Ref [Shipment Ref]",
                "body": """Hi [Ops Colleague],

Handing over a new shipment that's just been confirmed:

Customer: [Customer Name]
Reference: [Shipment Ref]
Route: [Origin] to [Destination]
Agreed rate / terms: [Summary]
Anything the customer specifically asked for: [Notes]

Let me know if you need anything further from the sales side to get this
booked.

Thanks,
[Your Name]""",
            },
            {
                "title": "Welcome / Onboarding Email to New Customer",
                "subject": "Welcome — How We'll Work Together",
                "body": """Hi [Customer Name],

Welcome on board — I'll be your main point of contact for shipments going
forward. A few quick things to make this run smoothly:

- Send booking requests to: [email/contact]
- For anything urgent, reach me directly at: [phone/email]
- Please always confirm dangerous goods status upfront — it saves delays
  later
- I'll send a pre-alert and POD for every shipment automatically

Looking forward to working together — let me know if you have any
questions before your first booking.

Best regards,
[Your Name]""",
            },
        ],
    },
    {
        "name": "Weather / Force Majeure Delay",
        "templates": [
            {
                "title": "Weather Delay Notification to Customer",
                "subject": "Weather Delay – Ref [Shipment Ref]",
                "body": """Hi [Customer Name],

Your shipment is affected by weather-related disruption:

Reference: [Shipment Ref]
Disruption: [e.g. storm, port closure, flight grounding]
Original ETA: [Date] — Revised ETA: [Date, or "to be confirmed"]

This is outside the carrier's control, but we're monitoring closely and
will update you as soon as vessels/flights resume normal schedules.

Best regards,
[Your Name]""",
            },
            {
                "title": "Force Majeure Notice",
                "subject": "Force Majeure Notice – Ref [Shipment Ref]",
                "body": """Hi [Customer Name],

We're issuing this as a formal force majeure notice affecting your
shipment:

Reference: [Shipment Ref]
Event: [e.g. natural disaster, strike, war-risk closure]
Source confirming the event: [Carrier / port authority / news source]
Expected impact: [Delay / rerouting / cost impact]

We will keep you updated as the situation develops and will propose
alternatives as soon as they become available.

Best regards,
[Your Name]""",
            },
            {
                "title": "Port Congestion / Strike Notification",
                "subject": "Port Congestion Notice – [Port Name]",
                "body": """Hi [Customer Name],

[Port Name] is currently experiencing [congestion / industrial action],
affecting vessels calling this week, including your shipment [Shipment
Ref].

Expected impact: [Delay estimate]
Alternative being considered: [e.g. nearby port, different vessel]

We'll confirm the best path forward as soon as we have firmer information
from the carrier/terminal.

Best regards,
[Your Name]""",
            },
        ],
    },
    {
        "name": "Shift / Team Handover",
        "templates": [
            {
                "title": "End-of-Shift Handover – Open Items",
                "subject": "Shift Handover – [Date]",
                "body": """Hi [Colleague],

Handing over the following open items before I sign off:

1. [Shipment Ref] — [Status] — [What still needs to happen, by when]
2. [Shipment Ref] — [Status] — [What still needs to happen, by when]
3. [Shipment Ref] — [Status] — [What still needs to happen, by when]

Nothing else urgent outstanding. Call me if anything time-critical comes
up before [time].

Thanks,
[Your Name]""",
            },
            {
                "title": "Handover – Colleague Out of Office",
                "subject": "Covering [Colleague Name] – [Date range]",
                "body": """Hi team,

I'll be covering [Colleague Name]'s shipments while they're out
([Date] to [Date]). Please send anything related to their accounts
directly to me at [email/phone] during this period.

Open/urgent items I'm already aware of:
- [Shipment Ref] — [What needs attention]

Thanks for flagging anything I might have missed.

[Your Name]""",
            },
            {
                "title": "Weekly Status Summary to Manager",
                "subject": "Weekly Shipment Summary – Week of [Date]",
                "body": """Hi [Manager Name],

Quick summary of this week's shipments:

Total shipments handled: [Number]
On-time / delayed: [Number] / [Number]
Open issues needing attention: [Shipment Ref] — [Brief description]
Anything I need support on: [Notes, or "nothing at the moment"]

Let me know if you'd like more detail on anything specific.

Thanks,
[Your Name]""",
            },
        ],
    },
]

CHECKLISTS = [
    {
        "name": "Vessel Delivery Checklist",
        "items": [
            "Confirm vessel name, voyage number and berth/terminal",
            "Confirm gate cut-off date and time",
            "Confirm booking number matches carrier system",
            "Verify cargo dimensions and weight match booking",
            "Confirm DG status and documents if applicable",
            "Share delivery instructions with trucker/driver",
            "Confirm driver has correct documents (booking, ID, permits)",
            "Track delivery and confirm gate-in on the day",
            "Obtain and file the terminal receipt / EIR",
        ],
    },
    {
        "name": "Urgent Shipment Checklist",
        "items": [
            "Confirm the actual deadline (vessel ETD / flight cut-off / customer deadline)",
            "Confirm cargo is physically ready and where it currently is",
            "Check customs and documentation status",
            "Identify the fastest viable transport option",
            "Contact the carrier/agent directly rather than waiting on email",
            "Confirm a backup option in case the primary plan fails",
            "Set a clear internal owner and check-in time",
            "Notify the customer of the plan and next update time",
        ],
    },
    {
        "name": "Airfreight Quote Checklist",
        "items": [
            "Confirm origin and destination airports",
            "Confirm pieces, weight and dimensions",
            "Confirm commodity description and HS code if known",
            "Confirm DG status",
            "Confirm ready date/time",
            "Request transit time and earliest available flight",
            "Compare at least two carrier/agent options if time allows",
            "Confirm all-in rate (including surcharges) before booking",
        ],
    },
    {
        "name": "Cargo Readiness Checklist",
        "items": [
            "Confirm cargo is physically packed and labeled",
            "Confirm final piece count, weight and dimensions",
            "Confirm packaging is suitable for the transport mode",
            "Confirm commercial invoice and packing list are ready",
            "Confirm any certificates required (origin, fumigation, etc.)",
            "Confirm cargo location and site access details",
            "Confirm a contact person is available at pickup",
        ],
    },
    {
        "name": "Pre-Alert Checklist",
        "items": [
            "Confirm shipment reference and booking details",
            "Confirm final vessel/flight, ETD and ETA",
            "Attach commercial invoice and packing list",
            "Attach transport document (B/L, AWB, CMR)",
            "Confirm DG documents attached if applicable",
            "Confirm consignee/agent contact details are correct",
            "Send pre-alert with enough lead time for customs prep",
        ],
    },
    {
        "name": "DG Pre-Check",
        "items": [
            "Confirm whether the cargo is classified as dangerous goods",
            "Obtain UN number, proper shipping name, class and packing group",
            "Obtain MSDS / Safety Data Sheet",
            "Confirm packaging and labeling meet DG requirements",
            "Confirm the selected carrier accepts this DG class",
            "Confirm any additional documentation required (DGD, permits)",
            "Escalate to a qualified DG specialist before booking if uncertain",
        ],
    },
    {
        "name": "Customs Documentation Check",
        "items": [
            "Confirm commercial invoice matches the actual cargo",
            "Confirm HS codes are provided or confirmed",
            "Confirm country of origin is stated",
            "Confirm any required licenses or certificates are attached",
            "Confirm consignee's customs/EORI/tax ID is correct",
            "Confirm incoterms are stated and understood by both sides",
            "Confirm customs broker has all documents before cargo arrival",
        ],
    },
    {
        "name": "Warehouse Pickup Check",
        "items": [
            "Confirm exact pickup address and site access requirements",
            "Confirm release note or authorization is issued",
            "Confirm opening hours and any appointment requirements",
            "Confirm driver has correct reference numbers",
            "Confirm cargo is palletized/ready for loading",
            "Confirm site contact name and phone number",
        ],
    },
    {
        "name": "Next Port Checklist",
        "items": [
            "Confirm why the original port/vessel is no longer viable",
            "Check availability on the next vessel/port option",
            "Confirm new ETD/ETA and transit time",
            "Confirm any additional cost and who absorbs it",
            "Confirm cargo can physically reach the new port/cut-off in time",
            "Get customer approval before rebooking",
            "Update all parties (agent, warehouse, customer) once confirmed",
        ],
    },
    {
        "name": "Onboard Delivery Checklist",
        "items": [
            "Confirm onboard delivery is permitted for this vessel/berth",
            "Confirm exact delivery window and gate details",
            "Confirm required documents for gate access",
            "Confirm driver has vessel/berth contact details",
            "Confirm cargo will physically make the delivery window",
            "Track delivery in real time and escalate early if at risk",
            "Obtain confirmation of onboard delivery once completed",
        ],
    },
    {
        "name": "Agent Coordination Checklist",
        "items": [
            "Confirm the agent's scope (clearance only, delivery, both)",
            "Share shipment reference, documents and current status",
            "Confirm agent's local contact and working hours",
            "Confirm any special handling instructions are passed on",
            "Set a clear expectation for status updates",
            "Confirm POD process and who is responsible for obtaining it",
        ],
    },
    {
        "name": "Delay / Missed Deadline Checklist",
        "items": [
            "Confirm the deadline that was missed and by how much",
            "Identify the root cause (documentation, cargo readiness, carrier, customs)",
            "Determine the earliest realistic recovery option",
            "Estimate any added cost or time impact",
            "Inform the customer proactively, before they ask",
            "Document what happened for internal follow-up",
            "Confirm the recovery plan with all parties involved",
        ],
    },
    {
        "name": "FCL Sea Freight Booking Checklist",
        "items": [
            "Confirm origin and destination ports",
            "Confirm container type and quantity (e.g. 1x40'HC)",
            "Confirm cargo weight and whether it's within container payload limits",
            "Confirm VGM (Verified Gross Mass) process and deadline",
            "Confirm empty container pickup location and date",
            "Confirm loading location, address and access requirements",
            "Confirm gate-in cut-off and document cut-off dates",
            "Confirm DG status and documents if applicable",
            "Confirm seal number is recorded once container is sealed",
        ],
    },
    {
        "name": "LCL Sea Freight Checklist",
        "items": [
            "Confirm CBM (volume) and weight, and which is used for pricing",
            "Confirm CFS (container freight station) cut-off date",
            "Confirm palletization and packaging suitable for consolidation",
            "Confirm cargo marks and labels are clear and match documents",
            "Confirm co-loader/consolidator handling the shipment",
            "Confirm DG status — many consolidators restrict or exclude DG in LCL",
            "Confirm destination CFS and deconsolidation process for the consignee",
        ],
    },
    {
        "name": "Road Freight (FTL/LTL) Checklist",
        "items": [
            "Confirm exact pickup and delivery addresses, including any access restrictions",
            "Confirm loading/unloading time windows and appointment requirements",
            "Confirm vehicle type required (e.g. tail-lift, curtain-side, refrigerated)",
            "Confirm driver has all required references, IDs and permits",
            "Confirm cargo securing/packaging is suitable for road transport",
            "Confirm border/customs requirements if crossing into another country",
            "Confirm contact person and phone number at both pickup and delivery",
        ],
    },
    {
        "name": "New Operator First-Week Checklist",
        "items": [
            "Get access to the booking/TMS system and carrier portals",
            "Save key contacts: main carriers, agents, customs broker, warehouse",
            "Review the toolkit's email templates and bookmark the ones used daily",
            "Shadow a colleague on at least one urgent/time-critical shipment",
            "Confirm who to escalate to for DG questions and for customer complaints",
            "Learn the company's standard cut-off times per trade lane/mode",
            "Confirm where shipment documents and past correspondence are filed",
        ],
    },
    {
        "name": "Shift Handover Checklist",
        "items": [
            "List every shipment with an open action, not just problem shipments",
            "State the next required action and who owns it, in plain terms",
            "Flag anything with a deadline in the next 24 hours",
            "Confirm the customer has (or hasn't) been informed of any issue",
            "Share where documents or correspondence for open items are saved",
            "Confirm how to reach you if something urgent comes up after handover",
        ],
    },
    {
        "name": "Rate Quote Sanity-Check Checklist",
        "items": [
            "Confirm the quote is all-in (no hidden surcharges like BAF, CAF, THC)",
            "Confirm the quote's validity period and whether rates can change after booking",
            "Confirm which party pays destination charges (per the quoted Incoterm)",
            "Compare against at least one other quote if time and margin allow",
            "Confirm transit time matches what the customer was promised",
            "Confirm the quote covers the actual cargo profile (weight, DG, dimensions)",
        ],
    },
    {
        "name": "End-of-Shipment Closeout Checklist",
        "items": [
            "Confirm POD has been received and filed",
            "Confirm all invoices (ours and carrier's) have been reconciled",
            "Confirm no outstanding claims, damage or disputes remain open",
            "Archive all shipment documents in the correct customer/reference folder",
            "Note any lessons learned for next time (delay causes, what worked well)",
            "Confirm the customer received final confirmation that the shipment is complete",
        ],
    },
]

WORKFLOWS = [
    {
        "trigger": "Shipment Will Miss Vessel",
        "steps": [
            "Confirm the actual vessel ETD and gate/document cut-off times",
            "Confirm exactly where the cargo currently is and how long it needs to reach the terminal",
            "Check if a later cut-off or a sister vessel on the same string is available",
            "If not recoverable, identify the next vessel or an air/courier alternative",
            "Get customer approval on cost and timing before rebooking",
            "Update all parties (warehouse, trucker, agent, customer) once a new plan is confirmed",
        ],
    },
    {
        "trigger": "Supplier Hasn't Released Cargo",
        "steps": [
            "Contact the supplier directly to confirm the reason for the hold",
            "Confirm what is needed to release the cargo (payment, documents, approval)",
            "Escalate internally if the hold is commercial (e.g. payment terms)",
            "Get a firm, confirmed release time from the supplier — not an estimate",
            "Recalculate whether the original transport plan is still achievable",
            "If not, prepare a backup transport option in parallel while resolving the hold",
        ],
    },
    {
        "trigger": "Airline Rejects Shipment",
        "steps": [
            "Confirm the exact reason for rejection (DG, documentation, dimensions, space)",
            "Correct the issue if possible (missing document, incorrect labeling, etc.)",
            "If space-related, ask for the next available flight or a different routing",
            "Check alternative airlines or a consolidator/agent with available space",
            "Reconfirm the new option meets the customer's required delivery date",
            "Notify the customer of the change and revised ETA",
        ],
    },
    {
        "trigger": "Documents Are Missing",
        "steps": [
            "Identify exactly which document is missing and who is responsible for it",
            "Contact that party directly with a clear deadline for when it's needed",
            "Check if a provisional or draft document can be used to avoid delay",
            "Confirm with the carrier/customs broker whether movement can proceed without it",
            "Escalate internally if the missing document risks a deadline",
            "File the final document once received and confirm nothing else is outstanding",
        ],
    },
    {
        "trigger": "Vessel Changes Port",
        "steps": [
            "Confirm the new port and the reason for the change",
            "Confirm whether cargo already delivered to the original port needs to be moved",
            "Check transit time and cost impact of reaching the new port",
            "Confirm the new ETD/ETA and whether the original deadline is still achievable",
            "Get customer approval for any additional cost or delay",
            "Update all parties with the new port and revised schedule",
        ],
    },
    {
        "trigger": "Cargo Cannot Be Delivered Onboard",
        "steps": [
            "Confirm the exact reason (missed cut-off, access restriction, documentation)",
            "Check if a later delivery window or different gate is available",
            "If not, confirm the terminal's off-dock or CFS delivery option",
            "Check whether next-port or next-vessel rebooking is a better option than waiting",
            "Confirm any storage or demurrage cost this may create",
            "Inform the customer of the situation and the recommended path forward",
        ],
    },
    {
        "trigger": "Customer Disputes the Invoice or Rate",
        "steps": [
            "Pull the original quote/rate confirmation and compare it line by line to the invoice",
            "Identify exactly which charge is disputed and why",
            "Check if the disputed charge was clearly communicated upfront (e.g. a surcharge)",
            "If the charge is valid, explain it clearly with the supporting quote/document",
            "If the charge is an error, correct the invoice and apologize for the mistake",
            "Document the resolution so the same dispute doesn't recur on future shipments",
        ],
    },
    {
        "trigger": "Cargo Fails Customs Inspection",
        "steps": [
            "Get the exact reason for the failed inspection from the broker or customs directly",
            "Determine if it's a documentation issue, a physical cargo issue, or a compliance issue",
            "Contact the shipper/customer immediately if additional documents or corrections are needed",
            "Confirm the revised timeline and any storage/demurrage cost building up",
            "Escalate to a customs specialist or legal advisor if the issue is regulatory, not just paperwork",
            "Keep the customer updated at each step, even if there's no resolution yet",
        ],
    },
    {
        "trigger": "Driver or Trucker No-Show",
        "steps": [
            "Confirm the booking was actually received and confirmed by the trucking company",
            "Call the driver and dispatcher directly rather than waiting on email",
            "Check if a replacement driver/vehicle can be arranged from the same or another carrier",
            "Recalculate whether the original cut-off is still achievable with a new pickup time",
            "Inform the customer proactively if the delay is likely to affect their deadline",
            "Follow up afterward on why the no-show happened, especially with a repeat carrier",
        ],
    },
]

AI_PROMPTS = [
    {
        "title": "Operational Action Plan",
        "prompt": """You are helping a marine logistics operator handle an urgent shipment.

Shipment data:
- Vessel / flight: [Vessel or flight name]
- ETD / cut-off: [Date and time]
- Cargo location: [Current location]
- Cargo details: [Pieces / weight / dimensions]
- DG status: [Non-DG / DG — details]
- Deadline: [What must happen by when]

Based on this information, generate a clear, numbered operational action
plan for the next 24 hours. Prioritize the steps by urgency, flag any
information that is still missing, and note one realistic backup option
in case the primary plan fails.""",
    },
    {
        "title": "Customer Update Email",
        "prompt": """You are a marine logistics operator writing a professional update to a
customer about their shipment.

Shipment data:
- Reference: [Shipment ref]
- Situation: [What has happened — e.g. delay, missed vessel, rebooking]
- Impact: [New ETA / cost impact, if any]
- Next update: [When you will follow up again]

Write a concise, professional email (under 150 words) that explains the
situation clearly, states what is being done about it, and gives a
specific time for the next update. Avoid overly technical jargon.""",
    },
    {
        "title": "Agent / Partner Instructions",
        "prompt": """You are briefing a destination agent or partner on a shipment they need
to handle on your behalf.

Shipment data:
- Reference: [Shipment ref]
- Current status: [Status]
- What the agent needs to do: [Clearance / delivery / both]
- Deadline or priority level: [Details]
- Special instructions: [Handling notes, DG, access restrictions, etc.]

Write a clear, structured handover brief the agent can act on immediately,
including exactly what confirmation you need back from them and by when.""",
    },
    {
        "title": "Risk Assessment",
        "prompt": """You are assessing the risk of a shipment not meeting its deadline.

Shipment data:
- Deadline: [Date/time and what it's tied to]
- Current status: [Where the cargo and documents currently stand]
- Known issues: [Any delays, missing documents, DG concerns, capacity issues]
- Time remaining: [Hours/days left]

Identify the top 3 risks to this shipment meeting its deadline, rate each
as low/medium/high, and suggest one mitigation action for each risk.""",
    },
    {
        "title": "Backup Solution Options",
        "prompt": """You are generating backup options for a shipment where the primary
transport plan may fail.

Shipment data:
- Primary plan: [e.g. vessel X on date Y]
- Reason it may fail: [Reason]
- Cargo details: [Pieces / weight / dimensions / DG status]
- Customer's hard deadline (if any): [Date]

Suggest two to three realistic backup options (e.g. next vessel, air
freight, different port or routing), with an approximate timeline and
trade-off for each, so the operator can present clear choices internally
or to the customer.""",
    },
    {
        "title": "Missing-Information Checklist",
        "prompt": """You are reviewing a shipment before it can be safely booked or moved.

Shipment data so far:
- [Paste everything currently known about the shipment here — vessel/flight,
  cargo details, DG status, documents, deadline, etc.]

Based on what is provided, list exactly what information is still missing
before this shipment can be booked or moved with confidence, grouped by
category (cargo details, documentation, customs, DG, deadline).""",
    },
    {
        "title": "Rate Negotiation Draft",
        "prompt": """You are a marine logistics operator negotiating a better rate with a
carrier or agent.

Negotiation data:
- Lane: [Origin] to [Destination]
- Quoted rate: [Amount]
- Target rate: [Amount, if you have one in mind]
- Leverage: [Volume commitment / recurring lane / flexible dates / other]

Write a short, professional email that pushes for a better rate using the
leverage above, without sounding confrontational, and proposes a clear
next step (e.g. confirming today if the rate is matched).""",
    },
    {
        "title": "Claims / Insurance Letter Draft",
        "prompt": """You are drafting a formal cargo damage or loss claim on behalf of a
customer.

Claim data:
- Reference: [Shipment Ref]
- Description of damage/loss: [Description]
- When and where discovered: [Details]
- Estimated value affected: [Amount]
- Supporting documents available: [Photos / survey report / invoice, etc.]

Write a clear, formal claim letter to the carrier or insurer stating the
facts, the documents attached, and the outcome being requested (repair,
replacement, or compensation).""",
    },
    {
        "title": "Shift Handover Summary Generator",
        "prompt": """You are a marine logistics operator writing a handover summary at the
end of your shift.

Open items:
- [List each shipment reference, its current status, and what still needs
  to happen, in rough notes]

Turn these rough notes into a clear, numbered handover summary that a
colleague could act on immediately without needing to ask follow-up
questions, ordered by urgency.""",
    },
    {
        "title": "SOP / Process Documentation Generator",
        "prompt": """You are documenting a recurring operational process so any operator on
the team can follow it consistently.

Process to document: [e.g. "how we handle a missed vessel cut-off", "how
we pre-alert a new customer"]
Rough steps as currently done: [Describe the steps informally, in any order]

Turn this into a clear, numbered Standard Operating Procedure with a short
purpose statement at the top, so a new team member could follow it without
additional explanation.""",
    },
    {
        "title": "Customer Service Recovery Message",
        "prompt": """You are writing to a customer after something went wrong on their
shipment, to rebuild trust and keep the relationship strong.

Situation:
- What went wrong: [Description]
- Root cause: [Cause, in plain terms]
- What's being done to fix it: [Concrete action]
- What's being done to prevent it happening again: [Concrete action, if any]

Write an honest, empathetic email that takes ownership without being
overly apologetic, explains the fix clearly, and ends with a concrete next
step and timeline.""",
    },
]

# ---------------------------------------------------------------------------
# QUICK-START GUIDE — a suggested order to use the toolkit in, aimed at
# someone brand new to the role. Rendered with the same step-list style as
# the workflows section.
# ---------------------------------------------------------------------------
QUICK_START = [
    {
        "phase": "Day 1 — Get Set Up",
        "steps": [
            "Get access to the booking/TMS system, carrier portals and shared inboxes",
            "Save this toolkit and bookmark the Email Templates and Checklists sections",
            "Learn who to go to for DG questions, customs issues and customer complaints",
            "Work through the New Operator First-Week Checklist in Section 3",
        ],
    },
    {
        "phase": "Week 1 — Handle Real Shipments",
        "steps": [
            "Use the Pickup Request and Pre-Alert templates on your first live shipments",
            "Run the Cargo Readiness Checklist before confirming any booking",
            "Ask a colleague to review your first few customer-facing emails before sending",
            "Try the Missing-Information Checklist AI prompt on a shipment with incomplete details",
        ],
    },
    {
        "phase": "Weeks 2–4 — Handle the Harder Cases",
        "steps": [
            "Use the Shipment Problem Workflows the first time something goes wrong",
            "Send your first Delay Notification or Weather Delay email using a template as a base",
            "Start using the Shift Handover Checklist at the end of each working day",
            "If you have DG Training Academy access, start the Course Path alongside your day-to-day work",
        ],
    },
]

# ---------------------------------------------------------------------------
# GLOSSARY & INCOTERMS REFERENCE — plain-language definitions of the
# abbreviations and terms used throughout this toolkit.
# ---------------------------------------------------------------------------
GLOSSARY = [
    ("POD", "Proof of Delivery — signed confirmation that cargo was delivered to the consignee."),
    ("ETD / ETA", "Estimated Time of Departure / Estimated Time of Arrival."),
    ("B/L (Bill of Lading)", "The transport document and title document for a sea shipment."),
    ("AWB (Air Waybill)", "The transport document for an air shipment — unlike a B/L, it is not a title document."),
    ("CMR", "The transport document and contract used for international road freight in Europe."),
    ("FCL / LCL", "Full Container Load / Less than Container Load — a container booked exclusively, versus shared space."),
    ("CFS", "Container Freight Station — the facility where LCL cargo is consolidated or deconsolidated."),
    ("VGM", "Verified Gross Mass — the legally required, verified weight of a loaded container before it can be loaded on a vessel."),
    ("HS Code", "Harmonized System code — the international product classification used for customs declarations."),
    ("EORI", "Economic Operators Registration and Identification — an EU customs ID number for businesses."),
    ("DG", "Dangerous Goods — cargo classified as hazardous under the IMDG Code, IATA DGR or ADR."),
    ("MSDS / SDS", "(Material) Safety Data Sheet — a document describing a substance's hazards and safe handling."),
    ("Demurrage", "Charges for keeping a container at the port/terminal beyond the free time allowed."),
    ("Detention", "Charges for keeping a carrier's container or equipment outside the port beyond the free time allowed."),
    ("Consignee", "The party to whom cargo is being shipped and delivered."),
    ("Shipper", "The party sending the cargo — often the exporter or seller."),
    ("Pre-Alert", "Advance notification sent to a consignee or agent with shipment and document details before arrival."),
    ("Cut-off", "The latest time cargo or documents must be submitted to make a specific vessel or flight."),
    ("TEU", "Twenty-foot Equivalent Unit — the standard unit used for counting container capacity."),
    ("Force Majeure", "Unforeseeable circumstances outside a party's control that prevent a contract from being fulfilled."),
]

INCOTERMS = [
    ("EXW — Ex Works", "Seller makes the goods available at their own premises; the buyer takes on all risk and cost from that point."),
    ("FCA — Free Carrier", "Seller delivers the goods to a carrier nominated by the buyer at a named place."),
    ("FOB — Free On Board", "Seller delivers the goods on board the vessel; risk transfers to the buyer once loaded."),
    ("CFR — Cost and Freight", "Seller pays the cost and freight to the destination port; risk transfers once the goods are loaded."),
    ("CIF — Cost, Insurance and Freight", "Same as CFR, but the seller must also provide minimum cargo insurance."),
    ("CPT — Carriage Paid To", "Seller pays carriage to the named destination; risk transfers to the buyer at the first carrier."),
    ("CIP — Carriage and Insurance Paid To", "Same as CPT, but the seller must also provide cargo insurance."),
    ("DAP — Delivered At Place", "Seller delivers the goods, ready for unloading, at the named destination; the buyer handles import clearance."),
    ("DDP — Delivered Duty Paid", "Seller delivers the goods cleared for import at the named destination — the maximum obligation for a seller."),
]

BONUS_CHECKLIST = [
    {
        "category": "Vessel Information",
        "items": ["Vessel name & voyage number", "Berth / terminal", "ETD & gate cut-off", "Booking number confirmed"],
    },
    {
        "category": "Cargo Information",
        "items": ["Pieces, weight & dimensions confirmed", "Cargo physically ready", "Packaging suitable for transport", "Current cargo location known"],
    },
    {
        "category": "Customs Status",
        "items": ["Commercial invoice & packing list ready", "HS code confirmed", "Any licenses/certificates attached", "Customs broker informed"],
    },
    {
        "category": "Transport Options",
        "items": ["Direct truck delivery checked", "Air/courier alternative checked", "Fastest viable option identified", "Backup option identified"],
    },
    {
        "category": "Required Documents",
        "items": ["Booking confirmation", "Transport document (B/L / AWB / CMR)", "DG documents (if applicable)", "Delivery instructions issued"],
    },
    {
        "category": "Backup Options",
        "items": ["Next vessel/port identified", "Customer informed of contingency", "Cost impact estimated", "Decision owner assigned"],
    },
]

# ---------------------------------------------------------------------------
# PREMIUM-ONLY CONTENT — included in the Premium tier's PDF, editable Word
# doc and shipment tracker, on top of everything above.
# ---------------------------------------------------------------------------

PREMIUM_EMAIL_CATEGORY = {
    "name": "Advanced Operator Templates",
    "templates": [
        {
            "title": "Cargo Damage / Claims Report",
            "subject": "Damage Report – Ref [Shipment Ref]",
            "body": """Hi [Carrier / Insurer Contact],

We need to report damage identified on the shipment below:

Reference: [Shipment Ref]
Damage noted at: [Location — e.g. delivery, terminal receipt]
Description of damage: [Description]
Photos attached: [Yes/No]
Estimated value affected: [Amount]

Please advise the claims process and any documentation you require from
our side (survey report, photos, packing list).

Thanks,
[Your Name]""",
        },
        {
            "title": "Multi-Modal Routing Proposal",
            "subject": "Routing Options – [Shipment Ref]",
            "body": """Hi [Customer Name],

Based on your shipment requirements, here are the routing options we'd
recommend comparing:

Option A – Sea: [Transit time] / [Approx. cost]
Option B – Air: [Transit time] / [Approx. cost]
Option C – Sea + final-mile air/truck: [Transit time] / [Approx. cost]

Given your deadline of [Date], we'd recommend Option [A/B/C] — happy to
confirm booking as soon as you approve.

Best regards,
[Your Name]""",
        },
        {
            "title": "Customer Escalation Response",
            "subject": "Re: [Shipment Ref] — Update and Next Steps",
            "body": """Hi [Customer Name],

I understand the repeated delays on [Shipment Ref] have been frustrating,
and I want to make sure you have a clear picture of where things stand.

Current status: [Status]
What caused the delay: [Reason, in plain terms]
What we're doing now: [Concrete action]
When you'll hear from us next: [Specific date/time]

I'm personally keeping an eye on this until it's resolved — please reach
out directly if anything is unclear in the meantime.

Best regards,
[Your Name]""",
        },
        {
            "title": "Vessel Substitution Notice",
            "subject": "Vessel Change Notice – [Shipment Ref]",
            "body": """Hi [Customer / Agent],

The carrier has substituted the originally booked vessel. Updated details:

Original vessel: [Name] — New vessel: [Name]
Reason (per carrier): [Reason]
Revised ETD / ETA: [Dates]
Impact on your booking: [None / minor delay / other]

No action is required on your end unless stated above — we'll continue
monitoring and update you if anything changes further.

Best regards,
[Your Name]""",
        },
        {
            "title": "Long-Term Rate / Contract Request",
            "subject": "Contract Rate Request – [Origin] to [Destination]",
            "body": """Hi [Carrier Contact],

We'd like to request a contracted rate for a recurring lane:

Origin / Destination: [Origin] to [Destination]
Estimated volume: [Shipments per month/quarter]
Typical cargo profile: [Weight/dimensions/commodity type]
Contract period requested: [e.g. 6 / 12 months]

Could you share your best contract rate and any minimum volume
commitments required? Happy to discuss further by call if useful.

Thanks,
[Your Name]""",
        },
        {
            "title": "Formal Force Majeure Declaration",
            "subject": "Formal Force Majeure Declaration – Ref [Shipment Ref]",
            "body": """Dear [Customer / Partner Name],

This letter serves as formal notice of a force majeure event affecting the
performance of our obligations under [Contract / Booking Reference].

Event: [Description of the event — natural disaster, war-risk closure, strike, etc.]
Date event began: [Date]
Source confirming the event: [Carrier / port authority / government notice]
Obligations affected: [Which deliveries/deadlines are impacted]
Expected duration: [Best estimate, or "unknown at this time"]

We will continue to perform all obligations not affected by this event and
will notify you promptly once the situation is resolved or materially
changes. Please contact us with any questions regarding this notice.

Regards,
[Your Name / Company]""",
        },
        {
            "title": "Volume RFQ to Multiple Carriers",
            "subject": "Request for Quotation – [Origin] to [Destination] – [Annual Volume]",
            "body": """Dear [Carrier Contact],

We are consolidating our freight spend on the lane below and would like to
invite you to quote:

Origin / Destination: [Origin] to [Destination]
Mode: [Sea FCL / Sea LCL / Air / Road]
Estimated annual volume: [Volume — TEU / kg / shipments]
Typical cargo profile: [Weight, dimensions, DG status]
Required transit time: [Days]
Contract period: [e.g. 12 months]

Please submit your best all-in rate, transit time and any volume
incentives by [Date]. We plan to award this lane by [Date].

Regards,
[Your Name]""",
        },
        {
            "title": "New Client Onboarding & Credit Terms",
            "subject": "Onboarding — Account Setup for [Customer Name]",
            "body": """Dear [Customer Contact],

Welcome — to get your account fully set up, we'll need the following:

Company registration / VAT details: [Details]
Billing contact and invoice email: [Details]
Requested payment terms: [e.g. Net 30]
Standard operating locations: [Origins/destinations you'll ship from/to]
Any standing instructions: [e.g. always insure cargo, always use carrier X]

Once confirmed, I'll set up your account and send our standard booking
process so your team knows exactly how to reach us for each shipment.

Best regards,
[Your Name]""",
        },
    ],
}

PREMIUM_CHECKLIST = {
    "name": "Claims & Damage Checklist",
    "items": [
        "Confirm and document the damage/loss with photos",
        "Note exactly when and where the damage was discovered",
        "Check the transport document for any exceptions noted at handover",
        "Notify the carrier/insurer within their required claim window",
        "Gather commercial invoice and value documentation",
        "Confirm whether cargo insurance applies and policy details",
        "Submit claim with all required documents to avoid delay",
        "Track claim status and escalate if no response within agreed time",
    ],
}

# ---------------------------------------------------------------------------
# DERIVED COUNTS — computed from the data above so the cover, table of
# contents and section headers can never drift out of sync with what's
# actually in the toolkit.
# ---------------------------------------------------------------------------
BASE_EMAIL_TEMPLATE_COUNT = sum(len(c["templates"]) for c in EMAIL_CATEGORIES)
BASE_EMAIL_CATEGORY_COUNT = len(EMAIL_CATEGORIES)
PREMIUM_EMAIL_TEMPLATE_COUNT = BASE_EMAIL_TEMPLATE_COUNT + len(PREMIUM_EMAIL_CATEGORY["templates"])
PREMIUM_EMAIL_CATEGORY_COUNT = BASE_EMAIL_CATEGORY_COUNT + 1
BASE_CHECKLIST_COUNT = len(CHECKLISTS)
PREMIUM_CHECKLIST_COUNT = BASE_CHECKLIST_COUNT + 1
WORKFLOW_COUNT = len(WORKFLOWS)
AI_PROMPT_COUNT = len(AI_PROMPTS)
GLOSSARY_COUNT = len(GLOSSARY)
INCOTERMS_COUNT = len(INCOTERMS)
PREMIUM_BONUS_TEMPLATE_COUNT = len(PREMIUM_EMAIL_CATEGORY["templates"])

EMAIL_CATEGORY_ICONS = {
    "Pickup Requests": "package",
    "POD Requests": "file-text",
    "Pre-Alerts": "send",
    "Vessel Delivery Instructions": "anchor",
    "Warehouse Releases": "warehouse",
    "Dimensions Requests": "box",
    "Missing Shipment Follow-Ups": "search",
    "Delay Notifications": "clock",
    "Next-Port Proposals": "map-pin",
    "DG Information Requests": "alert-triangle",
    "Airfreight Quotation Requests": "plane",
    "Agent Coordination": "users",
    "Booking Amendments & Changes": "calendar",
    "Rate & Quote Negotiation": "compass",
    "Customs Query & Clearance": "shield-check",
    "New Shipment Kickoff": "package",
    "Weather / Force Majeure Delay": "calendar-x",
    "Shift / Team Handover": "users",
    "Advanced Operator Templates": "star",
}

CHECKLIST_ICONS = {
    "Vessel Delivery Checklist": "anchor",
    "Urgent Shipment Checklist": "clock",
    "Airfreight Quote Checklist": "plane",
    "Cargo Readiness Checklist": "box",
    "Pre-Alert Checklist": "send",
    "DG Pre-Check": "alert-triangle",
    "Customs Documentation Check": "file-text",
    "Warehouse Pickup Check": "warehouse",
    "Next Port Checklist": "map-pin",
    "Onboard Delivery Checklist": "ship",
    "Agent Coordination Checklist": "users",
    "Delay / Missed Deadline Checklist": "calendar-x",
    "FCL Sea Freight Booking Checklist": "ship",
    "LCL Sea Freight Checklist": "package",
    "Road Freight (FTL/LTL) Checklist": "truck",
    "New Operator First-Week Checklist": "compass",
    "Shift Handover Checklist": "users",
    "Rate Quote Sanity-Check Checklist": "file-text",
    "End-of-Shipment Closeout Checklist": "check-square",
    "Claims & Damage Checklist": "file-warning",
}

WORKFLOW_ICONS = {
    "Shipment Will Miss Vessel": "clock",
    "Supplier Hasn't Released Cargo": "package-x",
    "Airline Rejects Shipment": "plane-off",
    "Documents Are Missing": "file-warning",
    "Vessel Changes Port": "map-pin",
    "Cargo Cannot Be Delivered Onboard": "ship",
    "Customer Disputes the Invoice or Rate": "file-warning",
    "Cargo Fails Customs Inspection": "shield-check",
    "Driver or Trucker No-Show": "truck",
}

BONUS_ICONS = {
    "Vessel Information": "anchor",
    "Cargo Information": "package",
    "Customs Status": "shield-check",
    "Transport Options": "truck",
    "Required Documents": "file-text",
    "Backup Options": "check-square",
}

# ---------------------------------------------------------------------------
# HTML BUILDING
# ---------------------------------------------------------------------------

def esc(s):
    return _html.escape(s, quote=False)

def nl2br_esc(s):
    return esc(s).replace("\n", "<br>")

# ---------------------------------------------------------------------------
# ICON LIBRARY (inline SVG, lucide-style, matches the website's icon system)
# ---------------------------------------------------------------------------

ICONS = {
    "anchor": '<path d="M12 5v3m0 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm0 4v6.5M6 15c.6 2.3 2.7 4 6 4s5.4-1.7 6-4M8 8.3c.8-.8 2-1.1 2-1.1m8 1.1c-.8-.8-2-1.1-2-1.1"/>',
    "mail": '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
    "list-checks": '<path d="M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01"/>',
    "workflow": '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/>',
    "sparkles": '<path d="M12 3v3m0 12v3m9-9h-3M6 12H3m14.5-6.5-2 2m-9 9-2 2m0-13 2 2m9 9 2 2"/>',
    "ship": '<path d="M2 21c.6.5 1.3 1 2.5 1 2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 1.9.5 2.5 1"/><path d="M4 18l1-7h14l1 7"/><path d="M9 11V6a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v5"/>',
    "package": '<path d="M21 8a2 2 0 0 0-1-1.7l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.7l7 4a2 2 0 0 0 2 0l7-4a2 2 0 0 0 1-1.7Z"/><path d="M3.3 7 12 12l8.7-5M12 22V12"/>',
    "package-x": '<path d="m16.5 9.4-9-5.19"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0"/><path d="M3.27 6.96 12 12.01l8.73-5.05M12 22.08V12"/><path d="M17 17l4 4M21 17l-4 4"/>',
    "shield-check": '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/>',
    "alert-triangle": '<path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"/><path d="M12 9v4M12 17h.01"/>',
    "map-pin": '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
    "calendar": '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
    "calendar-x": '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18M17 17l-4-4M13 17l4-4"/>',
    "box": '<path d="M21 8a2 2 0 0 0-1-1.7l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.7l7 4a2 2 0 0 0 2 0l7-4a2 2 0 0 0 1-1.7Z"/><path d="M3.3 7 12 12l8.7-5M12 22V12"/>',
    "compass": '<circle cx="12" cy="12" r="9"/><path d="m14.5 9.5-5 2.5 2.5 2.5 2.5-5Z"/>',
    "send": '<path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>',
    "check-square": '<path d="m9 11 3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>',
    "truck": '<path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M14 9h4l3 4v4a1 1 0 0 1-1 1h-2"/><circle cx="7" cy="18" r="2"/><circle cx="19" cy="18" r="2"/>',
    "file-text": '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M9 13h6M9 17h6"/>',
    "gift": '<rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7M7.5 8a2.5 2.5 0 0 1 0-5C11 3 12 8 12 8s1-5 4.5-5a2.5 2.5 0 0 1 0 5"/>',
    "star": '<path d="M11.5 2.5c.2-.5.8-.5 1 0l2.2 4.7 5.1.7c.6.1.8.8.4 1.2l-3.7 3.6.9 5.1c.1.6-.5 1-1 .8L12 16l-4.4 2.6c-.5.3-1.1-.2-1-.8l.9-5.1L3.8 9.1c-.4-.4-.2-1.1.4-1.2l5.1-.7Z"/>',
    "warehouse": '<path d="M3 21V9l9-6 9 6v12M3 21h18M9 21v-6h6v6"/>',
    "plane": '<path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-1 .1-1.3.5l-.7.7c-.4.4-.3 1 .2 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.4 6.8c.3.5.9.6 1.3.2l.7-.7c.4-.3.6-.8.5-1.3Z"/>',
    "plane-off": '<path d="M10.6 6.6 21 3l-3.6 10.4"/><path d="m8 8-6.5 6.5"/><path d="M14 16l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2"/><path d="M2 2l20 20"/>',
    "clock": '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/>',
    "users": '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
    "search": '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
    "file-warning": '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M12 12v4M12 16.5h.01"/>',
}


def icon(name, size=14):
    return f'<svg width="{size}" height="{size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">{ICONS[name]}</svg>'


def icon_badge(name, size=24, icon_size=13, tone="ocean"):
    tones = {
        "ocean": "background:linear-gradient(135deg,#3fb6f2,#0b73b3);color:#fff;",
        "tint": "background:rgba(23,147,220,0.1);color:#0b73b3;",
        "navy": "background:linear-gradient(135deg,#1a3352,#0a1930);color:#7dd0fa;",
    }
    radius = max(6, round(size * 0.32))
    return (
        f'<span class="icon-badge" style="width:{size}px;height:{size}px;border-radius:{radius}px;{tones[tone]}">'
        f'{icon(name, icon_size)}</span>'
    )


CSS = """
@page { size: A4; margin: 20mm 18mm 22mm 18mm; }
* { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
html, body {
  margin: 0; padding: 0;
  font-family: -apple-system, "Segoe UI", Helvetica, Arial, sans-serif;
  color: #16233a; font-size: 10.3pt; line-height: 1.5;
}
.navy { color: #0a1930; }
.ocean { color: #0b73b3; }
.icon-badge { display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; }

/* ---- cover ---- */
.cover {
  height: 273mm; margin: -20mm -18mm 0 -18mm; padding: 34mm 20mm;
  background: linear-gradient(160deg, #040b1a 0%, #0a1930 55%, #0b2036 100%);
  color: #fff; position: relative; page-break-after: always; overflow: hidden;
}
.cover .route-graphic { position: absolute; right: 24px; bottom: 60px; width: 320px; height: 320px; opacity: 0.6; pointer-events: none; }
.cover .grid-overlay {
  position: absolute; inset: 0;
  background-image: linear-gradient(to right, rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.045) 1px, transparent 1px);
  background-size: 26px 26px;
}
.cover .mark {
  width: 54px; height: 54px; border-radius: 14px;
  background: linear-gradient(135deg, #3fb6f2, #0b73b3);
  display: flex; align-items: center; justify-content: center; margin-bottom: 26px;
  box-shadow: 0 10px 30px -8px rgba(23,147,220,0.55);
  position: relative;
}
.cover .mark svg { width: 28px; height: 28px; }
.cover .eyebrow { font-size: 10pt; letter-spacing: 2px; text-transform: uppercase; color: #7dd0fa; font-weight: 700; position: relative; }
.cover h1 { font-size: 30pt; line-height: 1.2; margin: 16px 0 0; font-weight: 800; letter-spacing: -0.5px; max-width: 480px; position: relative; }
.cover .tagline { margin-top: 18px; font-size: 12pt; color: #b9c6d6; max-width: 420px; line-height: 1.6; position: relative; }
.cover .stats { display: flex; gap: 28px; margin-top: 46px; position: relative; }
.cover .stat b { display: block; font-size: 20pt; color: #fff; }
.cover .stat span { font-size: 8.5pt; color: #8797ac; text-transform: uppercase; letter-spacing: 1px; }
.cover .footer-note { position: absolute; bottom: 32mm; left: 20mm; right: 20mm; font-size: 8.5pt; color: #64748b; border-top: 1px solid rgba(255,255,255,0.12); padding-top: 14px; }

/* ---- intro / toc ---- */
.intro-page { page-break-after: always; }
.intro-page h2 { font-size: 18pt; color: #0a1930; margin-bottom: 6px; }
.intro-page p.lead { color: #45536b; font-size: 10.5pt; max-width: 480px; }
.toc { margin-top: 26px; border-top: 1px solid #dbe3ee; }
.toc-row { display: flex; align-items: center; gap: 14px; padding: 12px 0; border-bottom: 1px solid #dbe3ee; font-size: 10.3pt; }
.toc-row .t { flex: 1; color: #16233a; font-weight: 600; }
.toc-row .d { color: #8797ac; font-size: 9pt; }
.toc-row.incoterm-row .t { flex: 0 0 230px; }

/* ---- section header ---- */
.section-break { page-break-before: always; }
.section-head { display: flex; align-items: center; gap: 14px; border-bottom: 2.5px solid #0b73b3; padding-bottom: 14px; margin-bottom: 20px; }
.section-head .icon-badge { box-shadow: 0 8px 20px -6px rgba(23,147,220,0.45); }
.section-head .eyebrow { font-size: 8.5pt; letter-spacing: 1.5px; text-transform: uppercase; color: #0b73b3; font-weight: 700; }
.section-head h2 { font-size: 17pt; color: #0a1930; margin: 4px 0 0; }
.section-head p { color: #45536b; font-size: 9.7pt; margin-top: 4px; }

/* ---- email templates ---- */
.cat-title { display: flex; align-items: center; gap: 9px; font-size: 11.5pt; font-weight: 700; color: #0a1930; margin: 22px 0 10px; padding-bottom: 6px; border-bottom: 1px solid #dbe3ee; page-break-after: avoid; break-after: avoid; }
.cat-title:first-of-type { margin-top: 0; }
.tpl { border: 1px solid #dbe3ee; border-radius: 8px; padding: 12px 14px; margin-bottom: 12px; break-inside: avoid; }
.tpl .tpl-title { font-size: 9.6pt; font-weight: 700; color: #0b73b3; margin-bottom: 6px; }
.tpl .tpl-subject { font-size: 9.3pt; color: #16233a; background: #f1f5f9; border-radius: 5px; padding: 5px 9px; margin-bottom: 8px; }
.tpl .tpl-subject b { color: #45536b; font-weight: 600; }
.tpl .tpl-body { font-size: 9.2pt; color: #2c3a52; white-space: pre-wrap; }

/* ---- checklists ---- */
.checklist-block { break-inside: avoid; margin-bottom: 18px; }
.checklist-block h3 { display: flex; align-items: center; gap: 9px; font-size: 11.5pt; color: #0a1930; margin: 0 0 9px; padding-bottom: 6px; border-bottom: 1px solid #dbe3ee; }
.check-row { display: flex; align-items: flex-start; gap: 8px; padding: 3.5px 0; font-size: 9.6pt; color: #2c3a52; }
.box { width: 10px; height: 10px; border: 1.6px solid #0b73b3; border-radius: 2.5px; flex-shrink: 0; margin-top: 2px; }

/* ---- workflows ---- */
.workflow { break-inside: avoid; margin-bottom: 18px; border-left: 3px solid #0b73b3; padding-left: 14px; }
.workflow h3 { display: flex; align-items: center; gap: 9px; font-size: 12pt; color: #0a1930; margin: 0 0 9px; }
.wf-step { display: flex; gap: 9px; padding: 4px 0; font-size: 9.6pt; color: #2c3a52; }
.wf-num { width: 18px; height: 18px; border-radius: 50%; background: #0b73b3; color: #fff; font-size: 8pt; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }

/* ---- ai prompts ---- */
.prompt-block { break-inside: avoid; margin-bottom: 16px; }
.prompt-block h3 { display: flex; align-items: center; gap: 9px; font-size: 11.5pt; color: #0a1930; margin: 0 0 8px; }
.prompt-box { background: #0a1930; color: #dbe3ee; border-radius: 8px; padding: 13px 15px; font-family: "Courier New", monospace; font-size: 8.7pt; white-space: pre-wrap; line-height: 1.55; }

/* ---- bonus one-pager ---- */
.bonus-page { page-break-before: always; }
.bonus-card { border: 2px solid #0a1930; border-radius: 12px; padding: 24px 26px; }
.bonus-card .bh { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #dbe3ee; padding-bottom: 14px; margin-bottom: 16px; }
.bonus-card .bh-left { display: flex; align-items: center; gap: 12px; }
.bonus-card .bh h2 { font-size: 15pt; color: #0a1930; margin: 0; }
.bonus-card .bh span { font-size: 8.5pt; color: #8797ac; text-transform: uppercase; letter-spacing: 1px; }
.bonus-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px 26px; }
.bonus-cat h4 { display: flex; align-items: center; gap: 8px; font-size: 9.8pt; color: #0b73b3; text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 8px; }

/* ---- disclaimer / back page ---- */
.back-page { page-break-before: always; }
.disc { border: 1px solid #f3d9a8; background: #fdf6e8; border-radius: 8px; padding: 16px 18px; font-size: 9.5pt; color: #6b5215; margin-top: 24px; }
.disc svg { float: left; margin: 1px 8px 0 0; color: #b45309; }

/* ---- footer / page number ---- */
.pagefoot { position: fixed; bottom: -14mm; left: 0; right: 0; font-size: 8pt; color: #94a3b8; display: flex; justify-content: space-between; }
"""


def render_route_graphic():
    # Decorative abstract "shipping route" illustration for the cover —
    # a dashed course line between three waypoints with a vessel icon,
    # echoing the maritime brand direction without using stock photography.
    # All coordinates stay well inside the 340x340 viewBox so nothing is
    # clipped by the cover's overflow:hidden edge.
    return """
<svg class="route-graphic" viewBox="0 0 340 340" fill="none">
  <path d="M20 300 C 110 280, 130 210, 90 170 S 50 90, 150 70 S 270 55, 300 30"
        stroke="#3fb6f2" stroke-width="2.5" stroke-dasharray="1 10" stroke-linecap="round"/>
  <circle cx="20" cy="300" r="5" fill="#3fb6f2"/>
  <circle cx="90" cy="170" r="5" fill="#3fb6f2"/>
  <circle cx="150" cy="70" r="5" fill="#3fb6f2"/>
  <g transform="translate(266, 6) rotate(18)">
    <circle cx="24" cy="24" r="32" fill="rgba(63,182,242,0.10)"/>
    <path d="M8 27c1.6 1.3 3.4 2.6 6.5 2.6 6.5 0 6.5-5.2 13-5.2s6.5 5.2 13 5.2c1.3 0 2.1-.5 2.5-1"
          stroke="#7dd0fa" stroke-width="1.8" stroke-linecap="round" fill="none"/>
    <path d="M12 21l2.5-9h15l2.5 9" stroke="#7dd0fa" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    <path d="M23 14V6.5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1V14" stroke="#7dd0fa" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  </g>
</svg>
"""


def render_cover(premium=False):
    email_count = PREMIUM_EMAIL_TEMPLATE_COUNT if premium else BASE_EMAIL_TEMPLATE_COUNT
    checklist_count = PREMIUM_CHECKLIST_COUNT if premium else BASE_CHECKLIST_COUNT
    badge = (
        f'<div style="position:relative;display:inline-flex;align-items:center;gap:6px;background:linear-gradient(135deg,#f6c453,#e08a1e);'
        f'color:#2b1a03;font-size:8.5pt;font-weight:800;letter-spacing:1px;text-transform:uppercase;border-radius:999px;padding:5px 13px;margin-bottom:14px;">'
        f'{icon("star", 11)}Premium Edition</div><br>'
        if premium
        else ""
    )
    return f"""
<div class="cover">
  <div class="grid-overlay"></div>
  {render_route_graphic()}
  <div class="mark">{icon("anchor", 26)}</div>
  {badge}
  <div class="eyebrow">For Marine &amp; Vessel Logistics Operators</div>
  <h1>Marine Logistics<br>Operator Toolkit</h1>
  <div class="tagline">Email templates, operational checklists, shipment problem workflows and AI operator prompts — built to be used during daily operations, not read once and shelved.</div>
  <div class="stats">
    <div class="stat"><b>{email_count}</b><span>Email Templates</span></div>
    <div class="stat"><b>{checklist_count}</b><span>Checklists</span></div>
    <div class="stat"><b>{WORKFLOW_COUNT}</b><span>Workflows</span></div>
    <div class="stat"><b>{AI_PROMPT_COUNT}</b><span>AI Prompts</span></div>
  </div>
  <div class="footer-note">Marine Logistics Operator Toolkit — Edition 1.0 &nbsp;·&nbsp; Educational &amp; operational reference. Not a substitute for formal DG, customs or regulatory training.</div>
</div>
"""


def render_intro(premium=False):
    email_line = (
        f"{PREMIUM_EMAIL_TEMPLATE_COUNT} templates across {PREMIUM_EMAIL_CATEGORY_COUNT} categories"
        if premium
        else f"{BASE_EMAIL_TEMPLATE_COUNT} templates across {BASE_EMAIL_CATEGORY_COUNT} categories"
    )
    checklist_line = f"{PREMIUM_CHECKLIST_COUNT} checklists" if premium else f"{BASE_CHECKLIST_COUNT} checklists"
    rows = [
        ("1", "compass", "Quick-Start Guide", "Your first month, phase by phase"),
        ("2", "mail", "Email Templates", email_line),
        ("3", "list-checks", "Operational Checklists", checklist_line),
        ("4", "workflow", "Shipment Problem Workflows", f"{WORKFLOW_COUNT} workflows"),
        ("5", "sparkles", "AI Operator Prompts", f"{AI_PROMPT_COUNT} ready-to-use prompts"),
        ("6", "search", "Glossary & Incoterms Reference", f"{GLOSSARY_COUNT} terms + {INCOTERMS_COUNT} Incoterms explained"),
    ]
    if premium:
        rows.append(("7", "star", "Premium Bonus: Advanced Operator Templates", f"{PREMIUM_BONUS_TEMPLATE_COUNT} templates + claims checklist"))
        rows.append(("8", "gift", "Bonus: Emergency Vessel Shipment Checklist", "1-page reference"))
    else:
        rows.append(("7", "gift", "Bonus: Emergency Vessel Shipment Checklist", "1-page reference"))
    toc = "".join(
        f'<div class="toc-row">{icon_badge(ic, size=26, icon_size=13, tone="tint")}'
        f'<div class="t">{esc(t)}</div><div class="d">{esc(d)}</div></div>'
        for n, ic, t, d in rows
    )
    return f"""
<div class="intro-page">
  <div class="eyebrow ocean" style="font-size:8.5pt;letter-spacing:1.5px;text-transform:uppercase;font-weight:700;">How to Use This Toolkit</div>
  <h2>A practical reference, not a course</h2>
  <p class="lead">This toolkit is built to be used <i>while</i> you're working: identify the situation you're in, open the matching checklist, workflow, template or prompt, and use it directly. It does not replace formal training — dangerous goods, customs and regulatory requirements must always be confirmed with qualified parties and the relevant carrier, authority or logistics provider.</p>
  <div class="toc">{toc}</div>
</div>
"""


def render_section_head(eyebrow, title, desc, icon_name):
    return f"""
<div class="section-head">
  {icon_badge(icon_name, size=40, icon_size=19)}
  <div>
    <div class="eyebrow">{esc(eyebrow)}</div>
    <h2>{esc(title)}</h2>
    <p>{esc(desc)}</p>
  </div>
</div>
"""


def render_quickstart():
    body = render_section_head("Section 1", "Quick-Start Guide", "New to the role? Here's a suggested order to work through the toolkit over your first month.", "compass")
    for q in QUICK_START:
        steps = "".join(
            f'<div class="wf-step"><div class="wf-num">{i+1}</div><div>{esc(s)}</div></div>'
            for i, s in enumerate(q["steps"])
        )
        body += f'<div class="workflow"><h3>{esc(q["phase"])}</h3>{steps}</div>'
    return f'<div class="section-break">{body}</div>'


def render_reference():
    body = render_section_head("Section 6", "Glossary & Incoterms Reference", "Plain-language definitions for the abbreviations and terms used throughout this toolkit.", "search")
    glossary_rows = "".join(
        f'<div class="toc-row"><div class="t">{esc(term)}</div><div class="d">{esc(definition)}</div></div>'
        for term, definition in GLOSSARY
    )
    body += f'<div class="cat-title">Glossary</div><div class="toc">{glossary_rows}</div>'
    incoterms_rows = "".join(
        f'<div class="toc-row incoterm-row"><div class="t">{esc(term)}</div><div class="d">{esc(definition)}</div></div>'
        for term, definition in INCOTERMS
    )
    body += f'<div class="cat-title" style="margin-top:26px;">Incoterms 2020 — Quick Reference</div><div class="toc">{incoterms_rows}</div>'
    return f'<div class="section-break">{body}</div>'


def render_emails():
    body = render_section_head("Section 2", f"{BASE_EMAIL_TEMPLATE_COUNT} Professional Email Templates", "Ready-to-send templates for the messages operators write every day. Replace anything in [brackets] with your shipment's real details.", "mail")
    for cat in EMAIL_CATEGORIES:
        cat_icon = icon_badge(EMAIL_CATEGORY_ICONS.get(cat["name"], "mail"), size=22, icon_size=11, tone="tint")
        body += f'<div class="cat-title">{cat_icon}{esc(cat["name"])}</div>'
        for t in cat["templates"]:
            body += f"""
<div class="tpl">
  <div class="tpl-title">{esc(t["title"])}</div>
  <div class="tpl-subject"><b>Subject:</b> {esc(t["subject"])}</div>
  <div class="tpl-body">{nl2br_esc(t["body"])}</div>
</div>
"""
    return f'<div class="section-break">{body}</div>'


def render_checklists():
    body = render_section_head("Section 3", f"{BASE_CHECKLIST_COUNT} Operational Checklists", "Step-by-step checklists to verify cargo, documents and vessel requirements before you commit to a plan.", "list-checks")
    for c in CHECKLISTS:
        rows = "".join(f'<div class="check-row"><div class="box"></div><div>{esc(item)}</div></div>' for item in c["items"])
        h_icon = icon_badge(CHECKLIST_ICONS.get(c["name"], "list-checks"), size=22, icon_size=11, tone="tint")
        body += f'<div class="checklist-block"><h3>{h_icon}{esc(c["name"])}</h3>{rows}</div>'
    return f'<div class="section-break">{body}</div>'


def render_workflows():
    body = render_section_head("Section 4", f"{WORKFLOW_COUNT} Shipment Problem Workflows", "Decision paths for the situations that derail an otherwise smooth shipment.", "workflow")
    for w in WORKFLOWS:
        steps = "".join(
            f'<div class="wf-step"><div class="wf-num">{i+1}</div><div>{esc(s)}</div></div>'
            for i, s in enumerate(w["steps"])
        )
        h_icon = icon_badge(WORKFLOW_ICONS.get(w["trigger"], "workflow"), size=24, icon_size=12, tone="ocean")
        body += f'<div class="workflow"><h3>{h_icon}{esc(w["trigger"])}</h3>{steps}</div>'
    return f'<div class="section-break">{body}</div>'


def render_prompts():
    body = render_section_head("Section 5", f"{AI_PROMPT_COUNT} AI Operator Prompts", "Paste your shipment details into any AI assistant along with the prompt below to get a usable draft in seconds.", "sparkles")
    for p in AI_PROMPTS:
        h_icon = icon_badge("sparkles", size=22, icon_size=11, tone="navy")
        body += f"""
<div class="prompt-block">
  <h3>{h_icon}{esc(p["title"])}</h3>
  <div class="prompt-box">{nl2br_esc(p["prompt"])}</div>
</div>
"""
    return f'<div class="section-break">{body}</div>'


def render_bonus():
    cats = ""
    for c in BONUS_CHECKLIST:
        rows = "".join(f'<div class="check-row"><div class="box"></div><div>{esc(item)}</div></div>' for item in c["items"])
        h_icon = icon_badge(BONUS_ICONS.get(c["category"], "check-square"), size=18, icon_size=10, tone="tint")
        cats += f'<div class="bonus-cat"><h4>{h_icon}{esc(c["category"])}</h4>{rows}</div>'
    return f"""
<div class="bonus-page">
  <div class="section-head">
    {icon_badge("gift", size=40, icon_size=19)}
    <div>
      <div class="eyebrow">Bonus</div>
      <h2>Emergency Vessel Shipment Checklist</h2>
      <p>A compact one-page checklist for urgent vessel shipments — work through it top to bottom.</p>
    </div>
  </div>
  <div class="bonus-card">
    <div class="bh">
      <div class="bh-left">{icon_badge("anchor", size=32, icon_size=16)}<h2>Emergency Vessel Shipment</h2></div>
      <span>One-Page Checklist</span>
    </div>
    <div class="bonus-grid">{cats}</div>
  </div>
</div>
"""


def render_back():
    head = render_section_head(
        "Before You Go",
        "A Practical Reference — Not a Substitute for Training",
        "Use this toolkit to work more systematically and communicate more professionally.",
        "shield-check",
    )
    return f"""
<div class="back-page">
  {head}
  <div class="disc">
    {icon("alert-triangle", 16)}This toolkit is an educational and operational reference. Dangerous goods, customs and
    regulatory requirements must always be confirmed with qualified parties and the relevant
    carrier, authorities or logistics provider. It does not replace formal DG training,
    certification, or professional legal/customs advice.
  </div>
  <p style="margin-top:28px;font-size:9.5pt;color:#45536b;">
    Questions or team licensing requests: <b>support@marinelogisticstoolkit.com</b><br>
    &copy; Marine Logistics Operator Toolkit. All rights reserved.
  </p>
</div>
"""


def render_premium_bonus():
    cat = PREMIUM_EMAIL_CATEGORY
    body = render_section_head(
        "Premium Bonus",
        f"{PREMIUM_BONUS_TEMPLATE_COUNT} Advanced Operator Templates",
        "Extra templates for the less everyday, higher-stakes situations — included with Premium.",
        "star",
    )
    cat_icon = icon_badge(EMAIL_CATEGORY_ICONS.get(cat["name"], "star"), size=22, icon_size=11, tone="tint")
    body += f'<div class="cat-title">{cat_icon}{esc(cat["name"])}</div>'
    for t in cat["templates"]:
        body += f"""
<div class="tpl">
  <div class="tpl-title">{esc(t["title"])}</div>
  <div class="tpl-subject"><b>Subject:</b> {esc(t["subject"])}</div>
  <div class="tpl-body">{nl2br_esc(t["body"])}</div>
</div>
"""
    c = PREMIUM_CHECKLIST
    rows = "".join(f'<div class="check-row"><div class="box"></div><div>{esc(item)}</div></div>' for item in c["items"])
    h_icon = icon_badge(CHECKLIST_ICONS.get(c["name"], "file-warning"), size=22, icon_size=11, tone="tint")
    body += f'<div class="checklist-block" style="margin-top:22px;"><h3>{h_icon}{esc(c["name"])}</h3>{rows}</div>'
    return f'<div class="section-break">{body}</div>'


def build(premium=False):
    premium_section = render_premium_bonus() if premium else ""
    html_doc = f"""<!doctype html>
<html><head><meta charset="utf-8">
<title>Marine Logistics Operator Toolkit{" — Premium" if premium else ""}</title>
<style>{CSS}</style>
</head><body>
{render_cover(premium)}
{render_intro(premium)}
{render_quickstart()}
{render_emails()}
{render_checklists()}
{render_workflows()}
{render_prompts()}
{render_reference()}
{premium_section}
{render_bonus()}
{render_back()}
</body></html>"""
    return html_doc


if __name__ == "__main__":
    out = build(premium=False)
    with open("toolkit.html", "w", encoding="utf-8") as f:
        f.write(out)
    print("wrote toolkit.html (standard)", len(out), "bytes")

    out_premium = build(premium=True)
    with open("toolkit-premium.html", "w", encoding="utf-8") as f:
        f.write(out_premium)
    print("wrote toolkit-premium.html", len(out_premium), "bytes")
