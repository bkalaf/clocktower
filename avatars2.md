//avatars2.md


Got it. Your current prompts are engineered for **static, readable tokens**, so the model keeps giving you **posed passport photos** with “responsible lighting” and “neutral expression.” That’s why they feel lifeless and drab.

To steer toward what you want—**vibrant color, theatrical fantasy, dynamic action, themed professions/props**—you need three big changes:

1. **Stop demanding “waist-up portrait + neutral background”** as the default.
2. Add **action + narrative moment + environment + magical/occupational props**.
3. Explicitly request **richer palette + dramatic lighting + expressive face**.

Below is a reusable **Style/Direction Block** and then rewritten prompts for each of your filenames (keeping your identity/role guidelines, but loosening them into “job flavor” rather than shackles).

---

## Global Style/Direction Block (prepend to every prompt)

**Style:** vibrant high-fantasy character illustration (game key art / card art), idealized realism, strong silhouette readability, expressive face and body language, saturated but tasteful color palette, high contrast, cinematic dramatic lighting (rim light + colored bounce light), dynamic composition, rich textures (cloth, leather, metal), magical VFX when relevant (glow, sparks, embers, mist).

**Shot:** full-body or 3/4 body preferred; waist-up allowed but not required.
**Scene:** action moment, clear story beat, themed props (weapons/tools/religious regalia), environment that supports the role (forge, chapel, moonlit woods, market, docks).
**Mood:** lively, character-forward, “caught in the act,” not posed.

**Hard constraints:** medieval-fantasy-adjacent (no modern clothing), no text, no watermark, no caricature.

(If you still need tokens later, we can do a second pass with “token crop” instructions; right now you’re style-finding, so go big.)


---

## One extra trick that helps a lot

Add this line near the top of every prompt:

**“Vibrant color palette, higher saturation, dynamic pose, expressive face; avoid muted/gray grading.”**

Also consider explicitly banning the “posed portrait look”:

**“Not a static posed portrait; capture a mid-action moment.”**

You’ll notice these edits also naturally push the model toward **full-body/3/4 compositions**, which is what you want for swords/cauldrons/rituals/forges.

If you want to go even harder into a specific vibe (e.g., *Diablo grimdark*, *Hearthstone colorful*, *MTG painterly-card*, *JRPG cinematic*), you can add a single “style target line” and I’ll tune the whole batch to that aesthetic.
