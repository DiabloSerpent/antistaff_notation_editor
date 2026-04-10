# Immediate

# Communication
- [ ] make page or section in readme dedicated to explaining why the editor exists and what the antistaff format is trying to do
- [ ] add panel to display the controls of the website
# Visual
- [ ] make the code display a lil error symbol when a symbol isn't recognized
- [ ] allow code to display size 16-64 notes
	- [ ] and make an error for larger note sizes
- [ ] add more symbol types
	- [ ] time sig, measure number, bpm, rit, strengths, pedals, etc
- [ ] add support for multi-cell symbols
	- non-trivial, would require a separate drawing pass
	- [ ] measure borders, key sig, strength changes
# Structural
- [ ] move the code that draws the selected cell into the main canvas drawing
- [ ] change the file format to use the non-demo version of the classes
	- non-trivial task
	- [ ] also implies changing the editor to recognize measures
		- intensive task
	- [ ] add margins/title elements to the canvas/file structure
- [ ] split main js file into multiple files
	- not sure if this is desirable
- [ ] change the drawing to use a svg file instead of a canvas
	- uncertain desirability, intensive task
- [ ] add a version field to the antistaff class
	- probably won't be necessary in the short term, but it won't hurt

# Far Off
- [ ] make an actually persistent and shareable website out of this
- [ ] look into making a desktop app out of this
	- Dioxus looks like the most interesting way to do this
	- however, that would require rewriting the entire code base in Rust
- [ ] Figure out what license to use
- [ ] allow .mscz files to be imported into the editor
	- but I don't plan on every feature being ported over b/c of the differences in formats and capabilities
	- [ ] and also import/export the internal json files
