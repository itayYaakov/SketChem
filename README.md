# SketChem
Graphical editor for chemical structures
## What is SketChem?
SketChem is a graphical editor for chemical structures. It is a free software and it is open source.
A client side web application, built using React, Redux, Kekule.js and typescript.
SketChem allows you to create and edit chemical structures.

Demo - [SketChem Demo](https://itayyaakov.github.io/SketChem/)
![image](https://user-images.githubusercontent.com/35079630/175395026-440daa61-b004-4835-9390-c08e08689e90.png)

## Preview 
<p align="center">
  <img width="700" src="https://user-images.githubusercontent.com/35079630/175395996-e89a2bf9-cf93-41a4-ba76-b77c3d0b8169.png">  
  <img width="700" src="https://user-images.githubusercontent.com/35079630/175396475-efec5100-8be6-4826-b4e4-b8cd14979449.png">
  <img height="300" src="https://user-images.githubusercontent.com/35079630/175397434-b567cd00-c9cd-491a-a282-caa4d8188d56.png">
</p>

## What is unique about SketChem?
#### 1. SketChem is a free software
SketChem is a free software and it is open source.
#### 2. SketChem is a client side web application
With the usage of the Kekule.js library, SketChem can access two of the most powerful chemical structure libraries: OpenBabel and Indigo.
Both are imported as WebAssembly modules.
All the calculations are done on the client side with the help of WebAssembly.

#### 3. Unbelievable number of formats
With 145+ different formats, almost any chemical structure can be imported or exported when you are using SketChem.

#### 4. Beautifully designed
The sketchpad is based on svg objects, therefore everything you see is vector based. This allow you to zoom in to the tiniest details and still view a crisp colorful display.

## Development
In order to use SketChem, you need to install the following dependencies:
1. Npm: [npm](https://www.npmjs.com/)
2. Yarn: `npm install --global yarn`

To Build the application, run the following commands:  
1. `git clone https://github.com/itayYaakov/SketChem.git`
2. `cd sketchem-react`
  
To run the application, run the following commands:  
1. `yarn install`  
2. `yarn build`  
3. `cd build`  
4. `python -m http.server` (or any other local server)  
5. open http://localhost:8000/  
  
Or you can run the application in the development mode:  
1. `cd sketchem-react`  
2. `yarn start`  
3. open http://localhost:3000/  
  
To rebuild kekule.js library dependencies, run the following commands:  
1. `git clone https://github.com/itayYaakov/Kekule.js.git`
2. `cd Kekule.js`
3. `yarn install` (only required for the first time)
4. `cd utils/jsMinifier`
5. `yarn build_prod`
6. from Kekule.js/custom_dist/ copy kekule.min.js to SketChem/sketchem-react/public/kekule-js-dist
   (you can also copy the extra folder if it changed)
  
## Features
* **Navigating** - pan with the mouse middle button, zoom in/out with the mouse wheel
* **Atom** - just choose an atom from the right panel, or from the periodic table, and click on the canvas to add it to the structure.
You can also change an existing atom by clicking on it, or drag the mouse from an existing atom to create a new one.
* **Bond** - select a bond type from the left panel, and click on the canvas to create a new bond.
By default, two carbon atoms are connected to the bond.
You can also:
    * Drag the mouse from an existing atom to create a new one
    * Click an existing bond to change its type (single, double, triple, etc) (a stereo bond will be reversed if you click on it)
    * Click an atom to connect it to the bond in the optimal way
* **Chain** - just like a bond, but as many as you want.
* **Erase** - click on an atom or bond to erase it. You can also drag the mouse to erase a group of atoms or bonds.
* **Charge -/+** - click on an atom to add or remove a charge.
* **Periodic Table** - not enough atoms? Click on the periodic table button to get more.
* **Clear** - click on the clear button to erase all the atoms and bonds from the sketchpad.
* **Copy** - copy the current selection to the clipboard.
* **Paste** - paste the clipboard contents to a new location.
* **Undo** - undo the last action.
* **Redo** - redo the last action.
* **Import** - import a structure from a file or from a clipboard.
* **Export** - export the current structure to a file or to a clipboard.
* **Select Lasso** - select a group of atoms or bonds by drawing a lasso.
* **Select Rectangle** - select a group of atoms or bonds by drawing a rectangle.

Not enough? I hear you!:
* **Easy Change** - select atoms or bonds and apply a new charge/label/bond type by simply clicking the desired button.
* **Implict Hydrogen** - smart guessing of an atom's implicy hydrogen based on its neighbors, label and charge.
* **Gradient** - bonds are colored based on their connected atoms' colors.
* **Valence Error** - breaking some chemistry laws? red warning will appear
<p align="center">
  <img width="300" src="https://user-images.githubusercontent.com/35079630/175400083-384f55dd-8403-4725-a042-e76766f48a70.png">  
</p>

## Hotkey list

 | Function | Symbol |
 | --- | --- |
 | Single Bond | <kbd>1</kbd> |
 | Double Bond | <kbd>2</kbd> |
 | Triple Bond | <kbd>3</kbd> |
 | Single Or Double Bond | <kbd>4</kbd> |
 | Wedge Front Bond | <kbd>5</kbd> |
 | Wedge Back Bond | <kbd>6</kbd> |
 | Select - Box | <kbd>Q</kbd> |
 | Select - Lasso | <kbd>W</kbd> |
 | Chain | <kbd>E</kbd> |
 | Periodic Table | <kbd>R</kbd> |
 | Charge Minus | <kbd>Z</kbd> |
 | Charge Plus | <kbd>X</kbd> |
 | Erase | <kbd>Del</kbd>, <kbd>Backspace</kbd>, <kbd>Clear</kbd> |
 | Export | <kbd>Ctrl</kbd> + <kbd>S</kbd> |
 | Import | <kbd>Ctrl</kbd> + <kbd>O</kbd> |
 | Clear | <kbd>Shift</kbd> + <kbd>N</kbd> |
 | Copy | <kbd>Ctrl</kbd> + <kbd>C</kbd> |
 | Paste | <kbd>Ctrl</kbd> + <kbd>V</kbd> |
 | Undo | <kbd>Ctrl</kbd> + <kbd>Z</kbd> |
 | Redo | <kbd>Ctrl</kbd> + <kbd>Y</kbd> |
 | Hydrogen Atom | <kbd>H</kbd> |
 | Carbon Atom | <kbd>C</kbd> |
 | Nitrogen Atom | <kbd>N</kbd> |
 | Oxygen Atom | <kbd>O</kbd> |
 | Fluorine Atom | <kbd>F</kbd> |
 | Sulphur Atom | <kbd>S</kbd> |
 | Phosphorus Atom | <kbd>P</kbd> |
 | Iodine | <kbd>I</kbd> |


## Contributing
You can contribute to Sketchem by opening an issue or creating a pull request on GitHub.
Currently, the application is in development mode.
Don't hesitate to open an issue if you have any questions or suggestions.
Questions and suggestions are always welcome.

## License
SketChem is licensed under the MIT license.
