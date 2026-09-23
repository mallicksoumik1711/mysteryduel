# MysteryDuel Design Guidelines

These principles guide the design of MysteryDuel interfaces, game screens, components, and future product surfaces.

The goal is to create an interface that feels focused, readable, competitive, and intentional without becoming visually noisy.

Use the existing component patterns and Tailwind CSS setup. Prefer extending established patterns over introducing a separate visual system for individual screens.

## Start With the Player's Goal

MysteryDuel is a two-player character guessing game.

The player's primary goal is to identify the opponent's secret character by asking questions and eliminating characters.

Before designing a screen, establish:

* What is the player trying to accomplish?
* What information does the player need right now?
* What action should the player take next?
* What game state needs to be immediately understood?
* What information must remain private?

The interface should make the current objective obvious without requiring the player to search through the UI.

For the main game screen, the hierarchy should generally be:

1. Current game state and turn
2. Character board
3. Question/action area
4. Supporting information

The character board is the primary object of the game and should receive the majority of the visual attention.

## Design Around the Game Board

The character grid is the central interaction surface.

Characters should be easy to scan, compare, select, and eliminate.

Character cards should communicate their state clearly:

* Available
* Selected
* Eliminated
* Correct guess
* Incorrect guess
* Disabled

Do not rely only on color to communicate these states. Use changes in opacity, borders, icons, text, or other visual cues where appropriate.

The grid should maintain consistent card dimensions and alignment.

Equivalent characters should have equivalent visual treatment. Avoid giving individual characters unnecessary visual emphasis unless their state requires it.

## Make Turns Obvious

MysteryDuel is turn-based, so the player must always understand whose turn it is.

The interface should clearly communicate:

* Your turn
* Opponent's turn
* Waiting for opponent
* Question being processed
* Game over

Turn state should be visible without interrupting the player's view of the board.

Avoid excessive animations or attention-grabbing effects for turn changes.

Motion should primarily communicate a meaningful state transition.

## Questions Should Be Easy to Understand

Questions are the player's primary tool for gathering information.

Questions should be:

* Short
* Specific
* Easy to scan
* Grouped logically
* Clearly associated with the character attributes they target

For example:

> Does the character have a beard?

is preferable to a long or ambiguous question.

Question categories can be used when they improve discovery, but categories should not create unnecessary navigation.

The player should understand what will happen before submitting a question.

## Protect Private Game Information

The client must never visually expose information that belongs to the opponent's private game state.

The UI should clearly distinguish between:

* Public game information
* The player's own information
* Information learned through questions
* Private opponent information

The opponent's secret character should never be revealed until the game rules allow it.

This principle also applies to loading states, errors, debugging information, and future spectator or replay features.

## Typography and Visual Hierarchy

Use the project's configured sans-serif typeface for interface text.

Use typography to establish hierarchy before relying on borders, backgrounds, shadows, or color.

Use:

* Clear page/game titles
* Readable body text
* Compact labels
* Distinct action text
* Subdued supporting information

Use sentence case for headings and labels.

Avoid:

* Excessive uppercase text
* Excessive letter spacing
* Tiny text
* Arbitrary font sizes
* Multiple competing heading styles

Related information should share the same typographic treatment.

## Color System and Palette

The visual theme uses a **Cinematic Crimson & Obsidian (Warm Dark Mode)** aesthetic. It provides a dark, atmospheric backdrop that brings maximum visual focus to the character images on the board.

### 1. Canvas & Atmospheric Colors

| Role | Color Name | Hex / CSS Value | Tailwind Class / Usage |
| :--- | :--- | :--- | :--- |
| **Canvas Background** | Obsidian Black | `#0f0608` | `bg-[#0f0608]` |
| **Vignette Spotlight** | Deep Mahogany Wine | `#2b1018` | Top-center radial radial gradient `from-[#2b1018]` |
| **Vignette Midtone** | Dark Charcoal Plum | `#160a0d` | Radial gradient `via-[#160a0d]` |
| **Vignette Outer** | Deep Espresso Black | `#0a0306` | Edge backdrop `to-[#0a0306]` |
| **Ambient Side Glow** | Burnt Amber Glow | `rgba(120,50,20,0.55)` | Left/Right atmospheric screen flares |

### 2. Typography & Interactive Colors

| Role | Color Name | Hex Code | Tailwind Equivalent |
| :--- | :--- | :--- | :--- |
| **Primary Headings** | Pure White | `#ffffff` | `text-white` |
| **Body & Primary Text**| Zinc 100 | `#f4f4f5` | `text-zinc-100` |
| **Secondary Copy** | Zinc 400 | `#a1a1aa` | `text-zinc-400` |
| **Subdued Labels** | Zinc 500 | `#71717a` | `text-zinc-500` |
| **Inverted CTA Text** | Zinc 950 | `#09090b` | `text-zinc-950` (Used on primary white buttons) |

### 3. Surface, Border & Glass Accents

* **Primary Buttons:** `bg-zinc-100` with hover state `hover:bg-white` and high-contrast dark text (`text-zinc-950`).
* **Secondary / Glass Surfaces:** `bg-white/5` with borders `border-white/20`.
* **Subtle Card Borders:** `ring-1 ring-inset ring-white/10`.
* **Elevated Shadows:** `shadow-[0_20px_50px_rgba(0,0,0,0.85)]`.

### 4. Tailwind Config Extension

Extend `tailwind.config.js` to standardize these theme tokens:

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        obsidian: {
          DEFAULT: '#0f0608',
          vignette: '#2b1018',
          mid: '#160a0d',
          outer: '#0a0306',
        },
        flare: {
          amber: 'rgba(120, 50, 20, 0.55)',
        },
      },
      backgroundImage: {
        'hero-vignette': 'radial-gradient(ellipse 90% 70% at 50% 40%, #2b1018 0%, #160a0d 45%, #0a0306 100%)',
        'flare-left': 'linear-gradient(to right, rgba(120,50,20,0.55) 0%, transparent 100%)',
        'flare-right': 'linear-gradient(to left, rgba(120,50,20,0.55) 0%, transparent 100%)',
      },
    },
  },
};

## Practice Visual Restraint

MysteryDuel should feel like a game, but it does not need constant visual effects to communicate that.

Prefer:

* Clear hierarchy
* Strong alignment
* Deliberate spacing
* Meaningful contrast
* Clear interaction states

Avoid:

* Decorative gradients
* Excessive glows
* Decorative blobs
* Glass effects
* Heavy shadows
* Unnecessary borders
* Excessive rounded containers
* Decorative icons
* Animations that do not communicate game state

Color should communicate meaning.

For example:

* Action
* Selection
* Elimination
* Success
* Error
* Turn state

Do not use color purely as decoration when it could make the interface harder to understand.

## Surfaces and Containers

Not every section needs a card.

Use a surface, border, radius, or shadow when it communicates:

* Grouping
* Interaction
* Selection
* Game state
* Separation between competing areas

Otherwise, use spacing and alignment.

The interface should feel like one coherent game board rather than a collection of unrelated cards.

## Character Cards

Character cards are one of the most important reusable components in the application.

A character card should primarily communicate:

* Character image
* Character name
* Relevant visual attributes
* Current state

The default card should remain visually simple.

States should be predictable:

```text
Available
    ↓
Selected
    ↓
Eliminated
```

A selected or eliminated character should remain recognizable so the player can remember who they have already considered.

Do not permanently remove eliminated characters from the board unless the game design explicitly requires it. Maintaining their position makes the board easier to scan.

## Responsive Design

MysteryDuel must work across desktop and narrow screens.

Do not simply shrink the desktop layout.

Instead, recompose the interface.

For example:

Desktop:

```text
┌──────────────────────────────────────────────┐
│ Game information                             │
├─────────────────────────────┬────────────────┤
│                             │                │
│       Character Grid        │ Questions      │
│                             │                │
│                             │                │
└─────────────────────────────┴────────────────┘
```

Mobile:

```text
┌──────────────────────┐
│ Game information     │
├──────────────────────┤
│ Character Grid       │
│                      │
├──────────────────────┤
│ Questions            │
└──────────────────────┘
```

The character grid should reflow naturally.

Do not hide important game information simply because the viewport is smaller.

Avoid horizontal page overflow.

## Accessibility

Use semantic HTML and native controls wherever possible.

Interactive elements must have clear accessible names.

Support:

* Keyboard navigation
* Visible focus states
* Sufficient contrast
* Screen-reader-friendly labels
* Logical reading order

Do not communicate important game states through color alone.

For example, an eliminated character should not be represented only by changing from one color to another.

## Interaction States

Every interactive component should consider its relevant states.

For buttons:

```text
Default
Hover
Focus
Active
Disabled
Loading
```

For character cards:

```text
Available
Hover
Selected
Eliminated
Disabled
```

For game state:

```text
Waiting
Your Turn
Opponent's Turn
Processing
Game Over
```

The player should always understand why an action is unavailable.

## Motion

Use motion only when it helps explain a state change or confirms an action.

Good uses:

* Character elimination
* Turn transition
* Question submission
* Game result
* Connection state changes

Avoid:

* Constant movement
* Pulsing elements without meaning
* Parallax
* Scroll animations
* Bounce effects
* Decorative transitions

The game should remain usable even if animations are disabled or reduced.

## Component Design

Build reusable components around meaningful responsibilities.

For example:

```text
GameBoard
CharacterGrid
CharacterCard
QuestionPanel
QuestionButton
GameHeader
TurnIndicator
GameResult
```

Avoid creating components purely because a piece of markup exists.

A component should generally exist because it:

* Has its own behavior
* Has meaningful state
* Is reused
* Represents a meaningful part of the game

Keep game logic separate from presentation where practical.

## Data-Driven UI

Do not hardcode repeated character or question markup.

Characters should come from data:

```ts
characters.map((character) => (
  <CharacterCard
    key={character.id}
    character={character}
  />
))
```

Questions should also come from data.

This allows the same UI to work when we eventually replace mock data with data from FastAPI.

## Game State and UI State

Keep a clear distinction between game state and temporary UI state.

Game state includes things such as:

```text
players
characters
secret character
current turn
questions
answers
eliminated characters
winner
```

UI state includes things such as:

```text
selected character
open question menu
hover state
loading state
modal visibility
```

The backend will eventually be authoritative for multiplayer game state.

The frontend should not assume that its local state is the source of truth for the game.

## Review Before Considering a Screen Finished

Review every major screen at desktop and narrow widths.

Check in this order:

1. Is the player's current objective obvious?
2. Is the character board clearly the primary object?
3. Is the current turn immediately understandable?
4. Can the player scan and compare characters easily?
5. Are available and eliminated characters clearly distinguishable?
6. Are questions easy to discover and understand?
7. Is important information visible without unnecessary interaction?
8. Are spacing and alignment intentional?
9. Can unnecessary borders, surfaces, icons, or effects be removed?
10. Does the interface work with keyboard navigation and accessible controls?
11. Does the layout reflow correctly on narrow screens?
12. Does the UI avoid revealing private opponent information?

Fix structural problems before adding decorative styling.

## Design Principle

MysteryDuel should feel like a focused deduction game.

The interface should make the reasoning process visible:

```text
Observe
   ↓
Ask
   ↓
Learn
   ↓
Eliminate
   ↓
Narrow the possibilities
   ↓
Guess
```

Every major UI decision should support that loop.
