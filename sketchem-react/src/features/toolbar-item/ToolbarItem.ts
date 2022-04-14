export default class ToolbarItem {
    readonly name: string;
    readonly onMouseEvent: (event: React.MouseEvent<HTMLButtonElement>) => void;
    readonly onButtonClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
    readonly keyboardKeys?: string[];

    constructor(
        name: string,
        onMouseEvent: (event: React.MouseEvent<HTMLButtonElement>) => void,
        onButtonClick?: (event: React.MouseEvent<HTMLButtonElement>) => void,
        keyboardKeys?: string[]
    ) {
        this.name = name;
        this.onMouseEvent = onMouseEvent;
        this.onButtonClick = onButtonClick;
        this.keyboardKeys = keyboardKeys;
    }
}
