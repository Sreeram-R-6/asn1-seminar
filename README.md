# ASN.1 interactive seminar

Open **index.html** in a modern browser. There is no build step and no frontend dependency installation. The lesson, controls and bundled fonts work offline.

For a local web server, run from this folder:

```powershell
python -m http.server 8000 --bind 127.0.0.1
```

Then open http://127.0.0.1:8000.

## Teaching controls

- Left / right arrow or Page Up / Page Down: previous / next slide.
- Home / End: first / last slide.
- G: chapter and slide overview.
- N: teaching notes.
- F: browser fullscreen, subject to browser permission/support.
- Present: request browser fullscreen and hide the HUD. Escape exits fullscreen and restores the website layout.
- Click the rightmost screen area: next slide. Click the leftmost area: previous slide (in presentation mode).
- H: show or hide the presentation HUD. N displays notes when the HUD is shown.
- Pause button: pauses the illustrative packet animation.
- Auto-play: advances every 18 seconds; stops on manual navigation, a dialog, tab hiding, or the last slide.
- Sources → Print lesson / save PDF: print all 20 slides, textbook problem answers and notes.

Present invokes the Fullscreen API directly from the click handler. If the browser rejects or does not support it, the HUD-free layout still fills the browser window and a message explains the limitation. Reduced-motion preferences are respected. Native dialogs support keyboard focus trapping and Escape.

## Content and scope

The lesson covers **ASN.1 (Abstract Syntax Notation One)**, as requested by the supplied textbook, not Autonomous System Numbers. Core content follows section 9.3, printed pages 722–726. The supplied file has nine PDF pages corresponding to printed pages 722–730.

The core lesson is limited to ASN.1. The introduction is expanded with a student-form analogy and an explanation of abstract syntax. The SNMP context slide, BER labs, general quiz and unrelated challenge have been removed. Encoding receives only the brief introduction included in section 9.3.3.

The final four slides answer P9-17, P9-18, P9-20 and P9-21, which explicitly request ASN.1 definitions. Figures 9.18 and 9.19 are outside the supplied extract; standard structures are supplemented from RFC 1157 and RFC 1155. P9-20 is labeled as a community-based SNMPv1 message structure, not an SNMPv3 envelope. Source mapping is in [docs/SOURCES.md](docs/SOURCES.md).

## Skills

Nine existing UI/frontend skills were copied into `.agents/skills/` for this project. See [docs/SKILLS.md](docs/SKILLS.md). Global installation was not possible because only this workspace is writable. These copies do not represent every frontend skill in every registry.
