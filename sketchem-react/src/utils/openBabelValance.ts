/* eslint-disable default-case */
/** ********************************************************************
Copyright (C) 2017 by Noel O'Boyle

This file is part of the Open Babel project.
For more information, see <http://openbabel.org/>

This program is free software; you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation version 2 of the License.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.
********************************************************************** */

// Return the typical valence for an atom of specified element, bond order sum and formal charge
export default function GetTypicalValence(element: number, bosum: number, charge: number) {
    switch (element) {
        case 1:
            switch (charge) {
                case 0:
                    if (bosum <= 1) return 1;
                    break;
                case 1:
                    if (bosum === 0) return 0;
                    break;
            }
            break;
        case 2:
            if (charge === 0) {
                if (bosum === 0) return 0;
            }
            break;
        case 3:
            switch (charge) {
                case 0:
                    if (bosum <= 1) return 1;
                    break;
                case 1:
                    if (bosum === 0) return 0;
                    break;
            }
            break;
        case 4:
            switch (charge) {
                case 0:
                    if (bosum <= 2) return 2;
                    break;
                case 1:
                    if (bosum <= 1) return 1;
                    break;
                case 2:
                    if (bosum === 0) return 0;
                    break;
            }
            break;
        case 5:
            switch (charge) {
                case -2:
                    if (bosum <= 3) return 3;
                    break;
                case -1:
                    if (bosum <= 4) return 4;
                    break;
                case 0:
                    if (bosum <= 3) return 3;
                    break;
                case 1:
                    if (bosum <= 2) return 2;
                    break;
                case 2:
                    if (bosum <= 1) return 1;
                    break;
            }
            break;
        case 6:
            switch (charge) {
                case -2:
                    if (bosum <= 2) return 2;
                    break;
                case -1:
                    if (bosum <= 3) return 3;
                    break;
                case 0:
                    if (bosum <= 4) return 4;
                    break;
                case 1:
                    if (bosum <= 3) return 3;
                    break;
                case 2:
                    if (bosum <= 2) return 2;
                    break;
            }
            break;
        case 7:
            // Note that while N can have valence 5, it doesn't make sense
            // to round up to 5 when adding hydrogens
            switch (charge) {
                case -2:
                    if (bosum <= 1) return 1;
                    break;
                case -1:
                    if (bosum <= 2) return 2;
                    break;
                case 0:
                    switch (bosum) {
                        case 0:
                        case 1:
                        case 2:
                        case 3:
                            return 3;
                        case 4:
                            return 4; // don't round up to 5 for nitrogen
                        case 5:
                            return 5;
                    }
                    break;
                case 1:
                    if (bosum <= 4) return 4;
                    break;
                case 2:
                    if (bosum <= 3) return 3;
                    break;
            }
            break;
        case 8:
            switch (charge) {
                case -2:
                    if (bosum === 0) return 0;
                    break;
                case -1:
                    if (bosum <= 1) return 1;
                    break;
                case 0:
                    if (bosum <= 2) return 2;
                    break;
                case 1:
                    switch (bosum) {
                        case 0:
                        case 1:
                        case 2:
                        case 3:
                            return 3;
                        case 4:
                        case 5:
                            return 5;
                    }
                    break;
            }
            break;
        case 9:
            switch (charge) {
                case -1:
                    if (bosum === 0) return 0;
                    break;
                case 0:
                    if (bosum <= 1) return 1;
                    break;
                case 1:
                    if (bosum <= 2) return 2;
                    break;
                case 2:
                    switch (bosum) {
                        case 0:
                        case 1:
                        case 2:
                        case 3:
                            return 3;
                        case 4:
                        case 5:
                            return 5;
                    }
                    break;
            }
            break;
        case 10:
            if (charge === 0) {
                if (bosum === 0) return 0;
            }
            break;
        case 11:
            switch (charge) {
                case -1:
                    if (bosum === 0) return 0;
                    break;
                case 0:
                    if (bosum <= 1) return 1;
                    break;
                case 1:
                    if (bosum === 0) return 0;
                    break;
            }
            break;
        case 12:
            switch (charge) {
                case 0:
                    if (bosum <= 2) return 2;
                    break;
                case 2:
                    if (bosum === 0) return 0;
                    break;
            }
            break;
        case 13:
            switch (charge) {
                case -2:
                    switch (bosum) {
                        case 0:
                        case 1:
                        case 2:
                        case 3:
                            return 3;
                        case 4:
                        case 5:
                            return 5;
                    }
                    break;
                case -1:
                    if (bosum <= 4) return 4;
                    break;
                case 0:
                    if (bosum <= 3) return 3;
                    break;
                case 1:
                    if (bosum <= 2) return 2;
                    break;
                case 2:
                    if (bosum <= 1) return 1;
                    break;
                case 3:
                    if (bosum === 0) return 0;
                    break;
            }
            break;
        case 14:
            switch (charge) {
                case -2:
                    if (bosum <= 2) return 2;
                    break;
                case -1:
                    switch (bosum) {
                        case 0:
                        case 1:
                        case 2:
                        case 3:
                            return 3;
                        case 4:
                        case 5:
                            return 5;
                    }
                    break;
                case 0:
                    if (bosum <= 4) return 4;
                    break;
                case 1:
                    if (bosum <= 3) return 3;
                    break;
                case 2:
                    if (bosum <= 2) return 2;
                    break;
            }
            break;
        case 15:
            switch (charge) {
                case -2:
                    switch (bosum) {
                        case 0:
                        case 1:
                            return 1;
                        case 2:
                        case 3:
                            return 3;
                        case 4:
                        case 5:
                            return 5;
                        case 6:
                        case 7:
                            return 7;
                    }
                    break;
                case -1:
                    switch (bosum) {
                        case 0:
                        case 1:
                        case 2:
                            return 2;
                        case 3:
                        case 4:
                            return 4;
                        case 5:
                        case 6:
                            return 6;
                    }
                    break;
                case 0:
                    switch (bosum) {
                        case 0:
                        case 1:
                        case 2:
                        case 3:
                            return 3;
                        case 4:
                        case 5:
                            return 5;
                    }
                    break;
                case 1:
                    if (bosum <= 4) return 4;
                    break;
                case 2:
                    if (bosum <= 3) return 3;
                    break;
            }
            break;
        case 16:
            switch (charge) {
                case -2:
                    if (bosum === 0) return 0;
                    break;
                case -1:
                    switch (bosum) {
                        case 0:
                        case 1:
                            return 1;
                        case 2:
                        case 3:
                            return 3;
                        case 4:
                        case 5:
                            return 5;
                        case 6:
                        case 7:
                            return 7;
                    }
                    break;
                case 0:
                    switch (bosum) {
                        case 0:
                        case 1:
                        case 2:
                            return 2;
                        case 3:
                        case 4:
                            return 4;
                        case 5:
                        case 6:
                            return 6;
                    }
                    break;
                case 1:
                    switch (bosum) {
                        case 0:
                        case 1:
                        case 2:
                        case 3:
                            return 3;
                        case 4:
                        case 5:
                            return 5;
                    }
                    break;
                case 2:
                    if (bosum <= 4) return 4;
                    break;
            }
            break;
        case 17:
            switch (charge) {
                case -1:
                    if (bosum === 0) return 0;
                    break;
                case 0:
                    switch (bosum) {
                        case 0:
                        case 1:
                            return 1;
                        case 2:
                        case 3:
                            return 3;
                        case 4:
                        case 5:
                            return 5;
                        case 6:
                        case 7:
                            return 7;
                    }
                    break;
                case 1:
                    switch (bosum) {
                        case 0:
                        case 1:
                        case 2:
                            return 2;
                        case 3:
                        case 4:
                            return 4;
                        case 5:
                        case 6:
                            return 6;
                    }
                    break;
                case 2:
                    switch (bosum) {
                        case 0:
                        case 1:
                        case 2:
                        case 3:
                            return 3;
                        case 4:
                        case 5:
                            return 5;
                    }
                    break;
            }
            break;
        case 18:
            if (charge === 0) {
                if (bosum === 0) return 0;
            }
            break;
        case 19:
            switch (charge) {
                case -1:
                    if (bosum === 0) return 0;
                    break;
                case 0:
                    if (bosum <= 1) return 1;
                    break;
                case 1:
                    if (bosum === 0) return 0;
                    break;
            }
            break;
        case 20:
            switch (charge) {
                case 0:
                    if (bosum <= 2) return 2;
                    break;
                case 1:
                    if (bosum <= 1) return 1;
                    break;
                case 2:
                    if (bosum === 0) return 0;
                    break;
            }
            break;
        case 31:
            switch (charge) {
                case -2:
                    switch (bosum) {
                        case 0:
                        case 1:
                        case 2:
                        case 3:
                            return 3;
                        case 4:
                        case 5:
                            return 5;
                    }
                    break;
                case -1:
                    if (bosum <= 4) return 4;
                    break;
                case 0:
                    if (bosum <= 3) return 3;
                    break;
                case 1:
                    if (bosum === 0) return 0;
                    break;
                case 2:
                    if (bosum <= 1) return 1;
                    break;
                case 3:
                    if (bosum === 0) return 0;
                    break;
            }
            break;
        case 32:
            switch (charge) {
                case -2:
                    switch (bosum) {
                        case 0:
                        case 1:
                        case 2:
                            return 2;
                        case 3:
                        case 4:
                            return 4;
                        case 5:
                        case 6:
                            return 6;
                    }
                    break;
                case -1:
                    switch (bosum) {
                        case 0:
                        case 1:
                        case 2:
                        case 3:
                            return 3;
                        case 4:
                        case 5:
                            return 5;
                    }
                    break;
                case 0:
                    if (bosum <= 4) return 4;
                    break;
                case 1:
                    if (bosum <= 3) return 3;
                    break;
                case 4:
                    if (bosum === 0) return 0;
                    break;
            }
            break;
        case 33:
            switch (charge) {
                case -3:
                    if (bosum === 0) return 0;
                    break;
                case -2:
                    switch (bosum) {
                        case 0:
                        case 1:
                            return 1;
                        case 2:
                        case 3:
                            return 3;
                        case 4:
                        case 5:
                            return 5;
                        case 6:
                        case 7:
                            return 7;
                    }
                    break;
                case -1:
                    switch (bosum) {
                        case 0:
                        case 1:
                        case 2:
                            return 2;
                        case 3:
                        case 4:
                            return 4;
                        case 5:
                        case 6:
                            return 6;
                    }
                    break;
                case 0:
                    switch (bosum) {
                        case 0:
                        case 1:
                        case 2:
                        case 3:
                            return 3;
                        case 4:
                        case 5:
                            return 5;
                    }
                    break;
                case 1:
                    if (bosum <= 4) return 4;
                    break;
                case 2:
                    if (bosum <= 3) return 3;
                    break;
            }
            break;
        case 34:
            switch (charge) {
                case -2:
                    if (bosum === 0) return 0;
                    break;
                case -1:
                    switch (bosum) {
                        case 0:
                        case 1:
                            return 1;
                        case 2:
                        case 3:
                            return 3;
                        case 4:
                        case 5:
                            return 5;
                        case 6:
                        case 7:
                            return 7;
                    }
                    break;
                case 0:
                    switch (bosum) {
                        case 0:
                        case 1:
                        case 2:
                            return 2;
                        case 3:
                        case 4:
                            return 4;
                        case 5:
                        case 6:
                            return 6;
                    }
                    break;
                case 1:
                    switch (bosum) {
                        case 0:
                        case 1:
                        case 2:
                        case 3:
                            return 3;
                        case 4:
                        case 5:
                            return 5;
                    }
                    break;
                case 2:
                    if (bosum <= 4) return 4;
                    break;
            }
            break;
        case 35:
            switch (charge) {
                case -1:
                    if (bosum === 0) return 0;
                    break;
                case 0:
                    switch (bosum) {
                        case 0:
                        case 1:
                            return 1;
                        case 2:
                        case 3:
                            return 3;
                        case 4:
                        case 5:
                            return 5;
                        case 6:
                        case 7:
                            return 7;
                    }
                    break;
                case 1:
                    switch (bosum) {
                        case 0:
                        case 1:
                        case 2:
                            return 2;
                        case 3:
                        case 4:
                            return 4;
                        case 5:
                        case 6:
                            return 6;
                    }
                    break;
                case 2:
                    switch (bosum) {
                        case 0:
                        case 1:
                        case 2:
                        case 3:
                            return 3;
                        case 4:
                        case 5:
                            return 5;
                    }
                    break;
            }
            break;
        case 36:
            if (charge === 0) {
                switch (bosum) {
                    case 0:
                        return 0;
                    case 1:
                    case 2:
                        return 2;
                }
            }
            break;
        case 37:
            switch (charge) {
                case -1:
                    if (bosum === 0) return 0;
                    break;
                case 0:
                    if (bosum <= 1) return 1;
                    break;
                case 1:
                    if (bosum === 0) return 0;
                    break;
            }
            break;
        case 38:
            switch (charge) {
                case 0:
                    if (bosum <= 2) return 2;
                    break;
                case 1:
                    if (bosum <= 1) return 1;
                    break;
                case 2:
                    if (bosum === 0) return 0;
                    break;
            }
            break;
        case 49:
            switch (charge) {
                case -2:
                    switch (bosum) {
                        case 0:
                        case 1:
                        case 2:
                        case 3:
                            return 3;
                        case 4:
                        case 5:
                            return 5;
                    }
                    break;
                case -1:
                    switch (bosum) {
                        case 0:
                        case 1:
                        case 2:
                            return 2;
                        case 3:
                        case 4:
                            return 4;
                    }
                    break;
                case 0:
                    if (bosum <= 3) return 3;
                    break;
                case 1:
                    if (bosum === 0) return 0;
                    break;
                case 2:
                    if (bosum <= 1) return 1;
                    break;
                case 3:
                    if (bosum === 0) return 0;
                    break;
            }
            break;
        case 50:
            switch (charge) {
                case -2:
                    switch (bosum) {
                        case 0:
                        case 1:
                        case 2:
                            return 2;
                        case 3:
                        case 4:
                            return 4;
                        case 5:
                        case 6:
                            return 6;
                    }
                    break;
                case -1:
                    switch (bosum) {
                        case 0:
                        case 1:
                        case 2:
                        case 3:
                            return 3;
                        case 4:
                        case 5:
                            return 5;
                    }
                    break;
                case 0:
                    switch (bosum) {
                        case 0:
                        case 1:
                        case 2:
                            return 2;
                        case 3:
                        case 4:
                            return 4;
                    }
                    break;
                case 1:
                    if (bosum <= 3) return 3;
                    break;
                case 2:
                    if (bosum === 0) return 0;
                    break;
                case 4:
                    if (bosum === 0) return 0;
                    break;
            }
            break;
        case 51:
            switch (charge) {
                case -2:
                    switch (bosum) {
                        case 0:
                        case 1:
                            return 1;
                        case 2:
                        case 3:
                            return 3;
                        case 4:
                        case 5:
                            return 5;
                        case 6:
                        case 7:
                            return 7;
                    }
                    break;
                case -1:
                    switch (bosum) {
                        case 0:
                        case 1:
                        case 2:
                            return 2;
                        case 3:
                        case 4:
                            return 4;
                        case 5:
                        case 6:
                            return 6;
                    }
                    break;
                case 0:
                    switch (bosum) {
                        case 0:
                        case 1:
                        case 2:
                        case 3:
                            return 3;
                        case 4:
                        case 5:
                            return 5;
                    }
                    break;
                case 1:
                    switch (bosum) {
                        case 0:
                        case 1:
                        case 2:
                            return 2;
                        case 3:
                        case 4:
                            return 4;
                    }
                    break;
                case 2:
                    if (bosum <= 3) return 3;
                    break;
                case 3:
                    if (bosum === 0) return 0;
                    break;
            }
            break;
        case 52:
            switch (charge) {
                case -2:
                    if (bosum === 0) return 0;
                    break;
                case -1:
                    switch (bosum) {
                        case 0:
                        case 1:
                            return 1;
                        case 2:
                        case 3:
                            return 3;
                        case 4:
                        case 5:
                            return 5;
                        case 6:
                        case 7:
                            return 7;
                    }
                    break;
                case 0:
                    switch (bosum) {
                        case 0:
                        case 1:
                        case 2:
                            return 2;
                        case 3:
                        case 4:
                            return 4;
                        case 5:
                        case 6:
                            return 6;
                    }
                    break;
                case 1:
                    switch (bosum) {
                        case 0:
                        case 1:
                        case 2:
                        case 3:
                            return 3;
                        case 4:
                        case 5:
                            return 5;
                    }
                    break;
                case 2:
                    switch (bosum) {
                        case 0:
                        case 1:
                        case 2:
                            return 2;
                        case 3:
                        case 4:
                            return 4;
                    }
                    break;
            }
            break;
        case 53:
            switch (charge) {
                case -1:
                    if (bosum === 0) return 0;
                    break;
                case 0:
                    switch (bosum) {
                        case 0:
                        case 1:
                            return 1;
                        case 2:
                        case 3:
                            return 3;
                        case 4:
                        case 5:
                            return 5;
                        case 6:
                        case 7:
                            return 7;
                    }
                    break;
                case 1:
                    switch (bosum) {
                        case 0:
                        case 1:
                        case 2:
                            return 2;
                        case 3:
                        case 4:
                            return 4;
                        case 5:
                        case 6:
                            return 6;
                    }
                    break;
                case 2:
                    switch (bosum) {
                        case 0:
                        case 1:
                        case 2:
                        case 3:
                            return 3;
                        case 4:
                        case 5:
                            return 5;
                    }
                    break;
            }
            break;
        case 54:
            if (charge === 0) {
                switch (bosum) {
                    case 0:
                        return 0;
                    case 1:
                    case 2:
                        return 2;
                    case 3:
                    case 4:
                        return 4;
                    case 5:
                    case 6:
                        return 6;
                    case 7:
                    case 8:
                        return 8;
                }
            }
            break;
        case 55:
            switch (charge) {
                case -1:
                    if (bosum === 0) return 0;
                    break;
                case 0:
                    if (bosum <= 1) return 1;
                    break;
                case 1:
                    if (bosum === 0) return 0;
                    break;
            }
            break;
        case 56:
            switch (charge) {
                case 0:
                    if (bosum <= 2) return 2;
                    break;
                case 1:
                    if (bosum <= 1) return 1;
                    break;
                case 2:
                    if (bosum === 0) return 0;
                    break;
            }
            break;
        case 81:
            if (charge === 0) {
                switch (bosum) {
                    case 0:
                    case 1:
                        return 1;
                    case 2:
                    case 3:
                        return 3;
                }
            }
            break;
        case 82:
            switch (charge) {
                case -2:
                    switch (bosum) {
                        case 0:
                        case 1:
                        case 2:
                            return 2;
                        case 3:
                        case 4:
                            return 4;
                        case 5:
                        case 6:
                            return 6;
                    }
                    break;
                case -1:
                    switch (bosum) {
                        case 0:
                        case 1:
                        case 2:
                        case 3:
                            return 3;
                        case 4:
                        case 5:
                            return 5;
                    }
                    break;
                case 0:
                    switch (bosum) {
                        case 0:
                        case 1:
                        case 2:
                            return 2;
                        case 3:
                        case 4:
                            return 4;
                    }
                    break;
                case 1:
                    if (bosum <= 3) return 3;
                    break;
                case 2:
                    if (bosum === 0) return 0;
                    break;
            }
            break;
        case 83:
            switch (charge) {
                case -2:
                    switch (bosum) {
                        case 0:
                        case 1:
                            return 1;
                        case 2:
                        case 3:
                            return 3;
                        case 4:
                        case 5:
                            return 5;
                        case 6:
                        case 7:
                            return 7;
                    }
                    break;
                case -1:
                    switch (bosum) {
                        case 0:
                        case 1:
                        case 2:
                            return 2;
                        case 3:
                        case 4:
                            return 4;
                        case 5:
                        case 6:
                            return 6;
                    }
                    break;
                case 0:
                    switch (bosum) {
                        case 0:
                        case 1:
                        case 2:
                        case 3:
                            return 3;
                        case 4:
                        case 5:
                            return 5;
                    }
                    break;
                case 1:
                    switch (bosum) {
                        case 0:
                        case 1:
                        case 2:
                            return 2;
                        case 3:
                        case 4:
                            return 4;
                    }
                    break;
                case 2:
                    if (bosum <= 3) return 3;
                    break;
                case 3:
                    if (bosum === 0) return 0;
                    break;
            }
            break;
        case 84:
            if (charge === 0) {
                switch (bosum) {
                    case 0:
                    case 1:
                    case 2:
                        return 2;
                    case 3:
                    case 4:
                        return 4;
                    case 5:
                    case 6:
                        return 6;
                }
            }
            break;
        case 85:
            switch (charge) {
                case -1:
                    if (bosum === 0) return 0;
                    break;
                case 0:
                    switch (bosum) {
                        case 0:
                        case 1:
                            return 1;
                        case 2:
                        case 3:
                            return 3;
                        case 4:
                        case 5:
                            return 5;
                        case 6:
                        case 7:
                            return 7;
                    }
                    break;
                case 1:
                    switch (bosum) {
                        case 0:
                        case 1:
                        case 2:
                            return 2;
                        case 3:
                        case 4:
                            return 4;
                        case 5:
                        case 6:
                            return 6;
                    }
                    break;
                case 2:
                    switch (bosum) {
                        case 0:
                        case 1:
                        case 2:
                        case 3:
                            return 3;
                        case 4:
                        case 5:
                            return 5;
                    }
                    break;
            }
            break;
        case 86:
            if (charge === 0) {
                switch (bosum) {
                    case 0:
                        return 0;
                    case 1:
                    case 2:
                        return 2;
                    case 3:
                    case 4:
                        return 4;
                    case 5:
                    case 6:
                        return 6;
                    case 7:
                    case 8:
                        return 8;
                }
            }
            break;
        case 87:
            switch (charge) {
                case 0:
                    if (bosum <= 1) return 1;
                    break;
                case 1:
                    if (bosum === 0) return 0;
                    break;
            }
            break;
        case 88:
            switch (charge) {
                case 0:
                    if (bosum <= 2) return 2;
                    break;
                case 1:
                    if (bosum <= 1) return 1;
                    break;
                case 2:
                    if (bosum === 0) return 0;
                    break;
            }
            break;
        // my addition for unhandled cases
        default:
            return bosum;
    }

    // return bosum;
    // my addition (instead of pervious return)
    return -1;
}
