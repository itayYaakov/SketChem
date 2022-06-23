export interface PtElement {
    symbol: string;
    name: string;
    number: number;
    category: string;
    // 1-7
    period: number;
    phase: string;
    x: number;
    y: number;
    atomicMass: number;
    customColor?: string;
    cpkColor?: string;
    rasmolColor?: string;
    jmolColor?: string;
}

const elementsArray: Array<PtElement> = [
    {
        symbol: "H",
        name: "Hydrogen",
        number: 1,
        category: "diatomic nonmetal",
        period: 1,
        phase: "Gas",
        x: 1,
        y: 1,
        atomicMass: 1.008,
        cpkColor: "#ffffff",
        rasmolColor: "#ffffff",
        jmolColor: "#ffffff",
    },
    {
        symbol: "He",
        name: "Helium",
        number: 2,
        category: "noble gas",
        period: 1,
        phase: "Gas",
        x: 1,
        y: 18,
        atomicMass: 4.0026022,
        cpkColor: "#d9ffff",
        rasmolColor: "#d9ffff",
        jmolColor: "#ffc0cb",
    },
    {
        symbol: "Li",
        name: "Lithium",
        number: 3,
        category: "alkali metal",
        period: 2,
        phase: "Solid",
        x: 2,
        y: 1,
        atomicMass: 6.94,
        cpkColor: "#cc80ff",
        rasmolColor: "#cc80ff",
        jmolColor: "#b22222",
    },
    {
        symbol: "Be",
        name: "Beryllium",
        number: 4,
        category: "alkaline earth metal",
        period: 2,
        phase: "Solid",
        x: 2,
        y: 2,
        atomicMass: 9.01218315,
        cpkColor: "#c2ff00",
        rasmolColor: "#c2ff00",
        jmolColor: "#ff1493",
    },
    {
        symbol: "B",
        name: "Boron",
        number: 5,
        category: "metalloid",
        period: 2,
        phase: "Solid",
        x: 2,
        y: 13,
        atomicMass: 10.81,
        cpkColor: "#ffb5b5",
        rasmolColor: "#ffb5b5",
        jmolColor: "#00ff00",
    },
    {
        symbol: "C",
        name: "Carbon",
        number: 6,
        category: "polyatomic nonmetal",
        period: 2,
        phase: "Solid",
        x: 2,
        y: 14,
        atomicMass: 12.011,
        cpkColor: "#909090",
        rasmolColor: "#909090",
        jmolColor: "#c8c8c8",
    },
    {
        symbol: "N",
        name: "Nitrogen",
        number: 7,
        category: "diatomic nonmetal",
        period: 2,
        phase: "Gas",
        x: 2,
        y: 15,
        atomicMass: 14.007,
        cpkColor: "#3050f8",
        rasmolColor: "#3050f8",
        jmolColor: "#8f8fff",
    },
    {
        symbol: "O",
        name: "Oxygen",
        number: 8,
        category: "diatomic nonmetal",
        period: 2,
        phase: "Gas",
        x: 2,
        y: 16,
        atomicMass: 15.999,
        cpkColor: "#ff0d0d",
        rasmolColor: "#ff0d0d",
        jmolColor: "#89c472",
    },
    {
        symbol: "F",
        name: "Fluorine",
        number: 9,
        category: "diatomic nonmetal",
        period: 2,
        phase: "Gas",
        x: 2,
        y: 17,
        atomicMass: 18.9984031636,
        cpkColor: "#90e050",
        rasmolColor: "#90e050",
        jmolColor: "#daa520",
    },
    {
        symbol: "Ne",
        name: "Neon",
        number: 10,
        category: "noble gas",
        period: 2,
        phase: "Gas",
        x: 2,
        y: 18,
        atomicMass: 20.17976,
        cpkColor: "#b3e3f5",
        rasmolColor: "#b3e3f5",
        jmolColor: "#ff1493",
    },
    {
        symbol: "Na",
        name: "Sodium",
        number: 11,
        category: "alkali metal",
        period: 3,
        phase: "Solid",
        x: 3,
        y: 1,
        atomicMass: 22.989769282,
        cpkColor: "#ab5cf2",
        rasmolColor: "#ab5cf2",
        jmolColor: "#0000ff",
    },
    {
        symbol: "Mg",
        name: "Magnesium",
        number: 12,
        category: "alkaline earth metal",
        period: 3,
        phase: "Solid",
        x: 3,
        y: 2,
        atomicMass: 24.305,
        cpkColor: "#8aff00",
        rasmolColor: "#8aff00",
        jmolColor: "#228b22",
    },
    {
        symbol: "Al",
        name: "Aluminium",
        number: 13,
        category: "post-transition metal",
        period: 3,
        phase: "Solid",
        x: 3,
        y: 13,
        atomicMass: 26.98153857,
        cpkColor: "#bfa6a6",
        rasmolColor: "#bfa6a6",
        jmolColor: "#808090",
    },
    {
        symbol: "Si",
        name: "Silicon",
        number: 14,
        category: "metalloid",
        period: 3,
        phase: "Solid",
        x: 3,
        y: 14,
        atomicMass: 28.085,
        cpkColor: "#f0c8a0",
        rasmolColor: "#f0c8a0",
        jmolColor: "#daa520",
    },
    {
        symbol: "P",
        name: "Phosphorus",
        number: 15,
        category: "polyatomic nonmetal",
        period: 3,
        phase: "Solid",
        x: 3,
        y: 15,
        atomicMass: 30.9737619985,
        cpkColor: "#ff8000",
        rasmolColor: "#ff8000",
        jmolColor: "#ffa500",
    },
    {
        symbol: "S",
        name: "Sulfur",
        number: 16,
        category: "polyatomic nonmetal",
        period: 3,
        phase: "Solid",
        x: 3,
        y: 16,
        atomicMass: 32.06,
        cpkColor: "#ffff30",
        rasmolColor: "#ffff30",
        jmolColor: "#ffc832",
    },
    {
        symbol: "Cl",
        name: "Chlorine",
        number: 17,
        category: "diatomic nonmetal",
        period: 3,
        phase: "Gas",
        x: 3,
        y: 17,
        atomicMass: 35.45,
        cpkColor: "#1ff01f",
        rasmolColor: "#1ff01f",
        jmolColor: "#00ff00",
    },
    {
        symbol: "Ar",
        name: "Argon",
        number: 18,
        category: "noble gas",
        period: 3,
        phase: "Gas",
        x: 3,
        y: 18,
        atomicMass: 39.9481,
        cpkColor: "#80d1e3",
        rasmolColor: "#80d1e3",
        jmolColor: "#ff1493",
    },
    {
        symbol: "K",
        name: "Potassium",
        number: 19,
        category: "alkali metal",
        period: 4,
        phase: "Solid",
        x: 4,
        y: 1,
        atomicMass: 39.09831,
        cpkColor: "#8f40d4",
        rasmolColor: "#8f40d4",
        jmolColor: "#ff1493",
    },
    {
        symbol: "Ca",
        name: "Calcium",
        number: 20,
        category: "alkaline earth metal",
        period: 4,
        phase: "Solid",
        x: 4,
        y: 2,
        atomicMass: 40.0784,
        cpkColor: "#3dff00",
        rasmolColor: "#3dff00",
        jmolColor: "#808090",
    },
    {
        symbol: "Sc",
        name: "Scandium",
        number: 21,
        category: "transition metal",
        period: 4,
        phase: "Solid",
        x: 4,
        y: 3,
        atomicMass: 44.9559085,
        cpkColor: "#e6e6e6",
        rasmolColor: "#e6e6e6",
        jmolColor: "#ff1493",
    },
    {
        symbol: "Ti",
        name: "Titanium",
        number: 22,
        category: "transition metal",
        period: 4,
        phase: "Solid",
        x: 4,
        y: 4,
        atomicMass: 47.8671,
        cpkColor: "#bfc2c7",
        rasmolColor: "#bfc2c7",
        jmolColor: "#808090",
    },
    {
        symbol: "V",
        name: "Vanadium",
        number: 23,
        category: "transition metal",
        period: 4,
        phase: "Solid",
        x: 4,
        y: 5,
        atomicMass: 50.94151,
        cpkColor: "#a6a6ab",
        rasmolColor: "#a6a6ab",
        jmolColor: "#ff1493",
    },
    {
        symbol: "Cr",
        name: "Chromium",
        number: 24,
        category: "transition metal",
        period: 4,
        phase: "Solid",
        x: 4,
        y: 6,
        atomicMass: 51.99616,
        cpkColor: "#8a99c7",
        rasmolColor: "#8a99c7",
        jmolColor: "#808090",
    },
    {
        symbol: "Mn",
        name: "Manganese",
        number: 25,
        category: "transition metal",
        period: 4,
        phase: "Solid",
        x: 4,
        y: 7,
        atomicMass: 54.9380443,
        cpkColor: "#9c7ac7",
        rasmolColor: "#9c7ac7",
        jmolColor: "#808090",
    },
    {
        symbol: "Fe",
        name: "Iron",
        number: 26,
        category: "transition metal",
        period: 4,
        phase: "Solid",
        x: 4,
        y: 8,
        atomicMass: 55.8452,
        cpkColor: "#e06633",
        rasmolColor: "#e06633",
        jmolColor: "#ffa500",
    },
    {
        symbol: "Co",
        name: "Cobalt",
        number: 27,
        category: "transition metal",
        period: 4,
        phase: "Solid",
        x: 4,
        y: 9,
        atomicMass: 58.9331944,
        cpkColor: "#f090a0",
        rasmolColor: "#f090a0",
        jmolColor: "#ff1493",
    },
    {
        symbol: "Ni",
        name: "Nickel",
        number: 28,
        category: "transition metal",
        period: 4,
        phase: "Solid",
        x: 4,
        y: 10,
        atomicMass: 58.69344,
        cpkColor: "#50d050",
        rasmolColor: "#50d050",
        jmolColor: "#a52a2a",
    },
    {
        symbol: "Cu",
        name: "Copper",
        number: 29,
        category: "transition metal",
        period: 4,
        phase: "Solid",
        x: 4,
        y: 11,
        atomicMass: 63.5463,
        cpkColor: "#c88033",
        rasmolColor: "#c88033",
        jmolColor: "#a52a2a",
    },
    {
        symbol: "Zn",
        name: "Zinc",
        number: 30,
        category: "transition metal",
        period: 4,
        phase: "Solid",
        x: 4,
        y: 12,
        atomicMass: 65.382,
        cpkColor: "#7d80b0",
        rasmolColor: "#7d80b0",
        jmolColor: "#a52a2a",
    },
    {
        symbol: "Ga",
        name: "Gallium",
        number: 31,
        category: "post-transition metal",
        period: 4,
        phase: "Solid",
        x: 4,
        y: 13,
        atomicMass: 69.7231,
        cpkColor: "#c28f8f",
        rasmolColor: "#c28f8f",
        jmolColor: "#ff1493",
    },
    {
        symbol: "Ge",
        name: "Germanium",
        number: 32,
        category: "metalloid",
        period: 4,
        phase: "Solid",
        x: 4,
        y: 14,
        atomicMass: 72.6308,
        cpkColor: "#668f8f",
        rasmolColor: "#668f8f",
        jmolColor: "#ff1493",
    },
    {
        symbol: "As",
        name: "Arsenic",
        number: 33,
        category: "metalloid",
        period: 4,
        phase: "Solid",
        x: 4,
        y: 15,
        atomicMass: 74.9215956,
        cpkColor: "#bd80e3",
        rasmolColor: "#bd80e3",
        jmolColor: "#ff1493",
    },
    {
        symbol: "Se",
        name: "Selenium",
        number: 34,
        category: "polyatomic nonmetal",
        period: 4,
        phase: "Solid",
        x: 4,
        y: 16,
        atomicMass: 78.9718,
        cpkColor: "#ffa100",
        rasmolColor: "#ffa100",
        jmolColor: "#ff1493",
    },
    {
        symbol: "Br",
        name: "Bromine",
        number: 35,
        category: "diatomic nonmetal",
        period: 4,
        phase: "Liquid",
        x: 4,
        y: 17,
        atomicMass: 79.904,
        cpkColor: "#a62929",
        rasmolColor: "#a62929",
        jmolColor: "#a52a2a",
    },
    {
        symbol: "Kr",
        name: "Krypton",
        number: 36,
        category: "noble gas",
        period: 4,
        phase: "Gas",
        x: 4,
        y: 18,
        atomicMass: 83.7982,
        cpkColor: "#5cb8d1",
        rasmolColor: "#5cb8d1",
        jmolColor: "#ff1493",
    },
    {
        symbol: "Rb",
        name: "Rubidium",
        number: 37,
        category: "alkali metal",
        period: 5,
        phase: "Solid",
        x: 5,
        y: 1,
        atomicMass: 85.46783,
        cpkColor: "#702eb0",
        rasmolColor: "#702eb0",
        jmolColor: "#ff1493",
    },
    {
        symbol: "Sr",
        name: "Strontium",
        number: 38,
        category: "alkaline earth metal",
        period: 5,
        phase: "Solid",
        x: 5,
        y: 2,
        atomicMass: 87.621,
        cpkColor: "#00ff00",
        rasmolColor: "#00ff00",
        jmolColor: "#ff1493",
    },
    {
        symbol: "Y",
        name: "Yttrium",
        number: 39,
        category: "transition metal",
        period: 5,
        phase: "Solid",
        x: 5,
        y: 3,
        atomicMass: 88.905842,
        cpkColor: "#94ffff",
        rasmolColor: "#94ffff",
        jmolColor: "#ff1493",
    },
    {
        symbol: "Zr",
        name: "Zirconium",
        number: 40,
        category: "transition metal",
        period: 5,
        phase: "Solid",
        x: 5,
        y: 4,
        atomicMass: 91.2242,
        cpkColor: "#94e0e0",
        rasmolColor: "#94e0e0",
        jmolColor: "#ff1493",
    },
    {
        symbol: "Nb",
        name: "Niobium",
        number: 41,
        category: "transition metal",
        period: 5,
        phase: "Solid",
        x: 5,
        y: 5,
        atomicMass: 92.906372,
        cpkColor: "#73c2c9",
        rasmolColor: "#73c2c9",
        jmolColor: "#ff1493",
    },
    {
        symbol: "Mo",
        name: "Molybdenum",
        number: 42,
        category: "transition metal",
        period: 5,
        phase: "Solid",
        x: 5,
        y: 6,
        atomicMass: 95.951,
        cpkColor: "#54b5b5",
        rasmolColor: "#54b5b5",
        jmolColor: "#ff1493",
    },
    {
        symbol: "Tc",
        name: "Technetium",
        number: 43,
        category: "transition metal",
        period: 5,
        phase: "Solid",
        x: 5,
        y: 7,
        atomicMass: 98,
        cpkColor: "#3b9e9e",
        rasmolColor: "#3b9e9e",
        jmolColor: "#ff1493",
    },
    {
        symbol: "Ru",
        name: "Ruthenium",
        number: 44,
        category: "transition metal",
        period: 5,
        phase: "Solid",
        x: 5,
        y: 8,
        atomicMass: 101.072,
        cpkColor: "#248f8f",
        rasmolColor: "#248f8f",
        jmolColor: "#ff1493",
    },
    {
        symbol: "Rh",
        name: "Rhodium",
        number: 45,
        category: "transition metal",
        period: 5,
        phase: "Solid",
        x: 5,
        y: 9,
        atomicMass: 102.905502,
        cpkColor: "#0a7d8c",
        rasmolColor: "#0a7d8c",
        jmolColor: "#ff1493",
    },
    {
        symbol: "Pd",
        name: "Palladium",
        number: 46,
        category: "transition metal",
        period: 5,
        phase: "Solid",
        x: 5,
        y: 10,
        atomicMass: 106.421,
        cpkColor: "#006985",
        rasmolColor: "#006985",
        jmolColor: "#ff1493",
    },
    {
        symbol: "Ag",
        name: "Silver",
        number: 47,
        category: "transition metal",
        period: 5,
        phase: "Solid",
        x: 5,
        y: 11,
        atomicMass: 107.86822,
        cpkColor: "#c0c0c0",
        rasmolColor: "#c0c0c0",
        jmolColor: "#808090",
    },
    {
        symbol: "Cd",
        name: "Cadmium",
        number: 48,
        category: "transition metal",
        period: 5,
        phase: "Solid",
        x: 5,
        y: 12,
        atomicMass: 112.4144,
        cpkColor: "#ffd98f",
        rasmolColor: "#ffd98f",
        jmolColor: "#ff1493",
    },
    {
        symbol: "In",
        name: "Indium",
        number: 49,
        category: "post-transition metal",
        period: 5,
        phase: "Solid",
        x: 5,
        y: 13,
        atomicMass: 114.8181,
        cpkColor: "#a67573",
        rasmolColor: "#a67573",
        jmolColor: "#ff1493",
    },
    {
        symbol: "Sn",
        name: "Tin",
        number: 50,
        category: "post-transition metal",
        period: 5,
        phase: "Solid",
        x: 5,
        y: 14,
        atomicMass: 118.7107,
        cpkColor: "#668080",
        rasmolColor: "#668080",
        jmolColor: "#ff1493",
    },
    {
        symbol: "Sb",
        name: "Antimony",
        number: 51,
        category: "metalloid",
        period: 5,
        phase: "Solid",
        x: 5,
        y: 15,
        atomicMass: 121.7601,
        cpkColor: "#9e63b5",
        rasmolColor: "#9e63b5",
        jmolColor: "#ff1493",
    },
    {
        symbol: "Te",
        name: "Tellurium",
        number: 52,
        category: "metalloid",
        period: 5,
        phase: "Solid",
        x: 5,
        y: 16,
        atomicMass: 127.603,
        cpkColor: "#d47a00",
        rasmolColor: "#d47a00",
        jmolColor: "#ff1493",
    },
    {
        symbol: "I",
        name: "Iodine",
        number: 53,
        category: "diatomic nonmetal",
        period: 5,
        phase: "Solid",
        x: 5,
        y: 17,
        atomicMass: 126.904473,
        cpkColor: "#940094",
        rasmolColor: "#940094",
        jmolColor: "#a020f0",
    },
    {
        symbol: "Xe",
        name: "Xenon",
        number: 54,
        category: "noble gas",
        period: 5,
        phase: "Gas",
        x: 5,
        y: 18,
        atomicMass: 131.2936,
        cpkColor: "#429eb0",
        rasmolColor: "#429eb0",
        jmolColor: "#ff1493",
    },
    {
        symbol: "Cs",
        name: "Cesium",
        number: 55,
        category: "alkali metal",
        period: 6,
        phase: "Solid",
        x: 6,
        y: 1,
        atomicMass: 132.905451966,
        cpkColor: "#57178f",
        rasmolColor: "#57178f",
        jmolColor: "#ff1493",
    },
    {
        symbol: "Ba",
        name: "Barium",
        number: 56,
        category: "alkaline earth metal",
        period: 6,
        phase: "Solid",
        x: 6,
        y: 2,
        atomicMass: 137.3277,
        cpkColor: "#00c900",
        rasmolColor: "#00c900",
        jmolColor: "#ffa500",
    },
    {
        symbol: "La",
        name: "Lanthanum",
        number: 57,
        category: "lanthanide",
        period: 6,
        phase: "Solid",
        x: 9,
        y: 3,
        atomicMass: 138.905477,
        cpkColor: "#70d4ff",
        rasmolColor: "#70d4ff",
        jmolColor: "#ff1493",
    },
    {
        symbol: "Ce",
        name: "Cerium",
        number: 58,
        category: "lanthanide",
        period: 6,
        phase: "Solid",
        x: 9,
        y: 4,
        atomicMass: 140.1161,
        cpkColor: "#ffffc7",
        rasmolColor: "#ffffc7",
        jmolColor: "#ff1493",
    },
    {
        symbol: "Pr",
        name: "Praseodymium",
        number: 59,
        category: "lanthanide",
        period: 6,
        phase: "Solid",
        x: 9,
        y: 5,
        atomicMass: 140.907662,
        cpkColor: "#d9ffc7",
        rasmolColor: "#d9ffc7",
        jmolColor: "#ff1493",
    },
    {
        symbol: "Nd",
        name: "Neodymium",
        number: 60,
        category: "lanthanide",
        period: 6,
        phase: "Solid",
        x: 9,
        y: 6,
        atomicMass: 144.2423,
        cpkColor: "#c7ffc7",
        rasmolColor: "#c7ffc7",
        jmolColor: "#ff1493",
    },
    {
        symbol: "Pm",
        name: "Promethium",
        number: 61,
        category: "lanthanide",
        period: 6,
        phase: "Solid",
        x: 9,
        y: 7,
        atomicMass: 145,
        cpkColor: "#a3ffc7",
        rasmolColor: "#a3ffc7",
        jmolColor: "#ff1493",
    },
    {
        symbol: "Sm",
        name: "Samarium",
        number: 62,
        category: "lanthanide",
        period: 6,
        phase: "Solid",
        x: 9,
        y: 8,
        atomicMass: 150.362,
        cpkColor: "#8fffc7",
        rasmolColor: "#8fffc7",
        jmolColor: "#ff1493",
    },
    {
        symbol: "Eu",
        name: "Europium",
        number: 63,
        category: "lanthanide",
        period: 6,
        phase: "Solid",
        x: 9,
        y: 9,
        atomicMass: 151.9641,
        cpkColor: "#61ffc7",
        rasmolColor: "#61ffc7",
        jmolColor: "#ff1493",
    },
    {
        symbol: "Gd",
        name: "Gadolinium",
        number: 64,
        category: "lanthanide",
        period: 6,
        phase: "Solid",
        x: 9,
        y: 10,
        atomicMass: 157.253,
        cpkColor: "#45ffc7",
        rasmolColor: "#45ffc7",
        jmolColor: "#ff1493",
    },
    {
        symbol: "Tb",
        name: "Terbium",
        number: 65,
        category: "lanthanide",
        period: 6,
        phase: "Solid",
        x: 9,
        y: 11,
        atomicMass: 158.925352,
        cpkColor: "#30ffc7",
        rasmolColor: "#30ffc7",
        jmolColor: "#ff1493",
    },
    {
        symbol: "Dy",
        name: "Dysprosium",
        number: 66,
        category: "lanthanide",
        period: 6,
        phase: "Solid",
        x: 9,
        y: 12,
        atomicMass: 162.5001,
        cpkColor: "#1fffc7",
        rasmolColor: "#1fffc7",
        jmolColor: "#ff1493",
    },
    {
        symbol: "Ho",
        name: "Holmium",
        number: 67,
        category: "lanthanide",
        period: 6,
        phase: "Solid",
        x: 9,
        y: 13,
        atomicMass: 164.930332,
        cpkColor: "#00ff9c",
        rasmolColor: "#00ff9c",
        jmolColor: "#ff1493",
    },
    {
        symbol: "Er",
        name: "Erbium",
        number: 68,
        category: "lanthanide",
        period: 6,
        phase: "Solid",
        x: 9,
        y: 14,
        atomicMass: 167.2593,
        cpkColor: "#00e675",
        rasmolColor: "#00e675",
        jmolColor: "#ff1493",
    },
    {
        symbol: "Tm",
        name: "Thulium",
        number: 69,
        category: "lanthanide",
        period: 6,
        phase: "Solid",
        x: 9,
        y: 15,
        atomicMass: 168.934222,
        cpkColor: "#00d452",
        rasmolColor: "#00d452",
        jmolColor: "#ff1493",
    },
    {
        symbol: "Yb",
        name: "Ytterbium",
        number: 70,
        category: "lanthanide",
        period: 6,
        phase: "Solid",
        x: 9,
        y: 16,
        atomicMass: 173.0451,
        cpkColor: "#00bf38",
        rasmolColor: "#00bf38",
        jmolColor: "#ff1493",
    },
    {
        symbol: "Lu",
        name: "Lutetium",
        number: 71,
        category: "lanthanide",
        period: 6,
        phase: "Solid",
        x: 9,
        y: 17,
        atomicMass: 174.96681,
        cpkColor: "#00ab24",
        rasmolColor: "#00ab24",
        jmolColor: "#ff1493",
    },
    {
        symbol: "Hf",
        name: "Hafnium",
        number: 72,
        category: "transition metal",
        period: 6,
        phase: "Solid",
        x: 6,
        y: 4,
        atomicMass: 178.492,
        cpkColor: "#4dc2ff",
        rasmolColor: "#4dc2ff",
        jmolColor: "#ff1493",
    },
    {
        symbol: "Ta",
        name: "Tantalum",
        number: 73,
        category: "transition metal",
        period: 6,
        phase: "Solid",
        x: 6,
        y: 5,
        atomicMass: 180.947882,
        cpkColor: "#4da6ff",
        rasmolColor: "#4da6ff",
        jmolColor: "#ff1493",
    },
    {
        symbol: "W",
        name: "Tungsten",
        number: 74,
        category: "transition metal",
        period: 6,
        phase: "Solid",
        x: 6,
        y: 6,
        atomicMass: 183.841,
        cpkColor: "#2194d6",
        rasmolColor: "#2194d6",
        jmolColor: "#ff1493",
    },
    {
        symbol: "Re",
        name: "Rhenium",
        number: 75,
        category: "transition metal",
        period: 6,
        phase: "Solid",
        x: 6,
        y: 7,
        atomicMass: 186.2071,
        cpkColor: "#267dab",
        rasmolColor: "#267dab",
        jmolColor: "#ff1493",
    },
    {
        symbol: "Os",
        name: "Osmium",
        number: 76,
        category: "transition metal",
        period: 6,
        phase: "Solid",
        x: 6,
        y: 8,
        atomicMass: 190.233,
        cpkColor: "#266696",
        rasmolColor: "#266696",
        jmolColor: "#ff1493",
    },
    {
        symbol: "Ir",
        name: "Iridium",
        number: 77,
        category: "transition metal",
        period: 6,
        phase: "Solid",
        x: 6,
        y: 9,
        atomicMass: 192.2173,
        cpkColor: "#175487",
        rasmolColor: "#175487",
        jmolColor: "#ff1493",
    },
    {
        symbol: "Pt",
        name: "Platinum",
        number: 78,
        category: "transition metal",
        period: 6,
        phase: "Solid",
        x: 6,
        y: 10,
        atomicMass: 195.0849,
        cpkColor: "#d0d0e0",
        rasmolColor: "#d0d0e0",
        jmolColor: "#ff1493",
    },
    {
        symbol: "Au",
        name: "Gold",
        number: 79,
        category: "transition metal",
        period: 6,
        phase: "Solid",
        x: 6,
        y: 11,
        atomicMass: 196.9665695,
        cpkColor: "#ffd123",
        rasmolColor: "#ffd123",
        jmolColor: "#daa520",
    },
    {
        symbol: "Hg",
        name: "Mercury",
        number: 80,
        category: "transition metal",
        period: 6,
        phase: "Liquid",
        x: 6,
        y: 12,
        atomicMass: 200.5923,
        cpkColor: "#b8b8d0",
        rasmolColor: "#b8b8d0",
        jmolColor: "#ff1493",
    },
    {
        symbol: "Tl",
        name: "Thallium",
        number: 81,
        category: "post-transition metal",
        period: 6,
        phase: "Solid",
        x: 6,
        y: 13,
        atomicMass: 204.38,
        cpkColor: "#a6544d",
        rasmolColor: "#a6544d",
        jmolColor: "#ff1493",
    },
    {
        symbol: "Pb",
        name: "Lead",
        number: 82,
        category: "post-transition metal",
        period: 6,
        phase: "Solid",
        x: 6,
        y: 14,
        atomicMass: 207.21,
        cpkColor: "#575961",
        rasmolColor: "#575961",
        jmolColor: "#ff1493",
    },
    {
        symbol: "Bi",
        name: "Bismuth",
        number: 83,
        category: "post-transition metal",
        period: 6,
        phase: "Solid",
        x: 6,
        y: 15,
        atomicMass: 208.980401,
        cpkColor: "#9e4fb5",
        rasmolColor: "#9e4fb5",
        jmolColor: "#ff1493",
    },
    {
        symbol: "Po",
        name: "Polonium",
        number: 84,
        category: "post-transition metal",
        period: 6,
        phase: "Solid",
        x: 6,
        y: 16,
        atomicMass: 209,
        cpkColor: "#ab5c00",
        rasmolColor: "#ab5c00",
        jmolColor: "#ff1493",
    },
    {
        symbol: "At",
        name: "Astatine",
        number: 85,
        category: "metalloid",
        period: 6,
        phase: "Solid",
        x: 6,
        y: 17,
        atomicMass: 210,
        cpkColor: "#754f45",
        rasmolColor: "#754f45",
        jmolColor: "#ff1493",
    },
    {
        symbol: "Rn",
        name: "Radon",
        number: 86,
        category: "noble gas",
        period: 6,
        phase: "Gas",
        x: 6,
        y: 18,
        atomicMass: 222,
        cpkColor: "#428296",
        rasmolColor: "#428296",
        jmolColor: "#ff1493",
    },
    {
        symbol: "Fr",
        name: "Francium",
        number: 87,
        category: "alkali metal",
        period: 7,
        phase: "Solid",
        x: 7,
        y: 1,
        atomicMass: 223,
        cpkColor: "#420066",
        rasmolColor: "#420066",
        jmolColor: "#ff1493",
    },
    {
        symbol: "Ra",
        name: "Radium",
        number: 88,
        category: "alkaline earth metal",
        period: 7,
        phase: "Solid",
        x: 7,
        y: 2,
        atomicMass: 226,
        cpkColor: "#007d00",
        rasmolColor: "#007d00",
        jmolColor: "#ff1493",
    },
    {
        symbol: "Ac",
        name: "Actinium",
        number: 89,
        category: "actinide",
        period: 7,
        phase: "Solid",
        x: 10,
        y: 3,
        atomicMass: 227,
        cpkColor: "#70abfa",
        rasmolColor: "#70abfa",
        jmolColor: "#ff1493",
    },
    {
        symbol: "Th",
        name: "Thorium",
        number: 90,
        category: "actinide",
        period: 7,
        phase: "Solid",
        x: 10,
        y: 4,
        atomicMass: 232.03774,
        cpkColor: "#00baff",
        rasmolColor: "#00baff",
        jmolColor: "#ff1493",
    },
    {
        symbol: "Pa",
        name: "Protactinium",
        number: 91,
        category: "actinide",
        period: 7,
        phase: "Solid",
        x: 10,
        y: 5,
        atomicMass: 231.035882,
        cpkColor: "#00a1ff",
        rasmolColor: "#00a1ff",
        jmolColor: "#ff1493",
    },
    {
        symbol: "U",
        name: "Uranium",
        number: 92,
        category: "actinide",
        period: 7,
        phase: "Solid",
        x: 10,
        y: 6,
        atomicMass: 238.028913,
        cpkColor: "#008fff",
        rasmolColor: "#008fff",
        jmolColor: "#ff1493",
    },
    {
        symbol: "Np",
        name: "Neptunium",
        number: 93,
        category: "actinide",
        period: 7,
        phase: "Solid",
        x: 10,
        y: 7,
        atomicMass: 237,
        cpkColor: "#0080ff",
        rasmolColor: "#0080ff",
        jmolColor: "#ff1493",
    },
    {
        symbol: "Pu",
        name: "Plutonium",
        number: 94,
        category: "actinide",
        period: 7,
        phase: "Solid",
        x: 10,
        y: 8,
        atomicMass: 244,
        cpkColor: "#006bff",
        rasmolColor: "#006bff",
        jmolColor: "#ff1493",
    },
    {
        symbol: "Am",
        name: "Americium",
        number: 95,
        category: "actinide",
        period: 7,
        phase: "Solid",
        x: 10,
        y: 9,
        atomicMass: 243,
        cpkColor: "#545cf2",
        rasmolColor: "#545cf2",
        jmolColor: "#ff1493",
    },
    {
        symbol: "Cm",
        name: "Curium",
        number: 96,
        category: "actinide",
        period: 7,
        phase: "Solid",
        x: 10,
        y: 10,
        atomicMass: 247,
        cpkColor: "#785ce3",
        rasmolColor: "#785ce3",
        jmolColor: "#ff1493",
    },
    {
        symbol: "Bk",
        name: "Berkelium",
        number: 97,
        category: "actinide",
        period: 7,
        phase: "Solid",
        x: 10,
        y: 11,
        atomicMass: 247,
        cpkColor: "#8a4fe3",
        rasmolColor: "#8a4fe3",
        jmolColor: "#ff1493",
    },
    {
        symbol: "Cf",
        name: "Californium",
        number: 98,
        category: "actinide",
        period: 7,
        phase: "Solid",
        x: 10,
        y: 12,
        atomicMass: 251,
        cpkColor: "#a136d4",
        rasmolColor: "#a136d4",
        jmolColor: "#ff1493",
    },
    {
        symbol: "Es",
        name: "Einsteinium",
        number: 99,
        category: "actinide",
        period: 7,
        phase: "Solid",
        x: 10,
        y: 13,
        atomicMass: 252,
        cpkColor: "#b31fd4",
        rasmolColor: "#b31fd4",
        jmolColor: "#ff1493",
    },
    {
        symbol: "Fm",
        name: "Fermium",
        number: 100,
        category: "actinide",
        period: 7,
        phase: "Solid",
        x: 10,
        y: 14,
        atomicMass: 257,
        cpkColor: "#b31fba",
        rasmolColor: "#b31fba",
        jmolColor: "#ff1493",
    },
    {
        symbol: "Md",
        name: "Mendelevium",
        number: 101,
        category: "actinide",
        period: 7,
        phase: "Solid",
        x: 10,
        y: 15,
        atomicMass: 258,
        cpkColor: "#b30da6",
        rasmolColor: "#b30da6",
        jmolColor: "#ff1493",
    },
    {
        symbol: "No",
        name: "Nobelium",
        number: 102,
        category: "actinide",
        period: 7,
        phase: "Solid",
        x: 10,
        y: 16,
        atomicMass: 259,
        cpkColor: "#bd0d87",
        rasmolColor: "#bd0d87",
        jmolColor: "#ff1493",
    },
    {
        symbol: "Lr",
        name: "Lawrencium",
        number: 103,
        category: "actinide",
        period: 7,
        phase: "Solid",
        x: 10,
        y: 17,
        atomicMass: 266,
        cpkColor: "#c70066",
        rasmolColor: "#c70066",
        jmolColor: "#ff1493",
    },
    {
        symbol: "Rf",
        name: "Rutherfordium",
        number: 104,
        category: "transition metal",
        period: 7,
        phase: "Solid",
        x: 7,
        y: 4,
        atomicMass: 267,
        cpkColor: "#cc0059",
        rasmolColor: "#cc0059",
        jmolColor: "#ff1493",
    },
    {
        symbol: "Db",
        name: "Dubnium",
        number: 105,
        category: "transition metal",
        period: 7,
        phase: "Solid",
        x: 7,
        y: 5,
        atomicMass: 268,
        cpkColor: "#d1004f",
        rasmolColor: "#d1004f",
        jmolColor: "#ff1493",
    },
    {
        symbol: "Sg",
        name: "Seaborgium",
        number: 106,
        category: "transition metal",
        period: 7,
        phase: "Solid",
        x: 7,
        y: 6,
        atomicMass: 269,
        cpkColor: "#d90045",
        rasmolColor: "#d90045",
        jmolColor: "#ff1493",
    },
    {
        symbol: "Bh",
        name: "Bohrium",
        number: 107,
        category: "transition metal",
        period: 7,
        phase: "Solid",
        x: 7,
        y: 7,
        atomicMass: 270,
        cpkColor: "#e00038",
        rasmolColor: "#e00038",
        jmolColor: "#ff1493",
    },
    {
        symbol: "Hs",
        name: "Hassium",
        number: 108,
        category: "transition metal",
        period: 7,
        phase: "Solid",
        x: 7,
        y: 8,
        atomicMass: 269,
        cpkColor: "#e6002e",
        rasmolColor: "#e6002e",
        jmolColor: "#ff1493",
    },
    {
        symbol: "Mt",
        name: "Meitnerium",
        number: 109,
        category: "unknown, probably transition metal",
        period: 7,
        phase: "Solid",
        x: 7,
        y: 9,
        atomicMass: 278,
        cpkColor: "#eb0026",
        rasmolColor: "#eb0026",
        jmolColor: "#ff1493",
    },
    {
        symbol: "Ds",
        name: "Darmstadtium",
        number: 110,
        category: "unknown, probably transition metal",
        period: 7,
        phase: "Solid",
        x: 7,
        y: 10,
        atomicMass: 281,
    },
    {
        symbol: "Rg",
        name: "Roentgenium",
        number: 111,
        category: "unknown, probably transition metal",
        period: 7,
        phase: "Solid",
        x: 7,
        y: 11,
        atomicMass: 282,
    },
    {
        symbol: "Cn",
        name: "Copernicium",
        number: 112,
        category: "transition metal",
        period: 7,
        phase: "Gas",
        x: 7,
        y: 12,
        atomicMass: 285,
    },
    {
        symbol: "Nh",
        name: "Nihonium",
        number: 113,
        category: "unknown, probably transition metal",
        period: 7,
        phase: "Solid",
        x: 7,
        y: 13,
        atomicMass: 286,
    },
    {
        symbol: "Fl",
        name: "Flerovium",
        number: 114,
        category: "post-transition metal",
        period: 7,
        phase: "Solid",
        x: 7,
        y: 14,
        atomicMass: 289,
    },
    {
        symbol: "Mc",
        name: "Moscovium",
        number: 115,
        category: "unknown, probably post-transition metal",
        period: 7,
        phase: "Solid",
        x: 7,
        y: 15,
        atomicMass: 289,
    },
    {
        symbol: "Lv",
        name: "Livermorium",
        number: 116,
        category: "unknown, probably post-transition metal",
        period: 7,
        phase: "Solid",
        x: 7,
        y: 16,
        atomicMass: 293,
    },
    {
        symbol: "Ts",
        name: "Tennessine",
        number: 117,
        category: "unknown, probably metalloid",
        period: 7,
        phase: "Solid",
        x: 7,
        y: 17,
        atomicMass: 294,
    },
    {
        symbol: "Og",
        name: "Oganesson",
        number: 118,
        category: "unknown, predicted to be noble gas",
        period: 7,
        phase: "Solid",
        x: 7,
        y: 18,
        atomicMass: 294,
    },
    {
        symbol: "Uue",
        name: "Ununennium",
        number: 119,
        category: "unknown, but predicted to be an alkali metal",
        period: 8,
        phase: "Solid",
        x: 8,
        y: 1,
        atomicMass: 315,
    },
];

const elementsBySymbolMap = new Map<string, PtElement>();
const elementsByAtomicNumberMap = new Map<number, PtElement>();
const elementsByXYMap = new Map<string, PtElement>();
// Kekule.js at the moment only support atoms up to 111
const MaxAtomicNumber = 111;

elementsArray.forEach((element) => {
    elementsBySymbolMap.set(element.symbol, element);
    elementsByAtomicNumberMap.set(element.number, element);
    elementsByXYMap.set(`${element.x}|${element.y}`, element);
});

elementsBySymbolMap.get("H")!.customColor = "#4a4a4a";
elementsBySymbolMap.get("C")!.customColor = "#000000";
elementsBySymbolMap.get("He")!.customColor = "#009e9e";
elementsBySymbolMap.get("N")!.customColor = "#2136aa";
elementsBySymbolMap.get("O")!.customColor = "#659154";
elementsBySymbolMap.get("S")!.customColor = "#e7a186";
elementsBySymbolMap.get("Sc")!.customColor = "#b0b0b0";
elementsBySymbolMap.get("Cl")!.customColor = "#179d4d";
elementsBySymbolMap.get("Pt")!.customColor = "#a6a6b3";
elementsBySymbolMap.get("Nd")!.customColor = "#8bb28b";
elementsBySymbolMap.get("Ce")!.customColor = "#e5e5b3";
elementsBySymbolMap.get("Gd")!.customColor = "#25cc9a";
elementsBySymbolMap.get("Pm")!.customColor = "#85d6a5";
elementsBySymbolMap.get("Pr")!.customColor = "#b0d99c";
elementsBySymbolMap.get("Y")!.customColor = "#74d4d4";

function atomicNumberToSymbol(atomicNumber: number) {
    switch (atomicNumber) {
        case 1:
            return "H";
        case 2:
            return "He";
        case 3:
            return "Li";
        case 4:
            return "Be";
        case 5:
            return "B";
        case 6:
            return "C";
        case 7:
            return "N";
        case 8:
            return "O";
        case 9:
            return "F";
        case 10:
            return "Ne";
        case 11:
            return "Na";
        case 12:
            return "Mg";
        case 13:
            return "Al";
        case 14:
            return "Si";
        case 15:
            return "P";
        case 16:
            return "S";
        case 17:
            return "Cl";
        case 18:
            return "Ar";
        case 19:
            return "K";
        case 20:
            return "Ca";
        case 21:
            return "Sc";
        case 22:
            return "Ti";
        case 23:
            return "V";
        case 24:
            return "Cr";
        case 25:
            return "Mn";
        case 26:
            return "Fe";
        case 27:
            return "Co";
        case 28:
            return "Ni";
        case 29:
            return "Cu";
        case 30:
            return "Zn";
        case 31:
            return "Ga";
        case 32:
            return "Ge";
        case 33:
            return "As";
        case 34:
            return "Se";
        case 35:
            return "Br";
        case 36:
            return "Kr";
        case 37:
            return "Rb";
        case 38:
            return "Sr";
        case 39:
            return "Y";
        case 40:
            return "Zr";
        case 41:
            return "Nb";
        case 42:
            return "Mo";
        case 43:
            return "Tc";
        case 44:
            return "Ru";
        case 45:
            return "Rh";
        case 46:
            return "Pd";
        case 47:
            return "Ag";
        case 48:
            return "Cd";
        case 49:
            return "In";
        case 50:
            return "Sn";
        case 51:
            return "Sb";
        case 52:
            return "Te";
        case 53:
            return "I";
        case 54:
            return "Xe";
        case 55:
            return "Cs";
        case 56:
            return "Ba";
        case 57:
            return "La";
        case 58:
            return "Ce";
        case 59:
            return "Pr";
        case 60:
            return "Nd";
        case 61:
            return "Pm";
        case 62:
            return "Sm";
        case 63:
            return "Eu";
        case 64:
            return "Gd";
        case 65:
            return "Tb";
        case 66:
            return "Dy";
        case 67:
            return "Ho";
        case 68:
            return "Er";
        case 69:
            return "Tm";
        case 70:
            return "Yb";
        case 71:
            return "Lu";
        case 72:
            return "Hf";
        case 73:
            return "Ta";
        case 74:
            return "W";
        case 75:
            return "Re";
        case 76:
            return "Os";
        case 77:
            return "Ir";
        case 78:
            return "Pt";
        case 79:
            return "Au";
        case 80:
            return "Hg";
        case 81:
            return "Tl";
        case 82:
            return "Pb";
        case 83:
            return "Bi";
        case 84:
            return "Po";
        case 85:
            return "At";
        case 86:
            return "Rn";
        case 87:
            return "Fr";
        case 88:
            return "Ra";
        case 89:
            return "Ac";
        case 90:
            return "Th";
        case 91:
            return "Pa";
        case 92:
            return "U";
        case 93:
            return "Np";
        case 94:
            return "Pu";
        case 95:
            return "Am";
        case 96:
            return "Cm";
        case 97:
            return "Bk";
        case 98:
            return "Cf";
        case 99:
            return "Es";
        case 100:
            return "Fm";
        case 101:
            return "Md";
        case 102:
            return "No";
        case 103:
            return "Lr";
        case 104:
            return "Rf";
        case 105:
            return "Db";
        case 106:
            return "Sg";
        case 107:
            return "Bh";
        case 108:
            return "Hs";
        case 109:
            return "Mt";
        case 110:
            return "Ds";
        case 111:
            return "Rg";
        case 112:
            return "Cn";
        case 113:
            return "Nh";
        case 114:
            return "Fl";
        case 115:
            return "Mc";
        case 116:
            return "Lv";
        case 117:
            return "Ts";
        case 118:
            return "Og";
        default:
            return "";
    }
    return "";
}

function symbolToAtomicNumber(symbol: string) {
    switch (symbol) {
        case "H":
            return 1;
        case "He":
            return 2;
        case "Li":
            return 3;
        case "Be":
            return 4;
        case "B":
            return 5;
        case "C":
            return 6;
        case "N":
            return 7;
        case "O":
            return 8;
        case "F":
            return 9;
        case "Ne":
            return 10;
        case "Na":
            return 11;
        case "Mg":
            return 12;
        case "Al":
            return 13;
        case "Si":
            return 14;
        case "P":
            return 15;
        case "S":
            return 16;
        case "Cl":
            return 17;
        case "Ar":
            return 18;
        case "K":
            return 19;
        case "Ca":
            return 20;
        case "Sc":
            return 21;
        case "Ti":
            return 22;
        case "V":
            return 23;
        case "Cr":
            return 24;
        case "Mn":
            return 25;
        case "Fe":
            return 26;
        case "Co":
            return 27;
        case "Ni":
            return 28;
        case "Cu":
            return 29;
        case "Zn":
            return 30;
        case "Ga":
            return 31;
        case "Ge":
            return 32;
        case "As":
            return 33;
        case "Se":
            return 34;
        case "Br":
            return 35;
        case "Kr":
            return 36;
        case "Rb":
            return 37;
        case "Sr":
            return 38;
        case "Y":
            return 39;
        case "Zr":
            return 40;
        case "Nb":
            return 41;
        case "Mo":
            return 42;
        case "Tc":
            return 43;
        case "Ru":
            return 44;
        case "Rh":
            return 45;
        case "Pd":
            return 46;
        case "Ag":
            return 47;
        case "Cd":
            return 48;
        case "In":
            return 49;
        case "Sn":
            return 50;
        case "Sb":
            return 51;
        case "Te":
            return 52;
        case "I":
            return 53;
        case "Xe":
            return 54;
        case "Cs":
            return 55;
        case "Ba":
            return 56;
        case "La":
            return 57;
        case "Ce":
            return 58;
        case "Pr":
            return 59;
        case "Nd":
            return 60;
        case "Pm":
            return 61;
        case "Sm":
            return 62;
        case "Eu":
            return 63;
        case "Gd":
            return 64;
        case "Tb":
            return 65;
        case "Dy":
            return 66;
        case "Ho":
            return 67;
        case "Er":
            return 68;
        case "Tm":
            return 69;
        case "Yb":
            return 70;
        case "Lu":
            return 71;
        case "Hf":
            return 72;
        case "Ta":
            return 73;
        case "W":
            return 74;
        case "Re":
            return 75;
        case "Os":
            return 76;
        case "Ir":
            return 77;
        case "Pt":
            return 78;
        case "Au":
            return 79;
        case "Hg":
            return 80;
        case "Tl":
            return 81;
        case "Pb":
            return 82;
        case "Bi":
            return 83;
        case "Po":
            return 84;
        case "At":
            return 85;
        case "Rn":
            return 86;
        case "Fr":
            return 87;
        case "Ra":
            return 88;
        case "Ac":
            return 89;
        case "Th":
            return 90;
        case "Pa":
            return 91;
        case "U":
            return 92;
        case "Np":
            return 93;
        case "Pu":
            return 94;
        case "Am":
            return 95;
        case "Cm":
            return 96;
        case "Bk":
            return 97;
        case "Cf":
            return 98;
        case "Es":
            return 99;
        case "Fm":
            return 100;
        case "Md":
            return 101;
        case "No":
            return 102;
        case "Lr":
            return 103;
        case "Rf":
            return 104;
        case "Db":
            return 105;
        case "Sg":
            return 106;
        case "Bh":
            return 107;
        case "Hs":
            return 108;
        case "Mt":
            return 109;
        case "Ds":
            return 110;
        case "Rg":
            return 111;
        case "Cn":
            return 112;
        case "Nh":
            return 113;
        case "Fl":
            return 114;
        case "Mc":
            return 115;
        case "Lv":
            return 116;
        case "Ts":
            return 117;
        case "Og":
            return 118;
        default:
            return 0;
    }
    return 0;
}

export const ElementsData = {
    elementsBySymbolMap,
    elementsByAtomicNumberMap,
    elementsByXYMap,
    MaxAtomicNumber,
    atomicNumberToSymbol,
    symbolToAtomicNumber,
};
