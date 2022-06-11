import { AtomConstants } from "@constants/atom.constants";
import { EditorConstants } from "@constants/editor.constant";
import {
    EntityLifeStage,
    EntityType,
    EntityVisualState,
    LayersNames,
    MouseEventsNames,
} from "@constants/enum.constants";
import { IdUtils } from "@src/utils/IdUtils";
import { LayersUtils } from "@src/utils/LayersUtils";
import { Box, Circle, Ellipse, Line, Rect, Shape, SVG, Svg, Text, Tspan } from "@svgdotjs/svg.js";
import {
    ActionItem,
    AtomAttributes,
    BondAttributes,
    EntityAttributes,
    EntityEventContext,
    EntityEventsFunctions,
    IEntity,
} from "@types";

const hoverOrSelectColor = "#38e8e8";
const hoverOpacity = 0.5;

export abstract class Entity {
    abstract attributes: EntityAttributes;

    protected abstract hoverOrSelectShape: Rect | Circle | undefined;

    protected lifeStage: EntityLifeStage;

    protected bbox: Box | undefined;

    protected visualState: EntityVisualState;

    constructor(attributes: IEntity) {
        this.lifeStage = EntityLifeStage.New;
        this.visualState = EntityVisualState.None;
    }

    isAlive() {
        return this.lifeStage === EntityLifeStage.Initialized;
    }

    protected abstract setHoverOrSelectShape(): void;

    // implement
    protected modifyTree(add: boolean): void {}

    // implement
    protected addInstanceToMap(): void {}

    // implement
    protected removeInstanceFromMapAndTree(): void {}

    protected undraw(): void {}

    // ! should be private
    abstract draw(): void;

    abstract getOuterDrawCommand(): void;

    abstract myType: EntityType;

    updateBbox(shape: Shape) {
        this.bbox = shape.bbox();
    }

    setVisualState(visualState: EntityVisualState, color: string = hoverOrSelectColor) {
        if (!this.hoverOrSelectShape) return;
        this.visualState = visualState;

        switch (this.visualState) {
            case EntityVisualState.None:
                this.hoverOrSelectShape.fill({ opacity: 0 });
                break;
            case EntityVisualState.Hover:
            case EntityVisualState.Select:
                this.hoverOrSelectShape.fill({ color, opacity: 1 });
                break;
            default:
                break;
        }

        if (this.visualState === EntityVisualState.Hover) {
            this.hoverOrSelectShape.fill({ opacity: hoverOpacity });
        }
    }

    setListeners(eventListeners?: EntityEventsFunctions) {
        this.removeListeners();
        if (!this.hoverOrSelectShape || !eventListeners) return;

        const context: EntityEventContext = {
            id: this.getId(),
            type: this.myType,
        };

        if (eventListeners.onMouseDown) {
            const handler = eventListeners.onMouseDown;
            this.hoverOrSelectShape.on(MouseEventsNames.onMouseDown, (event) => handler(event, context));
        }
        if (eventListeners.onMouseEnter) {
            const handler = eventListeners.onMouseEnter;
            this.hoverOrSelectShape.on(MouseEventsNames.onMouseEnter, (event) => handler(event, context));
            // this.hoverOrSelectShape.on(MouseEventsNames.onMouseEnter, (event) =>
            //     console.log("onMouseEnter on Entity=", this.getId())
            // );
        }
        if (eventListeners.onMouseLeave) {
            const handler = eventListeners.onMouseLeave;
            this.hoverOrSelectShape.on(MouseEventsNames.onMouseLeave, (event) => handler(event, context));
            // this.hoverOrSelectShape.on(MouseEventsNames.onMouseLeave, (event) =>
            //     console.log("onMouseLeave on Entity=", this.getId())
            // );
        }
        if (eventListeners.onMouseMove) {
            const handler = eventListeners.onMouseMove;
            this.hoverOrSelectShape.on(MouseEventsNames.onMouseMove, (event) => handler(event, context));
        }
        if (eventListeners.onMouseUp) {
            const handler = eventListeners.onMouseUp;
            this.hoverOrSelectShape.on(MouseEventsNames.onMouseUp, (event) => handler(event, context));
        }
        // Object.keys(MouseEventsNames).forEach((eventName) => {

        //     const f = eventListeners[eventName];
        //     if (!eventListeners[eventName]) return;
        //     this.hoverOrSelectShape.on(eventName, (e) => {
        //         eventListeners[eventName](e, this);
        //     });
        // });
    }

    removeListeners() {
        if (!this.hoverOrSelectShape) return;
        this.hoverOrSelectShape.off();
    }

    getId() {
        return this.attributes.id;
    }

    // updateAttributes(newAttributes: Partial<AtomAttributes>, ignoreNotifyBondsIds: number[] = []);

    // destroy(ignoreBondRemove: number[] = [], IShouldNotifyBonds: boolean = true);
}
