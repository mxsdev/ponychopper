# ponychopper

<p align="center">
  <img width="554" alt="Screen Shot 2022-12-02 at 4 37 25 PM" src="https://user-images.githubusercontent.com/16108792/205401498-7638d9d2-26bc-4755-b246-ad6ac8924ad0.png">
</p>

Ponychopper is a desktop application developed to improve the workflow of composing sample-based music genres such as [plunderphonics][plunderphonics] and hip-hop.

It works by randomly iterating through a user-defined list of [chop regions](#notating-a-file) and filtering by user provided filter options. This allows the musician to rapidly cycle through possibilities without deviating from certain restrictions (such as staying within a certain key).

This vastly improves the workflow experience and allows the musician to focus on what really matters: making great music!

[plunderphonics]: https://en.wikipedia.org/wiki/Plunderphonics

## Installation

Install ponychopper through the [releases][releases] page, where you'll find the binary for your operating system.

[releases]: https://github.com/mxsdev/ponychopper/releases

## Usage

### Chop

Click the knife button or press `C` on your keyboard.

### Use a Chop

<p align="center">
  <img src="https://user-images.githubusercontent.com/16108792/205450049-28feffeb-b157-420a-9052-8491b8b4fa86.gif">
</p>

To use a chop in your music software, simply click and drag!

## Filtering

Ponychopper provides a variety of filtering options, most of which should be fairly self-explanatory to use.

Note that filter values are determined based on [cue points](#audio-format).

### Range Sliders

Within filtering options, there are many range sliders, each having a switch next to it.

When the switch is on, the slider is in *range mode*, and allows for any value within the range:

<p align="center">
  <img width="360" alt="image" src="https://user-images.githubusercontent.com/16108792/205401737-f9a86e36-7cd9-4bac-b566-d699fe682268.png">
</p>

When the switch is off, the slider is in *value mode*, and allows for only the selected value.

<p align="center">
  <img width="360" alt="image" src="https://user-images.githubusercontent.com/16108792/205401836-219e9896-7909-49d2-9cc5-3ca50e41ff4f.png">
</p>

### Filtering by Pitch

#### Cmd Click

Hold Command (macOS) or Control (Windows/Linux) to solo a specific pitch. This will work with any checkbox section.

#### Strict Mode

<p align="center">
<img width="360" alt="image" src="https://user-images.githubusercontent.com/16108792/205402166-cabbdf67-75e3-4798-b2d9-fe085019f602.png">
</p>
  
If in strict-mode, in the case of a chop with multiple pitches, this option will allow for only the chops for which every pitch passes the error range. Conversely, if not in strict mode, only one pitch needs to pass.

#### Pitch ±

<p align="center">
<img width="360" alt="image" src="https://user-images.githubusercontent.com/16108792/205402260-c4ef8753-9c13-4c1b-a37f-925076915092.png">
</p>

Allows an "error" range for semi-tones. So, a pm value of `1` will allow all pitches to vary +/- 1 semitone from the selected pitches.

#### Set Key

<p align="center">
<img width="360" alt="image" src="https://user-images.githubusercontent.com/16108792/205402280-7495eba1-eebd-49ff-984a-8e2a4eb938b7.png">
</p>
  
Convenience tool for only allowing pitches that come from a specific key.

### Filter Search

<p align="center">
<img width="352" alt="image" src="https://user-images.githubusercontent.com/16108792/205402500-f926a803-3887-4e50-805e-ef3331557ac9.png">
</p>

Filter search allows you to filter by the spoken text of a chop. Three search options are supported:

* **Exact**: Looks for an exact text substring match
* **Fuzzy**: Uses a simple [fuzzy search][fuzzy] algorithm
* **RegEx**: Allows searching by a user-provided [regular expression][regexp]

[regexp]: https://en.wikipedia.org/wiki/Regular_expression
[fuzzy]: https://en.wikipedia.org/wiki/Approximate_string_matching

## Settings

### Directory

<p align="center">
  <img width="664" alt="image" src="https://user-images.githubusercontent.com/16108792/205448438-151afc12-d21d-44aa-9ded-297b414a1e94.png">
</p>

You can choose a source directory and output directory. 

The source directory should contain `wav` files formatted as per [audio format](#audio-format).

The output directory will be written to as-needed when chops are dragged. Currently, the only supported output file type is `wav`.

### Hotkeys

<p align="center">
  <img width="669" alt="image" src="https://user-images.githubusercontent.com/16108792/205448529-d37a873d-2692-412d-a7eb-c85c4a7cabfc.png">
</p>

Hotkeys are currently supported for `Play/Pause`, `Chop`, `Previous/Next Chop`, `Replay`, and `Expand Left/Right`

#### Global Shortcuts

Ponychopper supports global shortcuts, which becomes very useful for pairing with another audio software, such as a DAW.

#### Expand Left/Right

Expand left/right "expands" the selection in either direction. So, for example, if you have selected the first syllable of the word `today`, expanding right will give you the entire word.

### Pin

<p align="center">
  <img width="240" alt="image" src="https://user-images.githubusercontent.com/16108792/205448683-46f09bf0-2073-44cd-8d4d-3c2bb2cfac4e.png">
</p>

Simply click the "pin" icon in the top left to force the window to always be on top. This is very useful for usage with another audio software.

## Audio Format

Resultant chops are determined by *cue points* and *regions*. Information about the audio segment is determined by the chosen region and its cue point label.

Currently, only `.wav` files are supported.

## Notating a File

<p align="center">
  <img width="725" alt="image" src="https://user-images.githubusercontent.com/16108792/205448892-4bd97921-f906-4a29-a3d6-7eb5c733c756.png">
</p>

In order to notate a file, you'll have to use an editor that supports wav regions. The easiest to use is [Image-Line's Edison][edison], which can be used for free with the trial version of [FL Studio][flstudio].

[edison]: https://www.image-line.com/fl-studio-news/edison-tutorial-1-of-6/
[flstudio]: https://www.image-line.com/

## Label Format

### Chop Regions

For a usable audio segment, the format is as follows:

```
<text> [syllables] p:[pitch]
```

By default the number of syllables is assumed to be 1.

For example, to notate the speech "one" spoken at C5, use `one p:c5`. For the speech "tomorrow", use `tomorrow 3`.

To notate multiple different pitches per syllable, you use multiple regions.

<!-- TODO: example picture here -->

### Meta Regions

Meta regions can be used to provide meta-info about samples for filtering purposes.

#### `@word`

Denotes everything within the region as a single word. Useful for words with multiple syllables/pitches.

#### `@phrase`

Denotes everything within the region as a single phrase. Currently not used, but may be at a later time.

#### `@gap`

Prevents a chop from forming in such a way that it crosses this sample. Use this in long sections of silence to prevent them from being sampled.

#### `@char`

Indicates a certain speaker or character. Applies to all audio segments within the region.

#### `@meta`

Currently supports a `season` argument to provide season info:

`@meta season:[#]`

## Development

Run `yarn` initially to set-up dependencies. 

### Running Locally

Use `yarn serve` to spin up a development instance.

### Building

TODO
